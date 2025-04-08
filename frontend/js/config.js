// Configuration file for the frontend application

// Backend API URL - Using relative path since frontend and backend are on same origin
const API_BASE_URL = '';

// Google Authentication
const GOOGLE_CLIENT_ID = import.meta.env?.VITE_GOOGLE_CLIENT_ID || ''; 

// Gemini API (if needed on frontend)
const GEMINI_API_KEY = import.meta.env?.VITE_GEMINI_API_KEY || '';

// Export configuration variables
export { API_BASE_URL, GOOGLE_CLIENT_ID, GEMINI_API_KEY };