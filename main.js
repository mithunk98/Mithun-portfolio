// --- 1. Sticky Header & Mobile Menu ---
document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.querySelector('.navbar');
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  // Sticky header visually updates on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.style.background = 'rgba(2, 6, 23, 0.9)'; // Dark transparent
      navbar.style.borderBottomColor = 'rgba(255, 255, 255, 0.15)';
    } else {
      navbar.style.background = 'rgba(2, 6, 23, 0.7)'; // Lighter dark transparent
      navbar.style.borderBottomColor = 'rgba(255, 255, 255, 0.1)';
    }
  });

  // Mobile menu toggle
  mobileBtn.addEventListener('click', () => {
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    if(navLinks.style.display === 'flex') {
      navLinks.style.flexDirection = 'column';
      navLinks.style.position = 'absolute';
      navLinks.style.top = '100%';
      navLinks.style.left = '0';
      navLinks.style.width = '100%';
      navLinks.style.background = '#020617';
      navLinks.style.padding = '2rem 0';
      navLinks.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
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

  // --- 2. Scroll Reveal Animations ---
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
