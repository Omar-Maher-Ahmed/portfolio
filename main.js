document.addEventListener('DOMContentLoaded', () => {

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

    /* ── Custom Cursor ── */
    const dot  = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', e => {
        mx = e.clientX; my = e.clientY;
        dot.style.left  = mx + 'px';
        dot.style.top   = my + 'px';
    });

    // Smooth ring follow
    (function loop() {
        rx += (mx - rx) * 0.12;
        ry += (my - ry) * 0.12;
        ring.style.left = rx + 'px';
        ring.style.top  = ry + 'px';
        requestAnimationFrame(loop);
    })();

    // Expand on hover
    document.querySelectorAll('a, button, .glass, input, textarea').forEach(el => {
        el.addEventListener('mouseenter', () => ring.classList.add('expand'));
        el.addEventListener('mouseleave', () => ring.classList.remove('expand'));
    });

    /* ── Navbar Scroll Effect ── */
    const nav = document.getElementById('nav');
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });

    /* ── Active Nav Link ── */
    const sections  = document.querySelectorAll('section[id]');
    const navLinks  = document.querySelectorAll('.nav-link');

    const sectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(l => l.classList.remove('active'));
                const id = entry.target.id;
                const active = document.querySelector(`.nav-link[data-section="${id}"]`);
                if (active) active.classList.add('active');
            }
        });
    }, { threshold: 0.4 });

    sections.forEach(s => sectionObserver.observe(s));

    /* ── Reveal on Scroll ── */
    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    /* ── Hamburger / Mobile Menu ── */
    const hamburger  = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');

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

    /* ── Smooth scroll for older browsers ── */
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const target = document.querySelector(a.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

});
