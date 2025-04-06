// Authentication handling for Cognis AI
document.addEventListener('DOMContentLoaded', function() {
    // Form validation functions
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function validatePassword(password) {
        return password.length >= 6; // Minimum 6 characters
    }
    
    function showInputError(inputElement, message) {
        // Remove any existing error message
        const existingError = inputElement.parentElement.querySelector('.input-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Add error class to input
        inputElement.classList.add('input-error');
        
        // Create and append error message
        const errorElement = document.createElement('div');
        errorElement.className = 'input-error';
        errorElement.textContent = message;
        inputElement.parentElement.appendChild(errorElement);
    }
    
    function clearInputError(inputElement) {
        // Remove error class
        inputElement.classList.remove('input-error');
        
        // Remove error message
        const errorElement = inputElement.parentElement.querySelector('.input-error');
        if (errorElement) {
            errorElement.remove();
        }
    }
    // Tab switching functionality
    const tabs = document.querySelectorAll('.auth-tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Show selected tab content
            tabContents.forEach(content => {
                content.classList.add('hidden');
                if (content.id === `${tabId}-tab`) {
                    content.classList.remove('hidden');
                }
            });
        });
    });
    
    // JWT Authentication
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    if (loginForm) {
        // Get form input elements
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        
        // Remove real-time validation to prevent input fields from closing prematurely
        // Validation will only happen when the form is submitted
        
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = emailInput.value;
            const password = passwordInput.value;
            
            // Validate form before submission
            let isValid = true;
            
            // Validate email
            if (!email.trim()) {
                showInputError(emailInput, 'Email is required');
                isValid = false;
            } else if (!validateEmail(email)) {
                showInputError(emailInput, 'Please enter a valid email address');
                isValid = false;
            } else {
                clearInputError(emailInput);
            }
            
            // Validate password
            if (!password.trim()) {
                showInputError(passwordInput, 'Password is required');
                isValid = false;
            } else if (!validatePassword(password)) {
                showInputError(passwordInput, 'Password must be at least 6 characters');
                isValid = false;
            } else {
                clearInputError(passwordInput);
            }
            
            // If validation fails, stop form submission
            if (!isValid) {
                return;
            }
            
            try {
                // Check if server is available
                const serverAvailable = false; // Set to false for local development without server
                
                if (serverAvailable) {
                    // Import API base URL from config
                    const API_BASE_URL = 'http://localhost:3000';
                    // Server-side authentication (original code)
                    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ email, password })
                    });
                    
                    const data = await response.json();
                    
                    if (response.ok) {
                        // Clear any existing user data
                        localStorage.removeItem('subjects');
                        localStorage.removeItem('chatHistory');
                        localStorage.removeItem('storedChatHistory');
                        localStorage.removeItem('currentChatId');
                        
                        // Store JWT token in localStorage
                        localStorage.setItem('token', data.token);
                        localStorage.setItem('user', JSON.stringify(data.user));
                        
                        // Redirect to dashboard or home page
                        window.location.href = 'characters.html';
                    } else {
                        showNotification(data.message || 'Login failed', 'error');
                    }
                } else {
                    // Client-side authentication for demo purposes
                    // This is a temporary solution when server is not available
                    if (email && password) {
                        // Get registered users from localStorage
                        const users = JSON.parse(localStorage.getItem('demoUsers') || '[]');
                        
                        // Find user with matching email
                        const user = users.find(user => user.email === email);
                        
                        if (user && user.password === password) {
                            // Create a user object without password
                            const authenticatedUser = {
                                id: user.id,
                                name: user.name,
                                email: user.email
                            };
                            
                            // Create a mock token
                            const mockToken = 'demo_token_' + Date.now();
                            
                            // Store in localStorage
                            localStorage.setItem('token', mockToken);
                            localStorage.setItem('user', JSON.stringify(authenticatedUser));
                            
                            showNotification('Login successful!', 'success');
                            
                            // Redirect after a short delay
                            setTimeout(() => {
                                window.location.href = 'characters.html';
                            }, 1000);
                        } else {
                            // If no matching user or password is incorrect
                            showNotification('Invalid email or password', 'error');
                        }
                    } else {
                        showNotification('Please enter both email and password', 'error');
                    }
                }
            } catch (error) {
                console.error('Login error:', error);
                showNotification('An error occurred during login', 'error');
            }
        });
    }
    
    if (registerForm) {
        // Get form input elements
        const nameInput = document.getElementById('reg-name');
        const emailInput = document.getElementById('reg-email');
        const passwordInput = document.getElementById('reg-password');
        const confirmPasswordInput = document.getElementById('reg-confirm-password');
        
        // Remove real-time validation to prevent input fields from closing prematurely
        // Validation will only happen when the form is submitted
        
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = nameInput.value;
            const email = emailInput.value;
            const password = passwordInput.value;
            const confirmPassword = confirmPasswordInput.value;
            
            // Validate form before submission
            let isValid = true;
            
            // Validate name
            if (!name.trim()) {
                showInputError(nameInput, 'Name is required');
                isValid = false;
            } else if (name.trim().length < 2) {
                showInputError(nameInput, 'Name must be at least 2 characters');
                isValid = false;
            } else {
                clearInputError(nameInput);
            }
            
            // Validate email
            if (!email.trim()) {
                showInputError(emailInput, 'Email is required');
                isValid = false;
            } else if (!validateEmail(email)) {
                showInputError(emailInput, 'Please enter a valid email address');
                isValid = false;
            } else {
                clearInputError(emailInput);
            }
            
            // Validate password
            if (!password.trim()) {
                showInputError(passwordInput, 'Password is required');
                isValid = false;
            } else if (!validatePassword(password)) {
                showInputError(passwordInput, 'Password must be at least 6 characters');
                isValid = false;
            } else {
                clearInputError(passwordInput);
            }
            
            // Validate confirm password
            if (!confirmPassword.trim()) {
                showInputError(confirmPasswordInput, 'Please confirm your password');
                isValid = false;
            } else if (password !== confirmPassword) {
                showInputError(confirmPasswordInput, 'Passwords do not match');
                isValid = false;
            } else {
                clearInputError(confirmPasswordInput);
            }
            
            // If validation fails, stop form submission
            if (!isValid) {
                return;
            }
            
            try {
                // Check if server is available
                const serverAvailable = false; // Set to false for local development without server
                
                if (serverAvailable) {
                    // Import API base URL from config
                    const API_BASE_URL = 'http://localhost:3000';
                    // Server-side registration (original code)
                    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ name, email, password })
                    });
                    
                    const data = await response.json();
                    
                    if (response.ok) {
                        showNotification('Registration successful! Please log in.', 'success');
                        
                        // Switch to login tab
                        document.querySelector('[data-tab="login"]').click();
                    } else {
                        showNotification(data.message || 'Registration failed', 'error');
                    }
                } else {
                    // Client-side registration for demo purposes
                    // This is a temporary solution when server is not available
                    if (name && email && password) {
                        // Store user in localStorage for demo purposes
                        // In a real app, this would be stored in a database
                        const users = JSON.parse(localStorage.getItem('demoUsers') || '[]');
                        
                        // Check if email already exists
                        if (users.some(user => user.email === email)) {
                            showNotification('User with this email already exists', 'error');
                            return;
                        }
                        
                        // Add new user
                        users.push({
                            id: Date.now().toString(),
                            name,
                            email,
                            password // Note: In a real app, never store plain text passwords
                        });
                        
                        // Save to localStorage
                        localStorage.setItem('demoUsers', JSON.stringify(users));
                        
                        showNotification('Registration successful! Please log in.', 'success');
                        
                        // Switch to login tab
                        document.querySelector('[data-tab="login"]').click();
                    } else {
                        showNotification('Please fill in all fields', 'error');
                    }
                }
            } catch (error) {
                console.error('Registration error:', error);
                showNotification('An error occurred during registration', 'error');
            }
        });
    }
});

