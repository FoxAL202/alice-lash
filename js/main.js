const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
);

/* ===== HEADER ===== */
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
  header?.classList.toggle('scrolled', window.pageYOffset > 40);
});

/* ===== BURGER ===== */
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

/* ===== SCROLL TO TOP ===== */
document.getElementById('scrollTop')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ===== WORKS GALLERY (index) ===== */
const worksGrid = document.getElementById('worksGrid');
if (worksGrid) {
  worksGrid.innerHTML = WORKS.slice(0, 6).map(w => {
    const gradient = SERVICES.find(s => s.id === w.id)?.gradient || 'linear-gradient(135deg, #667eea, #764ba2)';
    return `
      <div class="gallery-item fade-in" style="background:${gradient}">
        <div class="gallery-placeholder">
          <span class="gallery-placeholder-text">${w.serviceName}</span>
        </div>
        <div class="gallery-item-overlay">
          <span>${w.serviceName}</span>
          <small>${w.date}</small>
        </div>
      </div>
    `;
  }).join('');
}

/* ===== SERVICES ===== */
const servicesGrid = document.getElementById('servicesGrid');
if (servicesGrid) {
  const iconSymbols = ['✦', '◈', '◆', '✧', '◇', '❋', '○', '☆'];
  servicesGrid.innerHTML = SERVICES.filter(s => s.isPopular).map((s, i) => {
    const color = s.gradient.match(/#[a-f0-9]{6}/i)?.[0] || '#a78bfa';
    return `
      <div class="service-card fade-in" data-service-id="${s.id}" style="--gradient:${s.gradient}">
        <div class="service-card-icon" style="background:${s.gradient}22;color:${color}">${iconSymbols[i]}</div>
        <div class="service-card-category">${CATEGORIES.find(c => c.id === s.category)?.label || s.category}</div>
        <h3 class="service-card-title">${s.name}</h3>
        <p class="service-card-desc">${s.description}</p>
        <div class="service-card-footer">
          <span class="service-card-price">${s.price.toLocaleString()} ₽</span>
          <span class="service-card-duration">${s.duration}</span>
        </div>
      </div>
    `;
  }).join('');

  servicesGrid.addEventListener('click', (e) => {
    const card = e.target.closest('.service-card');
    if (card && !e.target.closest('.btn')) {
      card.classList.toggle('expanded');
    }
  });
}

/* ===== ABOUT ===== */
const aboutText = document.getElementById('aboutText');
const aboutStats = document.getElementById('aboutStats');

if (aboutText && typeof MASTER !== 'undefined') {
  aboutText.innerHTML = MASTER.about.map(p => `<p>${p}</p>`).join('');
}

if (aboutStats && typeof MASTER !== 'undefined') {
  aboutStats.innerHTML = MASTER.stats.map(s => `
    <div class="about-stat fade-in">
      <div class="about-stat-number">${s.value}</div>
      <div class="about-stat-label">${s.label}</div>
    </div>
  `).join('');
}

/* ===== REVIEWS ===== */
const reviewsTrack = document.getElementById('reviewsTrack');
const reviewsDots = document.getElementById('reviewsDots');

if (reviewsTrack) {
  reviewsTrack.innerHTML = REVIEWS.map(r => `
    <div class="review-card">
      <div class="review-header">
        <div class="review-avatar">${r.name.charAt(0)}</div>
        <div class="review-info">
          <div class="review-name">${r.name}</div>
          <div class="review-date">${r.date}</div>
        </div>
        <div class="review-rating">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
      </div>
      <p class="review-text review-text-expand" onclick="this.classList.toggle('expanded')">«${r.text}»</p>
      <div class="review-service">${r.service}</div>
    </div>
  `).join('');

  if (reviewsDots) {
    const cards = reviewsTrack.querySelectorAll('.review-card');
    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = `review-dot ${i === 0 ? 'active' : ''}`;
      dot.addEventListener('click', () => {
        reviewsTrack.parentElement.scrollTo({
          left: cards[i].offsetLeft - 24,
          behavior: 'smooth'
        });
      });
      reviewsDots.appendChild(dot);
    });

    reviewsTrack.parentElement.addEventListener('scroll', () => {
      const scrollLeft = reviewsTrack.parentElement.scrollLeft;
      const dots = reviewsDots.querySelectorAll('.review-dot');
      dots.forEach((dot, i) => {
        const cardLeft = cards[i]?.offsetLeft - 24 || 0;
        dot.classList.toggle('active', Math.abs(scrollLeft - cardLeft) < 100);
      });
    });
  }
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

  if (!lightbox) return;

  function getActiveItems() {
    return Array.from(document.querySelectorAll('.gallery-item')).filter(
      el => el.style.display !== 'none'
    );
  }

  function openLightbox(index) {
    const items = getActiveItems();
    if (items.length === 0) return;
    currentIndex = index;
    const name = items[currentIndex].querySelector('.gallery-item-overlay span')?.textContent || 'Фото работы';
    const gradient = items[currentIndex].style.background || 'linear-gradient(135deg, #667eea, #764ba2)';
    lightboxImage.src = '';
    lightboxImage.alt = name;
    lightboxImage.style.background = gradient;
    lightboxImage.style.width = '400px';
    lightboxImage.style.height = '300px';
    lightboxImage.style.objectFit = 'contain';
    lightboxImage.style.borderRadius = '12px';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    updateCounter(getActiveItems());
  }

  function updateCounter(items) {
    if (items.length > 0) {
      lightboxCounter.textContent = `${currentIndex + 1} / ${items.length}`;
    }
  }

  function attachClicks() {
    document.querySelectorAll('.gallery-item').forEach((item, index) => {
      item.addEventListener('click', () => openLightbox(index));
    });
  }

  function navigate(direction) {
    const items = getActiveItems();
    if (items.length === 0) return;
    currentIndex = (currentIndex + direction + items.length) % items.length;
    const name = items[currentIndex].querySelector('.gallery-item-overlay span')?.textContent || 'Фото работы';
    const gradient = items[currentIndex].style.background || 'linear-gradient(135deg, #667eea, #764ba2)';
    lightboxImage.alt = name;
    lightboxImage.style.background = gradient;
    updateCounter(items);
  }

  function close() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  attachClicks();

  lightboxClose?.addEventListener('click', close);
  lightboxPrev?.addEventListener('click', () => navigate(-1));
  lightboxNext?.addEventListener('click', () => navigate(1));

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });

  return { attachClicks };
}

