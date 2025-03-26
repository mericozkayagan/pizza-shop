terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  required_version = ">= 1.2.0"
}

provider "aws" {
  region = var.aws_region
  # AWS credentials will be picked up from environment variables:
  # AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_SESSION_TOKEN
}

# Create a VPC
resource "aws_vpc" "restaurant_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  tags = {
    Name = "restaurant-vpc"
  }
}

# Create public subnet
resource "aws_subnet" "public_subnet" {
  vpc_id                  = aws_vpc.restaurant_vpc.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true
  availability_zone       = "${var.aws_region}a"
  tags = {
    Name = "restaurant-public-subnet"
  }
}

# Create Internet Gateway
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.restaurant_vpc.id
  tags = {
    Name = "restaurant-igw"
  }
}

# Create Route Table
resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.restaurant_vpc.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }
  tags = {
    Name = "restaurant-public-route-table"
  }
}

# Associate Route Table with Subnet
resource "aws_route_table_association" "public_rta" {
  subnet_id      = aws_subnet.public_subnet.id
  route_table_id = aws_route_table.public_rt.id
}

# Create Security Group for EC2 instance
resource "aws_security_group" "restaurant_sg" {
  name        = "restaurant-security-group"
  description = "Allow HTTP, HTTPS and SSH traffic"
  vpc_id      = aws_vpc.restaurant_vpc.id

  # SSH access
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "SSH"
  }

  # HTTP access
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "HTTP"
  }

  # HTTPS access
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "HTTPS"
  }

  # Node.js Backend port
  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Node.js Backend"
  }

  # React Frontend port
  ingress {
    from_port   = 5173
    to_port     = 5173
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "React Dev Server"
  }

  # PostgreSQL port
  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"]
    description = "PostgreSQL"
  }

  # Allow all outbound traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "restaurant-security-group"
  }
}

# Create EC2 Key Pair
resource "aws_key_pair" "restaurant_key" {
  key_name   = "restaurant-key"
  public_key = var.ssh_public_key
}

# Get latest Amazon Linux 2023 AMI
data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-2023.*-x86_64"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# Create EC2 instance (free tier eligible)
resource "aws_instance" "restaurant_server" {
  ami                    = data.aws_ami.amazon_linux.id
  instance_type          = "t2.micro"
  key_name               = aws_key_pair.restaurant_key.key_name
  vpc_security_group_ids = [aws_security_group.restaurant_sg.id]
  subnet_id              = aws_subnet.public_subnet.id

  root_block_device {
    volume_size           = 8
    volume_type           = "gp2"
    delete_on_termination = true
  }

  user_data = <<-EOF
              #!/bin/bash
              # Update system
              dnf update -y

              # Install Node.js
              dnf install -y nodejs git

              # Install Nginx as a reverse proxy
              dnf install -y nginx
              systemctl enable nginx
              systemctl start nginx

              # Create restaurant app directory
              mkdir -p /opt/restaurant-app

              # Set up Nginx configuration for the app
              cat > /etc/nginx/conf.d/restaurant.conf << 'EOL'
              server {
                  listen 80;
                  server_name _;

                  location /api {
                      proxy_pass http://localhost:3000;
                      proxy_http_version 1.1;
                      proxy_set_header Upgrade $http_upgrade;
                      proxy_set_header Connection 'upgrade';
                      proxy_set_header Host $host;
                      proxy_cache_bypass $http_upgrade;
                  }

                  location / {
                      proxy_pass http://localhost:5173;
                      proxy_http_version 1.1;
                      proxy_set_header Upgrade $http_upgrade;
                      proxy_set_header Connection 'upgrade';
                      proxy_set_header Host $host;
                      proxy_cache_bypass $http_upgrade;
                  }
              }
              EOL

              # Restart Nginx to apply configuration
              systemctl restart nginx
              EOF

  tags = {
    Name = "restaurant-server"
  }
}

# Output the instance public IP and DNS
output "instance_ip" {
  value = aws_instance.restaurant_server.public_ip
  description = "The public IP of the EC2 instance"
}

output "instance_dns" {
  value = aws_instance.restaurant_server.public_dns
  description = "The public DNS of the EC2 instance"
}

output "ssh_command" {
  value = "ssh -i /path/to/private/key.pem ec2-user@${aws_instance.restaurant_server.public_dns}"
  description = "Command to SSH into the EC2 instance"
}