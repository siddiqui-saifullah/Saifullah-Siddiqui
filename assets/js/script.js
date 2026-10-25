document.addEventListener('DOMContentLoaded', () => {

    // --- 1. HEADER SCROLL EFFECT ---
    const header = document.querySelector('.main-header');
    // Check if header exists on the page before adding scroll listener
    if (header) {
        const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 50);
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    // --- 2. MOBILE MENU ---
    const navToggle = document.querySelector('.nav-toggle');
    const nav = document.getElementById('primary-nav');

    if (header && navToggle && nav) {
        const setOpen = open => {
            header.classList.toggle('nav-open', open);
            navToggle.setAttribute('aria-expanded', String(open));
            navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        };

        navToggle.addEventListener('click', () => setOpen(!header.classList.contains('nav-open')));
        nav.addEventListener('click', e => { if (e.target.closest('a')) setOpen(false); });
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && header.classList.contains('nav-open')) {
                setOpen(false);
                navToggle.focus();
            }
        });
        document.addEventListener('click', e => {
            if (!header.contains(e.target)) setOpen(false);
        });
        // Leaving the mobile layout (toggle hidden) with the menu open would strand it open
        window.addEventListener('resize', () => {
            if (getComputedStyle(navToggle).display === 'none') setOpen(false);
        }, { passive: true });
    }

    // --- 3. HIGHLIGHT THE SECTION IN VIEW (homepage) ---
    const sectionLinks = nav ? [...nav.querySelectorAll('a[href^="#"]')] : [];

    if (sectionLinks.length && 'IntersectionObserver' in window) {
        const linkFor = new Map();
        sectionLinks.forEach(link => {
            const section = document.querySelector(link.getAttribute('href'));
            if (section) linkFor.set(section, link);
        });

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                sectionLinks.forEach(l => l.classList.remove('is-active'));
                linkFor.get(entry.target).classList.add('is-active');
            });
        }, { rootMargin: '-45% 0px -50% 0px' });

        linkFor.forEach((_, section) => observer.observe(section));
    }

    // --- 4. POINTER GLOW ---
    const cursorGlow = document.querySelector('.cursor-glow');

    if (cursorGlow && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        window.addEventListener('mousemove', e => {
            cursorGlow.style.left = `${e.clientX}px`;
            cursorGlow.style.top = `${e.clientY}px`;
        }, { passive: true });

        // Fade the glow over links and buttons so it doesn't compete with their hover states
        document.querySelectorAll('a, button').forEach(el => {
            el.addEventListener('mouseenter', () => cursorGlow.classList.add('hidden'));
            el.addEventListener('mouseleave', () => cursorGlow.classList.remove('hidden'));
        });
    }

    // --- 5. PROJECT PREVIEW HOVER EFFECT (for homepage) ---
    const projectItems = document.querySelectorAll('.project-item');
    const projectPreview = document.querySelector('.project-preview');

    if (projectPreview) {
        document.addEventListener('mouseleave', () => {
            projectPreview.classList.remove('visible');
        });

        projectItems.forEach(item => {
            const previewImage = item.dataset.image;
            if (!previewImage) return;

            item.addEventListener('mousemove', e => {
                projectPreview.src = previewImage;
                projectPreview.classList.add('visible');

                projectPreview.style.left = `${e.clientX}px`;
                projectPreview.style.top = `${e.clientY}px`;
            });

            item.addEventListener('mouseleave', () => {
                projectPreview.classList.remove('visible');
            });
        });
    }

    // --- 6. COPY EMAIL ---
    document.querySelectorAll('[data-copy]').forEach(button => {
        const label = button.textContent;
        button.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(button.dataset.copy);
                button.textContent = 'Copied';
            } catch {
                button.textContent = 'Copy failed';
            }
            setTimeout(() => { button.textContent = label; }, 2000);
        });
    });

    // --- 7. INITIALIZE FEATHER ICONS ---
    // This will find all data-feather attributes and replace them with SVG icons
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
});
