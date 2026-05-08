/* =============================================
   MFevziDemir Solutions – Main JavaScript
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

    /* ---------- Loading Screen ---------- */
    const loader = document.getElementById('loading-screen');
    if (loader) {
        // Hide loader quickly to improve LCP
        const hideLoader = () => {
            loader.classList.add('hide');
            setTimeout(() => { if(loader.parentNode) loader.remove(); }, 600);
        };
        
        if (document.readyState === 'complete') {
            hideLoader();
        } else {
            window.addEventListener('load', hideLoader);
            // Safety timeout
            setTimeout(hideLoader, 3000); 
        }
    }

    /* ---------- Navbar Scroll Effect ---------- */
    const navbar = document.querySelector('.navbar-mf');
    const handleNavScroll = () => {
        if (!navbar) return;
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleNavScroll, { passive: true });

    /* ---------- Dynamic Copyright Year ---------- */
    const copyrightYears = document.querySelectorAll('.copyright-year');
    copyrightYears.forEach(el => el.textContent = new Date().getFullYear());
    handleNavScroll();

    /* ---------- Scroll Animation (IntersectionObserver) ---------- */
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -40px 0px' };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // animate only once
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-up').forEach(el => observer.observe(el));

    /* ---------- Scroll to Top Button ---------- */
    const scrollTopBtn = document.getElementById('scrollTop');
    const handleScrollTop = () => {
        if (!scrollTopBtn) return;
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('show');
            scrollTopBtn.style.opacity = '1';
        } else {
            scrollTopBtn.classList.remove('show');
            scrollTopBtn.style.opacity = '0';
        }
    };
    window.addEventListener('scroll', handleScrollTop, { passive: true });
    handleScrollTop();

    /* ---------- Smooth Scroll ---------- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navHeight = navbar ? navbar.offsetHeight : 0;
                const targetPos = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
                window.scrollTo({ top: targetPos, behavior: 'smooth' });
            }
            // Close mobile nav if open
            const navCollapse = document.getElementById('navbarNav');
            if (navCollapse && navCollapse.classList.contains('show')) {
                $(navCollapse).collapse('hide');
            }
        });
    });

    /* ---------- Hero Particles ---------- */
    const particleContainer = document.querySelector('.hero-particles');
    if (particleContainer) {
        const isMobile = window.innerWidth < 768;
        const particleCount = isMobile ? 8 : 20; // Fewer particles on mobile for performance
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('span');
            particle.classList.add('particle');
            const size = Math.random() * 6 + 3;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
            particle.style.animationDelay = (Math.random() * 10) + 's';
            particle.style.opacity = Math.random() * 0.3 + 0.05;
            particleContainer.appendChild(particle);
        }
    }

    /* ---------- Counter Animation ---------- */
    const counters = document.querySelectorAll('.stat-number, .counter-value');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));

    function animateCounter(el) {
        const text = el.textContent.trim();
        const match = text.match(/^(\d+)(\+?)$/);
        if (!match) return;

        const target = parseInt(match[1]);
        const suffix = match[2] || '';
        const duration = 1500;
        const start = performance.now();

        const step = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            el.textContent = Math.floor(eased * target) + suffix;
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }

    /* ---------- Active Nav Link Highlight ---------- */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link[href^="#"]');

    const highlightNav = () => {
        const scrollPos = window.scrollY + 200;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };
    window.addEventListener('scroll', highlightNav, { passive: true });

    /* ---------- Tilt Effect on Glass Cards (Desktop) ---------- */
    if (window.matchMedia('(min-width: 992px)').matches) {
        document.querySelectorAll('.glass-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -3;
                const rotateY = ((x - centerX) / centerX) * 3;
                card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    /* ---------- Lazy Image Loading ---------- */
    if ('IntersectionObserver' in window) {
        const imgObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    imgObserver.unobserve(img);
                }
            });
        });
        document.querySelectorAll('img[data-src]').forEach(img => imgObserver.observe(img));
    }

    /* ---------- Typing Effect (Hero Subtitle) ---------- */
    const typedEl = document.querySelector('.typed-text');
    if (typedEl) {
        const words = ['Modern', 'Hızlı', 'Güvenli', 'Responsive'];
        let wordIndex = 0;
        let charIndex = 0; // Reset to 0 for the animation to start from scratch
        let isDeleting = false;

        function typeLoop() {
            const currentWord = words[wordIndex];
            if (isDeleting) {
                typedEl.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typedEl.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
            }

            let delay = isDeleting ? 50 : 120;
            
            // If it's the very first run, start with a longer delay because it's already typed
            if (!isDeleting && charIndex === currentWord.length) {
                delay = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                delay = 400;
            }

            setTimeout(typeLoop, delay);
        }
        typeLoop();
    }

    console.log('%c🚀 MFevziDemir Solutions', 'color:#30A6CD;font-size:16px;font-weight:bold;');
});
