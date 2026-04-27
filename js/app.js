document.addEventListener('DOMContentLoaded', function() {
    initCookieConsent();
    initMobileNav();
    initHeaderScroll();
    initScrollReveal();
    initSmoothScroll();
    initNewsletter();
});

function initCookieConsent() {
    var consent = localStorage.getItem('cookieConsent');
    var banner = document.querySelector('.cookie-banner');
    var acceptBtn = document.querySelector('.cookie-accept-btn');

    if (!consent && banner) {
        banner.classList.remove('hidden');
    } else if (banner) {
        banner.classList.add('hidden');
    }

    if (acceptBtn && banner) {
        acceptBtn.addEventListener('click', function() {
            localStorage.setItem('cookieConsent', 'true');
            banner.classList.add('hidden');
        });
    }
}

function initMobileNav() {
    var hamburger = document.querySelector('.hamburger-btn');
    var overlay = document.querySelector('.mobile-nav-overlay');
    var closeBtn = document.querySelector('.mobile-nav-close');

    function openNav() {
        document.body.classList.add('mobile-nav-open');
        document.body.style.overflow = 'hidden';
    }

    function closeNav() {
        document.body.classList.remove('mobile-nav-open');
        document.body.style.overflow = '';
    }

    if (hamburger) hamburger.addEventListener('click', openNav);
    if (closeBtn) closeBtn.addEventListener('click', closeNav);
    if (overlay) overlay.addEventListener('click', closeNav);

    var navLinks = document.querySelectorAll('.mobile-nav-links a');
    navLinks.forEach(function(link) {
        link.addEventListener('click', closeNav);
    });
}

function initHeaderScroll() {
    var header = document.querySelector('.header');
    if (!header) return;

    var scrolled = false;
    window.addEventListener('scroll', function() {
        var shouldBeScrolled = window.scrollY > 60;
        if (shouldBeScrolled !== scrolled) {
            scrolled = shouldBeScrolled;
            header.classList.toggle('header--scrolled', scrolled);
        }
    }, { passive: true });
}

function initScrollReveal() {
    var els = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });

        els.forEach(function(el, i) {
            var parent = el.parentNode;
            if (parent && (parent.classList.contains('products-grid') || parent.classList.contains('brands-grid'))) {
                el.style.transitionDelay = (i % 4) * 0.08 + 's';
            }
            observer.observe(el);
        });
    } else {
        els.forEach(function(el) { el.classList.add('revealed'); });
    }
}

function initSmoothScroll() {
    var links = document.querySelectorAll('a[href^="#"]');
    var header = document.querySelector('.header');

    links.forEach(function(link) {
        link.addEventListener('click', function(e) {
            var id = this.getAttribute('href');
            if (id === '#') return;
            var target = document.querySelector(id);
            if (target) {
                e.preventDefault();
                var offset = header ? header.offsetHeight : 0;
                window.scrollTo({
                    top: target.getBoundingClientRect().top + window.scrollY - offset,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function initNewsletter() {
    var form = document.querySelector('.newsletter-form');
    var emailInput = document.querySelector('.newsletter-email');
    var successMsg = document.querySelector('.newsletter-success');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            var email = emailInput ? emailInput.value : '';
            var valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

            if (successMsg) {
                if (valid) {
                    successMsg.textContent = 'Obrigado por subscrever a nossa newsletter!';
                    successMsg.style.display = 'block';
                    successMsg.style.color = '';
                    form.reset();
                } else {
                    successMsg.textContent = 'Por favor, insira um email válido.';
                    successMsg.style.display = 'block';
                    successMsg.style.color = 'var(--c-error)';
                }
            }
        });
    }
}
