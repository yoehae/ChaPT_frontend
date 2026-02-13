/**
 * Cha Physical Therapy - Main JavaScript
 * ======================================
 *
 * This file handles all interactive functionality for the website.
 * It is designed to be modular and reusable across all pages.
 *
 * MODULES:
 * 1. Header Scroll Behavior - Changes header style on scroll
 * 2. Mobile Navigation - Hamburger menu toggle and overlay
 * 3. Smooth Scrolling - Anchor link smooth scroll with header offset
 * 4. Video Handling - Hero video play/pause based on visibility
 * 5. FAQ Accordion - Animated expand/collapse for FAQ items
 * 6. Form Validation - Client-side validation for insurance form
 * 7. Scroll Animations - Fade-in animations on scroll
 * 8. Lazy Loading - Fallback for browsers without native support
 *
 * USAGE:
 * Include this script at the bottom of the page body.
 * All functionality initializes automatically on DOMContentLoaded.
 */

(function () {
  "use strict";

  // ==========================================
  // DOM Element References
  // ==========================================
  // Cache frequently used DOM elements for performance
  const header = document.querySelector(".site-header");
  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
  const mainNav = document.querySelector(".main-nav");
  const navLinks = document.querySelectorAll(".nav-menu a");
  const navOverlay = document.querySelector(".nav-overlay");
  const heroVideo = document.querySelector(".hero-video");
  const logoImage = header?.querySelector(".logo-image");

  // Logo paths - use absolute paths for consistent loading across all pages
  const logoPathBrown = "/static/images/chaLogo/chaLogo_brown.png";
  const logoPathWhite = "/static/images/chaLogo/chaLogo_white.png";

  // Check if page has no hero section (header should stay in scrolled state)
  const isNoHeroPage = document.body.classList.contains("no-hero");

  // ==========================================
  // 1. Header Scroll Behavior
  // ==========================================
  /**
   * Adds/removes 'scrolled' class to header based on scroll position.
   * Also swaps logo image between white and brown variants.
   * Threshold: 150px from top
   * For pages without hero sections, header always stays in scrolled state.
   */
  function handleHeaderScroll() {
    if (!header) return;

    // For pages without hero, always keep header in scrolled state
    if (isNoHeroPage) {
      header.classList.add("scrolled");
      if (logoImage) {
        logoImage.src = logoPathBrown;
      }
      return;
    }

    const scrollY = window.scrollY || window.pageYOffset;
    const scrollThreshold = 150;

    if (scrollY > scrollThreshold) {
      header.classList.add("scrolled");
      if (logoImage) {
        logoImage.src = logoPathBrown;
      }
    } else {
      header.classList.remove("scrolled");
      if (logoImage) {
        logoImage.src = logoPathWhite;
      }
    }
  }

  /**
   * Throttle function to limit execution frequency.
   * Used for scroll events to improve performance.
   * @param {Function} func - Function to throttle
   * @param {number} limit - Minimum time between calls (ms)
   */
  function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  // Initialize header scroll behavior
  window.addEventListener("scroll", throttle(handleHeaderScroll, 10));
  handleHeaderScroll(); // Check initial state on page load

  // ==========================================
  // 2. Mobile Navigation
  // ==========================================
  /**
   * Toggles mobile menu open/closed state.
   * Manages overlay visibility and body scroll lock.
   */
  function toggleMobileMenu() {
    if (!mainNav || !mobileMenuToggle) return;

    const isOpen = mainNav.classList.toggle("open");
    mobileMenuToggle.setAttribute("aria-expanded", isOpen);

    // Toggle overlay
    if (navOverlay) {
      navOverlay.classList.toggle("active", isOpen);
      navOverlay.setAttribute("aria-hidden", !isOpen);
    }

    // Prevent body scroll when menu is open
    document.body.style.overflow = isOpen ? "hidden" : "";
  }

  /**
   * Closes mobile menu and resets all related states.
   */
  function closeMobileMenu() {
    if (!mainNav || !mobileMenuToggle) return;

    mainNav.classList.remove("open");
    mobileMenuToggle.setAttribute("aria-expanded", "false");

    if (navOverlay) {
      navOverlay.classList.remove("active");
      navOverlay.setAttribute("aria-hidden", "true");
    }

    document.body.style.overflow = "";
  }

  // Mobile menu event listeners
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener("click", toggleMobileMenu);
  }

  if (navOverlay) {
    navOverlay.addEventListener("click", closeMobileMenu);
  }

  // Close menu when clicking nav links or CTA buttons (except dropdown toggles)
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      // Don't close if this is a dropdown toggle on mobile
      const isDropdownToggle = this.parentElement.classList.contains("has-dropdown");
      const isMobile = window.innerWidth <= 900;

      if (!isDropdownToggle || !isMobile) {
        closeMobileMenu();
      }
    });
  });

  document.querySelectorAll(".mobile-nav-ctas a").forEach((btn) => {
    btn.addEventListener("click", closeMobileMenu);
  });

  // Close menu on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mainNav?.classList.contains("open")) {
      closeMobileMenu();
    }
  });

  // ==========================================
  // 2b. Mobile Dropdown Toggle
  // ==========================================
  /**
   * Handles dropdown menu toggle on mobile devices.
   * On mobile, clicking the parent link toggles the dropdown instead of navigating.
   */
  const dropdownToggles = document.querySelectorAll(".has-dropdown > a");

  dropdownToggles.forEach((toggle) => {
    toggle.addEventListener("click", function (e) {
      // Only handle dropdown toggle on mobile (when nav is in mobile mode)
      const isMobile = window.innerWidth <= 900;

      if (isMobile) {
        e.preventDefault();
        const parent = this.parentElement;
        const isOpen = parent.classList.contains("open");

        // Close all other dropdowns
        document.querySelectorAll(".has-dropdown.open").forEach((dropdown) => {
          if (dropdown !== parent) {
            dropdown.classList.remove("open");
          }
        });

        // Toggle current dropdown
        parent.classList.toggle("open", !isOpen);
      }
    });
  });

  // Close dropdowns when clicking outside on mobile
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".has-dropdown")) {
      document.querySelectorAll(".has-dropdown.open").forEach((dropdown) => {
        dropdown.classList.remove("open");
      });
    }
  });

  // ==========================================
  // 3. Smooth Scrolling for Anchor Links
  // ==========================================
  /**
   * Smooth scroll to anchor targets with header offset.
   * Works for all links starting with '#'.
   */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerHeight = header?.offsetHeight || 0;
        const targetPosition =
          targetElement.getBoundingClientRect().top +
          window.pageYOffset -
          headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // ==========================================
  // 4. Video Handling
  // ==========================================
  /**
   * Pauses hero video when not in viewport for performance.
   * Uses IntersectionObserver with 25% visibility threshold.
   */
  if (heroVideo) {
    const videoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            heroVideo.play().catch(() => {});
          } else {
            heroVideo.pause();
          }
        });
      },
      { threshold: 0.25 },
    );

    videoObserver.observe(heroVideo);
  }

  // ==========================================
  // 5. FAQ Accordion Enhancement
  // ==========================================
  /**
   * Initializes animated accordion functionality for <details> elements.
   * Provides smooth height transitions on open/close.
   *
   * HTML Structure Required:
   * <details class="accordion-item">
   *   <summary>Question</summary>
   *   <div class="accordion-content">Answer</div>
   * </details>
   */
  const accordionItems = document.querySelectorAll(".accordion-item");

  accordionItems.forEach((item) => {
    const summary = item.querySelector("summary");
    const content = item.querySelector(".accordion-content");

    if (!summary || !content) return;

    // Set initial height based on open state
    content.style.height = item.open ? content.scrollHeight + "px" : "0";

    summary.addEventListener("click", (e) => {
      e.preventDefault();

      if (item.open) {
        // CLOSING: Animate height to 0, then remove open attribute
        content.style.height = content.scrollHeight + "px";
        content.offsetHeight; // Force reflow
        content.style.height = "0";

        content.addEventListener(
          "transitionend",
          function handler() {
            item.open = false;
            content.removeEventListener("transitionend", handler);
          },
          { once: true },
        );
      } else {
        // OPENING: Set open attribute, then animate height
        item.open = true;
        const targetHeight = content.scrollHeight + "px";
        content.style.height = "0";
        content.offsetHeight; // Force reflow
        content.style.height = targetHeight;

        content.addEventListener(
          "transitionend",
          function handler() {
            content.style.height = "auto"; // Allow dynamic resizing
            content.removeEventListener("transitionend", handler);
          },
          { once: true },
        );
      }
    });
  });

  // ==========================================
  // 6. Form Validation
  // ==========================================
  /**
   * Client-side validation for the insurance check form.
   * Validates phone, email, and provider selection.
   * Shows success/failure message by replacing wrapper innerHTML.
   */
  const insuranceForms = document.querySelectorAll(".insurance-form");

  insuranceForms.forEach((insuranceForm) => {
    insuranceForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const phone = this.querySelector("#phone, [name='phone']");
      const email = this.querySelector("#email, [name='email']");
      const provider = this.querySelector("#insurance-provider, [name='insurance_provider']");
      let isValid = true;

      // Validate phone
      if (!phone.value.trim()) {
        showError(phone, "Please enter your phone number");
        isValid = false;
      } else {
        clearError(phone);
      }

      // Validate email
      if (!email.value.trim() || !isValidEmail(email.value)) {
        showError(email, "Please enter a valid email address");
        isValid = false;
      } else {
        clearError(email);
      }

      // Validate provider selection
      if (!provider.value) {
        showError(provider, "Please select your insurance provider");
        isValid = false;
      } else {
        clearError(provider);
      }

      if (isValid) {
        const wrapper = this.closest(".insurance-form-wrapper");
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn ? submitBtn.textContent : "";

        // Show loading state
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = "Submitting...";
        }

        try {
          // Send data to API
          const response = await fetch("/api/insurance", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              phone: phone.value.trim(),
              email: email.value.trim(),
              provider: provider.value,
            }),
          });

          const data = await response.json();

          if (response.ok && data.success) {
            // Show success/failure message based on insurance acceptance
            if (wrapper) {
              if (data.accepted) {
                showInsuranceSuccess(wrapper);
              } else {
                showInsuranceFailure(wrapper);
              }
            } else {
              showFormSuccess(this);
            }
          } else {
            // Server error - show generic error
            throw new Error(data.error || "Failed to submit form");
          }
        } catch (error) {
          console.error("Insurance form submission error:", error);
          // Reset button and show error
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
          }
          alert("There was an error submitting your request. Please try again or call us directly.");
        }
      }
    });
  });

  // ==========================================
  // 6b. Appointments Form Submission
  // ==========================================
  /**
   * Handles appointment form submission.
   * Sends data to /api/appointments endpoint.
   */
  const appointmentForms = document.querySelectorAll(".appointment-form");

  appointmentForms.forEach((appointmentForm) => {
    appointmentForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const firstName = this.querySelector("[name='first_name']");
      const lastName = this.querySelector("[name='last_name']");
      const email = this.querySelector("[name='email']");
      const phone = this.querySelector("[name='phone']");
      const insuranceProvider = this.querySelector("[name='insurance_provider']");
      const insuranceMemberId = this.querySelector("[name='insurance_member_id']");
      const birthdate = this.querySelector("[name='birthdate']");
      const referralSource = this.querySelector("[name='referral_source']");
      const message = this.querySelector("[name='message']");

      let isValid = true;

      // Validate required fields
      if (!firstName?.value.trim()) {
        showError(firstName, "Please enter your first name");
        isValid = false;
      } else {
        clearError(firstName);
      }

      if (!lastName?.value.trim()) {
        showError(lastName, "Please enter your last name");
        isValid = false;
      } else {
        clearError(lastName);
      }

      if (!email?.value.trim() || !isValidEmail(email.value)) {
        showError(email, "Please enter a valid email address");
        isValid = false;
      } else {
        clearError(email);
      }

      if (!phone?.value.trim()) {
        showError(phone, "Please enter your phone number");
        isValid = false;
      } else {
        clearError(phone);
      }

      if (isValid) {
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn ? submitBtn.textContent : "";

        // Show loading state
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = "Submitting...";
        }

        try {
          // Send data to API
          const response = await fetch("/api/appointments", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              first_name: firstName?.value.trim() || "",
              last_name: lastName?.value.trim() || "",
              email: email?.value.trim() || "",
              phone: phone?.value.trim() || "",
              insurance_provider: insuranceProvider?.value.trim() || "",
              insurance_member_id: insuranceMemberId?.value.trim() || "",
              birthdate: birthdate?.value || "",
              referral_source: referralSource?.value || "",
              message: message?.value.trim() || "",
            }),
          });

          const data = await response.json();

          if (response.ok && data.success) {
            // Show success message
            showAppointmentSuccess(this);
          } else {
            throw new Error(data.error || "Failed to submit form");
          }
        } catch (error) {
          console.error("Appointment form submission error:", error);
          // Reset button and show error
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
          }
          alert("There was an error submitting your request. Please try again or call us directly.");
        }
      }
    });
  });

  /**
   * Shows success message after appointment form submission.
   * @param {HTMLFormElement} form - The submitted form
   */
  function showAppointmentSuccess(form) {
    const wrapper = form.closest(".appointment-form-wrapper") || form.parentElement;

    if (wrapper) {
      wrapper.innerHTML = `
        <div class="appointment-result appointment-success">
          <div class="result-icon success-icon">
            <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M9 12l2 2 4-4"/>
            </svg>
          </div>
          <h2>Request Received!</h2>
          <p>Thank you for reaching out. We've received your appointment request and will contact you within 1-2 business days to confirm your appointment time.</p>
          <a href="/" class="btn btn-primary biggerBtn">Return to Home</a>
        </div>
      `;
    } else {
      // Fallback
      showFormSuccess(form);
    }
  }

  /**
   * Validates email format using regex.
   * @param {string} email - Email address to validate
   * @returns {boolean} True if valid email format
   */
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /**
   * Displays error message below form input.
   * @param {HTMLElement} input - Form input element
   * @param {string} message - Error message to display
   */
  function showError(input, message) {
    const formGroup = input.closest(".form-group");
    let errorEl = formGroup.querySelector(".error-message");

    if (!errorEl) {
      errorEl = document.createElement("span");
      errorEl.className = "error-message";
      errorEl.style.cssText =
        "color: #c00; font-size: 0.85rem; display: block; margin-top: 0.25rem;";
      formGroup.appendChild(errorEl);
    }

    errorEl.textContent = message;
    input.style.borderColor = "#c00";
  }

  /**
   * Removes error message and styling from form input.
   * @param {HTMLElement} input - Form input element
   */
  function clearError(input) {
    const formGroup = input.closest(".form-group");
    const errorEl = formGroup.querySelector(".error-message");

    if (errorEl) {
      errorEl.remove();
    }
    input.style.borderColor = "";
  }

  /**
   * Shows success message when insurance is accepted.
   * Replaces wrapper innerHTML with success content.
   * @param {HTMLElement} wrapper - The form wrapper element
   */
  function showInsuranceSuccess(wrapper) {
    wrapper.innerHTML = `
      <div class="insurance-result insurance-success">
        <div class="result-icon success-icon">
          <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M9 12l2 2 4-4"/>
          </svg>
        </div>
        <h2>Great News!</h2>
        <p>Your insurance is accepted at Cha Physical Therapy. We'll contact you shortly to confirm your coverage details and help you schedule your first appointment.</p>
        <a href="appointments.html" class="btn btn-primary biggerBtn">Book an Appointment</a>
      </div>
    `;
  }

  /**
   * Shows failure message when insurance is not accepted.
   * Replaces wrapper innerHTML with failure content.
   * @param {HTMLElement} wrapper - The form wrapper element
   */
  function showInsuranceFailure(wrapper) {
    wrapper.innerHTML = `
      <div class="insurance-result insurance-failure">
        <h2>We're Sorry</h2>
        <p>Unfortunately, we don't currently accept your insurance provider. However, we offer competitive self-pay rates and can provide documentation for out-of-network reimbursement. Please contact us to discuss your options.</p>
        <div class="result-actions">
          <a href="tel:+12126439326" class="btn btn-primary biggerBtn">Call Us to Discuss Options</a>
        </div>
      </div>
    `;
  }

  /**
   * Shows success state after valid form submission (fallback).
   * Resets form after 3 seconds.
   * @param {HTMLFormElement} form - The submitted form
   */
  function showFormSuccess(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    submitBtn.textContent = "Thank you! We'll be in touch.";
    submitBtn.disabled = true;
    submitBtn.style.backgroundColor = "#6b7b3c";

    setTimeout(() => {
      form.reset();
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      submitBtn.style.backgroundColor = "";
    }, 3000);
  }

  // ==========================================
  // 7. Scroll Animations
  // ==========================================
  /**
   * Initializes fade-in animations for content sections.
   * Uses IntersectionObserver for performance.
   * Respects prefers-reduced-motion setting.
   */
  const animateOnScroll = () => {
    const elements = document.querySelectorAll(
      ".content-section, .feature-card, .blog-card",
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      },
    );

    elements.forEach((el) => observer.observe(el));
  };

  // Inject animation styles dynamically
  const animationStyles = document.createElement("style");
  animationStyles.textContent = `
    .content-section,
    .feature-card,
    .blog-card {
      opacity: 0;
      transform: translateY(30px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }

    .content-section.animate-in,
    .feature-card.animate-in,
    .blog-card.animate-in {
      opacity: 1;
      transform: translateY(0);
    }

    .feature-card:nth-child(2) { transition-delay: 0.1s; }
    .feature-card:nth-child(3) { transition-delay: 0.2s; }
  `;
  document.head.appendChild(animationStyles);

  // Initialize or disable based on user preference
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    animateOnScroll();
  } else {
    document
      .querySelectorAll(".content-section, .feature-card, .blog-card")
      .forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
  }

  // ==========================================
  // 8. Lazy Loading Images (Fallback)
  // ==========================================
  /**
   * Provides lazy loading fallback for browsers
   * that don't support native loading="lazy".
   */
  if ("loading" in HTMLImageElement.prototype) {
    // Browser supports native lazy loading
    document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
      }
    });
  } else {
    // Fallback using IntersectionObserver
    const lazyImageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
          }
          lazyImageObserver.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
      lazyImageObserver.observe(img);
    });
  }
})();
