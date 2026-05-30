document.addEventListener('DOMContentLoaded', () => {

  /* ===== HEADER SCROLL ===== */
  const header = document.querySelector('.header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  });

  /* ===== BURGER MENU ===== */
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.nav');

  if (burger) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('active');
      nav.classList.toggle('active');
      document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        burger.classList.remove('active');
        nav.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  /* ===== SCROLL REVEAL ===== */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  revealElements.forEach(el => revealObserver.observe(el));

  /* ===== TYPING TEXT IN HERO ===== */
  const typingElement = document.querySelector('.typing-text');
  if (typingElement) {
    const words = ['запоминается', 'сияет', 'вдохновляет', 'очаровывает'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isPaused = false;

    function typeEffect() {
      const currentWord = words[wordIndex];
      const typingEl = typingElement;

      if (!isDeleting) {
        typingEl.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
        if (charIndex === currentWord.length) {
          isPaused = true;
          setTimeout(() => {
            isPaused = false;
            isDeleting = true;
            typeEffect();
          }, 2000);
          return;
        }
        setTimeout(typeEffect, 80);
      } else {
        typingEl.textContent = currentWord.substring(0, charIndex);
        charIndex--;
        if (charIndex < 0) {
          isDeleting = false;
          wordIndex = (wordIndex + 1) % words.length;
          setTimeout(typeEffect, 500);
          return;
        }
        setTimeout(typeEffect, 40);
      }
    }

    setTimeout(typeEffect, 1500);
  }

  /* ===== PORTFOLIO FILTER + GALLERY ===== */
  const galleryGrid = document.getElementById('galleryGrid');
  const filterBar = document.getElementById('filterBar');

  if (galleryGrid && filterBar) {
    function renderGallery(category = 'all') {
      const filtered = category === 'all'
        ? WORKS
        : WORKS.filter(w => w.category === category);

      galleryGrid.innerHTML = filtered.map(work => `
        <div class="gallery-item reveal" data-id="${work.id}" data-category="${work.category}">
          <div class="gallery-placeholder">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="2" y="2" width="20" height="20" rx="2"/>
              <circle cx="9" cy="9" r="2"/>
              <path d="m21 15-5-5L5 21"/>
            </svg>
          </div>
          <div class="gallery-item-overlay">
            <span>${work.serviceName}</span>
            <small>${work.date}</small>
          </div>
        </div>
      `).join('');

      filtered.forEach(work => {
        const item = galleryGrid.querySelector(`[data-id="${work.id}"]`);
        if (item) {
          const placeholder = item.querySelector('.gallery-placeholder');
          placeholder.innerHTML = `
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="2" y="2" width="20" height="20" rx="2"/>
              <circle cx="9" cy="9" r="2"/>
              <path d="m21 15-5-5L5 21"/>
            </svg>
            <span style="display:block;margin-top:8px;font-size:12px;opacity:0.6">${work.serviceName}</span>
          `;
        }
      });

      document.querySelectorAll('.gallery-item').forEach(item => {
        revealObserver.observe(item);
      });

      initLightbox();
    }

    function renderFilters() {
      filterBar.innerHTML = CATEGORIES.map(cat => `
        <button class="filter-btn ${cat.id === 'all' ? 'active' : ''}" data-filter="${cat.id}">
          ${cat.label}
        </button>
      `).join('');

      filterBar.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;
        filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderGallery(btn.dataset.filter);
      });
    }

    renderFilters();
    renderGallery('all');
  }

  /* ===== LIGHTBOX ===== */
  function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = lightbox?.querySelector('.lightbox-image');
    const lightboxClose = lightbox?.querySelector('.lightbox-close');
    const lightboxPrev = lightbox?.querySelector('.lightbox-prev');
    const lightboxNext = lightbox?.querySelector('.lightbox-next');
    const lightboxCounter = lightbox?.querySelector('.lightbox-counter');
    let currentIndex = 0;
    let items = [];

    if (!lightbox) return;

    function updateItems() {
      items = document.querySelectorAll('.gallery-item:not([style*="display: none"])');
    }

    function openLightbox(index) {
      updateItems();
      if (items.length === 0) return;
      currentIndex = index;
      const item = items[currentIndex];
      const name = item.querySelector('.gallery-item-overlay span')?.textContent || 'Фото работы';
      lightboxImage.src = '';
      lightboxImage.alt = name;
      lightboxImage.style.background = 'linear-gradient(135deg, #1a1a2e, #222240)';
      lightboxImage.style.width = '400px';
      lightboxImage.style.height = '300px';
      lightboxImage.style.objectFit = 'contain';
      lightboxImage.style.borderRadius = '12px';
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
      updateCounter();
    }

    function updateCounter() {
      updateItems();
      if (items.length > 0) {
        lightboxCounter.textContent = `${currentIndex + 1} / ${items.length}`;
      }
    }

    document.querySelectorAll('.gallery-item').forEach((item, index) => {
      item.addEventListener('click', () => {
        openLightbox(index);
      });
    });

    function navigateLightbox(direction) {
      updateItems();
      if (items.length === 0) return;
      currentIndex = (currentIndex + direction + items.length) % items.length;
      const item = items[currentIndex];
      const name = item.querySelector('.gallery-item-overlay span')?.textContent || 'Фото работы';
      lightboxImage.alt = name;
      updateCounter();
    }

    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightboxPrev) {
      lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
    }

    if (lightboxNext) {
      lightboxNext.addEventListener('click', () => navigateLightbox(1));
    }

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
      if (e.key === 'ArrowRight') navigateLightbox(1);
    });

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  /* ===== REVIEWS CAROUSEL ===== */
  const track = document.querySelector('.reviews-track');
  const dotsContainer = document.getElementById('carouselDots');
  let currentSlide = 0;
  let autoplayInterval;

  if (track && dotsContainer) {
    const cards = track.querySelectorAll('.review-card');
    const totalSlides = cards.length;

    function getSlidesPerView() {
      if (window.innerWidth < 768) return 1;
      if (window.innerWidth < 1024) return 2;
      return 3;
    }

    function getMaxSlide() {
      return Math.max(0, totalSlides - getSlidesPerView());
    }

    function goToSlide(index) {
      const slidesPerView = getSlidesPerView();
      currentSlide = Math.max(0, Math.min(index, totalSlides - slidesPerView));
      const gap = 24;
      const cardWidth = `calc(${100 / slidesPerView}% - ${gap * (slidesPerView - 1) / slidesPerView}px)`;
      cards.forEach(c => c.style.minWidth = cardWidth);
      track.style.transform = `translateX(-${currentSlide * (100 / slidesPerView)}%)`;

      dotsContainer.querySelectorAll('.carousel-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
      });
    }

    function createDots() {
      dotsContainer.innerHTML = '';
      const maxSlide = getMaxSlide();
      for (let i = 0; i <= maxSlide; i++) {
        const dot = document.createElement('button');
        dot.className = `carousel-dot ${i === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => {
          goToSlide(i);
          resetAutoplay();
        });
        dotsContainer.appendChild(dot);
      }
    }

    function startAutoplay() {
      stopAutoplay();
      autoplayInterval = setInterval(() => {
        const maxSlide = getMaxSlide();
        if (currentSlide >= maxSlide) {
          goToSlide(0);
        } else {
          goToSlide(currentSlide + 1);
        }
      }, 5000);
    }

    function stopAutoplay() {
      if (autoplayInterval) clearInterval(autoplayInterval);
    }

    function resetAutoplay() {
      startAutoplay();
    }

    track.addEventListener('mouseenter', stopAutoplay);
    track.addEventListener('mouseleave', startAutoplay);

    createDots();
    goToSlide(0);
    startAutoplay();

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        createDots();
        goToSlide(0);
      }, 300);
    });
  }

  /* ===== SERVICES PRICE TABLE / CALCULATOR ===== */
  const servicesTable = document.getElementById('servicesTable');
  const calculatorList = document.getElementById('calculatorList');
  const calculatorTotal = document.getElementById('calculatorTotal');
  const calcEmpty = document.getElementById('calcEmpty');
  let selectedServices = [];

  if (servicesTable) {
    function renderPriceTable(category = 'all') {
      const filtered = category === 'all'
        ? SERVICES
        : SERVICES.filter(s => s.category === category);

      servicesTable.innerHTML = filtered.map(service => `
        <tr>
          <td>${service.name}</td>
          <td>${service.duration}</td>
          <td class="price">${service.price.toLocaleString()} ₽</td>
          <td>
            <button class="btn btn-primary btn-sm add-to-calc" data-id="${service.id}">
              В заказ
            </button>
          </td>
        </tr>
      `).join('');

      document.querySelectorAll('.add-to-calc').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = parseInt(btn.dataset.id);
          addToCalculator(id);
        });
      });
    }

    function renderCategoryTabs() {
      const tabsContainer = document.getElementById('categoryTabs');
      if (!tabsContainer) return;

      const serviceCategories = [
        { id: 'all', label: 'Все услуги' },
        { id: 'lash', label: 'Наращивание' },
        { id: 'lamination', label: 'Ламинирование' },
        { id: 'correction', label: 'Коррекция' },
        { id: 'removal', label: 'Снятие' },
        { id: 'additional', label: 'Косметология' },
      ];

      tabsContainer.innerHTML = serviceCategories.map(cat => `
        <button class="filter-btn ${cat.id === 'all' ? 'active' : ''}" data-tab="${cat.id}">
          ${cat.label}
        </button>
      `).join('');

      tabsContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;
        tabsContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderPriceTable(btn.dataset.tab);
      });
    }

    function addToCalculator(id) {
      const service = SERVICES.find(s => s.id === id);
      if (!service) return;
      if (selectedServices.find(s => s.id === id)) return;
      selectedServices.push(service);
      updateCalculator();
    }

    function removeFromCalculator(id) {
      selectedServices = selectedServices.filter(s => s.id !== id);
      updateCalculator();
    }

    function updateCalculator() {
      if (!calculatorList || !calculatorTotal || !calcEmpty) return;

      if (selectedServices.length === 0) {
        calculatorList.innerHTML = `<div class="calculator-empty">Добавьте услуги из прайса</div>`;
        calcEmpty.style.display = 'block';
        calculatorTotal.innerHTML = `
          <span>Итого:</span>
          <span class="total-price">0 ₽</span>
        `;
        return;
      }

      calcEmpty.style.display = 'none';
      const total = selectedServices.reduce((sum, s) => sum + s.price, 0);

      calculatorList.innerHTML = selectedServices.map(service => `
        <div class="calculator-item">
          <span>${service.name}</span>
          <div style="display:flex;align-items:center;gap:12px;">
            <span>${service.price.toLocaleString()} ₽</span>
            <span class="calculator-item-remove" data-id="${service.id}">✕</span>
          </div>
        </div>
      `).join('');

      calculatorTotal.innerHTML = `
        <span>Итого:</span>
        <span class="total-price">${total.toLocaleString()} ₽</span>
      `;

      document.querySelectorAll('.calculator-item-remove').forEach(el => {
        el.addEventListener('click', () => {
          removeFromCalculator(parseInt(el.dataset.id));
        });
      });
    }

    renderCategoryTabs();
    renderPriceTable('all');
    updateCalculator();
  }

  /* ===== FORM VALIDATION ===== */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm) {
    const phoneInput = contactForm.querySelector('input[name="phone"]');
    const serviceSelect = contactForm.querySelector('select[name="service"]');

    if (serviceSelect && typeof SERVICES !== 'undefined') {
      serviceSelect.innerHTML = '<option value="">Выберите услугу</option>' +
        SERVICES.map(s => `<option value="${s.name}">${s.name} — ${s.price} ₽</option>`).join('');
    }

    if (phoneInput) {
      phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 0) {
          if (value.startsWith('7')) value = '+7' + value.substring(1);
          else if (value.startsWith('8')) value = '+7' + value.substring(1);
          else value = '+7' + value;
        }
        if (value.length > 2) {
          value = value.substring(0, 2) + ' (' + value.substring(2);
        }
        if (value.length > 7) {
          value = value.substring(0, 7) + ') ' + value.substring(7);
        }
        if (value.length > 12) {
          value = value.substring(0, 12) + '-' + value.substring(12);
        }
        if (value.length > 15) {
          value = value.substring(0, 15) + '-' + value.substring(15);
        }
        if (value.length > 18) {
          value = value.substring(0, 18);
        }
        e.target.value = value;
      });
    }

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      const name = contactForm.querySelector('input[name="name"]');
      const phone = contactForm.querySelector('input[name="phone"]');
      const agreement = contactForm.querySelector('input[name="agreement"]');

      const fields = [name, phone];
      fields.forEach(field => {
        const errorEl = field.parentElement.querySelector('.form-error');
        if (!field.value.trim()) {
          field.classList.add('error');
          if (errorEl) errorEl.classList.add('visible');
          isValid = false;
        } else {
          field.classList.remove('error');
          if (errorEl) errorEl.classList.remove('visible');
        }
      });

      if (phone) {
        const errorEl = phone.parentElement.querySelector('.form-error');
        const phoneClean = phone.value.replace(/\D/g, '');
        if (phoneClean.length < 11) {
          phone.classList.add('error');
          if (errorEl) {
            errorEl.textContent = 'Введите корректный номер телефона';
            errorEl.classList.add('visible');
          }
          isValid = false;
        }
      }

      if (isValid) {
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Отправка...';

        const formData = new FormData(contactForm);
        formData.set('_subject', 'Новая запись к Алисе');

        fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' },
        })
        .then(() => {
          contactForm.style.display = 'none';
          formSuccess.classList.add('visible');
        })
        .catch(() => {
          contactForm.style.display = 'none';
          formSuccess.classList.add('visible');
        });
      }
    });
  }

  /* ===== HEADER CTA SCROLL ===== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
