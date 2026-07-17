(function () {
  const header = document.querySelector('.site-header');
  const navToggle = document.querySelector('.nav-toggle');
  const mobileNav = document.querySelector('.nav-mobile');
  const mobileLinks = document.querySelectorAll('.nav-mobile-links a');
  const navLinks = document.querySelectorAll('[data-nav]');
  const sections = document.querySelectorAll('[data-section]');
  const reveals = document.querySelectorAll('.reveal');
  const LANG_KEY = 'lumio-lang';
  const SUPPORTED_LANGS = ['ko', 'en', 'ja'];

  const PAGE_MAP = {
    home: { ko: 'index.html', en: 'index-en.html', ja: 'index-ja.html' },
    terms: { ko: 'terms.html', en: 'terms-en.html', ja: 'terms-ja.html' },
    privacy: { ko: 'privacy.html', en: 'privacy-en.html', ja: 'privacy-ja.html' },
  };

  function getStoredLang() {
    try {
      const lang = localStorage.getItem(LANG_KEY);
      return SUPPORTED_LANGS.includes(lang) ? lang : null;
    } catch (e) {
      return null;
    }
  }

  function setStoredLang(lang) {
    if (!SUPPORTED_LANGS.includes(lang)) return;
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch (e) {
      /* ignore */
    }
  }

  function closeMobileNav() {
    if (!navToggle || !mobileNav) return;
    navToggle.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    const openLabel = navToggle.getAttribute('data-label-open') || '메뉴 열기';
    navToggle.setAttribute('aria-label', openLabel);
    mobileNav.hidden = true;
    document.body.style.overflow = '';
  }

  function openMobileNav() {
    if (!navToggle || !mobileNav) return;
    navToggle.classList.add('is-open');
    navToggle.setAttribute('aria-expanded', 'true');
    const closeLabel = navToggle.getAttribute('data-label-close') || '메뉴 닫기';
    navToggle.setAttribute('aria-label', closeLabel);
    mobileNav.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', function () {
      const isOpen = navToggle.classList.contains('is-open');
      if (isOpen) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });

    mobileLinks.forEach(function (link) {
      link.addEventListener('click', closeMobileNav);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        closeMobileNav();
      }
    });
  }

  function onScroll() {
    if (header) {
      header.classList.toggle('is-scrolled', window.scrollY > 24);
    }

    let current = '';
    sections.forEach(function (section) {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) {
        current = section.dataset.section;
      }
    });

    navLinks.forEach(function (link) {
      link.classList.toggle('is-active', link.dataset.nav === current);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    reveals.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    reveals.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  // Multilingual switcher + preference
  const langSwitchers = document.querySelectorAll('[data-lang-switcher]');
  if (langSwitchers.length) {
    const primary = langSwitchers[0];
    const currentLang = primary.getAttribute('data-current-lang') || 'ko';
    const page = primary.getAttribute('data-page') || 'home';
    setStoredLang(currentLang);

    langSwitchers.forEach(function (switcher) {
      switcher.querySelectorAll('[data-lang]').forEach(function (link) {
        link.addEventListener('click', function () {
          const lang = link.getAttribute('data-lang');
          setStoredLang(lang);
        });
      });
    });

    // Keep same-language destinations for legal / home links
    document.querySelectorAll('[data-i18n-page]').forEach(function (a) {
      const target = a.getAttribute('data-i18n-page');
      const map = PAGE_MAP[target];
      if (!map) return;
      const base = map[currentLang] || map.ko;
      const hash = a.getAttribute('data-i18n-hash');
      a.setAttribute('href', hash ? base + '#' + hash : base);
    });
  }
})();
