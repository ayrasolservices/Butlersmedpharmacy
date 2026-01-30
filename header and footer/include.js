// include.js - Optimized for GitHub Pages
(function() {
    'use strict';
    
    // Configuration
    const CONFIG = {
        repoName: window.location.pathname.split('/')[1] || '', // Get repo name from URL
        isGitHubPages: window.location.hostname.includes('github.io'),
        debug: true
    };
    
    // Log info
    console.log('GitHub Pages Include.js loaded');
    console.log('Repo name:', CONFIG.repoName);
    console.log('Full path:', window.location.pathname);
    
    // Determine base path for GitHub Pages
    function getBasePath() {
        if (!CONFIG.isGitHubPages) {
            // Local development - adjust as needed
            const path = window.location.pathname;
            const segments = path.split('/');
            
            // If we're in a subfolder (like /about/)
            if (segments.length > 2 && segments[segments.length - 1] !== '') {
                // We're in a file in a subfolder
                return '../';
            } else if (segments.length > 2) {
                // We're in a subfolder directory
                return './';
            }
            return './';
        }
        
        // GitHub Pages - includes repo name in path
        if (CONFIG.repoName && CONFIG.repoName !== '') {
            return '/' + CONFIG.repoName + '/';
        }
        
        // User/organization site (username.github.io)
        return '/';
    }
    
    // Load a component
    async function loadComponent(containerId, filename) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.warn(`Container #${containerId} not found`);
            return;
        }
        
        // Show loading
        container.innerHTML = '<div style="padding: 10px; background: #f5f5f5;">Loading...</div>';
        
        // Build paths to try (GitHub Pages needs absolute paths)
        const basePath = getBasePath();
        const pathsToTry = [
            `${basePath}header and footer/${filename}`,  // With folder name
            `${basePath}${filename}`,                    // In root
            `./header and footer/${filename}`,           // Relative with folder
            `./${filename}`,                             // Relative in same dir
            `/${filename}`,                              // Absolute root
            filename                                     // Just filename
        ];
        
        if (CONFIG.debug) {
            console.log('Trying paths for', filename, ':', pathsToTry);
        }
        
        // Try each path
        for (const path of pathsToTry) {
            try {
                console.log(`Trying: ${path}`);
                const response = await fetch(path);
                
                if (response.ok) {
                    const html = await response.text();
                    container.innerHTML = html;
                    console.log(`✓ Loaded ${filename} from: ${path}`);
                    
                    // Initialize
                    if (containerId === 'header-container') initializeHeader();
                    if (containerId === 'footer-container') initializeFooter();
                    
                    return;
                }
            } catch (error) {
                // Continue to next path
                continue;
            }
        }
        
        // If all paths fail
        container.innerHTML = `
            <div style="
                background: #ffe6e6;
                border: 1px solid #ff9999;
                padding: 15px;
                margin: 10px;
                border-radius: 5px;
            ">
                <strong>Error loading ${filename}</strong><br>
                Tried paths: ${pathsToTry.join(', ')}<br>
                <small>Make sure "header and footer" folder exists in repository root</small>
            </div>
        `;
    }
    
    // Initialize header
    function initializeHeader() {
        console.log('Initializing header...');
        
        // Mobile menu
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
            
            // Close menu on link click
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });
        }
        
        // Fix GitHub Pages links
        fixLinks();
    }
    
    // Initialize footer
    function initializeFooter() {
        console.log('Initializing footer...');
        
        // Update year
        const yearElements = document.querySelectorAll('[data-current-year]');
        yearElements.forEach(el => {
            el.textContent = new Date().getFullYear();
        });
    }
    
    // Fix links for GitHub Pages
    function fixLinks() {
        const links = document.querySelectorAll('a');
        const basePath = getBasePath();
        
        links.forEach(link => {
            const href = link.getAttribute('href');
            
            // Skip external links, anchors, and empty hrefs
            if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:')) {
                return;
            }
            
            // If it's a relative link and we're on GitHub Pages
            if (CONFIG.isGitHubPages && href.startsWith('./')) {
                link.href = basePath + href.substring(2);
            } else if (CONFIG.isGitHubPages && !href.startsWith('/') && !href.startsWith('.')) {
                // Links like "about.html" -> "/repo/about.html"
                link.href = basePath + href;
            }
        });
    }
    
    // Start loading when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    function init() {
        console.log('DOM ready, loading components...');
        
        // Load both components
        Promise.all([
            loadComponent('header-container', 'header.html'),
            loadComponent('footer-container', 'footer.html')
        ]).then(() => {
            console.log('All components loaded successfully');
        }).catch(error => {
            console.error('Error loading components:', error);
        });
    }
})();