// Google Sign-In Handler
function handleGoogleSignIn(response) {
    // Get the ID token from the response
    const idToken = response.credential;
    
    // Check if server is available
    const serverAvailable = false; // Set to false for local development without server
    
    if (serverAvailable) {
        // Send the token to your backend
        fetch('/api/auth/google', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ idToken })
        })
        .then(response => response.json())
        .then(data => {
            if (data.token) {
                // Store JWT token in localStorage
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                // Redirect to dashboard or home page
                window.location.href = 'characters.html';
            } else {
                showNotification(data.message || 'Google authentication failed', 'error');
            }
        })
        .catch(error => {
            console.error('Google auth error:', error);
            showNotification('An error occurred during Google authentication', 'error');
        });
    } else {
        // Client-side Google authentication for demo purposes
        try {
            // Parse the JWT payload to get user info
            // Note: In a real app, you would verify this token on the server
            const payload = JSON.parse(atob(idToken.split('.')[1]));
            
            // Create a user object from the Google payload
            const googleUser = {
                id: 'google_' + payload.sub,
                name: payload.name || 'Google User',
                email: payload.email,
                picture: payload.picture
            };
            
            // Create a mock token
            const mockToken = 'google_demo_token_' + Date.now();
            
            // Store in localStorage
            localStorage.setItem('token', mockToken);
            localStorage.setItem('user', JSON.stringify(googleUser));
            
            showNotification('Google login successful!', 'success');
            
            // Redirect after a short delay
            setTimeout(() => {
                window.location.href = 'characters.html';
            }, 1000);
        } catch (error) {
            console.error('Google auth client-side error:', error);
            showNotification('Failed to process Google authentication', 'error');
        }
    }
}

// Google Sign-Up Handler

// Google Sign-Up Handler
function handleGoogleSignUp(response) {
    // Use the same handler as sign-in
    handleGoogleSignIn(response);
}

// Check if user is authenticated
function isAuthenticated() {
    const token = localStorage.getItem('token');
    return !!token; // Convert to boolean
}

// Logout function
function logout() {
    // Clear all user-related data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('subjects');
    localStorage.removeItem('chatHistory');
    localStorage.removeItem('storedChatHistory');
    localStorage.removeItem('currentChatId');
    window.location.href = 'login.html';
}

// Authentication protection for restricted pages
function checkAuth() {
    // Get the current page filename
    const currentPage = window.location.pathname.split('/').pop();
    
    // List of pages that require authentication
    const restrictedPages = ['characters.html', 'create.html'];
    
    // Check if current page requires authentication
    if (restrictedPages.includes(currentPage)) {
        // If not authenticated, redirect to login page
        if (!isAuthenticated()) {
            window.location.href = 'login.html';
        }
    }
}

// Run authentication check when page loads
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
});

// Notification system
function showNotification(message, type = 'info') {
    // Create notification element if it doesn't exist
    let notification = document.querySelector('.notification');
    
    if (!notification) {
        notification = document.createElement('div');
        notification.className = 'notification';
        document.body.appendChild(notification);
    }
    
    // Set notification type and message
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Show notification
    notification.classList.add('show');
    
    // Hide after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}