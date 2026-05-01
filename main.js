document.addEventListener('DOMContentLoaded', () => {
    // 1. Custom Cursor Logic
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.cursor-follower');
    
    document.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        
        // Main dot
        cursor.style.transform = `translate(${clientX}px, ${clientY}px)`;
        
        // Smooth follower
        follower.style.transform = `translate(${clientX - 11}px, ${clientY - 11}px)`;
    });

    // Cursor Reactivity
    const interactiveElements = document.querySelectorAll('a, button, .glass, .project-card');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            follower.style.transform += ' scale(1.5)';
            follower.style.background = 'rgba(100, 255, 218, 0.1)';
            follower.style.borderColor = 'transparent';
        });
        el.addEventListener('mouseleave', () => {
            follower.style.transform = follower.style.transform.replace(' scale(1.5)', '');
            follower.style.background = 'transparent';
            follower.style.borderColor = 'var(--accent-primary)';
        });
    });

    // 2. Intersection Observer for Scroll-Reveal
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-up');
    fadeElements.forEach(el => revealObserver.observe(el));

    // 3. Smooth Scroll for Navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navHeight = document.querySelector('.glass-nav').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 4. Navbar Background Change on Scroll
    const nav = document.querySelector('.glass-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.style.padding = '12px 0';
            nav.style.background = 'rgba(11, 16, 27, 0.95)';
        } else {
            nav.style.padding = '20px 0';
            nav.style.background = 'rgba(11, 16, 27, 0.8)';
        }
    });

    // 5. Parallax Effect for Background Blobs
    const blobs = document.querySelectorAll('.blob');
    window.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        blobs.forEach((blob, index) => {
            const speed = (index + 1) * 0.015;
            const x = (clientX - centerX) * speed;
            const y = (clientY - centerY) * speed;
            blob.style.left = `calc(${blob.offsetLeft}px + ${x}px)`; // This is a bit jittery, let's use transform
            // Overriding transform to include move-blob animation and mouse parallax
            // Actually, for simplicity and performance, let's just stick to the CSS animation + subtle JS offset
            blob.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
});
