document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.querySelector('.nav-toggle');
    const enlaces = document.querySelector('.nav-enlaces');
    if (toggle && enlaces) {
      toggle.addEventListener('click', function() {
        const expanded = enlaces.classList.toggle('open');
        toggle.setAttribute('aria-expanded', expanded);
      });
      // Opcional: cerrar menú al hacer click fuera
      document.addEventListener('click', function(e) {
        if (!toggle.contains(e.target) && !enlaces.contains(e.target)) {
          enlaces.classList.remove('open');
          toggle.setAttribute('aria-expanded', false);
        }
      });
    }
  });