// include.js - GitHub Pages PROVEN WORKING VERSION
(function() {
    'use strict';
    
    console.log('Include.js loaded - GitHub Pages Version');
    
    // Get current URL info
    const currentUrl = window.location.href;
    const isLocalhost = currentUrl.includes('localhost') || currentUrl.includes('127.0.0.1');
    const isGitHubPages = currentUrl.includes('github.io');
    
    // Get repo name from URL pattern: username.github.io/repo-name/
    function getRepoName() {
        if (!isGitHubPages) return '';
        
        const url = new URL(currentUrl);
        const pathParts = url.pathname.split('/').filter(part => part);
        
        // If it's a project site (not user site), the first part is repo name
        // username.github.io/repo-name/
        if (pathParts.length > 0 && !currentUrl.includes(`${pathParts[0]}.github.io`)) {
            return pathParts[0];
        }
        return '';
    }
    
    const repoName = getRepoName();
    console.log('Repo name detected:', repoName || '(user/organization site)');
    
    // Build base URL for all file requests
    function getBaseUrl() {
        if (isLocalhost) {
            // Local development - adjust based on your local setup
            return window.location.origin + '/';
        }
        
        if (isGitHubPages) {
            if (repoName) {
                // Project site: https://username.github.io/repo-name/
                return `https://${window.location.hostname}/${repoName}/`;
            } else {
                // User/organization site: https://username.github.io/
                return `https://${window.location.hostname}/`;
            }
        }
        
        // Fallback
        return window.location.origin + '/';
    }
    
    // Load component with RETRY logic
    async function loadComponent(componentName, containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container #${containerId} not found!`);
            return;
        }
        
        // Show loading
        container.innerHTML = `<div style="padding: 10px; background: #f0f0f0;">Loading ${componentName}...</div>`;
        
        // Try multiple paths (GitHub Pages needs different paths)
        const pathsToTry = [];
        const baseUrl = getBaseUrl();
        
        // For GitHub Pages
        if (isGitHubPages) {
            pathsToTry.push(
                `${baseUrl}header and footer/${componentName}`,  // Primary path
                `${baseUrl}${componentName}`,                    // Root
                `/${repoName}/header and footer/${componentName}`, // Absolute with repo
                `/header and footer/${componentName}`,           // Absolute without repo
                `./header and footer/${componentName}`,          // Relative
                `./${componentName}`                             // Same directory
            );
        } else {
            // Local development
            pathsToTry.push(
                './header and footer/' + componentName,
                './' + componentName,
                '/header and footer/' + componentName,
                '/' + componentName
            );
        }
        
        console.log(`Trying to load ${componentName} from:`, pathsToTry);
        
        // Try each path
        for (let i = 0; i < pathsToTry.length; i++) {
            const path = pathsToTry[i];
            try {
                console.log(`Attempt ${i + 1}: ${path}`);
                const response = await fetch(path);
                
                if (response.ok) {
                    const html = await response.text();
                    container.innerHTML = html;
                    console.log(`✅ SUCCESS! Loaded ${componentName} from: ${path}`);
                    
                    // Initialize component
                    if (containerId === 'header-container') {
                        initializeHeader();
                        fixAllLinks(); // Fix links for GitHub Pages
                    }
                    if (containerId === 'footer-container') {
                        initializeFooter();
                    }
                    
                    return true; // Success!
                }
            } catch (error) {
                console.log(`Failed attempt ${i + 1}:`, error.message);
                // Continue to next path
            }
        }
        
        // ALL PATHS FAILED - Show helpful error
        container.innerHTML = `
            <div style="
                background: #ffebee;
                border: 2px solid #f44336;
                border-radius: 8px;
                padding: 20px;
                margin: 10px;
                color: #c62828;
                font-family: Arial, sans-serif;
            ">
                <h3 style="margin-top: 0;">⚠️ Error Loading ${componentName}</h3>
                <p><strong>Problem:</strong> Cannot find ${componentName}</p>
                <p><strong>Your GitHub Pages URL:</strong> ${currentUrl}</p>
                <p><strong>Base URL used:</strong> ${baseUrl}</p>
                <p><strong>Repo name detected:</strong> ${repoName || 'None (user site)'}</p>
                <p><strong>Paths tried:</strong></p>
                <ul style="font-size: 12px;">
                    ${pathsToTry.map(p => `<li>${p}</li>`).join('')}
                </ul>
                <hr>
                <p><strong>Quick Fix:</strong></p>
                <ol>
                    <li>Make sure "header and footer" folder exists in your repo</li>
                    <li>Check that ${componentName} is inside that folder</li>
                    <li>Your repo structure should be:<br>
                        <code>
                        repository/<br>
                        ├── header and footer/<br>
                        │   ├── header.html<br>
                        │   ├── footer.html<br>
                        │   └── include.js<br>
                        ├── index.html<br>
                        └── other-pages.html
                        </code>
                    </li>
                </ol>
            </div>
        `;
        
        return false;
    }
    
    // Fix ALL links for GitHub Pages
    function fixAllLinks() {
        if (!isGitHubPages) return;
        
        const allLinks = document.querySelectorAll('a');
        const basePath = repoName ? `/${repoName}/` : '/';
        
        allLinks.forEach(link => {
            const href = link.getAttribute('href');
            
            // Skip if no href or is external/absolute
            if (!href || href.startsWith('http') || href.startsWith('#') || 
                href.startsWith('mailto:') || href.startsWith('tel:')) {
                return;
            }
            
            // Fix relative links
            if (href.startsWith('./')) {
                link.href = basePath + href.substring(2);
            } else if (!href.startsWith('/')) {
                // Links like "about.html" -> "/repo/about.html"
                link.href = basePath + href;
            } else if (href.startsWith('/') && repoName && !href.startsWith(`/${repoName}/`)) {
                // Absolute links without repo name
                link.href = basePath + href.substring(1);
            }
        });
        
        console.log('Fixed links for GitHub Pages');
    }
    
    // Initialize header
    function initializeHeader() {
        console.log('Initializing header...');
        
        // Mobile menu toggle
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
    }
    
    // Initialize footer
    function initializeFooter() {
        console.log('Initializing footer...');
        
        // Update copyright year
        document.querySelectorAll('[data-year], #current-year').forEach(el => {
            el.textContent = new Date().getFullYear();
        });
    }
    
    // Start loading when page is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    async function init() {
        console.log('Starting component loading...');
        
        // Load both components
        await Promise.all([
            loadComponent('header.html', 'header-container'),
            loadComponent('footer.html', 'footer-container')
        ]);
        
        console.log('Component loading complete!');
    }
})();
