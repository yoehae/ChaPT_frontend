/**
 * Cha Physical Therapy - Treatment Page JavaScript
 * =================================================
 *
 * This file handles functionality specific to individual treatment pages.
 * Includes FAQ accordion toggle behavior.
 *
 * USAGE:
 * Include this script on individual treatment pages after the main script.js
 */

(function () {
  "use strict";

  // ==========================================
  // FAQ Accordion for Treatment Pages
  // ==========================================
  /**
   * Initializes FAQ accordion functionality for treatment pages.
   * Uses .faq-question buttons with .faq-item containers.
   */
  document.querySelectorAll(".faq-question").forEach((button) => {
    button.addEventListener("click", () => {
      const expanded = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", !expanded);
      button.parentElement.classList.toggle("active");
    });
  });
})();
