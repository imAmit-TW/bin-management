# Seed Inventory Management System

A real-time web application for seed agencies to manage and monitor their inventory allocations in bulk storage facilities.

## Features

- Real-time storage capacity monitoring
- Agency allocation tracking
- Visual representation of storage usage
- Inter-agency visibility
- Capacity alerts and notifications

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Setup

1. Clone the repository
2. Install dependencies for both frontend and backend:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

## Running the Application

1. Start the backend server:

```bash
cd backend
npm run dev
```

2. In a new terminal, start the frontend development server:

```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5001

## Technology Stack

- Frontend:
  - React with TypeScript
  - Material-UI for components
  - Socket.IO client for real-time updates
  - Recharts for data visualization

- Backend:
  - Node.js with Express
  - Socket.IO for real-time communication
  - CORS enabled for cross-origin requests

## Development

The application uses dummy data for demonstration purposes. In a production environment, you would need to:

1. Connect to a real database
2. Implement proper authentication
3. Add more robust error handling
4. Implement proper data validation
5. Add unit and integration tests 
