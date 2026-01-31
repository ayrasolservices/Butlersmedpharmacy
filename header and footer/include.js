// include.js - GitHub Pages Simple Version
document.addEventListener('DOMContentLoaded', function() {
    
    // Get repository name from URL (for GitHub Pages)
    const pathSegments = window.location.pathname.split('/');
    const repoName = pathSegments[1] || '';
    const isGitHubPages = window.location.hostname.includes('github.io');
    
    // Build the correct base path
    let basePath = '';
    if (isGitHubPages && repoName) {
        // Format: https://username.github.io/repo-name/
        basePath = '/' + repoName + '/';
    } else if (isGitHubPages) {
        // Format: https://username.github.io/
        basePath = '/';
    } else {
        // Local development
        basePath = './';
    }
    
    console.log('Base path for GitHub Pages:', basePath);
    
    // Load header
    fetch(basePath + 'header and footer/header.html')
        .then(response => {
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response.text();
        })
        .then(html => {
            document.getElementById('header-container').innerHTML = html;
            console.log('✓ Header loaded');
            
            // Fix all links in header for GitHub Pages
            if (isGitHubPages) {
                document.querySelectorAll('#header-container a').forEach(link => {
                    const href = link.getAttribute('href');
                    if (href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('mailto:')) {
                        if (href.startsWith('./')) {
                            link.href = basePath + href.substring(2);
                        } else if (!href.startsWith('/')) {
                            link.href = basePath + href;
                        }
                    }
                });
            }
            
            // Initialize mobile menu AFTER header is loaded
            initMobileMenu();
        })
        .catch(error => {
            console.error('Header error:', error);
            document.getElementById('header-container').innerHTML = `
                <nav style="background:#333;color:white;padding:1rem;">
                    <a href="${basePath}" style="color:white;">Home</a> | 
                    <a href="${basePath}about.html" style="color:white;">About</a>
                </nav>
            `;
        });
    
    // Load footer
    fetch(basePath + 'header and footer/footer.html')
        .then(response => {
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response.text();
        })
        .then(html => {
            document.getElementById('footer-container').innerHTML = html;
            console.log('✓ Footer loaded');
        })
        .catch(error => {
            console.error('Footer error:', error);
            document.getElementById('footer-container').innerHTML = `
                <footer style="background:#222;color:white;padding:1rem;text-align:center;">
                    &copy; ${new Date().getFullYear()} My Website
                </footer>
            `;
        });
});

// Mobile menu function - must be outside DOMContentLoaded
function initMobileMenu() {
    console.log('Initializing mobile menu...');
    
    // Try multiple times as header might load slowly
    let attempts = 0;
    const maxAttempts = 10;
    
    function tryInit() {
        attempts++;
        
        const hamburgerBtn = document.getElementById('hamburgerBtn');
        const mobilePanel = document.getElementById('mobilePanel');
        const mobileOverlay = document.getElementById('mobileOverlay');
        const mobileCloseBtn = document.getElementById('mobileCloseBtn');
        
        if (!hamburgerBtn || !mobilePanel) {
            if (attempts < maxAttempts) {
                console.log(`Mobile menu elements not found, retrying... (${attempts}/${maxAttempts})`);
                setTimeout(tryInit, 200);
            } else {
                console.log('❌ Mobile menu elements not found after maximum attempts');
                // Try to find by class as fallback
                const hamburgerByClass = document.querySelector('.hamburger');
                const mobilePanelByClass = document.querySelector('.mobile-panel');
                if (hamburgerByClass && mobilePanelByClass) {
                    console.log('Found elements by class, initializing...');
                    initWithElements(hamburgerByClass, mobilePanelByClass, 
                                   document.querySelector('.mobile-overlay'),
                                   document.querySelector('.mobile-close-btn'));
                }
            }
            return;
        }
        
        console.log('✓ Found mobile menu elements by ID');
        initWithElements(hamburgerBtn, mobilePanel, mobileOverlay, mobileCloseBtn);
    }
    
    function initWithElements(hamburgerBtn, mobilePanel, mobileOverlay, mobileCloseBtn) {
        console.log('Initializing mobile menu with elements...');
        
        function openMobileMenu() {
            console.log('Opening mobile menu');
            if (mobileOverlay) mobileOverlay.classList.add('show');
            if (mobilePanel) mobilePanel.classList.add('show');
            if (hamburgerBtn) hamburgerBtn.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
        }
        
        function closeMobileMenu() {
            console.log('Closing mobile menu');
            if (mobileOverlay) mobileOverlay.classList.remove('show');
            if (mobilePanel) mobilePanel.classList.remove('show');
            if (hamburgerBtn) hamburgerBtn.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
        
        // Clear any existing event listeners
        const newHamburgerBtn = hamburgerBtn.cloneNode(true);
        hamburgerBtn.parentNode.replaceChild(newHamburgerBtn, hamburgerBtn);
        
        // Add click event to the button AND all children (including SVG)
        newHamburgerBtn.addEventListener('click', openMobileMenu);
        
        // Also add pointer-events style to ensure SVG is clickable
        const hamburgerIcon = newHamburgerBtn.querySelector('.hamburger-icon');
        if (hamburgerIcon) {
            hamburgerIcon.style.pointerEvents = 'auto';
        }
        
        // Add events for close button and overlay
        if (mobileCloseBtn) {
            const newCloseBtn = mobileCloseBtn.cloneNode(true);
            mobileCloseBtn.parentNode.replaceChild(newCloseBtn, mobileCloseBtn);
            newCloseBtn.addEventListener('click', closeMobileMenu);
        }
        
        if (mobileOverlay) {
            const newOverlay = mobileOverlay.cloneNode(true);
            mobileOverlay.parentNode.replaceChild(newOverlay, mobileOverlay);
            newOverlay.addEventListener('click', closeMobileMenu);
        }
        
        // Close on window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 992) {
                closeMobileMenu();
            }
        });
        
        // Close when clicking links in mobile panel
        if (mobilePanel) {
            mobilePanel.addEventListener('click', function(e) {
                if (e.target.tagName === 'A') {
                    closeMobileMenu();
                }
            });
        }
        
        console.log('✅ Mobile menu fully initialized');
        
        // Test: Add a temporary style to show it's working
        newHamburgerBtn.style.border = '2px solid #FD0510';
        setTimeout(() => {
            newHamburgerBtn.style.border = '';
        }, 2000);
    }
    
    // Start initialization
    tryInit();
}
