/* ============================================================
   BABA PG HOUSE — Script.js
   Premium Interactions, Conversions & Animations
   ============================================================ */

(function () {
  'use strict';

  // ─── CONSTANTS ───
  const WA_NUMBER = '917290008205';
  const WA_BASE = `https://wa.me/${WA_NUMBER}`;
  const WA_DEFAULT_MSG = encodeURIComponent('Hi, I want to book a visit for BABA PG HOUSE');

  // ─── PRELOADER ───
  window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      setTimeout(() => {
        preloader.classList.add('hidden');
      }, 800);
    }
    // Trigger entrance animations
    triggerHeroAnimations();
    initCountUp();
  });

  // ─── NAVBAR ───
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  // Scroll effect
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    if (navbar) {
      navbar.classList.toggle('scrolled', scrollY > 60);
    }

    // Show rooms left badge after scrolling past hero
    const badge = document.getElementById('roomsLeftBadge');
    if (badge) {
      badge.classList.toggle('show', scrollY > 600);
    }

    lastScroll = scrollY;
  });

  // Hamburger
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    // Close on link click
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Active nav link tracking
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 150;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.nav-link[href="#${id}"]`);
      if (link) {
        link.classList.toggle('active', scrollPos >= top && scrollPos < top + height);
      }
    });
  });

  // ─── HERO PARTICLES ───
  function createParticles() {
    const container = document.getElementById('heroParticles');
    if (!container) return;
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.className = 'hero-particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 8 + 's';
      particle.style.animationDuration = (6 + Math.random() * 6) + 's';
      particle.style.width = (2 + Math.random() * 4) + 'px';
      particle.style.height = particle.style.width;
      container.appendChild(particle);
    }
  }
  createParticles();

  // ─── HERO ANIMATIONS ───
  function triggerHeroAnimations() {
    const heroElements = document.querySelectorAll('.hero-content [data-anim]');
    heroElements.forEach((el, index) => {
      const delay = parseInt(el.dataset.delay || 0);
      setTimeout(() => {
        el.classList.add('visible');
      }, 300 + delay);
    });
  }

  // ─── SCROLL ANIMATIONS (IntersectionObserver) ───
  const animObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay || 0);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        animObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('[data-anim]:not(.hero-content [data-anim])').forEach(el => {
    animObserver.observe(el);
  });

  // ─── COUNT UP ANIMATION ───
  function initCountUp() {
    const counters = document.querySelectorAll('[data-count]');
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count);
          animateCount(el, 0, target, 2000);
          countObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => countObserver.observe(counter));
  }

  function animateCount(el, start, end, duration) {
    const startTime = performance.now();
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const value = Math.round(start + (end - start) * eased);
      el.textContent = value;
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    requestAnimationFrame(update);
  }

  // Trust section counter
  const trustCountObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const nums = entry.target.querySelectorAll('.trust-num[data-count]');
        nums.forEach(n => {
          const target = parseInt(n.dataset.count);
          animateCount(n, 0, target, 2000);
        });
        trustCountObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const trustSection = document.getElementById('trust');
  if (trustSection) trustCountObserver.observe(trustSection);

  // ─── GALLERY LIGHTBOX ───
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let galleryImages = [];
  let currentImageIndex = 0;

  document.querySelectorAll('[data-lightbox]').forEach((item, index) => {
    const img = item.querySelector('img');
    const caption = item.querySelector('.gallery-hover span');
    if (img) {
      galleryImages.push({
        src: img.src,
        alt: img.alt,
        caption: caption ? caption.textContent : img.alt
      });
      item.addEventListener('click', () => openLightbox(index));
    }
  });

  function openLightbox(index) {
    currentImageIndex = index;
    updateLightbox();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function updateLightbox() {
    if (!galleryImages[currentImageIndex]) return;
    lightboxImg.src = galleryImages[currentImageIndex].src;
    lightboxImg.alt = galleryImages[currentImageIndex].alt;
    lightboxCaption.textContent = galleryImages[currentImageIndex].caption;
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', () => {
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    updateLightbox();
  });
  if (lightboxNext) lightboxNext.addEventListener('click', () => {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    updateLightbox();
  });

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lightboxPrev.click();
    if (e.key === 'ArrowRight') lightboxNext.click();
  });

  // ─── VIDEO PLAYER ───
  const videoPlaceholder = document.getElementById('videoPlaceholder');
  const playBtn = document.getElementById('playVideoBtn');
  const ytPlayer = document.getElementById('ytPlayer');

  if (playBtn && videoPlaceholder && ytPlayer) {
    videoPlaceholder.addEventListener('click', () => {
      videoPlaceholder.style.display = 'none';
      ytPlayer.classList.remove('hidden');
      ytPlayer.play();
    });
  }

  // ─── REVIEWS CAROUSEL ───
  const reviewsTrack = document.getElementById('reviewsTrack');
  const carouselDots = document.getElementById('carouselDots');
  const carouselPrev = document.getElementById('carouselPrev');
  const carouselNext = document.getElementById('carouselNext');

  if (reviewsTrack) {
    const cards = reviewsTrack.querySelectorAll('.review-card');
    let currentSlide = 0;
    let cardsPerView = getCardsPerView();
    let totalSlides = Math.ceil(cards.length / cardsPerView);

    function getCardsPerView() {
      if (window.innerWidth <= 640) return 1;
      if (window.innerWidth <= 900) return 2;
      return 3;
    }

    function buildDots() {
      if (!carouselDots) return;
      carouselDots.innerHTML = '';
      for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.className = 'carousel-dot' + (i === currentSlide ? ' active' : '');
        dot.addEventListener('click', () => goToSlide(i));
        carouselDots.appendChild(dot);
      }
    }

    function goToSlide(index) {
      currentSlide = index;
      const cardWidth = cards[0].offsetWidth + 24; // gap
      const offset = -currentSlide * cardsPerView * cardWidth;
      reviewsTrack.style.transform = `translateX(${offset}px)`;
      updateDots();
    }

    function updateDots() {
      if (!carouselDots) return;
      carouselDots.querySelectorAll('.carousel-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
      });
    }

    function nextSlide() {
      currentSlide = (currentSlide + 1) % totalSlides;
      goToSlide(currentSlide);
    }

    function prevSlide() {
      currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
      goToSlide(currentSlide);
    }

    if (carouselNext) carouselNext.addEventListener('click', nextSlide);
    if (carouselPrev) carouselPrev.addEventListener('click', prevSlide);

    buildDots();

    // Auto-play
    let autoPlay = setInterval(nextSlide, 5000);

    const carouselWrap = document.getElementById('reviewsCarousel');
    if (carouselWrap) {
      carouselWrap.addEventListener('mouseenter', () => clearInterval(autoPlay));
      carouselWrap.addEventListener('mouseleave', () => {
        autoPlay = setInterval(nextSlide, 5000);
      });
    }

    // Touch swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    if (reviewsTrack) {
      reviewsTrack.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      reviewsTrack.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
          diff > 0 ? nextSlide() : prevSlide();
        }
      }, { passive: true });
    }

    // Resize handler
    window.addEventListener('resize', () => {
      cardsPerView = getCardsPerView();
      totalSlides = Math.ceil(cards.length / cardsPerView);
      currentSlide = Math.min(currentSlide, totalSlides - 1);
      buildDots();
      goToSlide(currentSlide);
    });
  }

  // ─── LEAD FORM → WHATSAPP REDIRECT ───
  const leadForm = document.getElementById('leadForm');
  if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('formName').value.trim();
      const phone = document.getElementById('formPhone').value.trim();
      const room = document.getElementById('formRoom').value;

      if (!name || !phone) {
        showToast('Please fill in all required fields');
        return;
      }

      // Build WhatsApp message
      let msg = `Hi, I want to book a visit for BABA PG HOUSE.\n\n`;
      msg += `📛 Name: ${name}\n`;
      msg += `📱 Phone: ${phone}\n`;
      if (room) msg += `🛏 Room: ${room}\n`;
      msg += `\nPlease share details and availability!`;

      const waURL = `${WA_BASE}?text=${encodeURIComponent(msg)}`;

      // Show toast
      showToast('Redirecting to WhatsApp...');

      // Redirect after short delay
      setTimeout(() => {
        window.open(waURL, '_blank');
      }, 800);

      leadForm.reset();
    });
  }

  // ─── TOAST ───
  function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');
    if (!toast || !toastMsg) return;

    toastMsg.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  // ─── EXIT INTENT POPUP ───
  const exitOverlay = document.getElementById('exitPopupOverlay');
  const exitClose = document.getElementById('exitPopupClose');
  let exitShown = false;

  // Desktop: mouse leaving viewport
  document.addEventListener('mouseout', (e) => {
    if (exitShown) return;
    if (e.clientY <= 0 || e.clientX <= 0 || e.clientX >= window.innerWidth) {
      showExitPopup();
    }
  });

  // Mobile: back button / inactivity
  let mobileTimer;
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && !exitShown) {
      // User switching tabs
    }
  });

  // Also trigger after 45 seconds of inactivity
  let inactivityTimer;
  function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
      if (!exitShown && window.scrollY > 300) {
        showExitPopup();
      }
    }, 45000);
  }

  ['scroll', 'mousemove', 'touchstart', 'keypress'].forEach(evt => {
    document.addEventListener(evt, resetInactivityTimer, { passive: true });
  });
  resetInactivityTimer();

  function showExitPopup() {
    if (exitShown || !exitOverlay) return;
    exitShown = true;
    exitOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeExitPopup() {
    if (!exitOverlay) return;
    exitOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (exitClose) exitClose.addEventListener('click', closeExitPopup);
  if (exitOverlay) {
    exitOverlay.addEventListener('click', (e) => {
      if (e.target === exitOverlay) closeExitPopup();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && exitOverlay && exitOverlay.classList.contains('active')) {
      closeExitPopup();
    }
  });

  // ─── 3D TILT EFFECT ON CARDS ───
  function init3DTilt() {
    const cards = document.querySelectorAll('.room-card, .amenity-card');

    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / centerY * -5;
        const rotateY = (x - centerX) / centerX * 5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // Only apply on desktop
  if (window.matchMedia('(min-width: 900px)').matches) {
    init3DTilt();
  }

  // ─── SMOOTH SCROLL for anchor links ───
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ─── DYNAMIC ROOMS LEFT (randomize slightly every few seconds) ───
  function updateRoomsLeft() {
    const rooms = Math.floor(Math.random() * 3) + 1; // 1-3
    const els = document.querySelectorAll('#roomsLeft, #roomsLeftFloating');
    els.forEach(el => {
      if (el) el.textContent = rooms;
    });
  }

  // Update rooms count every 30 seconds
  setInterval(updateRoomsLeft, 30000);

  // ─── PARALLAX on HERO (subtle) ───
  window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero-content');
    if (!hero) return;
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight) {
      hero.style.transform = `translateY(${scrollY * 0.2}px)`;
      hero.style.opacity = 1 - scrollY / (window.innerHeight * 0.8);
    }
  });

  // ─── BUTTON CLICK ANIMATIONS ───
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      // Ripple effect
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255,255,255,0.3);
        transform: scale(0);
        animation: rippleAnim 0.6s ease-out forwards;
        pointer-events: none;
      `;
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      this.style.position = 'relative';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Inject ripple keyframe
  const style = document.createElement('style');
  style.textContent = `
    @keyframes rippleAnim {
      to { transform: scale(4); opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  // ─── LAZY LOAD IMAGES ───
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
    }, { rootMargin: '100px' });

    document.querySelectorAll('img[data-src]').forEach(img => imgObserver.observe(img));
  }

})();
function openDirections() {
  const destination = '28.370306,77.550722';
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const url = `https://www.google.com/maps/dir/?api=1&origin=${lat},${lng}&destination=${destination}&travelmode=driving`;
        window.open(url, '_blank');
      },
      () => {
        window.open(`https://www.google.com/maps/dir/?api=1&origin=My+Location&destination=${destination}&travelmode=driving`, '_blank');
      },
      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 60000
      }
    );
  } else {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`, '_blank');
  }
}