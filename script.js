/* ============================================
   WILLYS EMEJE — PORTFOLIO SCRIPTS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- LOADER ---------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 300);
  });
  // fallback in case load event already fired
  setTimeout(() => loader && loader.classList.add('hidden'), 2500);

  /* ---------- MOBILE MENU ---------- */
  const menuToggle = document.getElementById('menu-toggle');
  const navLinksEl = document.getElementById('nav-links');

  function closeMenu() {
    menuToggle.setAttribute('aria-expanded', 'false');
    navLinksEl.classList.remove('open');
    document.body.style.overflow = '';
  }
  function openMenu() {
    menuToggle.setAttribute('aria-expanded', 'true');
    navLinksEl.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    expanded ? closeMenu() : openMenu();
  });

  navLinksEl.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  /* ---------- SMOOTH SCROLL (with sticky-header offset) ---------- */
  const headerEl = document.getElementById('navbar');
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.length <= 1) return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const offset = headerEl.offsetHeight + 12;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ---------- SCROLLSPY: active nav link + navbar shrink + progress bar + back-to-top ---------- */
  const sections = document.querySelectorAll('main section[id]');
  const navLinkEls = document.querySelectorAll('.nav-link');
  const progressBar = document.getElementById('scroll-progress');
  const backToTop = document.getElementById('back-to-top');

  function onScroll() {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = docHeight > 0 ? (scrollY / docHeight) * 100 + '%' : '0%';

    headerEl.classList.toggle('scrolled', scrollY > 30);
    backToTop.classList.toggle('visible', scrollY > 500);

    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - headerEl.offsetHeight - 60;
      if (scrollY >= top) current = sec.getAttribute('id');
    });
    navLinkEls.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- TYPING ANIMATION ---------- */
  const typingEl = document.getElementById('typing-text');
  const phrases = [
    'AI Data Specialist',
    'Full Stack Developer',
    'Data Scientist',
    'Team Lead'
  ];
  let phraseIdx = 0, charIdx = 0, deleting = false;

  function typeLoop() {
    const current = phrases[phraseIdx];
    if (!deleting) {
      charIdx++;
      typingEl.textContent = current.slice(0, charIdx);
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(typeLoop, 1500);
        return;
      }
    } else {
      charIdx--;
      typingEl.textContent = current.slice(0, charIdx);
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
      }
    }
    setTimeout(typeLoop, deleting ? 35 : 70);
  }
  if (typingEl) typeLoop();

  /* ---------- SCROLL REVEAL (IntersectionObserver) ---------- */
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- ANIMATED SKILL BARS ---------- */
  const skillBars = document.querySelectorAll('.skill-bar');
  skillBars.forEach(bar => {
    const fill = bar.querySelector('.skill-fill');
    const level = bar.dataset.level || 0;
    fill.style.setProperty('--target-width', level + '%');
  });
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  skillBars.forEach(bar => skillObserver.observe(bar));

  /* ---------- ANIMATED STAT COUNTERS ---------- */
  const statNums = document.querySelectorAll('.stat-num');
  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10) || 0;
    const duration = 1200;
    const start = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  statNums.forEach(el => statObserver.observe(el));

  /* ---------- HERO PARTICLES (lightweight canvas) ---------- */
  const canvas = document.getElementById('particles');
  if (canvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let w, h;

    function resize() {
      const hero = document.getElementById('hero');
      w = canvas.width = hero.offsetWidth;
      h = canvas.height = hero.offsetHeight;
    }

    function initParticles() {
      const count = Math.min(60, Math.floor((w * h) / 18000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.6 + 0.4,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        alpha: Math.random() * 0.5 + 0.15
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(96,165,250,${p.alpha})`;
        ctx.fill();
      });
      requestAnimationFrame(draw);
    }

    resize();
    initParticles();
    draw();

    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => { resize(); initParticles(); }, 200);
    });
  }

  /* ---------- CONTACT FORM VALIDATION + SUBMISSION ---------- */
  const form = document.getElementById('contact-form');
  const statusEl = document.getElementById('form-status');

  function setError(fieldId, message) {
    const group = document.getElementById(fieldId).closest('.form-group');
    const errorEl = document.getElementById(fieldId + '-error');
    if (message) {
      group.classList.add('invalid');
      errorEl.textContent = message;
    } else {
      group.classList.remove('invalid');
      errorEl.textContent = '';
    }
  }

  function validateForm(data) {
    let valid = true;
    if (!data.name.trim()) { setError('name', 'Please enter your name.'); valid = false; }
    else setError('name', '');

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email.trim() || !emailPattern.test(data.email)) { setError('email', 'Please enter a valid email.'); valid = false; }
    else setError('email', '');

    if (!data.subject.trim()) { setError('subject', 'Please add a subject.'); valid = false; }
    else setError('subject', '');

    if (!data.message.trim() || data.message.trim().length < 10) { setError('message', 'Message should be at least 10 characters.'); valid = false; }
    else setError('message', '');

    return valid;
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = {
        name: form.name.value,
        email: form.email.value,
        subject: form.subject.value,
        message: form.message.value
      };

      if (!validateForm(data)) {
        statusEl.textContent = 'Please fix the errors above.';
        statusEl.className = 'form-status error';
        return;
      }

      const submitBtn = form.querySelector('.form-submit');
      submitBtn.classList.add('loading');
      statusEl.textContent = '';
      statusEl.className = 'form-status';

      // Simulated submission (no backend wired up — replace with real endpoint/mailto/Formspree).
      setTimeout(() => {
        submitBtn.classList.remove('loading');
        statusEl.textContent = `Thanks, ${data.name.split(' ')[0]}! Your message has been noted — Willys will reach out at ${data.email} soon.`;
        statusEl.className = 'form-status success';
        form.reset();
      }, 1100);
    });

    // live-clear errors as the user types
    ['name', 'email', 'subject', 'message'].forEach(id => {
      document.getElementById(id).addEventListener('input', () => setError(id, ''));
    });
  }

});
