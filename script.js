// Configuration
const FRAME_COUNT = 600;
const CANVAS_ID = 'scroll-canvas';
const SCROLL_CONTAINER_CLASS = '.scroll-container';
const FRAME_PATH_TEMPLATE = (index) => `frames/frame_${String(index).padStart(4, '0')}.jpg`;

// State Variables
const images = [];
let loadedCount = 0;
let targetFrame = 1;
let currentFrame = 1;
let lastDrawnFrame = -1;

// DOM Elements
const canvas = document.getElementById(CANVAS_ID);
const ctx = canvas.getContext('2d');
const preloader = document.getElementById('preloader');
const percentText = document.getElementById('load-percentage');
const progressBar = document.getElementById('load-progress-bar');
const headerNav = document.getElementById('header-nav');

// Preload Images
function preloadImages() {
  const CHUNK_SIZE = 25; // Load in batches to prevent network choke
  const INITIAL_LOAD_COUNT = 300; // Block the loader until half (300) of the images are loaded
  let currentIndex = 1;
  let hasStarted = false;
  
  // EMERGENCY FALLBACK: If the network hangs on deployment, unlock the site after 4 seconds
  setTimeout(() => {
    if (!hasStarted) {
      console.warn("Preloader emergency unlock triggered due to network timeout.");
      hasStarted = true;
      onAllFramesLoaded();
    }
  }, 4000);
  
  // Pre-fill array to maintain correct frame order
  for (let i = 0; i <= FRAME_COUNT; i++) {
    images.push(null);
  }

  function loadNextChunk() {
    let chunkEnd = Math.min(currentIndex + CHUNK_SIZE - 1, FRAME_COUNT);
    let chunkTotal = chunkEnd - currentIndex + 1;
    let chunkLoadedCount = 0;
    
    if (chunkTotal <= 0) return;
    
    for (let i = currentIndex; i <= chunkEnd; i++) {
      const img = new Image();
      
      const finishImg = () => {
        loadedCount++;
        chunkLoadedCount++;
        
        // If we haven't unlocked the website yet, update the progress bar
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
      
      // If error (e.g. 404 on deployment), still continue loading so loader doesn't freeze forever
      img.onerror = finishImg; 

      img.src = FRAME_PATH_TEMPLATE(i);
      images[i] = img;
    }
  }
  
  loadNextChunk();
}

function updateProgress(count, total) {
  const progressPercent = Math.floor((count / total) * 100);
  percentText.textContent = `${progressPercent}%`;
  progressBar.style.width = `${progressPercent}%`;
}

// When Loading Finishes
function onAllFramesLoaded() {
  setTimeout(() => {
    preloader.classList.add('loaded');
    document.body.style.overflow = 'auto'; // Re-enable normal scrolling
    
    resizeCanvas();
    updateTargetFrame();
    currentFrame = targetFrame;
    drawFrame(Math.round(currentFrame));
    
    startAnimationLoop();
  }, 500);
}

// Draw Frame
function drawFrame(frameIndex) {
  if (frameIndex < 1 || frameIndex > FRAME_COUNT) return;
  const img = images[frameIndex];
  if (!img || !img.complete) return;

  ctx.imageSmoothingEnabled = true;
  // Removed imageSmoothingQuality='high' from tick loop for massive performance gain

  // No need to clearRect if we draw over the whole canvas, but safe to keep.
  // ctx.clearRect(0, 0, canvas.width, canvas.height);

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
  
  if (maxScroll <= 0) {
    targetFrame = 1;
    return;
  }

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
    
    if (roundedFrame !== lastDrawnFrame) {
      drawFrame(roundedFrame);
    }
    
    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}


function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  drawFrame(Math.round(currentFrame));
}

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

