/**
 * Scroll Animations for Cognis AI
 * This script handles revealing elements as they enter the viewport
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize floating elements movement
    initFloatingElements();
});

/**
 * Initialize scroll animations using Intersection Observer
 */
function initScrollAnimations() {
    // Select all elements with scroll animation classes
    const animatedElements = document.querySelectorAll(
        '.scroll-animate, .scroll-animate-left, .scroll-animate-right'
    );
    
    // Create observer options
    const observerOptions = {
        root: null, // viewport is the root
        rootMargin: '0px',
        threshold: 0.15 // trigger when 15% of the element is visible
    };
    
    // Create intersection observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Add fade-in class when element enters viewport
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                
                // Add staggered animation to child elements if they exist
                const children = entry.target.querySelectorAll('.stagger-item');
                if (children.length > 0) {
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('fade-in');
                        }, 100 * index);
                    });
                }
                
                // Unobserve element after it's animated
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe each animated element
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * Initialize floating elements movement on mouse move
 */
function initFloatingElements() {
    const floatingElements = document.querySelectorAll('.floating-element');
    const chatCards = document.querySelectorAll('.chat-demo-card, .phone-mockup');
    
    // Add subtle floating animation to chat cards
    chatCards.forEach(card => {
        card.classList.add('floating');
    });
    
    // Move floating elements on mouse move
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        floatingElements.forEach(element => {
            const offsetX = (mouseX - 0.5) * 20;
            const offsetY = (mouseY - 0.5) * 20;
            
            element.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        });
        
        // Subtle movement for chat cards
        chatCards.forEach(card => {
            const offsetX = (mouseX - 0.5) * 5;
            const offsetY = (mouseY - 0.5) * 5;
            
            card.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        });
    });
}