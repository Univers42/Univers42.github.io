/**
 * UNIVERS42 - MAIN APP LOGIC
 * Navigation drawer, toast notifications, dynamic footer copyright & utilities
 */

(function () {
  // Global Toast function
  let toastTimer = null;
  window.showToast = function (message) {
    const toast = document.getElementById('toast');
    const msgSpan = document.getElementById('toast-msg');
    if (!toast || !msgSpan) return;

    msgSpan.textContent = message;
    toast.classList.add('show');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3600);
  };

  document.addEventListener('DOMContentLoaded', () => {
    // Mobile navigation toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');

    if (mobileMenuBtn && navMenu) {
      mobileMenuBtn.addEventListener('click', () => {
        if (window.playKeyClick) window.playKeyClick('click');
        const isOpen = navMenu.classList.toggle('mobile-open');
        mobileMenuBtn.setAttribute('aria-expanded', isOpen);
        mobileMenuBtn.setAttribute('aria-label', isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
      });

      // Auto close when nav-link clicked
      document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
          navMenu.classList.remove('mobile-open');
          mobileMenuBtn.setAttribute('aria-expanded', 'false');
          mobileMenuBtn.setAttribute('aria-label', 'Abrir menú de navegación');
        });
      });
    }

    // Dynamic copyright year in footer
    const copyrightYear = document.getElementById('copyright-year');
    if (copyrightYear) {
      const year = new Date().getFullYear();
      copyrightYear.textContent = year > 2025 ? `2025\u2013${year}` : '2025';
    }

    // Console easter egg
    console.log(
      "%c UNIVERS42 %c Ecosistema Open Source de Escuela 42 \n%c192+ repositorios forjados en C, Rust, Shell y WASM. 0 Memory Leaks.",
      "background: #00f2fe; color: #02050e; font-weight: bold; padding: 4px 8px; border-radius: 4px;",
      "background: #0d1a3d; color: #38bdf8; padding: 4px 8px;",
      "color: #94a3b8; font-size: 11px; margin-top: 4px;"
    );
  });
})();
