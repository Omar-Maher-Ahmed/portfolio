function initPortfolio() {

    /* ── Theme Toggle ── */
    const html       = document.documentElement;
    const themeBtn   = document.getElementById('themeToggle');
    const mobileTBtn = document.getElementById('mobileThemeToggle');

    const savedTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);
    updateMobileToggleText(savedTheme);

    function toggleTheme() {
        const current = html.getAttribute('data-theme');
        const next    = current === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        updateMobileToggleText(next);
    }

    function updateMobileToggleText(theme) {
        if (mobileTBtn) {
            mobileTBtn.textContent = theme === 'dark'
                ? 'Switch to Light Mode ☀️'
                : 'Switch to Dark Mode 🌙';
        }
    }

    if (themeBtn)   themeBtn.addEventListener('click', toggleTheme);
    if (mobileTBtn) mobileTBtn.addEventListener('click', toggleTheme);

    /* ── Ambient Cursor Glow Spotlight ── */
    const cursorGlow = document.getElementById('cursorGlow');
    if (cursorGlow) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let glowX = mouseX;
        let glowY = mouseY;
        let isMoving = false;

        window.addEventListener('mousemove', e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            if (!isMoving) {
                cursorGlow.style.opacity = '1';
                isMoving = true;
            }
        }, { passive: true });

        document.addEventListener('mouseleave', () => {
            cursorGlow.style.opacity = '0';
            isMoving = false;
        });

        document.addEventListener('mouseenter', () => {
            cursorGlow.style.opacity = '1';
            isMoving = true;
        });

        function animateGlow() {
            glowX += (mouseX - glowX) * 0.15;
            glowY += (mouseY - glowY) * 0.15;
            cursorGlow.style.transform = `translate3d(${glowX - 250}px, ${glowY - 250}px, 0)`;
            requestAnimationFrame(animateGlow);
        }
        requestAnimationFrame(animateGlow);
    }

    /* ── Navbar Scroll Effect ── */
    const nav = document.getElementById('nav');
    if (nav) {
        window.addEventListener('scroll', () => {
            nav.classList.toggle('scrolled', window.scrollY > 40);
        }, { passive: true });
    }

    /* ── Active Nav Link ── */
    const sections  = document.querySelectorAll('section[id]');
    const navLinks  = document.querySelectorAll('.nav-link');

    if (sections.length && 'IntersectionObserver' in window) {
        const sectionObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    navLinks.forEach(l => l.classList.remove('active'));
                    const id = entry.target.id;
                    const active = document.querySelector(`.nav-link[data-section="${id}"]`);
                    if (active) active.classList.add('active');
                }
            });
        }, { threshold: 0.25 });

        sections.forEach(s => sectionObserver.observe(s));
    }

    /* ── Reveal on Scroll ── */
    const revealElements = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        revealElements.forEach(el => el.classList.add('visible'));
    }

    /* ── Hamburger / Mobile Menu ── */
    const hamburger  = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('open');
            mobileMenu.classList.toggle('open');
            document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
        });

        document.querySelectorAll('.mobile-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('open');
                mobileMenu.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    /* ── Contact Form ── */
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', async e => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            btn.textContent = 'Sending…';
            btn.disabled = true;
            try {
                const res = await fetch(form.action, {
                    method: 'POST',
                    body: new FormData(form),
                    headers: { 'Accept': 'application/json' }
                });
                if (res.ok) {
                    btn.textContent = '✓ Message Sent!';
                    btn.style.background = 'linear-gradient(135deg,#68d391,#48bb78)';
                    form.reset();
                } else {
                    throw new Error();
                }
            } catch {
                btn.textContent = 'Failed — Try Email';
                btn.style.background = 'linear-gradient(135deg,#fc8181,#e53e3e)';
                btn.disabled = false;
            }
        });
    }

    /* ── Smooth scroll for anchor links ── */
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const target = document.querySelector(a.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    /* ── GitHub Repositories Interactive Filtering & Live Search ── */
    const projectsGrid   = document.getElementById('projectsGrid');
    const projectSearch  = document.getElementById('projectSearch');
    const clearSearchBtn = document.getElementById('clearSearchBtn');
    const filterTabs     = document.querySelectorAll('.filter-tab');
    const projectCounter = document.getElementById('projectCounter');
    const projectsEmpty  = document.getElementById('projectsEmpty');
    const resetFilterBtn = document.getElementById('resetFilterBtn');

    let currentCategory    = 'all';
    let currentSearchQuery = '';

    function filterCards() {
        if (!projectsGrid) return;
        const cards = projectsGrid.querySelectorAll('.project-card');
        let visibleCount = 0;
        const q = currentSearchQuery.toLowerCase().trim();

        cards.forEach(card => {
            const category = card.getAttribute('data-category') || '';
            const matchesCategory = currentCategory === 'all' || category === currentCategory;

            const title = (card.querySelector('.project-title')?.textContent || '').toLowerCase();
            const desc = (card.querySelector('.project-desc')?.textContent || '').toLowerCase();
            const tech = (card.querySelector('.project-tech')?.textContent || '').toLowerCase();
            const badges = (card.querySelector('.project-badges')?.textContent || '').toLowerCase();

            const matchesSearch = !q || title.includes(q) || desc.includes(q) || tech.includes(q) || badges.includes(q);

            if (matchesCategory && matchesSearch) {
                card.style.display = 'flex';
                card.classList.add('visible');
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        if (projectCounter) {
            projectCounter.textContent = `Showing ${visibleCount} of ${cards.length} repositories`;
        }

        if (projectsEmpty) {
            projectsEmpty.style.display = visibleCount === 0 ? 'block' : 'none';
        }
    }

    // Filter tabs click
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentCategory = tab.getAttribute('data-category') || 'all';
            filterCards();
        });
    });

    // Real-time search input
    if (projectSearch) {
        projectSearch.addEventListener('input', e => {
            currentSearchQuery = e.target.value;
            if (clearSearchBtn) {
                clearSearchBtn.style.display = currentSearchQuery ? 'block' : 'none';
            }
            filterCards();
        });
    }

    // Clear search button
    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', () => {
            projectSearch.value = '';
            currentSearchQuery = '';
            clearSearchBtn.style.display = 'none';
            projectSearch.focus();
            filterCards();
        });
    }

    // Reset filters button in empty state
    if (resetFilterBtn) {
        resetFilterBtn.addEventListener('click', () => {
            currentCategory = 'all';
            currentSearchQuery = '';
            if (projectSearch) projectSearch.value = '';
            if (clearSearchBtn) clearSearchBtn.style.display = 'none';
            filterTabs.forEach(t => {
                t.classList.toggle('active', t.getAttribute('data-category') === 'all');
            });
            filterCards();
        });
    }

    // Run initial filter to ensure all cards have correct state
    filterCards();
}

// Immediate execution if DOM is ready, otherwise wait for event
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPortfolio);
} else {
    initPortfolio();
}
