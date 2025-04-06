// Subjects management for Cognis AI

// Function to save a new subject to localStorage
function saveSubject(subjectData) {
    // Get existing subjects or initialize empty array
    const subjects = JSON.parse(localStorage.getItem('subjects') || '[]');
    
    // Add unique ID and creation date to the subject
    const newSubject = {
        ...subjectData,
        id: 'subject_' + Date.now(),
        createdAt: new Date().toISOString()
    };
    
    // Add new subject to array
    subjects.push(newSubject);
    
    // Save updated array back to localStorage
    localStorage.setItem('subjects', JSON.stringify(subjects));
    
    return newSubject;
}

// Function to get all subjects from localStorage
function getAllSubjects() {
    return JSON.parse(localStorage.getItem('subjects') || '[]');
}

// Function to get a specific subject by ID
function getSubjectById(id) {
    const subjects = getAllSubjects();
    return subjects.find(subject => subject.id === id);
}

// Function to delete a subject by ID
function deleteSubject(id) {
    let subjects = getAllSubjects();
    subjects = subjects.filter(subject => subject.id !== id);
    localStorage.setItem('subjects', JSON.stringify(subjects));
}

// Function to determine icon based on subject type
function getSubjectIcon(type) {
    const icons = {
        'teacher': 'fas fa-chalkboard-teacher',
        'creative': 'fas fa-paint-brush',
        'professional': 'fas fa-briefcase',
        'friend': 'fas fa-user-friends',
        'custom': 'fas fa-cog',
        // Default fallbacks for expertise areas
        'math': 'fas fa-calculator',
        'science': 'fas fa-flask',
        'languages': 'fas fa-language',
        'arts': 'fas fa-palette'
    };
    
    return icons[type] || 'fas fa-robot';
}