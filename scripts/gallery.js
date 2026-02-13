/**
 * Cha Physical Therapy - Gallery Carousel
 * =======================================
 *
 * Simple image carousel/gallery component.
 * Used on interior pages like "Our Space" to showcase clinic images.
 *
 * USAGE:
 * Include this script after the main script.js file.
 * Requires the following HTML structure:
 *
 * <div class="gallery-carousel">
 *   <div class="gallery-track">
 *     <div class="gallery-slide">...</div>
 *     <div class="gallery-slide">...</div>
 *   </div>
 *   <div class="gallery-controls">
 *     <button class="gallery-btn gallery-prev">...</button>
 *     <div class="gallery-dots"></div>
 *     <button class="gallery-btn gallery-next">...</button>
 *   </div>
 * </div>
 */

(function () {
  "use strict";

  // ==========================================
  // Gallery Carousel
  // ==========================================
  const carousel = document.querySelector(".gallery-carousel");

  if (!carousel) return;

  const track = carousel.querySelector(".gallery-track");
  const slides = carousel.querySelectorAll(".gallery-slide");
  const prevBtn = carousel.querySelector(".gallery-prev");
  const nextBtn = carousel.querySelector(".gallery-next");
  const dotsContainer = carousel.querySelector(".gallery-dots");

  if (!track || slides.length === 0) return;

  let currentIndex = 0;
  const totalSlides = slides.length;

  /**
   * Creates navigation dots based on number of slides.
   */
  function createDots() {
    if (!dotsContainer) return;

    dotsContainer.innerHTML = "";
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement("button");
      dot.className = "gallery-dot" + (i === 0 ? " active" : "");
      dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
      dot.addEventListener("click", () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }
  }

  /**
   * Updates the active dot indicator.
   */
  function updateDots() {
    if (!dotsContainer) return;

    const dots = dotsContainer.querySelectorAll(".gallery-dot");
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentIndex);
    });
  }

  /**
   * Moves the carousel to a specific slide.
   * @param {number} index - The slide index to navigate to
   */
  function goToSlide(index) {
    if (index < 0) {
      currentIndex = totalSlides - 1;
    } else if (index >= totalSlides) {
      currentIndex = 0;
    } else {
      currentIndex = index;
    }

    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    updateDots();
  }

  /**
   * Advances to the next slide.
   */
  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  /**
   * Goes back to the previous slide.
   */
  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  // Initialize dots
  createDots();

  // Event listeners for navigation buttons
  if (prevBtn) {
    prevBtn.addEventListener("click", prevSlide);
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", nextSlide);
  }

  // Keyboard navigation
  carousel.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      prevSlide();
    } else if (e.key === "ArrowRight") {
      nextSlide();
    }
  });

  // Touch/swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
    },
    { passive: true }
  );

  track.addEventListener(
    "touchend",
    (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    },
    { passive: true }
  );

  /**
   * Handles swipe gestures on touch devices.
   */
  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  }

  // Auto-advance (optional - uncomment to enable)
  // let autoplayInterval;
  // function startAutoplay() {
  //   autoplayInterval = setInterval(nextSlide, 5000);
  // }
  // function stopAutoplay() {
  //   clearInterval(autoplayInterval);
  // }
  // startAutoplay();
  // carousel.addEventListener('mouseenter', stopAutoplay);
  // carousel.addEventListener('mouseleave', startAutoplay);
})();
