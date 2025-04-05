# Cognis AI

An AI companion platform that allows users to create and interact with unique AI characters tailored to their interests and learning goals.

## Project Structure

The project is organized as follows:

```
/
├── frontend/               # Frontend application
│   ├── public/             # Public assets
│   │   ├── images/         # Image assets
│   │   └── favicon.ico     # Favicon
│   ├── src/                # Source code
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── styles/         # CSS styles
│   │   ├── js/             # JavaScript files
│   │   └── index.js        # Entry point
│   └── index.html          # Main HTML file
├── backend/                # Backend server
│   ├── config/             # Configuration files
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── server.js           # Server entry point
│   └── package.json        # Backend dependencies
└── README.md               # Project documentation
```

## Getting Started

### Prerequisites

- Node.js
- MongoDB

### Installation

1. Clone the repository
2. Install backend dependencies:
   ```
   cd backend
   npm install
   ```
3. Install frontend dependencies:
   ```
   cd frontend
   npm install
   ```

### Running the Application

1. Start the backend server:
   ```
   cd backend
   npm start
   ```
2. Start the frontend development server:
   ```
   cd frontend
   npm start
   ```

## Features

- Create and customize AI characters
- Chat with AI assistants
- User authentication
- Chat history management