// --- 1. Sticky Header, Theme Toggle & Mobile Menu ---
document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.querySelector('.navbar');
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  // Scroll progress bar + sticky header
  const progressBar = document.getElementById('scrollProgress');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    if (progressBar) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.width = (docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0) + '%';
    }
  });

  // --- Theme Toggle ---
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });

  // Mobile menu toggle with animation
  mobileBtn.addEventListener('click', () => {
    const isOpen = navLinks.style.display === 'flex';
    navLinks.style.display = isOpen ? 'none' : 'flex';
    mobileBtn.classList.toggle('active');
    if (!isOpen) {
      navLinks.classList.add('mobile-open');
      navLinks.style.flexDirection = 'column';
      navLinks.style.position = 'absolute';
      navLinks.style.top = '100%';
      navLinks.style.left = '0';
      navLinks.style.width = '100%';
      navLinks.style.background = 'var(--bg-primary)';
      navLinks.style.padding = '2rem 0';
      navLinks.style.borderBottom = '1px solid var(--border-subtle)';
    } else {
      navLinks.classList.remove('mobile-open');
    }
  });

  // Smooth scroll offset for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      if(window.innerWidth <= 768) {
        navLinks.style.display = 'none';
      }

      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      }
    });
  });

  // --- 2. Animated Counters ---
  const metricVals = document.querySelectorAll('.metric-val');
  let countersRun = false;
  const runCounters = () => {
    if (countersRun) return;
    countersRun = true;
    metricVals.forEach(el => {
      const full = el.textContent.trim();
      const num = parseInt(full);
      const suffix = full.replace(/[0-9]/g, '');
      const duration = 1600;
      const start = performance.now();
      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * num) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  };
  const metricsEl = document.querySelector('.metrics-section');
  if (metricsEl) {
    new IntersectionObserver((entries, obs) => {
      if (entries[0].isIntersecting) { runCounters(); obs.disconnect(); }
    }, { threshold: 0.5 }).observe(metricsEl);
  }

  // --- 3. Active Nav Highlight ---
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => a.classList.remove('nav-active'));
        const match = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (match) match.classList.add('nav-active');
      }
    });
  }, { threshold: 0.35, rootMargin: '-80px 0px -40% 0px' });
  sections.forEach(s => navObserver.observe(s));

  // --- 4. Scroll Reveal Animations ---
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Unobserve once animated
      }
    });
  }, {
    root: null,
    threshold: 0.1, // Trigger when 10% is visible
    rootMargin: "0px 0px -50px 0px"
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // --- 3. Dynamic Page View & Session Tracking ---
  initAnalytics();

  // --- 4. Back to Top Logic ---
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- 5. Custom Event Tracking (Resume & Projects) ---
  const trackEvent = (eventName) => {
    fetch(`https://api.counterapi.dev/v1/mithun-portfolio-ba/${eventName}/up`)
      .catch(err => console.warn('Analytics API down.', err));
  };

  // Track Resume Downloads
  document.querySelectorAll('a[download]').forEach(btn => {
    btn.addEventListener('click', () => trackEvent('resume_downloads'));
  });

  // Track Project Clicks
  document.querySelectorAll('.project-card').forEach((card, index) => {
    card.addEventListener('click', () => {
      trackEvent(`project_${index + 1}_clicks`);
    });
  });
});

function initAnalytics() {
  // Silent tracking of global page views completely hidden from UI
  let sessionId = sessionStorage.getItem('usr_sess_id');
  if(!sessionId) {
    sessionId = Math.random().toString(16).substr(2, 6).toUpperCase();
    sessionStorage.setItem('usr_sess_id', sessionId);
  }

  // Fire and forget hit to the counter API so it logs accurately for the admin dashboard
  fetch('https://api.counterapi.dev/v1/mithun-portfolio-ba/visits/up').catch(() => {});
}
