/**
 * STORMBREAKERS - Master Interactive Script
 * Features:
 * - Dynamic Interactive Lightning & Particle Storm Canvas
 * - Web Audio API Sci-Fi Sound Synthesizer (No external assets required!)
 * - 3D Gyroscopic Card Tilt Interaction
 * - Squad Filtering & Interactive Dossier Modal
 * - Intersection Observer Scroll Reveals
 * - Mobile Menu & Smooth Sticky Navigation
 * - Simulated Encrypted Transmission Form
 */

document.addEventListener('DOMContentLoaded', () => {
  initStormCanvas();
  initSoundEngine();
  initNavigation();
  initScrollAnimations();
  initTiltEffect();
  initSquadFilter();
  initDossierModal();
  initContactForm();
  initBackToTop();
});

/* ==========================================================================
   1. INTERACTIVE STORM & LIGHTNING CANVAS
   ========================================================================== */
function initStormCanvas() {
  const canvas = document.getElementById('storm-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let lightningArcs = [];
  let mouse = { x: null, y: null, radius: 150 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createParticles();
  }

  window.addEventListener('resize', debounce(resize, 200));

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.radius = Math.random() * 2 + 1;
      this.baseAlpha = Math.random() * 0.45 + 0.15;
      this.color = Math.random() > 0.4 ? '#00f0ff' : '#a855f7';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse repulsion/interaction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.hypot(dx, dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          this.x -= Math.cos(angle) * force * 2.5;
          this.y -= Math.sin(angle) * force * 2.5;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.color;
      ctx.globalAlpha = this.baseAlpha;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    }
  }

  function createParticles() {
    particles = [];
    const count = Math.min(Math.floor((width * height) / 14000), 75);
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  // Generate an electric discharge arc between points
  function createLightningArc(startX, startY, endX, endY, branches = 4) {
    const points = [{ x: startX, y: startY }];
    const steps = 12;
    const dx = (endX - startX) / steps;
    const dy = (endY - startY) / steps;

    for (let i = 1; i < steps; i++) {
      const jitter = (Math.random() - 0.5) * 35;
      points.push({
        x: startX + dx * i + jitter,
        y: startY + dy * i + jitter
      });
    }
    points.push({ x: endX, y: endY });

    lightningArcs.push({
      points,
      alpha: 1,
      decay: 0.05,
      color: Math.random() > 0.5 ? '#00f0ff' : '#d946ef'
    });
  }

  // Mouse move tracking
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Click creates lightning discharge burst!
  window.addEventListener('click', (e) => {
    // Only discharge if not clicking an interactive button
    if (e.target.closest('button, a, input, select, textarea')) return;

    for (let i = 0; i < 3; i++) {
      const targetParticle = particles[Math.floor(Math.random() * particles.length)];
      if (targetParticle) {
        createLightningArc(e.clientX, e.clientY, targetParticle.x, targetParticle.y);
      }
    }
    SoundFX.playSpark();
  });

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Update & draw particles
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      // Connect nearby particles with subtle cyber links
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.hypot(dx, dy);

        if (dist < 115) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = particles[i].color;
          ctx.globalAlpha = (1 - dist / 115) * 0.18;
          ctx.lineWidth = 0.8;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    }

    // Render & update lightning arcs
    for (let i = lightningArcs.length - 1; i >= 0; i--) {
      const arc = lightningArcs[i];
      ctx.beginPath();
      ctx.moveTo(arc.points[0].x, arc.points[0].y);
      for (let p = 1; p < arc.points.length; p++) {
        ctx.lineTo(arc.points[p].x, arc.points[p].y);
      }
      ctx.strokeStyle = arc.color;
      ctx.lineWidth = 2.2;
      ctx.shadowBlur = 15;
      ctx.shadowColor = arc.color;
      ctx.globalAlpha = arc.alpha;
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;

      arc.alpha -= arc.decay;
      if (arc.alpha <= 0) {
        lightningArcs.splice(i, 1);
      }
    }

    requestAnimationFrame(animate);
  }

  resize();
  animate();
}

/* ==========================================================================
   2. WEB AUDIO API SCI-FI SOUND SYNTHESIZER
   ========================================================================== */
const SoundFX = {
  enabled: false,
  ctx: null,

  init() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    } catch (e) {
      console.warn('Web Audio API not supported on this browser.');
    }
  },

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  },

  playHover() {
    if (!this.enabled || !this.ctx) return;
    this.resume();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(680, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    } catch (e) {}
  },

  playClick() {
    if (!this.enabled || !this.ctx) return;
    this.resume();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(420, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.1);
    } catch (e) {}
  },

  playSpark() {
    if (!this.enabled || !this.ctx) return;
    this.resume();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(950, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(240, this.ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.14);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.14);
    } catch (e) {}
  },

  playChime() {
    if (!this.enabled || !this.ctx) return;
    this.resume();
    try {
      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.04);
        gain.gain.setValueAtTime(0.04, now + i * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.04 + 0.18);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.04);
        osc.stop(now + i * 0.04 + 0.18);
      });
    } catch (e) {}
  }
};

