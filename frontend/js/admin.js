// Admin authentication and functionality for Cognis AI

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in as admin
    const isAdmin = localStorage.getItem('adminLoggedIn');
    if (!isAdmin && !window.location.href.includes('login.html')) {
        // Redirect to login if not authenticated as admin
        window.location.href = 'login.html';
        return;
    }
    
    // If we're on the admin page, initialize admin functionality
    if (window.location.href.includes('admin.html')) {
        initAdminDashboard();
    }
});

// Initialize admin dashboard
function initAdminDashboard() {
    // Load registered users
    loadRegisteredUsers();
    
    // Set up tab switching
    const menuItems = document.querySelectorAll('.menu-item');
    const adminTabs = document.querySelectorAll('.admin-tab');
    
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            const tabId = item.getAttribute('data-tab');
            
            // Update active menu item
            menuItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            // Show selected tab
            adminTabs.forEach(tab => {
                tab.classList.remove('active');
                if (tab.id === `${tabId}-tab`) {
                    tab.classList.add('active');
                }
            });
        });
    });
    
    // Set up user search functionality
    const userSearch = document.getElementById('userSearch');
    if (userSearch) {
        userSearch.addEventListener('input', filterUsers);
    }
}

// Function to check if email and password match admin credentials
function checkAdminCredentials(email, password) {
    return email === 'admin@gmail.com' && password === 'admin';
}

// Function to handle admin login
function adminLogin(email, password) {
    if (checkAdminCredentials(email, password)) {
        localStorage.setItem('adminLoggedIn', 'true');
        return true;
    }
    return false;
}

// Function to logout admin
function adminLogout() {
    localStorage.removeItem('adminLoggedIn');
    window.location.href = 'login.html';
}

// Function to load registered users from localStorage
function loadRegisteredUsers() {
    const userTableBody = document.getElementById('userTableBody');
    if (!userTableBody) return;
    
    // Clear existing rows
    userTableBody.innerHTML = '';
    
    // Get registered users from localStorage
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    
    // Update total users count
    const totalUsersElement = document.getElementById('totalUsers');
    if (totalUsersElement) {
        totalUsersElement.textContent = users.length;
    }
    
    // If no users, show message
    if (users.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `<td colspan="4" class="empty-message">No registered users found</td>`;
        userTableBody.appendChild(emptyRow);
        return;
    }
    
    // Add each user to the table
    users.forEach(user => {
        const row = document.createElement('tr');
        row.dataset.email = user.email;
        
        const date = new Date(user.registeredAt).toLocaleDateString();
        
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${date}</td>
            <td>
                <button class="action-btn delete-btn" onclick="removeUser('${user.email}')">
                    <i class="fas fa-trash"></i> Remove
                </button>
            </td>
        `;
        
        userTableBody.appendChild(row);
    });
}

// Function to remove a user
function removeUser(email) {
    if (!confirm(`Are you sure you want to remove user ${email}?`)) {
        return;
    }
    
    // Get registered users
    let users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    
    // Filter out the user to remove
    users = users.filter(user => user.email !== email);
    
    // Save updated users list
    localStorage.setItem('registeredUsers', JSON.stringify(users));
    
    // Remove user's data
    localStorage.removeItem(`user_${email}`);
    
    // Reload users table
    loadRegisteredUsers();
    
    // Show success message
    alert(`User ${email} has been removed successfully.`);
}

// Function to filter users based on search input
function filterUsers() {
    const searchTerm = document.getElementById('userSearch').value.toLowerCase();
    const rows = document.querySelectorAll('#userTableBody tr');
    
    rows.forEach(row => {
        const name = row.cells[0]?.textContent.toLowerCase() || '';
        const email = row.cells[1]?.textContent.toLowerCase() || '';
        
        if (name.includes(searchTerm) || email.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}