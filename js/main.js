/* ===== SCROLL REVEAL (module level — доступен из любого места) ===== */
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
    items = Array.from(document.querySelectorAll('.gallery-item')).filter(
      el => el.style.display !== 'none'
    );
  }

  function openLightbox(index) {
    updateItems();
    if (items.length === 0) return;
    currentIndex = index;
    const name = items[currentIndex].querySelector('.gallery-item-overlay span')?.textContent || 'Фото работы';
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

  function attachLightboxClicks() {
    document.querySelectorAll('.gallery-item').forEach((item, index) => {
      item.addEventListener('click', () => openLightbox(index));
    });
  }

  function navigateLightbox(direction) {
    updateItems();
    if (items.length === 0) return;
    currentIndex = (currentIndex + direction + items.length) % items.length;
    const name = items[currentIndex].querySelector('.gallery-item-overlay span')?.textContent || 'Фото работы';
    lightboxImage.alt = name;
    updateCounter();
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  attachLightboxClicks();

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
  if (lightboxNext) lightboxNext.addEventListener('click', () => navigateLightbox(1));

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  return { attachLightboxClicks };
}

/* ===== PHONE MASK ===== */
function applyPhoneMask(input) {
  if (!input) return;
  input.addEventListener('input', () => {
    let value = input.value.replace(/\D/g, '');
    if (value.length > 0) {
      if (value.startsWith('7')) value = '+7' + value.substring(1);
      else if (value.startsWith('8')) value = '+7' + value.substring(1);
      else value = '+7' + value;
    }
    if (value.length > 2) value = value.substring(0, 2) + ' (' + value.substring(2);
    if (value.length > 7) value = value.substring(0, 7) + ') ' + value.substring(7);
    if (value.length > 12) value = value.substring(0, 12) + '-' + value.substring(12);
    if (value.length > 15) value = value.substring(0, 15) + '-' + value.substring(15);
    if (value.length > 18) value = value.substring(0, 18);
    input.value = value;
  });
}

/* ===== FORM HANDLER GENERIC ===== */
function setupFormHandler(form, successEl) {
  if (!form) return;

  const phoneInput = form.querySelector('input[name="phone"]');
  const serviceSelect = form.querySelector('select[name="service"]');
  const submitBtn = form.querySelector('button[type="submit"]');

  if (serviceSelect && typeof SERVICES !== 'undefined') {
    serviceSelect.innerHTML = '<option value="">Выберите услугу</option>' +
      SERVICES.map(s => `<option value="${s.name}">${s.name} — ${s.price} ₽</option>`).join('');
  }

  applyPhoneMask(phoneInput);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    const name = form.querySelector('input[name="name"]');
    const agreement = form.querySelector('input[name="agreement"]');
    const fields = [name, phoneInput];

    fields.forEach(field => {
      if (!field) return;
      const errorEl = field.closest('.form-group')?.querySelector('.form-error');
      if (!field.value.trim()) {
        field.classList.add('error');
        if (errorEl) errorEl.classList.add('visible');
        isValid = false;
      } else {
        field.classList.remove('error');
        if (errorEl) errorEl.classList.remove('visible');
      }
    });

    if (phoneInput) {
      const errorEl = phoneInput.closest('.form-group')?.querySelector('.form-error');
      const phoneClean = phoneInput.value.replace(/\D/g, '');
      if (phoneClean.length < 11) {
        phoneInput.classList.add('error');
        if (errorEl) {
          errorEl.textContent = 'Введите корректный номер';
          errorEl.classList.add('visible');
        }
        isValid = false;
      }
    }

    if (!isValid) return;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправка...';

    const fd = new FormData(form);
    fd.set('_subject', 'Новая запись к Алисе');

    fetch(form.action, { method: 'POST', body: fd, headers: { 'Accept': 'application/json' } })
      .then(() => { form.style.display = 'none'; if (successEl) successEl.classList.add('visible'); })
      .catch(() => { form.style.display = 'none'; if (successEl) successEl.classList.add('visible'); });
  });
}

