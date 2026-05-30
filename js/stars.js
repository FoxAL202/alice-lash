(function () {
  const canvas = document.getElementById('starsCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let stars = [];
  let shootingStars = [];
  let mouseX = 0, mouseY = 0;
  let isMobile = window.innerWidth < 768;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  function resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.scale(dpr, dpr);
    isMobile = w < 768;
    initStars();
  }

  function initStars() {
    const count = isMobile ? 80 : (window.innerWidth < 1200 ? 150 : 250);
    stars = [];
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 1.5 + 0.3,
        alpha: Math.random(),
        speed: Math.random() * 0.02 + 0.005,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  let shootingStarTimer = 0;

  function spawnShootingStar() {
    shootingStars.push({
      x: Math.random() * window.innerWidth * 0.8,
      y: Math.random() * window.innerHeight * 0.3,
      len: Math.random() * 80 + 40,
      speed: Math.random() * 4 + 3,
      angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
      alpha: 1,
      decay: 0.01 + Math.random() * 0.01
    });
  }

  function drawStar(s) {
    const parallaxX = (mouseX - window.innerWidth / 2) * 0.02;
    const parallaxY = (mouseY - window.innerHeight / 2) * 0.02;
    const x = s.x + parallaxX;
    const y = s.y + parallaxY;
    const alpha = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(Date.now() * s.speed + s.phase));
    ctx.beginPath();
    ctx.arc(x, y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
    ctx.fill();
  }

  function drawShootingStar(ss) {
    const endX = ss.x + Math.cos(ss.angle) * ss.len;
    const endY = ss.y + Math.sin(ss.angle) * ss.len;
    const gradient = ctx.createLinearGradient(ss.x, ss.y, endX, endY);
    gradient.addColorStop(0, `rgba(167, 139, 250, ${ss.alpha})`);
    gradient.addColorStop(1, `rgba(167, 139, 250, 0)`);
    ctx.beginPath();
    ctx.moveTo(ss.x, ss.y);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  function animate() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    stars.forEach(drawStar);

    shootingStarTimer++;
    if (shootingStarTimer > 300 + Math.random() * 200) {
      spawnShootingStar();
      shootingStarTimer = 0;
    }

    shootingStars = shootingStars.filter(ss => {
      ss.alpha -= ss.decay;
      ss.x += Math.cos(ss.angle) * ss.speed;
      ss.y += Math.sin(ss.angle) * ss.speed;
      if (ss.alpha > 0) drawShootingStar(ss);
      return ss.alpha > 0;
    });

    requestAnimationFrame(animate);
  }

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 200);
  });

  resize();
  animate();
})();
