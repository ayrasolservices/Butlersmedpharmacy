// ============================================
// include.js - For loading reusable components
// ============================================

(function() {
    'use strict';
    
    // Configuration
    const CONFIG = {
        headerFile: 'header.html',
        footerFile: 'footer.html',
        headerContainerId: 'header-container',
        footerContainerId: 'footer-container',
        showDebug: true // Set to false in production
    };
    
    // Get the directory where this script is located
    function getScriptDirectory() {
        const scripts = document.getElementsByTagName('script');
        const currentScript = scripts[scripts.length - 1];
        const scriptPath = currentScript.src;
        
        // Extract directory path
        if (scriptPath) {
            return scriptPath.substring(0, scriptPath.lastIndexOf('/') + 1);
        }
        
        // Fallback: Assume script is in same folder as HTML
        return '';
    }
    
    // Get correct path for file
    function getFilePath(filename) {
        const scriptDir = getScriptDirectory();
        
        // Method 1: If script has a src attribute (external file)
        if (scriptDir) {
            return scriptDir + filename;
        }
        
        // Method 2: If script is inline or path issues, try different approaches
        const basePath = window.location.pathname;
        const isRoot = basePath.endsWith('/') || basePath.endsWith('.html');
        
        if (isRoot) {
            // We're in root or a file in root
            return filename;
        } else {
            // We're in a subdirectory
            return '../' + filename;
        }
    }
    
    // Show debug message
    function debug(message) {
        if (CONFIG.showDebug) {
            console.log(`[Include.js] ${message}`);
        }
    }
    
    // Show error in container
    function showError(containerId, message) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div style="
                    background: #fff3cd;
                    border: 1px solid #ffeaa7;
                    color: #856404;
                    padding: 15px;
                    margin: 10px 0;
                    border-radius: 4px;
                    font-family: Arial, sans-serif;
                ">
                    <strong>Component Loading Error</strong><br>
                    ${message}<br>
                    <small>Please check file paths and server configuration</small>
                </div>
            `;
        }
    }
    
    // Load a component
    async function loadComponent(containerId, filename) {
        const container = document.getElementById(containerId);
        
        if (!container) {
            debug(`Container #${containerId} not found, skipping ${filename}`);
            return false;
        }
        
        // Show loading state
        container.innerHTML = `
            <div style="
                text-align: center;
                padding: 20px;
                color: #6c757d;
                font-style: italic;
            ">
                Loading ${filename.replace('.html', '')}...
            </div>
        `;
        
        try {
            // Try multiple path strategies
            const pathsToTry = [
                filename,                          // Same directory
                getFilePath(filename),            // Relative to script
                `header and footer/${filename}`,  // Specific folder
                `/${filename}`,                   // Root directory
                `./${filename}`                   // Current directory
            ];
            
            let response;
            let triedPaths = [];
            
            for (const path of pathsToTry) {
                triedPaths.push(path);
                debug(`Trying to load from: ${path}`);
                
                try {
                    response = await fetch(path);
                    if (response.ok) {
                        debug(`Successfully loaded from: ${path}`);
                        break;
                    }
                } catch (e) {
                    // Continue to next path
                    continue;
                }
            }
            
            if (!response || !response.ok) {
                throw new Error(`File not found. Tried: ${triedPaths.join(', ')}`);
            }
            
            const html = await response.text();
            container.innerHTML = html;
            
            // Initialize component
            if (containerId === CONFIG.headerContainerId) {
                initializeHeader();
            } else if (containerId === CONFIG.footerContainerId) {
                initializeFooter();
            }
            
            return true;
            
        } catch (error) {
            debug(`Error loading ${filename}: ${error.message}`);
            showError(containerId, `Failed to load ${filename}: ${error.message}`);
            return false;
        }
    }
    
    // ============================================
    // Initialize Components
    // ============================================
    
    function initializeHeader() {
        debug('Initializing header...');
        
        // Mobile menu toggle
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', function() {
                this.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
            
            // Close menu when clicking links
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', function() {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });
        }
        
        // Highlight current page
        highlightCurrentPage();
    }
    
    function initializeFooter() {
        debug('Initializing footer...');
        
        // Update copyright year
        document.querySelectorAll('[data-year]').forEach(element => {
            element.textContent = new Date().getFullYear();
        });
    }
    
    // Highlight current page in navigation
    function highlightCurrentPage() {
        const currentPath = window.location.pathname;
        const currentPage = currentPath.split('/').pop() || 'index.html';
        
        document.querySelectorAll('.nav-link').forEach(link => {
            const linkPath = link.getAttribute('href');
            link.classList.remove('active');
            
            if (linkPath === currentPage || 
                (currentPage === 'index.html' && linkPath === '/') ||
                (linkPath && currentPath.includes(linkPath))) {
                link.classList.add('active');
            }
        });
    }
    
    // ============================================
    // Main Execution
    // ============================================
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    async function init() {
        debug('Starting component loading...');
        
        // Load components
        await Promise.all([
            loadComponent(CONFIG.headerContainerId, CONFIG.headerFile),
            loadComponent(CONFIG.footerContainerId, CONFIG.footerFile)
        ]);
        
        debug('Component loading completed');
    }
    
    // Make reload functions available globally
    window.reloadHeader = function() {
        return loadComponent(CONFIG.headerContainerId, CONFIG.headerFile);
    };
    
    window.reloadFooter = function() {
        return loadComponent(CONFIG.footerContainerId, CONFIG.footerFile);
    };
    
})();
