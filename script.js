// Configuration
const FRAME_COUNT = 600;
const FRAME_PATH_TEMPLATE = (index) => `frames/frame_${String(index).padStart(4, '0')}.jpg`;

function initApp() {
  // SAFETY: unlock preloader after 2s no matter what (handles missing frames folder on deployment)
  const preloaderEl = document.getElementById('preloader');
  const emergencyUnlock = setTimeout(() => {
    if (preloaderEl && !preloaderEl.classList.contains('loaded')) {
      console.warn('XTARK: Emergency unlock triggered');
      preloaderEl.classList.add('loaded');
      document.body.style.overflow = 'auto';
    }
  }, 2000);

  // DOM Elements
  const canvas = document.getElementById('scroll-canvas');
  if (!canvas) { console.error('Canvas not found'); return; }
  const ctx = canvas.getContext('2d');
  const preloader = document.getElementById('preloader');
  const percentText = document.getElementById('load-percentage');
  const progressBar = document.getElementById('load-progress-bar');
  const headerNav = document.getElementById('header-nav');

  // State Variables
  const images = [];
  let loadedCount = 0;
  let targetFrame = 1;
  let currentFrame = 1;
  let lastDrawnFrame = -1;

  // ─── Canvas ─────────────────────────────────────────────────────────────────
  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    drawFrame(Math.round(currentFrame));
  }

  function drawFrame(frameIndex) {
    if (frameIndex < 1 || frameIndex > FRAME_COUNT) return;
    const img = images[frameIndex];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const imgRatio = img.width / img.height;
    const canvasRatio = canvas.width / canvas.height;
    let drawWidth, drawHeight, drawX, drawY;

    if (canvasRatio > imgRatio) {
      drawWidth = canvas.width;
      drawHeight = canvas.width / imgRatio;
      drawX = 0;
      drawY = (canvas.height - drawHeight) / 2;
    } else {
      drawHeight = canvas.height;
      drawWidth = canvas.height * imgRatio;
      drawX = (canvas.width - drawWidth) / 2;
      drawY = 0;
    }

    ctx.drawImage(img, Math.floor(drawX), Math.floor(drawY), Math.floor(drawWidth), Math.floor(drawHeight));
    lastDrawnFrame = frameIndex;
  }

  function updateTargetFrame() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    if (maxScroll <= 0) { targetFrame = 1; return; }
    const scrollProgress = Math.max(0, Math.min(1, scrollTop / maxScroll));
    targetFrame = 1 + scrollProgress * (FRAME_COUNT - 1);
  }

  function startAnimationLoop() {
    const EASE = 0.08;
    function tick() {
      const diff = targetFrame - currentFrame;
      if (Math.abs(diff) > 0.01) {
        currentFrame += diff * EASE;
      } else {
        currentFrame = targetFrame;
      }
      const roundedFrame = Math.round(currentFrame);
      if (roundedFrame !== lastDrawnFrame) drawFrame(roundedFrame);
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // ─── Preloader ───────────────────────────────────────────────────────────────
  function onAllFramesLoaded() {
    clearTimeout(emergencyUnlock);
    // Draw the canvas FIRST so background is visible before preloader fades
    resizeCanvas();
    updateTargetFrame();
    currentFrame = targetFrame;
    drawFrame(Math.round(currentFrame));
    startAnimationLoop();
    // NOW fade the preloader - canvas is already painted, no black flash
    requestAnimationFrame(() => {
      if (preloader) preloader.classList.add('loaded');
      document.body.style.overflow = 'auto';
    });
  }

  function updateProgress(count, total) {
    const pct = Math.floor((count / total) * 100);
    if (percentText) percentText.textContent = `${pct}%`;
    if (progressBar) progressBar.style.width = `${pct}%`;
  }

  function preloadImages() {
    const CHUNK_SIZE = 25;
    const INITIAL_LOAD_COUNT = 300;
    let currentIndex = 1;
    let hasStarted = false;

    // HARD FALLBACK: force unlock after 5s no matter what (handles 404s / network hangs)
    setTimeout(() => {
      if (!hasStarted) {
        console.warn('Preloader: emergency unlock after timeout');
        hasStarted = true;
        onAllFramesLoaded();
      }
    }, 5000);

    for (let i = 0; i <= FRAME_COUNT; i++) images.push(null);

    function loadNextChunk() {
      const chunkEnd = Math.min(currentIndex + CHUNK_SIZE - 1, FRAME_COUNT);
      const chunkTotal = chunkEnd - currentIndex + 1;
      if (chunkTotal <= 0) return;

      let chunkLoadedCount = 0;

      for (let i = currentIndex; i <= chunkEnd; i++) {
        const img = new Image();

        const finishImg = () => {
          loadedCount++;
          chunkLoadedCount++;

          // Draw frame 1 immediately the instant it loads - no black background
          if (i === 1 && img.complete && img.naturalWidth > 0) {
            resizeCanvas();
            drawFrame(1);
          }

          if (!hasStarted) {
            updateProgress(Math.min(loadedCount, INITIAL_LOAD_COUNT), INITIAL_LOAD_COUNT);
            if (loadedCount >= INITIAL_LOAD_COUNT) {
              hasStarted = true;
              onAllFramesLoaded();
            }
          }

          if (chunkLoadedCount === chunkTotal) {
            currentIndex = chunkEnd + 1;
            loadNextChunk();
          }
        };

        img.onload = finishImg;
        img.onerror = finishImg; // treat 404 as loaded so loader doesn't freeze
        img.src = FRAME_PATH_TEMPLATE(i);
        images[i] = img;
      }
    }

    loadNextChunk();
  }

  // ─── Scroll & Resize ─────────────────────────────────────────────────────────
  window.addEventListener('scroll', () => {
    updateTargetFrame();
    if (window.scrollY > 50) {
      headerNav.classList.add('scrolled');
    } else {
      headerNav.classList.remove('scrolled');
    }
  });

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resizeCanvas, 100);
  });

  // ─── Kick off ────────────────────────────────────────────────────────────────
  document.body.style.overflow = 'hidden';
  preloadImages();

  // ─── Navigation Highlighting ─────────────────────────────────────────────────
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('.std-section');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${entry.target.id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(section => observer.observe(section));

  // ─── Accordion Logic ──────────────────────────────────────────────────────────
  const accordionItems = document.querySelectorAll('.accordion-item');
  accordionItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      const container = item.closest('.accordion-container');
      const siblings = container.querySelectorAll('.accordion-item');
      siblings.forEach(other => {
        if (other !== item) other.classList.remove('active');
      });
      item.classList.add('active');
    });
  });

  // ─── Vertical Bar Scroll Spy ──────────────────────────────────────────────────
  const enduranceSection = document.getElementById('section-endurance');
  const statItems = document.querySelectorAll('.vertical-stats-bar .stat-item');

  if (enduranceSection && statItems.length > 0) {
    window.addEventListener('scroll', () => {
      const rect = enduranceSection.getBoundingClientRect();
      const sectionTop = rect.top;
      const windowHeight = window.innerHeight;
      const triggerPoint = windowHeight * 0.4;

      if (sectionTop < triggerPoint && sectionTop > -rect.height) {
        const scrolledPast = triggerPoint - sectionTop;
        const activeZone = rect.height * 0.6;
        const progress = Math.max(0, Math.min(1, scrolledPast / activeZone));

        statItems.forEach((item, index) => {
          const thresholds = [0.15, 0.45, 0.75];
          if (progress > thresholds[index]) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });
      }
    });
  }

  // ─── 3D Coaching Arc Animation ────────────────────────────────────────────────
  const coachingSection = document.getElementById('section-coaching');
  const coachCards = document.querySelectorAll('.arc-3d-wrapper .profile-card');

  if (coachingSection && coachCards.length > 0) {
    let targetProgress = 0;
    let currentProgress = 0;
    let isArcAnimating = false;
    let snapTimeout;

    window.addEventListener('scroll', () => {
      const rect = coachingSection.getBoundingClientRect();
      const sectionHeight = rect.height;
      const windowHeight = window.innerHeight;
      const scrollableDistance = sectionHeight - windowHeight;
      if (scrollableDistance <= 0) return;

      let p = -rect.top / scrollableDistance;
      targetProgress = Math.max(0, Math.min(1, p));

      if (!isArcAnimating) {
        isArcAnimating = true;
        requestAnimationFrame(tickArc);
      }

      clearTimeout(snapTimeout);
      snapTimeout = setTimeout(() => {
        if (targetProgress > 0 && targetProgress < 1) {
          if ((targetProgress > 0.2 && targetProgress < 0.4) || (targetProgress > 0.6 && targetProgress < 0.8)) {
            let snapProgress = 0;
            if (targetProgress < 0.3) snapProgress = 0.1;
            else if (targetProgress < 0.7) snapProgress = 0.5;
            else snapProgress = 0.9;

            const currentScrollY = window.scrollY || document.documentElement.scrollTop;
            const absoluteSectionTop = currentScrollY + rect.top;
            const targetScrollY = absoluteSectionTop + (snapProgress * scrollableDistance);
            window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
          }
        }
      }, 150);
    });

    function tickArc() {
      const diff = targetProgress - currentProgress;
      if (Math.abs(diff) > 0.001) {
        currentProgress += diff * 0.12;
        requestAnimationFrame(tickArc);
      } else {
        currentProgress = targetProgress;
        isArcAnimating = false;
      }

      let activeFloatIndex = 0;
      if (currentProgress < 0.2) {
        activeFloatIndex = 0;
      } else if (currentProgress < 0.4) {
        activeFloatIndex = (currentProgress - 0.2) * 5;
      } else if (currentProgress < 0.6) {
        activeFloatIndex = 1;
      } else if (currentProgress < 0.8) {
        activeFloatIndex = 1 + (currentProgress - 0.6) * 5;
      } else {
        activeFloatIndex = 2;
      }

      coachCards.forEach((card, index) => {
        const dist = index - activeFloatIndex;
        const absDist = Math.abs(dist);
        const yOffset = dist * 300;
        const zOffset = -Math.pow(absDist, 2) * 150;
        const rotateX = dist * -20;
        const scale = Math.max(0.7, 1.05 - (absDist * 0.35));
        const opacity = Math.max(0, 1 - (absDist * 0.5));

        card.style.transform = `translateY(${yOffset}px) translateZ(${zOffset}px) scale(${scale}) rotateX(${rotateX}deg)`;
        card.style.opacity = opacity;

        if (absDist < 0.2) {
          card.classList.add('is-active');
        } else {
          card.classList.remove('is-active');
        }
      });
    }

    window.dispatchEvent(new Event('scroll'));
  }
}

// Run when DOM is ready (handles both normal load and bundler defer)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