/* ===== MAIN ===== */
document.addEventListener('DOMContentLoaded', () => {

  /* ===== HEADER SCROLL ===== */
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    header?.classList.toggle('scrolled', window.pageYOffset > 50);
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

  /* ===== TYPING TEXT ===== */
  const typingElement = document.querySelector('.typing-text');
  if (typingElement) {
    const words = ['запоминается', 'сияет', 'вдохновляет', 'завораживает', 'притягивает', 'очаровывает'];
    let wordIndex = 0, charIndex = 0, isDeleting = false;

    function typeEffect() {
      const currentWord = words[wordIndex];
      if (!isDeleting) {
        typingElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
        if (charIndex === currentWord.length) {
          setTimeout(() => { isDeleting = true; typeEffect(); }, 2000);
          return;
        }
        setTimeout(typeEffect, 80);
      } else {
        typingElement.textContent = currentWord.substring(0, charIndex);
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

  /* ===== POPULAR SERVICES (index.html) ===== */
  const popularGrid = document.getElementById('popularGrid');
  if (popularGrid) {
    const popular = SERVICES.filter(s => s.isPopular).slice(0, 3);
    popularGrid.innerHTML = popular.map(s => `
      <div class="service-card reveal">
        <div class="service-card-image">
          <div class="placeholder">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="12" cy="12" r="9"/>
              <path d="M12 3c2.5 3 4 6.5 4 9s-1.5 6-4 9"/>
              <path d="M12 3c-2.5 3-4 6.5-4 9s1.5 6 4 9"/>
            </svg>
            <span style="display:block;margin-top:8px;font-size:12px;opacity:0.6">${s.name}</span>
          </div>
        </div>
        <div class="service-card-body">
          <div class="service-card-category">${CATEGORIES.find(c => c.id === s.category)?.label || s.category}</div>
          <h3 class="service-card-title">${s.name}</h3>
          <p class="service-card-desc">${s.description}</p>
          <div class="service-card-footer">
            <span class="service-card-price">${s.price.toLocaleString()} ₽</span>
            <span class="service-card-duration">${s.duration}</span>
          </div>
          <a href="services.html" class="btn btn-primary btn-sm">Подробнее</a>
        </div>
      </div>
    `).join('');
  }

  /* ===== PREVIEW GALLERY (index.html) ===== */
  const previewGallery = document.getElementById('previewGallery');
  if (previewGallery) {
    previewGallery.innerHTML = WORKS.slice(0, 4).map(w => `
      <div class="gallery-item reveal">
        <div class="gallery-placeholder">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="2" y="2" width="20" height="20" rx="2"/>
            <circle cx="9" cy="9" r="2"/>
            <path d="m21 15-5-5L5 21"/>
          </svg>
        </div>
        <div class="gallery-item-overlay">
          <span>${w.serviceName}</span>
          <small>${w.date}</small>
        </div>
      </div>
    `).join('');
  }

  /* ===== REVIEWS CONTENT ===== */
  const reviewsTrack = document.getElementById('reviewsTrack');
  if (reviewsTrack) {
    reviewsTrack.innerHTML = REVIEWS.map(r => `
      <div class="review-card">
        <div class="review-header">
          <div class="review-avatar">${r.name.charAt(0)}</div>
          <div class="review-author">
            <div class="review-name">${r.name}</div>
            <div class="review-date">${r.date}</div>
          </div>
          <div class="review-rating">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
        </div>
        <p class="review-text">"${r.text}"</p>
        <div class="review-service">${r.service}</div>
      </div>
    `).join('');
  }

  const reviewsGrid = document.getElementById('reviewsGrid');
  if (reviewsGrid) {
    reviewsGrid.innerHTML = REVIEWS.map(r => `
      <div class="review-card">
        <div class="review-header">
          <div class="review-avatar">${r.name.charAt(0)}</div>
          <div class="review-author">
            <div class="review-name">${r.name}</div>
            <div class="review-date">${r.date}</div>
          </div>
          <div class="review-rating">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
        </div>
        <p class="review-text">"${r.text}"</p>
        <div class="review-service">${r.service}</div>
      </div>
    `).join('');
  }

  /* ===== LIGHTBOX ===== */
  const lightboxApi = initLightbox();

  /* ===== PORTFOLIO FILTER + GALLERY (portfolio.html) ===== */
  const galleryGrid = document.getElementById('galleryGrid');
  const filterBar = document.getElementById('filterBar');

  if (galleryGrid && filterBar) {
    function renderGallery(category = 'all') {
      const filtered = category === 'all' ? WORKS : WORKS.filter(w => w.category === category);

      galleryGrid.innerHTML = filtered.map(work => `
        <div class="gallery-item reveal" data-id="${work.id}" data-category="${work.category}">
          <div class="gallery-placeholder">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="2" y="2" width="20" height="20" rx="2"/>
              <circle cx="9" cy="9" r="2"/>
              <path d="m21 15-5-5L5 21"/>
            </svg>
            <span style="display:block;margin-top:8px;font-size:12px;opacity:0.6">${work.serviceName}</span>
          </div>
          <div class="gallery-item-overlay">
            <span>${work.serviceName}</span>
            <small>${work.date}</small>
          </div>
        </div>
      `).join('');

      galleryGrid.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
      lightboxApi?.attachLightboxClicks();
    }

    function renderFilters() {
      filterBar.innerHTML = CATEGORIES.filter(c => c.id !== 'removal').map(cat => `
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

  /* ===== REVIEWS CAROUSEL (index.html) ===== */
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
      const spv = getSlidesPerView();
      currentSlide = Math.max(0, Math.min(index, totalSlides - spv));
      const gap = 24;
      cards.forEach(c => c.style.minWidth = `calc(${100 / spv}% - ${gap * (spv - 1) / spv}px)`);
      track.style.transform = `translateX(-${currentSlide * (100 / spv)}%)`;
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
        dot.addEventListener('click', () => { goToSlide(i); resetAutoplay(); });
        dotsContainer.appendChild(dot);
      }
    }

    function startAutoplay() {
      stopAutoplay();
      autoplayInterval = setInterval(() => {
        goToSlide(currentSlide >= getMaxSlide() ? 0 : currentSlide + 1);
      }, 5000);
    }

    function stopAutoplay() { if (autoplayInterval) clearInterval(autoplayInterval); }
    function resetAutoplay() { startAutoplay(); }

    track.addEventListener('mouseenter', stopAutoplay);
    track.addEventListener('mouseleave', startAutoplay);

    createDots();
    goToSlide(0);
    startAutoplay();

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => { createDots(); goToSlide(0); }, 300);
    });
  }

  /* ===== PRICE TABLE / CALCULATOR (services.html) ===== */
  const servicesTable = document.getElementById('servicesTable');
  const calculatorList = document.getElementById('calculatorList');
  const calculatorTotal = document.getElementById('calculatorTotal');
  const calcEmpty = document.getElementById('calcEmpty');
  let selectedServices = [];

  if (servicesTable) {
    function renderPriceTable(category = 'all') {
      const filtered = category === 'all' ? SERVICES : SERVICES.filter(s => s.category === category);

      servicesTable.innerHTML = filtered.map(service => `
        <tr>
          <td>${service.name}</td>
          <td>${service.duration}</td>
          <td class="price">${service.price.toLocaleString()} ₽</td>
          <td>
            <button class="btn btn-primary btn-sm add-to-calc" data-id="${service.id}">
              ${selectedServices.find(s => s.id === service.id) ? '✓ В заказе' : 'В заказ'}
            </button>
          </td>
        </tr>
      `).join('');

      document.querySelectorAll('.add-to-calc').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = parseInt(btn.dataset.id);
          if (selectedServices.find(s => s.id === id)) {
            removeFromCalculator(id);
          } else {
            addToCalculator(id);
          }
        });
      });
    }

    function renderCategoryTabs() {
      const tabsContainer = document.getElementById('categoryTabs');
      if (!tabsContainer) return;

      tabsContainer.innerHTML = [
        { id: 'all', label: 'Все услуги' },
        { id: 'lash', label: 'Наращивание' },
        { id: 'lamination', label: 'Ламинирование' },
        { id: 'correction', label: 'Коррекция' },
        { id: 'removal', label: 'Снятие' },
        { id: 'additional', label: 'Косметология' },
      ].map(cat => `
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
      if (!service || selectedServices.find(s => s.id === id)) return;
      selectedServices.push(service);
      updateCalculator();
      renderPriceTable(document.querySelector('#categoryTabs .filter-btn.active')?.dataset.tab || 'all');
    }

    function removeFromCalculator(id) {
      selectedServices = selectedServices.filter(s => s.id !== id);
      updateCalculator();
      renderPriceTable(document.querySelector('#categoryTabs .filter-btn.active')?.dataset.tab || 'all');
    }

    function updateCalculator() {
      if (!calculatorList || !calculatorTotal || !calcEmpty) return;

      if (selectedServices.length === 0) {
        calculatorList.innerHTML = '<div class="calculator-empty">Добавьте услуги из прайса</div>';
        calcEmpty.style.display = 'block';
        calculatorTotal.innerHTML = '<span>Итого:</span><span class="total-price">0 ₽</span>';
        return;
      }

      calcEmpty.style.display = 'none';
      const total = selectedServices.reduce((sum, s) => sum + s.price, 0);

      calculatorList.innerHTML = selectedServices.map(s => `
        <div class="calculator-item">
          <span>${s.name}</span>
          <div style="display:flex;align-items:center;gap:12px;">
            <span>${s.price.toLocaleString()} ₽</span>
            <span class="calculator-item-remove" data-id="${s.id}">✕</span>
          </div>
        </div>
      `).join('');

      calculatorTotal.innerHTML = `<span>Итого:</span><span class="total-price">${total.toLocaleString()} ₽</span>`;

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

  /* ===== CONTACT FORM (contacts.html) ===== */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  setupFormHandler(contactForm, formSuccess);

  /* ===== CTA FORM (index.html) ===== */
  const ctaForm = document.getElementById('ctaForm');
  const ctaSuccess = document.getElementById('ctaSuccess');
  setupFormHandler(ctaForm, ctaSuccess);

  /* ===== OBSERVE REVEAL ELEMENTS ===== */
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ===== ANCHOR SMOOTH SCROLL ===== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

});
