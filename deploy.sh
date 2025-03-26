#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Use existing EC2 instance information
INSTANCE_IP="18.201.232.65"
INSTANCE_DNS="ec2-18-201-232-65.eu-west-1.compute.amazonaws.com"
SSH_KEY="~/.ssh/restaurant_key"

echo "Using existing EC2 instance:"
echo "IP address: $INSTANCE_IP"
echo "DNS name: $INSTANCE_DNS"
echo "SSH key: $SSH_KEY"

# Verify SSH connection works
echo "Verifying SSH connection..."
if ssh -o StrictHostKeyChecking=no -i $SSH_KEY ec2-user@$INSTANCE_DNS "echo 'SSH connection successful'"; then
    echo "SSH connection verified successfully."
else
    echo "Error: Unable to connect to the EC2 instance."
    echo "Please make sure your SSH key is correct and the instance is running."
    exit 1
fi

# Create a lightweight deployment package (source code only)
echo "Creating source-only deployment package..."
mkdir -p deploy

# Archive only the necessary source files (no node_modules, no build artifacts)
echo "Creating source archive..."
tar -czf deploy/app.tar.gz \
    --exclude="**/node_modules" \
    --exclude="**/.git" \
    --exclude="**/dist" \
    --exclude="**/build" \
    --exclude="**/.cache" \
    --exclude="**/.parcel-cache" \
    --exclude="**/tmp" \
    client server package.json .env 2>/dev/null || true

# Create server-side deployment script
cat > deploy/deploy.sh << 'EOF'
#!/bin/bash
set -e

echo "Starting deployment process on server..."

# Clean up previous deployment
echo "Cleaning up previous installation..."
sudo rm -rf /opt/restaurant-app
sudo mkdir -p /opt/restaurant-app
sudo chown -R ec2-user:ec2-user /opt/restaurant-app
cd /opt/restaurant-app

# Extract the application source
echo "Extracting application source..."
tar -xzf /tmp/deploy/app.tar.gz

# Install frontend dependencies and build
echo "Building frontend..."
cd client
npm install
npm run build
cd ..

# Install backend dependencies
echo "Setting up backend..."
cd server
npm install --production

# Configure PM2 for the application
echo "Configuring process manager..."
sudo npm install -g pm2
pm2 stop restaurant-backend 2>/dev/null || true
pm2 delete restaurant-backend 2>/dev/null || true
pm2 start npm --name "restaurant-backend" -- run start
pm2 save
pm2 startup | grep -v "sudo env" || true

# Generate SSL certificates if they don't exist
echo "Ensuring SSL certificates are available..."
sudo mkdir -p /etc/nginx/ssl
if [ ! -f /etc/nginx/ssl/nginx.key ] || [ ! -f /etc/nginx/ssl/nginx.crt ]; then
  echo "Generating self-signed SSL certificates..."
  sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/nginx.key \
    -out /etc/nginx/ssl/nginx.crt \
    -subj '/CN=pizza.hiverrs.com'
fi

# Configure Nginx as a reverse proxy
echo "Configuring Nginx..."
sudo tee /etc/nginx/conf.d/restaurant.conf > /dev/null << 'EOL'
# Increase hash bucket size to accommodate longer domain names
server_names_hash_bucket_size 128;

# HTTP Server - Redirects to HTTPS
server {
    listen 80;
    server_name pizza.hiverrs.com ec2-18-201-232-65.eu-west-1.compute.amazonaws.com;

    # Redirect all HTTP requests to HTTPS
    return 301 https://$host$request_uri;
}

# HTTPS Server
server {
    listen 443 ssl;
    server_name pizza.hiverrs.com ec2-18-201-232-65.eu-west-1.compute.amazonaws.com;

    # SSL Configuration
    ssl_certificate /etc/nginx/ssl/nginx.crt;
    ssl_certificate_key /etc/nginx/ssl/nginx.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers 'EECDH+AESGCM:EDH+AESGCM:AES256+EECDH:AES256+EDH';

    # API Proxy
    location /api {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Static Files
    location / {
        root /opt/restaurant-app/client/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
}
EOL

# Restart Nginx to apply configuration
echo "Restarting Nginx..."
sudo systemctl restart nginx

echo "Deployment completed successfully!"
EOF

chmod +x deploy/deploy.sh

# Upload the minimal package to EC2
echo "Preparing EC2 instance for deployment..."
ssh -o StrictHostKeyChecking=no -i $SSH_KEY ec2-user@$INSTANCE_DNS "sudo rm -rf /tmp/deploy && sudo mkdir -p /tmp/deploy && sudo chmod 777 /tmp/deploy"

# Upload just the archive and deployment script
echo "Uploading source archive to EC2 instance..."
scp -o StrictHostKeyChecking=no -i $SSH_KEY deploy/app.tar.gz deploy/deploy.sh ec2-user@$INSTANCE_DNS:/tmp/deploy/

# Execute deployment script with sudo
echo "Executing deployment on the server (this may take a few minutes)..."
ssh -o StrictHostKeyChecking=no -i $SSH_KEY ec2-user@$INSTANCE_DNS "cd /tmp/deploy && chmod +x deploy.sh && sudo ./deploy.sh"

echo "========================================"
echo "Deployment completed successfully!"
echo "Application is now running at: http://$INSTANCE_DNS"
echo ""
echo "To SSH into your instance, use:"
echo "ssh -i $SSH_KEY ec2-user@$INSTANCE_DNS"
echo "========================================"