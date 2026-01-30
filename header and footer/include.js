// ============================================
// include.js - For loading reusable components
// Place this in "header and footer" folder
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('include.js: Loading header and footer components...');
    
    // Load header from same folder
    loadComponent('header.html', 'header-container', function() {
        console.log('Header loaded successfully');
        initializeHeader();
    });
    
    // Load footer from same folder
    loadComponent('footer.html', 'footer-container', function() {
        console.log('Footer loaded successfully');
        initializeFooter();
    });
});

// ============================================
// Main Loading Function
// ============================================
function loadComponent(fileName, containerId, onSuccess) {
    // Check if container exists
    const container = document.getElementById(containerId);
    if (!container) {
        console.warn(`Container #${containerId} not found on this page`);
        return;
    }
    
    // Show loading indicator
    container.innerHTML = `
        <div style="
            padding: 20px;
            text-align: center;
            color: #666;
            background: #f5f5f5;
            border-radius: 4px;
            margin: 10px 0;
        ">
            Loading ${fileName.replace('.html', '')}...
        </div>
    `;
    
    // Fetch the component
    fetch(fileName)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load ${fileName}: ${response.status} ${response.statusText}`);
            }
            return response.text();
        })
        .then(html => {
            // Insert the HTML
            container.innerHTML = html;
            
            // Call success callback
            if (onSuccess && typeof onSuccess === 'function') {
                onSuccess();
            }
        })
        .catch(error => {
            console.error(`Error loading ${fileName}:`, error);
            
            // Show error message
            container.innerHTML = `
                <div style="
                    background: #f8d7da;
                    color: #721c24;
                    padding: 15px;
                    border: 1px solid #f5c6cb;
                    border-radius: 4px;
                    margin: 10px 0;
                    text-align: center;
                ">
                    <strong>Error Loading ${fileName.replace('.html', '')}:</strong><br>
                    ${error.message}<br>
                    <small>Check that ${fileName} exists in the same folder as include.js</small>
                </div>
            `;
        });
}

// ============================================
// Header Initialization Functions
// ============================================
function initializeHeader() {
    console.log('Initializing header...');
    
    // 1. Mobile menu toggle functionality
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
    }
    
    // 2. Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            if (hamburger && navMenu) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
    
    // 3. Highlight current page in navigation
    highlightCurrentPage();
    
    // 4. Add dropdown functionality if present
    initializeDropdowns();
    
    // 5. Add scroll effect if needed
    window.addEventListener('scroll', handleHeaderScroll);
}

// ============================================
// Footer Initialization Functions
// ============================================
function initializeFooter() {
    console.log('Initializing footer...');
    
    // 1. Update current year in copyright
    const yearElements = document.querySelectorAll('#current-year, .current-year, [data-current-year]');
    yearElements.forEach(element => {
        element.textContent = new Date().getFullYear();
    });
    
    // 2. Initialize back to top button if present
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // Show/hide button on scroll
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTopBtn.style.display = 'block';
            } else {
                backToTopBtn.style.display = 'none';
            }
        });
    }
    
    // 3. Initialize newsletter form if present
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            if (validateEmail(email)) {
                alert('Thank you for subscribing!');
                this.reset();
            } else {
                alert('Please enter a valid email address');
            }
        });
    }
}

// ============================================
// Helper Functions
// ============================================

// Highlight current page in navigation
function highlightCurrentPage() {
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';
    
    document.querySelectorAll('.nav-link').forEach(link => {
        const linkPath = link.getAttribute('href');
        
        // Remove any existing active class
        link.classList.remove('active');
        
        // Check if this link matches current page
        if (linkPath === currentPage) {
            link.classList.add('active');
        } else if (currentPage === '' && linkPath === 'index.html') {
            link.classList.add('active');
        } else if (linkPath && currentPath.includes(linkPath.replace('.html', ''))) {
            link.classList.add('active');
        }
    });
}

// Initialize dropdown menus
function initializeDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        if (toggle && menu) {
            toggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Close other dropdowns
                dropdowns.forEach(other => {
                    if (other !== dropdown) {
                        other.classList.remove('open');
                    }
                });
                
                // Toggle this dropdown
                dropdown.classList.toggle('open');
            });
        }
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function() {
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('open');
        });
    });
}

// Handle header scroll effects
function handleHeaderScroll() {
    const header = document.querySelector('header');
    if (!header) return;
    
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

// Email validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ============================================
// Public API - You can call these from other scripts
// ============================================

// Reload header (useful after login/logout)
function reloadHeader() {
    loadComponent('header.html', 'header-container', initializeHeader);
}

// Reload footer
function reloadFooter() {
    loadComponent('footer.html', 'footer-container', initializeFooter);
}

// Update navigation active state manually
function updateNavActive(pageName) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === pageName) {
            link.classList.add('active');
        }
    });
}

// Make functions available globally
window.HeaderFooter = {
    reloadHeader: reloadHeader,
    reloadFooter: reloadFooter,
    updateNavActive: updateNavActive,
    highlightCurrentPage: highlightCurrentPage
};

console.log('include.js loaded successfully');
