# Cognis AI Backend

This is the backend server for Cognis AI, an AI-powered study chatbot that uses Google's Gemini API.

## Features

- User authentication (JWT-based)
- Google OAuth integration
- Chat functionality with Google Gemini API
- Chat history management

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Google Gemini API key

## Setup

1. Clone the repository
2. Navigate to the server directory
3. Install dependencies:

```bash
npm install
```

4. Create a `.env` file based on `.env.example` and fill in your credentials:

```
PORT=3000
JWT_SECRET=your_jwt_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GEMINI_API_KEY=your_gemini_api_key
NODE_ENV=development
```

5. Start the server:

```bash
npm run dev
```

The server will start on http://localhost:3000

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login with email and password
- `POST /api/auth/google` - Login with Google

### Chat

- `POST /api/chat` - Send a message to the AI
- `GET /api/chat/history` - Get user's chat history
- `DELETE /api/chat/history` - Clear user's chat history

### User

- `GET /api/user/profile` - Get user profile

## Development

For development, you can use:

```bash
npm run dev
```

This will start the server with nodemon, which automatically restarts when you make changes.

## Production

For production, use:

```bash
npm start
```

Make sure to set `NODE_ENV=production` in your environment variables.