const initApp = () => {
  document.body.style.overflow = 'hidden';
  preloadImages();

  // Navigation Highlighting
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
  }, { threshold: 0.3 }); // Trigger when 30% of the section is visible

  sections.forEach(section => observer.observe(section));

  // Accordion Logic
  const accordionItems = document.querySelectorAll('.accordion-item');
  accordionItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      // Find all accordion items within the same container so we don't close FAQs when hovering Programs
      const container = item.closest('.accordion-container');
      const siblings = container.querySelectorAll('.accordion-item');
      
      siblings.forEach(other => {
        if (other !== item) other.classList.remove('active');
      });
      item.classList.add('active');
    });
  });

  // Vertical Bar Scroll Spy Animation
  const enduranceSection = document.getElementById('section-endurance');
  const statItems = document.querySelectorAll('.vertical-stats-bar .stat-item');
  
  if (enduranceSection && statItems.length > 0) {
    window.addEventListener('scroll', () => {
      const rect = enduranceSection.getBoundingClientRect();
      const sectionTop = rect.top;
      const windowHeight = window.innerHeight;
      
      // Trigger when section top reaches the middle of the screen (delays the animation)
      const triggerPoint = windowHeight * 0.4;
      
      if (sectionTop < triggerPoint && sectionTop > -rect.height) {
        // Calculate progress 0 to 1 based on how far we scrolled through the section
        const scrolledPast = triggerPoint - sectionTop;
        // Total scrollable area for this effect
        const activeZone = rect.height * 0.6; 
        
        const progress = Math.max(0, Math.min(1, scrolledPast / activeZone));
        
        statItems.forEach((item, index) => {
          // Explicit, perfectly even thresholds for 3 items
          const thresholds = [0.15, 0.45, 0.75];
          const threshold = thresholds[index];
          
          if (progress > threshold) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });
      }
    });
  }

  // 3D Coaching Arc Animation
  const coachingSection = document.getElementById('section-coaching');
  const coachCards = document.querySelectorAll('.arc-3d-wrapper .profile-card');
  
  if (coachingSection && coachCards.length > 0) {
    let targetProgress = 0;
    let currentProgress = 0;
    let isArcAnimating = false;
    let snapTimeout;

    window.addEventListener('scroll', () => {
      const rect = coachingSection.getBoundingClientRect();
      const sectionTop = rect.top;
      const sectionHeight = rect.height;
      const windowHeight = window.innerHeight;
      
      const scrollableDistance = sectionHeight - windowHeight;
      if (scrollableDistance <= 0) return;
      
      let p = -sectionTop / scrollableDistance;
      targetProgress = Math.max(0, Math.min(1, p));

      if (!isArcAnimating) {
        isArcAnimating = true;
        requestAnimationFrame(tickArc);
      }
      
      // Auto-snap if stopped in mid-transition
      clearTimeout(snapTimeout);
      snapTimeout = setTimeout(() => {
        if (targetProgress > 0 && targetProgress < 1) {
          // Check if caught in a transition phase
          if ((targetProgress > 0.2 && targetProgress < 0.4) || (targetProgress > 0.6 && targetProgress < 0.8)) {
            let snapProgress = 0;
            if (targetProgress < 0.3) snapProgress = 0.1; // Snap back to Coach 1
            else if (targetProgress < 0.7) snapProgress = 0.5; // Snap to Coach 2
            else snapProgress = 0.9; // Snap to Coach 3
            
            const currentScrollY = window.scrollY || document.documentElement.scrollTop;
            const absoluteSectionTop = currentScrollY + rect.top;
            const targetScrollY = absoluteSectionTop + (snapProgress * scrollableDistance);
            
            window.scrollTo({
              top: targetScrollY,
              behavior: 'smooth'
            });
          }
        }
      }, 150);
    });

    function tickArc() {
      const diff = targetProgress - currentProgress;
      
      // If we are close enough, stop animating
      if (Math.abs(diff) > 0.001) {
        currentProgress += diff * 0.12; // Silky smooth, premium easing
        requestAnimationFrame(tickArc);
      } else {
        currentProgress = targetProgress;
        isArcAnimating = false;
      }
      
      // Divide the scroll into 5 phases for 3 cards based on the *smoothed* progress
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
        let adjustedDist = dist;
        const absDist = Math.abs(adjustedDist);
        
        const yOffset = adjustedDist * 300;
        const zOffset = -Math.pow(absDist, 2) * 150;
        const rotateX = adjustedDist * -20;
        const scale = Math.max(0.7, 1.05 - (absDist * 0.35));
        const opacity = Math.max(0, 1 - (absDist * 0.5));
        
        // Direct transform application for max hardware acceleration (skipping CSS var cascade)
        card.style.transform = `translateY(${yOffset}px) translateZ(${zOffset}px) scale(${scale}) rotateX(${rotateX}deg)`;
        card.style.opacity = opacity;
        
        const details = card.querySelector('.profile-details');
        if (details) {
          if (absDist < 0.2) {
            if (!card.classList.contains('is-active')) {
              card.classList.add('is-active');
            }
          } else {
            if (card.classList.contains('is-active')) {
              card.classList.remove('is-active');
            }
          }
        }
      });
    }
    
    // Trigger once on load to set initial state
    window.dispatchEvent(new Event('scroll'));
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