function initSoundEngine() {
  const toggleBtn = document.getElementById('sound-toggle');
  const toast = document.getElementById('audio-toast');
  if (!toggleBtn) return;

  SoundFX.init();

  function showToast(text) {
    if (!toast) return;
    toast.textContent = text;
    toast.classList.add('show');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2400);
  }

  toggleBtn.addEventListener('click', () => {
    SoundFX.enabled = !SoundFX.enabled;
    const label = toggleBtn.querySelector('.sound-label');

    if (SoundFX.enabled) {
      toggleBtn.classList.add('sound-active');
      if (label) label.textContent = 'FX: ON';
      showToast('⚡ Sci-Fi Audio FX Activated');
      SoundFX.playChime();
    } else {
      toggleBtn.classList.remove('sound-active');
      if (label) label.textContent = 'FX: OFF';
      showToast('Muted Audio FX');
    }
  });

  // Attach hover sounds to interactive elements
  const interactives = document.querySelectorAll('a, button, .tilt-card, .filter-btn');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => SoundFX.playHover());
    el.addEventListener('click', () => SoundFX.playClick());
  });
}

/* ==========================================================================
   3. NAVIGATION & SCROLL HIGHLIGHTING
   ========================================================================== */
function initNavigation() {
  const header = document.getElementById('header');
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const sections = document.querySelectorAll('section[id], header[id]');

  // Header scroll appearance
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    updateActiveNav();
  }, { passive: true });

  // Mobile menu toggle
  if (mobileBtn && mobileDrawer) {
    mobileBtn.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      mobileBtn.classList.toggle('active', isOpen);
      mobileBtn.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileBtn.classList.remove('active');
        mobileBtn.setAttribute('aria-expanded', false);
        document.body.style.overflow = '';
      });
    });
  }

  // Active section indicator
  function updateActiveNav() {
    const scrollPos = window.scrollY + 180;
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }
}

/* ==========================================================================
   4. SCROLL REVEAL (INTERSECTION OBSERVER)
   ========================================================================== */
function initScrollAnimations() {
  const reveals = document.querySelectorAll('.reveal-fade');
  if (!('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.getAttribute('data-delay') || 0;
        setTimeout(() => {
          el.classList.add('visible');
        }, parseInt(delay, 10));
        obs.unobserve(el);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

/* ==========================================================================
   5. 3D GYROSCOPIC CARD TILT EFFECT
   ========================================================================== */
function initTiltEffect() {
  const cards = document.querySelectorAll('.tilt-card[data-tilt]');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      card.style.transition = 'transform 0.5s ease';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'none';
    });
  });
}

/* ==========================================================================
   6. SQUAD FILTERING
   ========================================================================== */
function initSquadFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.member-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.classList.remove('hidden');
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* ==========================================================================
   7. INTERACTIVE DOSSIER MODAL
   ========================================================================== */
const memberDossiers = {
  alex: {
    name: 'Alex "Vortex" Vance',
    role: 'Team Captain & Lead Strategist',
    callsign: 'VORTEX // SB-01',
    bio: 'Pioneering strategist who transforms high-ambiguity objectives into razor-sharp roadmap execution. With over a decade of systems architecture mastery, Alex ensures the team strikes with singular focus and relentless momentum.',
    coreWeapon: 'Distributed Systems & Strategic Synthesis',
    stats: { velocity: '99%', resolve: '100%', leadership: '98%' },
    quote: '"Order is not given by circumstance; it is engineered through resolve."'
  },
  elena: {
    name: 'Elena "Nova" Chen',
    role: 'Creative Director & UX Architect',
    callsign: 'NOVA // SB-02',
    bio: 'Visionary artist at the intersection of futuristic human interface design and generative aesthetics. Elena crafts immersive visual worlds that captivate audiences and elevate digital interaction into high art.',
    coreWeapon: 'Spatial UI & Motion Mechanics',
    stats: { vision: '99%', creativity: '100%', precision: '96%' },
    quote: '"When functionality and awe meet, magic becomes standard."'
  },
  marcus: {
    name: 'Marcus "Cipher" Thorne',
    role: 'Principal Systems & AI Engineer',
    callsign: 'CIPHER // SB-03',
    bio: 'Algorithmic architect specializing in ultra-low latency frameworks, intelligent systems, and scalable cloud engines. Marcus guarantees that STORMBREAKERS products perform flawlessly under maximum tempest pressure.',
    coreWeapon: 'Distributed Cloud & Neural Architectures',
    stats: { efficiency: '99%', uptime: '99.9%', complexity: '100%' },
    quote: '"Complexity is just simplicity waiting to be discovered."'
  },
  sophia: {
    name: 'Sophia "Zephyr" Ramos',
    role: 'Innovation & Rapid Prototyping Lead',
    callsign: 'ZEPHYR // SB-04',
    bio: 'Fearless experimenter who turns theoretical concepts into testable, working reality within hours. Specializing in emerging technologies and creative computing, Sophia ensures the squad is always two steps ahead of the curve.',
    coreWeapon: 'Creative Code & Rapid Deployment',
    stats: { agility: '100%', curiosity: '98%', speed: '99%' },
    quote: '"The fastest path to certainty is fearless iteration."'
  },
  kai: {
    name: 'Kai "Pulse" Nakamura',
    role: 'Operations & Tactical Growth Lead',
    callsign: 'PULSE // SB-05',
    bio: 'Master of operational rhythm, ecosystem scaling, and strategic alliances. Kai synchronizes all internal moving parts and translates technological breakthroughs into global real-world resonance.',
    coreWeapon: 'Ecosystem Scaling & Strategic Execution',
    stats: { velocity: '97%', alignment: '99%', impact: '98%' },
    quote: '"A great team is an orchestra where every note resonates."'
  }
};

