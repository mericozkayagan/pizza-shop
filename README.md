# Restaurant Management System - Developer Documentation

## Overview

This is a comprehensive restaurant management system built with a modern stack:

- **Frontend**: React.js with Tailwind CSS for responsive UI
- **Backend**: Node.js with Express
- **Database**: PostgreSQL

The application serves multiple user roles (admin, kitchen, server, staff) and provides tools for menu management, table reservations, order processing, and kitchen operations.

## System Architecture

### Frontend

The client application is built with:

- React.js for component-based UI
- Context API for state management
- React Router for navigation
- Tailwind CSS for styling

### Backend

The server is built with:

- Express.js for API routes
- JWT for authentication
- PostgreSQL for data persistence
- Bcrypt for password hashing

### Database Schema

The PostgreSQL database consists of the following main tables:

- `users`: Staff accounts with role-based permissions
- `tables`: Restaurant layout and table management
- `menu_items`: Menu offerings with prices and descriptions
- `categories`: Menu categorization
- `ingredients`: Inventory tracking
- `orders`: Customer orders
- `order_items`: Individual items in orders
- `payments`: Transaction records

## Core Features

### Authentication & Authorization

- **JWT-based authentication** with secure token management
- **Role-based access control** with distinct user roles:
  - `admin`: Full system access
  - `kitchen`: Access to order preparation interface
  - `server`: Access to table management and order taking
  - `staff`: Limited access to core functionality

### Menu Management

- **Category organization** for menu items
- **CRUD operations** for menu items (admin only)
- **Image upload** for menu item visualization
- **Pricing management**
- **Availability toggling** for temporary menu changes

### Table Management

- **Interactive table map** showing layout and status
- **Table reservation** functionality
- **Status tracking** (available, occupied, reserved)
- **Server assignment** to tables

### Ordering System

- **Cart functionality** with localStorage persistence
- **Table-based ordering** system
- **Item customization** and special instructions
- **Real-time order status updates**
- **Item quantity management**
- **Order notes** for special requests

### Kitchen Operations

- **Order queue display** for kitchen staff
- **Status updates** (pending, preparing, ready, served)
- **Inventory tracking** for ingredients
- **Low stock alerts** for inventory management

### Server Interface

- **Table overview** for servers
- **Order management** for assigned tables
- **Payment processing** interface

### Admin Dashboard

- **Sales overview** and analytics
- **Staff management** with role assignment
- **Menu and inventory management**
- **Table layout configuration**

## API Endpoints

The system exposes several RESTful API endpoints:

### Authentication

- `POST /api/auth/login`: Authenticate user
- `GET /api/auth/current-user`: Get current user info

### Menu Management

- `GET /api/menu/items`: Get all menu items
- `GET /api/menu/categories`: Get all categories
- `POST /api/menu/items`: Create a new menu item (admin)
- `PUT /api/menu/items/:id`: Update a menu item (admin)

### Table Management

- `GET /api/tables`: Get all tables
- `GET /api/tables/:id`: Get specific table
- `POST /api/tables`: Create a new table (admin)
- `PUT /api/tables/:id`: Update table status or assignment

### Order Management

- `GET /api/orders`: Get all orders
- `GET /api/orders/active`: Get active orders
- `GET /api/orders/:id`: Get specific order
- `POST /api/orders`: Create a new order
- `PUT /api/orders/:id`: Update order status

## Development Setup

### Prerequisites

- Node.js (v14+)
- PostgreSQL (v12+)
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone [repository-url]
```

2. Install server dependencies

```bash
cd server
npm install
```

3. Install client dependencies

```bash
cd client
npm install
```

4. Set up environment variables

   - Create `.env` file in the server directory
   - Configure database connection, JWT secret, etc.

5. Initialize the database

```bash
cd server
npm run db:init
```

6. Run the development servers

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

## AWS Deployment

The project includes Terraform scripts to deploy the application to AWS using a free tier EC2 instance in the EU West (Ireland) region.

### Prerequisites for Deployment

- AWS account with access credentials
- Terraform installed on your local machine
- Access to your existing SSH private key for EC2 instance

### Deployment Steps

1. Set your AWS credentials as environment variables:

```bash
# For permanent IAM credentials
export AWS_ACCESS_KEY_ID="your-access-key"
export AWS_SECRET_ACCESS_KEY="your-secret-key"

# For temporary credentials (e.g., from AWS STS, IAM roles, or AWS SSO)
export AWS_ACCESS_KEY_ID="your-access-key"
export AWS_SECRET_ACCESS_KEY="your-secret-key"
export AWS_SESSION_TOKEN="your-session-token"
```

2. Run the deployment script:

```bash
./deploy.sh
```

This script will:

- Use your existing EC2 instance in eu-west-1 region
- Build the frontend application
- Deploy both frontend and backend to the EC2 instance
- Configure Nginx as a reverse proxy
- Connect to your existing PostgreSQL database
- Start the application services with PM2

**Note**: The script skips PostgreSQL setup because the database is already set up with data.

3. Access your application:
   After deployment completes, you'll receive the URL to access your application.

### SSH Access

When prompted during the deployment process, you'll need to provide your SSH private key to access the EC2 instance. Alternatively, if you already have the private key at `~/.ssh/restaurant_key`, the script will use it automatically.

To connect to your EC2 instance via SSH:

```bash
ssh -i ~/.ssh/restaurant_key ec2-user@ec2-18-201-232-65.eu-west-1.compute.amazonaws.com
```

### Infrastructure Components

The existing infrastructure consists of:

- VPC with public subnet in eu-west-1 region
- Security group with appropriate rules
- t2.micro EC2 instance (free tier eligible)
- Required networking components (internet gateway, route tables)

### Maintenance and Updates

To update the deployed application:

```bash
# Pull latest changes
git pull

# Re-run the deployment script
./deploy.sh
```
