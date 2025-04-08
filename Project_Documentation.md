# Cognis-AI Project Documentation

## Project Overview

Cognis-AI is an advanced educational AI assistant platform designed to help students and learners with their studies. The platform leverages Google's Gemini 2.0 Flash model to provide intelligent, context-aware responses to user queries across various academic subjects. The system features a modern, responsive user interface with real-time chat capabilities, subject-specific learning, and persistent conversation history.

## Architecture

The project follows a client-server architecture with clear separation of concerns:

### Frontend
- Built with vanilla JavaScript, HTML5, and CSS3
- Responsive design that works across desktop and mobile devices
- Modern UI with animations, transitions, and visual effects
- Organized into modular components for maintainability

### Backend
- Node.js with Express.js framework
- MongoDB database for data persistence
- JWT (JSON Web Token) authentication
- Integration with Google's Generative AI API (Gemini 2.0 Flash)

## Key Features

### User Authentication
- Secure login and registration system
- JWT-based authentication
- User profile management
- Session persistence

### AI Chat Interface
- Real-time chat with the AI assistant
- Context-aware conversations
- Message history within chat sessions
- Typing indicators and smooth animations

### Subject-Based Learning
- Organization of chats by academic subjects
- Subject-specific AI responses
- Customized learning paths

### Chat Management
- Create new chat sessions
- View chat history
- Delete individual chats
- Clear entire chat history
- Auto-generated chat titles based on conversation content

### Responsive Design
- Mobile-first approach
- Adapts to different screen sizes
- Touch-friendly interface
- Consistent experience across devices

## Technical Implementation

### Frontend Components

#### HTML Structure
- Semantic HTML5 markup
- Organized page structure
- Accessibility considerations

#### CSS Styling
- Custom CSS with variables for theming
- Flexbox and Grid layouts
- Animations and transitions
- Responsive breakpoints

#### JavaScript Functionality
- DOM manipulation
- Event handling
- Fetch API for backend communication
- Local storage for client-side data persistence

### Backend Components

#### API Endpoints

**Authentication Routes:**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/user` - Get current user info

**Chat Routes:**
- `POST /api/chat` - Process chat messages
- `GET /api/chat/history` - Get user's chat history
- `GET /api/chat/:chatId` - Get a specific chat
- `DELETE /api/chat/history` - Clear all user's chat history
- `DELETE /api/chat/:chatId` - Delete a specific chat
- `POST /api/chat/:chatId/reset` - Reset a specific chat

**Subject Routes:**
- `GET /api/subjects` - Get all subjects
- `POST /api/subjects` - Create a new subject
- `GET /api/subjects/:id` - Get a specific subject

#### Database Models

**User Model:**
- User authentication details
- Profile information

**Chat Model:**
- Chat metadata (title, creation date)
- Associated user
- Associated subject (optional)
- Array of messages with sender and timestamp

**Subject Model:**
- Subject name and description
- Associated icon or image

### AI Integration

- Integration with Google's Generative AI API
- Context-aware conversation handling
- Message history management for continuous conversations
- Dynamic chat title generation

## User Experience Design

### Visual Design
- Dark mode interface with neon accents
- Gradient effects and subtle animations
- Custom icons and visual elements
- Consistent color scheme and typography

### Interaction Design
- Intuitive navigation
- Smooth transitions between states
- Real-time feedback for user actions
- Loading indicators and animations

### Accessibility
- Semantic HTML structure
- Keyboard navigation support
- Screen reader compatibility
- Sufficient color contrast

## Security Measures

- Secure authentication with JWT
- Password hashing
- Input validation and sanitization
- Protection against common web vulnerabilities
- HTTPS support for secure communication

## Deployment

### Requirements
- Node.js runtime environment
- MongoDB database
- Google Generative AI API key
- Web server (for production deployment)

### Configuration
- Environment variables for sensitive information
- Database connection settings
- API keys and secrets

### Hosting Options
- Heroku, Vercel, or Netlify for frontend
- MongoDB Atlas for database
- Node.js hosting services for backend

## Future Enhancements

- Voice input and output capabilities
- File upload and document analysis
- Integration with educational resources and APIs
- Collaborative learning features
- Advanced analytics and learning progress tracking
- Mobile application versions

## Conclusion

Cognis-AI represents a powerful educational tool that leverages cutting-edge AI technology to enhance the learning experience. Its intuitive interface, robust backend, and intelligent conversation capabilities make it an effective assistant for students across various subjects and educational levels. The modular architecture allows for easy maintenance and future expansion as AI technology continues to evolve.