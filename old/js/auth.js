// Authentication handling for Cognis AI
document.addEventListener('DOMContentLoaded', function() {
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
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            try {
                // Check if server is available
                const serverAvailable = false; // Set to false for local development without server
                
                if (serverAvailable) {
                    // Server-side authentication (original code)
                    const response = await fetch('/api/auth/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ email, password })
                    });
                    
                    const data = await response.json();
                    
                    if (response.ok) {
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
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('reg-name').value;
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;
            const confirmPassword = document.getElementById('reg-confirm-password').value;
            
            // Password validation
            if (password !== confirmPassword) {
                showNotification('Passwords do not match', 'error');
                return;
            }
            
            try {
                // Check if server is available
                const serverAvailable = false; // Set to false for local development without server
                
                if (serverAvailable) {
                    // Server-side registration (original code)
                    const response = await fetch('/api/auth/register', {
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
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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