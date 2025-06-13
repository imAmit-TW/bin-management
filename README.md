# Seed Inventory Management System

A real-time web application for seed agencies to manage and monitor their inventory allocations in bulk storage facilities.

## Features

- Real-time storage capacity monitoring
- Agency allocation tracking
- Visual representation of storage usage
- Inter-agency visibility
- Capacity alerts and notifications

## Prerequisites

- Node.js (v18 or higher recommended)
- npm (v8 or higher recommended)
- Docker (for MongoDB)

## Setup

1. **Clone the repository**
2. **Install dependencies for both frontend and backend:**

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend2
npm install
```

## Running MongoDB with Docker Compose

Start MongoDB using Docker Compose (recommended):

```bash
docker-compose up -d
```

This will run MongoDB locally on port 27017 and persist data in a Docker volume.

## Seeding the Database

After MongoDB is running, seed the database with initial data:

```bash
cd backend
node seed.js
```

## Running the Application

1. **Start the backend server:**

```bash
cd backend
npm run dev
```

2. **In a new terminal, start the frontend development server:**

```bash
cd frontend2
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173 (or the port shown in your terminal)
- Backend: http://localhost:5001

## Technology Stack

- **Frontend:**
  - React with TypeScript
  - Tailwind CSS for styling
  - Vite for development server
- **Backend:**
  - Node.js with Express
  - MongoDB (via Docker)
  - Mongoose for ODM

## Development Notes

- The application uses seeded data for demonstration. Rerun the seed script if you want to reset the database.
- Make sure Docker is running and MongoDB is up before starting the backend.

## Development

The application uses dummy data for demonstration purposes. In a production environment, you would need to:

1. Connect to a real database
2. Implement proper authentication
3. Add more robust error handling
4. Implement proper data validation
5. Add unit and integration tests 