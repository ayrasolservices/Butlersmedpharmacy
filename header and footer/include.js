document.addEventListener('DOMContentLoaded', function() {
    
    const pathSegments = window.location.pathname.split('/');
    const repoName = pathSegments[1] || '';
    const isGitHubPages = window.location.hostname.includes('github.io');
    
    let basePath = '';
    if (isGitHubPages && repoName) {
        basePath = '/' + repoName + '/';
    } else if (isGitHubPages) {
        basePath = '/';
    } else {
        basePath = './';
    }
    
    console.log('Base path:', basePath);
    
    fetch(basePath + 'header and footer/header.html')
        .then(response => {
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response.text();
        })
        .then(html => {
            document.getElementById('header-container').innerHTML = html;
            console.log('Header loaded');
            
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
            
            initMobileMenu();
        })
        .catch(error => {
            console.error('Header error:', error);
            document.getElementById('header-container').innerHTML = `
                <nav style="background:#203F99;color:white;padding:1rem;">
                    <a href="${basePath}" style="color:white;">Butler's Med Pharmacy</a>
                </nav>
            `;
        });
    
    fetch(basePath + 'header and footer/footer.html')
        .then(response => {
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response.text();
        })
        .then(html => {
            document.getElementById('footer-container').innerHTML = html;
            console.log('Footer loaded');
        })
        .catch(error => {
            console.error('Footer error:', error);
            document.getElementById('footer-container').innerHTML = `
                <footer style="background:#222;color:white;padding:1rem;text-align:center;">
                    &copy; ${new Date().getFullYear()} Butler's Med Pharmacy
                </footer>
            `;
        });
});

function initMobileMenu() {
    console.log('Starting mobile menu init...');
    
    let attempts = 0;
    const maxAttempts = 20;
    
    function tryInit() {
        attempts++;
        
        const hamburgerBtn = document.getElementById('bt-hamburgerBtn');
        const mobilePanel = document.getElementById('bt-mobilePanel');
        const mobileOverlay = document.getElementById('bt-mobileOverlay');
        const mobileCloseBtn = document.getElementById('bt-mobileCloseBtn');
        
        console.log(`Attempt ${attempts}:`, {
            hamburgerBtn: !!hamburgerBtn,
            mobilePanel: !!mobilePanel,
            mobileOverlay: !!mobileOverlay,
            mobileCloseBtn: !!mobileCloseBtn
        });
        
        if (!hamburgerBtn || !mobilePanel) {
            if (attempts < maxAttempts) {
                setTimeout(tryInit, 300);
            } else {
                console.log('Failed to find elements');
                
                const hamburgerByClass = document.querySelector('.bt-hamburger');
                const mobilePanelByClass = document.querySelector('.bt-mobile-panel');
                if (hamburgerByClass && mobilePanelByClass) {
                    console.log('Found by class');
                    const overlayByClass = document.querySelector('.bt-mobile-overlay');
                    const closeBtnByClass = document.querySelector('.bt-mobile-close-btn');
                    initWithElements(hamburgerByClass, mobilePanelByClass, overlayByClass, closeBtnByClass);
                } else {
                    console.log('Creating manual mobile menu');
                    createManualMobileMenu();
                }
            }
            return;
        }
        
        console.log('All elements found');
        initWithElements(hamburgerBtn, mobilePanel, mobileOverlay, mobileCloseBtn);
    }
    
    function initWithElements(hamburgerBtn, mobilePanel, mobileOverlay, mobileCloseBtn) {
        console.log('Setting up event listeners');
        
        function openMobileMenu() {
            console.log('Opening menu');
            if (mobileOverlay) mobileOverlay.classList.add('show');
            if (mobilePanel) mobilePanel.classList.add('show');
            if (hamburgerBtn) hamburgerBtn.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
        }
        
        function closeMobileMenu() {
            console.log('Closing menu');
            if (mobileOverlay) mobileOverlay.classList.remove('show');
            if (mobilePanel) mobilePanel.classList.remove('show');
            if (hamburgerBtn) hamburgerBtn.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
        
        hamburgerBtn.addEventListener('click', openMobileMenu);
        
        if (mobileCloseBtn) {
            mobileCloseBtn.addEventListener('click', closeMobileMenu);
        }
        
        if (mobileOverlay) {
            mobileOverlay.addEventListener('click', closeMobileMenu);
        }
        
        window.addEventListener('resize', function() {
            if (window.innerWidth > 992) {
                closeMobileMenu();
            }
        });
        
        if (mobilePanel) {
            mobilePanel.addEventListener('click', function(e) {
                if (e.target.tagName === 'A') {
                    setTimeout(closeMobileMenu, 100);
                }
            });
        }
        
        console.log('Mobile menu initialized');
        
        hamburgerBtn.style.outline = '2px solid green';
        setTimeout(() => {
            hamburgerBtn.style.outline = '';
        }, 2000);
    }
    
    function createManualMobileMenu() {
        const headerContainer = document.getElementById('header-container');
        if (!headerContainer) return;
        
        const existingMenu = headerContainer.querySelector('.bt-mobile-header');
        if (existingMenu) return;
        
        const mobileMenuHTML = `
            <div class="bt-mobile-header">
                <div class="bt-wrap">
                    <a class="bt-mobile-logo" href="./index.html">
                        <img class="bt-logo-img" src="./assets/butlers-pharmacy-logo.png" alt="Logo">
                    </a>
                    <button class="bt-hamburger" id="bt-hamburgerBtn">
                        <div class="bt-hamburger-icon">
                            <svg viewBox="0 0 24 24" width="30" height="30">
                                <path d="M3 12h18M3 6h18M3 18h18" stroke="white" stroke-width="2"/>
                            </svg>
                        </div>
                    </button>
                </div>
            </div>
            <div class="bt-mobile-overlay" id="bt-mobileOverlay"></div>
            <div class="bt-mobile-panel" id="bt-mobilePanel">
                <div class="bt-mobile-inner">
                    <button class="bt-mobile-close-btn" id="bt-mobileCloseBtn">✕</button>
                    <p>Menu items will appear here</p>
                </div>
            </div>
        `;
        
        headerContainer.insertAdjacentHTML('beforeend', mobileMenuHTML);
        
        setTimeout(() => {
            const hamburgerBtn = document.getElementById('bt-hamburgerBtn');
            const mobilePanel = document.getElementById('bt-mobilePanel');
            const mobileOverlay = document.getElementById('bt-mobileOverlay');
            const mobileCloseBtn = document.getElementById('bt-mobileCloseBtn');
            
            if (hamburgerBtn && mobilePanel) {
                initWithElements(hamburgerBtn, mobilePanel, mobileOverlay, mobileCloseBtn);
            }
        }, 100);
    }
    
    tryInit();
}
