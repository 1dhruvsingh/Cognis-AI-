// Chat functionality with backend integration
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
        // Redirect to login if not authenticated
        window.location.href = 'login.html';
        return;
    }

    // Chat elements
    const chatMessages = document.getElementById('chatMessages');
    const chatForm = document.getElementById('chatForm');
    const userInput = document.getElementById('userInput');
    const chatHistoryList = document.getElementById('chatHistoryList');
    const newChatBtn = document.getElementById('newChatBtn');
    
    // Track current chat ID
    window.currentChatId = localStorage.getItem('currentChatId');
    
    // Chat history
    let chatHistory = [];
    
    // Load chat history from localStorage if available
    const savedHistory = localStorage.getItem('chatHistory');
    if (savedHistory) {
        try {
            chatHistory = JSON.parse(savedHistory);
            // Display saved messages 
            chatHistory.forEach(message => {
                addMessageToUI(message.sender, message.text);
            });
        } catch (error) {
            console.error('Error loading chat history:', error);
            // Reset history if there's an error
            localStorage.removeItem('chatHistory');
            chatHistory = [];
        }
    }
    
    // Import API base URL from config
    const API_BASE_URL = 'http://localhost:3000';
    
    // Load chat history from server
    async function loadChatHistory() {
        try {
            const response = await fetch(`${API_BASE_URL}/api/chat/history`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                displayChatHistory(data.chats);
            } else {
                console.error('Failed to load chat history');
                // If server request fails, display locally stored chats
                displayStoredChatHistory();
            }
        } catch (error) {
            console.error('Error loading chat history:', error);
            // If server request fails, display locally stored chats
            displayStoredChatHistory();
        }
    }
    
    // Display chat history in sidebar
    function displayChatHistory(chats) {
        chatHistoryList.innerHTML = '';
        
        if (chats.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'empty-history';
            emptyMessage.textContent = 'No chat history yet';
            chatHistoryList.appendChild(emptyMessage);
            return;
        }
        
        chats.forEach(chat => {
            const chatItem = document.createElement('div');
            chatItem.className = 'chat-history-item';
            if (chat._id === window.currentChatId) {
                chatItem.classList.add('active');
            }
            
            const title = document.createElement('div');
            title.className = 'title';
            title.textContent = chat.title;
            
            const date = document.createElement('div');
            date.className = 'date';
            date.textContent = new Date(chat.updatedAt).toLocaleString();
            
            chatItem.appendChild(title);
            chatItem.appendChild(date);
            
            chatItem.addEventListener('click', () => loadChat(chat._id));
            
            chatHistoryList.appendChild(chatItem);
        });
    }
    
    // Load a specific chat
    async function loadChat(chatId) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/chat/${chatId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                window.currentChatId = chatId;
                localStorage.setItem('currentChatId', chatId);
                
                // Update active state in sidebar
                document.querySelectorAll('.chat-history-item').forEach(item => {
                    item.classList.remove('active');
                });
                document.querySelectorAll('.chat-history-item').forEach(item => {
                    if (item.querySelector('.title').textContent === data.chat.title) {
                        item.classList.add('active');
                    }
                });
                
                // Clear current chat display
                chatMessages.innerHTML = '';
                chatHistory = [];
                
                // Display messages
                data.chat.messages.forEach(msg => {
                    addMessageToUI(msg.sender, msg.text);
                    chatHistory.push({ sender: msg.sender, text: msg.text });
                });
                
                // If no messages, add welcome message
                if (data.chat.messages.length === 0) {
                    addMessageToUI('bot', 'Hello! I\'m your AI study assistant. How can I help you today?');
                }
                
                // Save to localStorage
                saveHistory();
            } else {
                console.error('Failed to load chat');
            }
        } catch (error) {
            console.error('Error loading chat:', error);
        }
    }
    
    // New chat button handler
    newChatBtn.addEventListener('click', () => {
        // Clear current chat
        chatMessages.innerHTML = '';
        window.currentChatId = null;
        localStorage.removeItem('currentChatId');
        chatHistory = [];
        
        // Add welcome message
        addMessageToUI('bot', 'Hello! I\'m your AI study assistant. How can I help you today?');
        
        // Update sidebar
        document.querySelectorAll('.chat-history-item').forEach(item => {
            item.classList.remove('active');
        });
    });
    
    // Function to send message to AI
    async function sendMessage(event) {
        event.preventDefault();
        const message = userInput.value.trim();
        if (!message) return;

        // Add user message to UI
        addMessageToUI('user', message);
        userInput.value = '';

        try {
            const response = await fetch(`${API_BASE_URL}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    message,
                    chatId: window.currentChatId
                })
            });

            if (!response.ok) {
                throw new Error('Failed to get AI response');
            }

            const data = await response.json();
            addMessageToUI('bot', data.message);
            
            // Update current chat ID if it's a new chat
            if (data.chatId && !window.currentChatId) {
                window.currentChatId = data.chatId;
                localStorage.setItem('currentChatId', data.chatId);
                // Refresh chat history
                loadChatHistory();
            }

            // Save to chat history
            chatHistory.push({ sender: 'user', text: message });
            chatHistory.push({ sender: 'bot', text: data.message });
            saveHistory();

        } catch (error) {
            console.error('Error sending message:', error);
            addMessageToUI('bot', 'Sorry, I encountered an error. Please try again.');
        }
    }

    // Function to display stored chat history from localStorage
    function displayStoredChatHistory() {
        // Get stored chats from localStorage
        const storedChats = JSON.parse(localStorage.getItem('storedChatHistory') || '[]');
        
        // If there are no stored chats and no server chats, show empty message
        if (storedChats.length === 0 && chatHistoryList.children.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'empty-history';
            emptyMessage.textContent = 'No chat history yet';
            chatHistoryList.appendChild(emptyMessage);
            return;
        }
        
        // Add stored chats to the history list
        storedChats.forEach(chat => {
            // Check if this chat is already in the list
            const existingItems = Array.from(chatHistoryList.children);
            const exists = existingItems.some(item => 
                item.classList.contains('chat-history-item') && 
                item.dataset.chatId === chat.id
            );
            
            if (!exists) {
                const chatItem = document.createElement('div');
                chatItem.className = 'chat-history-item stored-chat';
                chatItem.dataset.chatId = chat.id;
                
                const title = document.createElement('div');
                title.className = 'title';
                title.textContent = chat.title;
                
                const date = document.createElement('div');
                date.className = 'date';
                date.textContent = chat.date;
                
                chatItem.appendChild(title);
                chatItem.appendChild(date);
                
                // Add click event to load this stored chat
                chatItem.addEventListener('click', () => loadStoredChat(chat));
                
                chatHistoryList.appendChild(chatItem);
            }
        });
    }
    
    // Function to load a stored chat
    function loadStoredChat(chat) {
        // Clear current chat display
        chatMessages.innerHTML = '';
        chatHistory = [];
        
        // Display messages from stored chat
        chat.messages.forEach(msg => {
            addMessageToUI(msg.sender, msg.text);
            chatHistory.push({ sender: msg.sender, text: msg.text });
        });
        
        // If no messages, add welcome message
        if (chat.messages.length === 0) {
            addMessageToUI('bot', 'Hello! I\'m your AI study assistant. How can I help you today?');
        }
        
        // Update active state in sidebar
        document.querySelectorAll('.chat-history-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Find and activate this chat item
        const chatItems = document.querySelectorAll('.chat-history-item');
        chatItems.forEach(item => {
            if (item.dataset.chatId === chat.id) {
                item.classList.add('active');
            }
        });
        
        // Save to localStorage
        saveHistory();
    }
    
    // Load chat history when page loads
    loadChatHistory();
    
    // Also display stored chat history
    displayStoredChatHistory();

    // Send message function
    window.sendMessage = async function(event) {
        event.preventDefault();
        
        const userMessage = userInput.value.trim();
        if (!userMessage) return;
        
        // Clear input
        userInput.value = '';
        
        // Add user message to UI - ensure it's displayed immediately
        addMessageToUI('user', userMessage);
        
        // Add to chat history
        chatHistory.push({ sender: 'user', text: userMessage });
        saveHistory();
        
        // Make sure the UI updates before sending to server
        setTimeout(() => {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 10);
        
        // Show typing indicator
        showTypingIndicator();
        
        try {
            // Send message to backend
            const response = await fetch(`${API_BASE_URL}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ 
                    message: userMessage, 
                    chatId: window.currentChatId,
                    subjectId: localStorage.getItem('currentSubjectId') || ''
                })
            });
            
            // Remove typing indicator
            removeTypingIndicator();
            
            if (response.ok) {
                const data = await response.json();
                
                // Store the chat ID if provided
                if (data.chatId) {
                    window.currentChatId = data.chatId;
                    localStorage.setItem('currentChatId', data.chatId);
                    
                    // Refresh chat history to show the new chat
                    loadChatHistory();
                }
                
                // Add AI response to UI
                addMessageToUI('bot', data.message);
                
                // Add to chat history
                chatHistory.push({ sender: 'bot', text: data.message });
                saveHistory();
            } else {
                // Handle error
                const errorData = await response.json();
                addMessageToUI('bot', `Sorry, I encountered an error: ${errorData.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error sending message:', error);
            removeTypingIndicator();
            addMessageToUI('bot', 'Sorry, I\'m having trouble connecting to the server. Please try again later.');
        }
    };
    
    // Add message to UI
    function addMessageToUI(sender, text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'message-avatar';
        
        // Add appropriate icon
        const icon = document.createElement('i');
        icon.className = sender === 'user' ? 'fas fa-user' : 'fas fa-robot';
        avatarDiv.appendChild(icon);
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        const paragraph = document.createElement('p');
        // Make sure text is properly displayed as a string
        paragraph.textContent = String(text);
        contentDiv.appendChild(paragraph);
        
        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);
        
        chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Show typing indicator
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-indicator';
        typingDiv.id = 'typingIndicator';
        
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'message-avatar';
        
        const icon = document.createElement('i');
        icon.className = 'fas fa-robot';
        avatarDiv.appendChild(icon);
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        const dots = document.createElement('div');
        dots.className = 'typing-dots';
        
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('span');
            dots.appendChild(dot);
        }
        
        contentDiv.appendChild(dots);
        
        typingDiv.appendChild(avatarDiv);
        typingDiv.appendChild(contentDiv);
        
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Remove typing indicator
    function removeTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    // Save chat history to localStorage
    function saveHistory() {
        // Only keep the last 50 messages to avoid localStorage limits
        const trimmedHistory = chatHistory.slice(-50);
        localStorage.setItem('chatHistory', JSON.stringify(trimmedHistory));
    }
    
    // Clear chat history (all chats)
    window.clearChatHistory = function() {
        // Store the current chat history before clearing if it's not empty
        if (chatHistory.length > 0) {
            // Create a timestamp for this chat history
            const timestamp = new Date().toISOString();
            const chatTitle = `Chat ${new Date().toLocaleString()}`;
            
            // Get existing stored chats
            const storedChats = JSON.parse(localStorage.getItem('storedChatHistory') || '[]');
            
            // Add current chat to stored chats
            storedChats.push({
                id: timestamp,
                title: chatTitle,
                messages: chatHistory,
                date: new Date().toLocaleString()
            });
            
            // Keep only the last 10 chats to avoid localStorage limits
            const trimmedStoredChats = storedChats.slice(-10);
            
            // Save to localStorage
            localStorage.setItem('storedChatHistory', JSON.stringify(trimmedStoredChats));
        }
        
        chatHistory = [];
        localStorage.removeItem('chatHistory');
        chatMessages.innerHTML = '';
        
        // Add welcome message
        addMessageToUI('bot', 'Hello! I\'m your AI study assistant. How can I help you today?');
        
        // Update the chat history sidebar
        displayStoredChatHistory();
        
        // Also clear from server if authenticated
        if (token) {
            fetch(`${API_BASE_URL}/api/chat/history`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).catch(error => {
                console.error('Error clearing chat history on server:', error);
            });
        }
    };
    
    // Reset current chat
    window.resetCurrentChat = async function(chatId) {
        if (!chatId && window.currentChatId) {
            chatId = window.currentChatId;
        }
        
        if (!chatId || !token) return;
        
        try {
            // Store the current chat history before resetting
            if (chatHistory.length > 0) {
                // Create a timestamp for this chat history
                const timestamp = new Date().toISOString();
                const chatTitle = `Chat ${new Date().toLocaleString()}`;
                
                // Get existing stored chats
                const storedChats = JSON.parse(localStorage.getItem('storedChatHistory') || '[]');
                
                // Add current chat to stored chats
                storedChats.push({
                    id: timestamp,
                    title: chatTitle,
                    messages: chatHistory,
                    date: new Date().toLocaleString()
                });
                
                // Keep only the last 10 chats to avoid localStorage limits
                const trimmedStoredChats = storedChats.slice(-10);
                
                // Save to localStorage
                localStorage.setItem('storedChatHistory', JSON.stringify(trimmedStoredChats));
                
                // Update the chat history sidebar
                displayStoredChatHistory();
            }
            
            const response = await fetch(`${API_BASE_URL}/api/chat/${chatId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                // Clear local chat display
                chatHistory = [];
                
                // Make sure to completely clear the chat window
                chatMessages.innerHTML = '';
                
                // Add welcome message
                addMessageToUI('bot', 'Chat has been reset. How can I help you today?');
                
                // Update localStorage
                saveHistory();
                
                // Reset currentChatId in localStorage but keep the reference in memory
                // This allows the reset button to still work while clearing the chat content
                localStorage.removeItem('currentChatId');
            } else {
                console.error('Failed to reset chat on server');
            }
        } catch (error) {
            console.error('Error resetting chat:', error);
        }
    };
});