/* ===== PORTFOLIO PAGE ===== */
const galleryGrid = document.getElementById('galleryGrid');
const filterBar = document.getElementById('filterBar');

if (filterBar) {
  filterBar.innerHTML = CATEGORIES.map(cat => `
    <button class="filter-btn ${cat.id === 'all' ? 'active' : ''}" data-filter="${cat.id}">
      ${cat.label}
    </button>
  `).join('');
}

if (galleryGrid && filterBar) {
  function renderGallery(category = 'all') {
    const filtered = category === 'all' ? WORKS : WORKS.filter(w => w.category === category);
    galleryGrid.innerHTML = filtered.map(w => {
      const gradient = SERVICES.find(s => s.id === w.id)?.gradient || 'linear-gradient(135deg, #667eea, #764ba2)';
      return `
        <div class="gallery-item fade-in" style="background:${gradient}" data-category="${w.category}">
          <div class="gallery-placeholder">
            <span class="gallery-placeholder-text">${w.serviceName}</span>
          </div>
          <div class="gallery-item-overlay">
            <span>${w.serviceName}</span>
            <small>${w.date}</small>
          </div>
        </div>
      `;
    }).join('');

    galleryGrid.querySelectorAll('.fade-in').forEach(el => revealObserver.observe(el));
    lightboxApi?.attachClicks();
  }

  filterBar.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderGallery(btn.dataset.filter);
  });

  renderGallery('all');
}

const lightboxApi = initLightbox();

/* ===== FORM ===== */
const bookingForm = document.getElementById('bookingForm');
const formSuccess = document.getElementById('formSuccess');

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

if (bookingForm) {
  const phoneInput = bookingForm.querySelector('input[name="phone"]');
  const serviceSelect = bookingForm.querySelector('select[name="service"]');

  if (serviceSelect && typeof SERVICES !== 'undefined') {
    serviceSelect.innerHTML = '<option value="">Выберите услугу</option>' +
      SERVICES.map(s => `<option value="${s.name}">${s.name} — ${s.price} ₽</option>`).join('');
  }

  applyPhoneMask(phoneInput);

  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    const name = bookingForm.querySelector('input[name="name"]');
    const agreement = bookingForm.querySelector('input[name="agreement"]');
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

    const submitBtn = bookingForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправка...';

    const fd = new FormData(bookingForm);
    fetch(bookingForm.action, { method: 'POST', body: fd, headers: { 'Accept': 'application/json' } })
      .then(() => { bookingForm.style.display = 'none'; if (formSuccess) formSuccess.classList.add('visible'); })
      .catch(() => { bookingForm.style.display = 'none'; if (formSuccess) formSuccess.classList.add('visible'); });
  });
}

/* ===== ANCHOR SMOOTH SCROLL ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ===== OBSERVE FADE-IN ELEMENTS ===== */
document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right').forEach(el => revealObserver.observe(el));