function initDossierModal() {
  const modal = document.getElementById('dossier-modal');
  const modalContent = document.getElementById('modal-content');
  const closeBtn = document.getElementById('modal-close');
  const backdrop = document.getElementById('modal-backdrop');
  const dossierBtns = document.querySelectorAll('.member-dossier-btn');

  if (!modal || !modalContent) return;

  function openDossier(memberKey) {
    const data = memberDossiers[memberKey];
    if (!data) return;

    modalContent.innerHTML = `
      <div class="dossier-hero">
        <div>
          <span class="holo-code">${data.callsign}</span>
          <h3 class="dossier-name" id="modal-member-name">${data.name}</h3>
          <p class="dossier-role">${data.role}</p>
        </div>
      </div>

      <div class="dossier-body">
        <h4 class="dossier-section-title">Operational Dossier</h4>
        <p class="dossier-bio">${data.bio}</p>

        <h4 class="dossier-section-title">Tactical Attributes</h4>
        <div class="dossier-stats-grid">
          ${Object.entries(data.stats).map(([k, v]) => `
            <div class="dossier-stat-box">
              <div class="dossier-stat-val">${v}</div>
              <div class="dossier-stat-lbl">${k}</div>
            </div>
          `).join('')}
        </div>

        <div style="margin-top: 1.5rem; padding-top: 1.2rem; border-top: 1px solid rgba(255,255,255,0.08);">
          <span style="font-family: var(--font-display); font-size: 0.72rem; color: var(--electric-blue); letter-spacing: 0.1em; display: block; margin-bottom: 0.35rem;">SIGNATURE DOCTRINE</span>
          <p style="font-style: italic; color: #ffffff; font-size: 0.95rem;">${data.quote}</p>
        </div>
      </div>
    `;

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    SoundFX.playChime();
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  dossierBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const memberKey = btn.getAttribute('data-member');
      openDossier(memberKey);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   8. ENCRYPTED TRANSMISSION FORM
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');
  const submitBtn = document.getElementById('form-submit-btn');

  if (!form || !submitBtn) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.elements['name'].value.trim();
    const email = form.elements['email'].value.trim();
    const message = form.elements['message'].value.trim();

    if (!name || !email || !message) {
      showFeedback('Please fill in all transmission fields.', false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showFeedback('Invalid email frequency format.', false);
      return;
    }

    // Simulated transmission state
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <span class="btn-text">Encrypting Signal...</span>
      <div class="pulse-dot" style="margin-left: 8px;"></div>
    `;

    setTimeout(() => {
      submitBtn.innerHTML = `
        <span class="btn-text">Signal Transmitted</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 18px; height: 18px;"><polyline points="20 6 9 17 4 12"></polyline></svg>
      `;

      showFeedback(`⚡ Transmission acknowledged, Operator ${name}. STORMBREAKERS Command will establish contact shortly.`, true);
      SoundFX.playChime();
      form.reset();

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }, 4000);
    }, 1200);
  });

  function showFeedback(msg, isSuccess) {
    if (!feedback) return;
    feedback.textContent = msg;
    feedback.className = `form-feedback ${isSuccess ? 'success' : 'error'}`;
    feedback.setAttribute('aria-hidden', 'false');
  }
}

/* ==========================================================================
   9. BACK TO TOP
   ========================================================================== */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    SoundFX.playClick();
  });
}

/* --- Utility: Debounce --- */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

