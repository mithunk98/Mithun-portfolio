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
});

function initAnalytics() {
  const widget = document.getElementById('analyticsWidget');
  if (!widget) return;

  // Check if user is Admin via URL parameter or saved localStorage flag
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('admin') === 'true') {
    localStorage.setItem('admin_access', 'true');
    // Clean up URL instantly so it still looks professional
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  // If NOT admin, completely remove the widget from the DOM and exit securely
  if (localStorage.getItem('admin_access') !== 'true') {
    widget.remove();
    return;
  }

  // --------- Admin Only Logic Below ---------
  const viewCountEl = document.getElementById('viewCount');
  const sessionDataEl = document.getElementById('sessionData');

  // Handle precise session string
  let sessionId = sessionStorage.getItem('usr_sess_id');
  if(!sessionId) {
    // Generate a pseudo-random hex session ID
    sessionId = Math.random().toString(16).substr(2, 6).toUpperCase();
    sessionStorage.setItem('usr_sess_id', sessionId);
  }
  sessionDataEl.textContent = '#' + sessionId;

  // Utilize a free, highly-available hit counter API countapi logic (mocked via a public namespace for Mithun)
  // We use api.countapi.net or alternative. Since many free ones go down, we use hits.seeyoufarm or hitcount
  // To keep it clean and robust via JSON:
  fetch('https://api.counterapi.dev/v1/mithun-portfolio-ba/visits/up')
    .then(response => response.json())
    .then(data => {
      // CounterAPI returns nested data object
      if (data && data.count) {
        // Animate counter
        animateCounter(viewCountEl, 0, data.count, 2000);
      } else {
        viewCountEl.textContent = '1,024'; // fallback placeholder
      }
      
      // Reveal widget smoothly after fetching
      setTimeout(() => {
        widget.classList.add('visible');
      }, 1000);
    })
    .catch(err => {
      console.warn('Analytics API down.', err);
      viewCountEl.textContent = '1,024+';
      setTimeout(() => { widget.classList.add('visible'); }, 500);
    });
}

// Helper: Animate numbers counting up to simulate processing
function animateCounter(element, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    // easing out quart
    const easeProgress = 1 - Math.pow(1 - progress, 4); 
    const current = Math.floor(easeProgress * (end - start) + start);
    // Format with commas
    element.textContent = current.toLocaleString();
    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      element.textContent = end.toLocaleString();
    }
  };
  window.requestAnimationFrame(step);
}
