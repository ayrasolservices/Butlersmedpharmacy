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
