# Cognis AI

An AI companion platform that allows users to create and interact with unique AI characters tailored to their interests and learning goals. Powered by Google's Gemini API, Cognis AI provides a personalized learning experience through customizable AI characters.

## 🚀 Features

- **Create Custom AI Characters** - Design AI characters with specific expertise, personality traits, and teaching styles
- **Interactive Chat Interface** - Engage in natural conversations with AI characters
- **User Authentication** - Secure login with email/password or Google OAuth
- **Chat History** - Save and review past conversations
- **Responsive Design** - Beautiful UI that works on desktop and mobile devices
- **Local Storage** - Character profiles stored in browser's local storage

## 📁 Project Structure

The project is organized as follows:

```
/
├── frontend/               # Frontend application
│   ├── Images/             # Image assets
│   ├── Styles/             # CSS styles
│   │   ├── auth.css        # Authentication styles
│   │   ├── characters.css  # Character display styles
│   │   ├── chat.css        # Chat interface styles
│   │   ├── create.css      # Character creation styles
│   │   ├── login.css       # Login page styles
│   │   └── style.css       # Global styles
│   ├── html/               # HTML pages
│   │   ├── about.html      # About page
│   │   ├── characters.html # Character selection page
│   │   ├── chat.html       # Chat interface
│   │   ├── create.html     # Character creation page
│   │   ├── index.html      # Landing page
│   │   └── login.html      # Authentication page
│   └── js/                 # JavaScript files
│       ├── auth.js         # Authentication logic
│       ├── chat.js         # Chat functionality
│       ├── config.js       # Configuration settings
│       ├── particles-config.js # Background animation
│       └── subjects.js     # Character management
├── Backend/                # Backend server
│   ├── config/             # Configuration files
│   │   └── db.js           # Database connection
│   ├── models/             # Database models
│   │   ├── Chat.js         # Chat model
│   │   ├── Subject.js      # Subject/Character model
│   │   └── User.js         # User model
│   ├── routes/             # API routes
│   │   ├── chat.js         # Chat endpoints
│   │   └── subjects.js     # Subject endpoints
│   ├── server.js           # Server entry point
│   └── package.json        # Backend dependencies
└── README.md               # Project documentation
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Google Gemini API key
- Google OAuth credentials (for Google login)

### Backend Setup

1. Clone the repository
   ```bash
   git clone https://github.com/1dhruvsingh/Cognis-AI-.git
   cd Cognis-AI-
   ```

2. Navigate to the backend directory
   ```bash
   cd Backend
   ```

3. Install dependencies
   ```bash
   npm install
   ```

4. Create a `.env` file in the Backend directory with the following variables:
   ```
   PORT=3000
   JWT_SECRET=your_jwt_secret_key
   GOOGLE_CLIENT_ID=your_google_client_id
   GEMINI_API_KEY=your_gemini_api_key
   NODE_ENV=development
   ```

5. Start the backend server
   ```bash
   npm run dev
   ```
   The server will start on http://localhost:3000

### Frontend Setup

1. The frontend is built with vanilla HTML, CSS, and JavaScript, so no build process is required.

2. You can serve the frontend using any static file server. For example, using Python's built-in HTTP server:
   ```bash
   cd /path/to/Cognis-AI-
   python3 -m http.server 8000
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:8000/frontend/html/index.html
   ```

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login with email and password
- `POST /api/auth/google` - Login with Google OAuth

### Chat

- `POST /api/chat` - Send a message to the AI
- `GET /api/chat/history` - Get user's chat history
- `DELETE /api/chat/history` - Clear user's chat history

### User

- `GET /api/user/profile` - Get user profile

## 🧠 Character Creation

Cognis AI allows users to create custom AI characters with specific:

- **Expertise Areas** - Define what subjects the AI is knowledgeable about
- **Personality Traits** - Configure how the AI responds and interacts
- **Teaching Style** - Set how the AI presents information

Characters are currently stored in the browser's localStorage and managed through the `subjects.js` file.

## 🏗️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (configured in config/db.js)
- **Authentication**: JWT, Google OAuth
- **AI Integration**: Google Gemini API
- **Frontend**: HTML, CSS, JavaScript (Vanilla)

## 🤝 Contributing

Contributions are welcome! Here's how you can contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Guidelines

- Follow the existing code style and organization
- Write clear, commented code
- Test your changes thoroughly
- Update documentation as needed

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔮 Future Roadmap

- Server-side character storage
- Voice interaction capabilities
- Enhanced AI model integration
- Mobile application
- Collaborative learning features