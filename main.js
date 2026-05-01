document.addEventListener('DOMContentLoaded', () => {
    // 1. Custom Cursor Follower
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.cursor-follower');
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        follower.style.transform = `translate(${e.clientX - 12}px, ${e.clientY - 12}px)`;
    });

    // 2. Reveal Animations on Scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // 3. Navbar Scroll Effect
    const nav = document.querySelector('.nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.style.padding = '16px 0';
            nav.style.background = 'rgba(8, 11, 18, 0.95)';
        } else {
            nav.style.padding = '24px 0';
            nav.style.background = 'transparent';
        }
    });
});
