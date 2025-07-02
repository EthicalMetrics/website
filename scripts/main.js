// scripts/main.js
async function loadComponent(id, url) {
  const res = await fetch(url);
  const html = await res.text();
  document.getElementById(id).innerHTML = html;

  if (window.initGlobalDesign) {
    window.initGlobalDesign();
  }
  if (window.initNuevo) {
    window.initNuevo();
  }
}

function loadDashboard() {
  return loadComponent('main', 'https://cdn.jsdelivr.net/gh/EthicalMetrics/website@latest/components/dashboard.html')
    .then(() => {
      // Reemplaza el CSS
      let css = document.querySelector('link[href*="nuevo.css"]');
      if (css) {
        css.href = "https://cdn.jsdelivr.net/gh/EthicalMetrics/website@latest/styles/dashboard.css";
      } else {
        const link = document.createElement('link');
        link.rel = "stylesheet";
        link.href = "https://cdn.jsdelivr.net/gh/EthicalMetrics/website@latest/styles/dashboard.css";
        document.head.appendChild(link);
      }

      // Elimina el script de nuevo.js si existe
      document.querySelectorAll('script[src*="nuevo.js"]').forEach(s => s.remove());

      // Carga dashboard.js y espera a que esté listo
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = "https://cdn.jsdelivr.net/gh/EthicalMetrics/website@latest/scripts/dashboard.js";
        script.defer = true;
        
        script.onload = () => {
          if (window.initDashboard) {
            window.initDashboard();
          }
          resolve();
        };
        
        document.body.appendChild(script);
      });
    });
}

function getPageName() {
  let page = location.hash.replace("#", "").split("?")[0] || "index";
  return page;
}

function navigateTo(page) {
  // Evita recargar si ya está en la página actual
  let currentPage = getPageName();
  if (currentPage === page) return;

  // Soporte explícito para pricing.html
  if (page === "pricing") {
    loadComponent('main', 'https://cdn.jsdelivr.net/gh/EthicalMetrics/website@latest/components/pricing.html');
  } else if (page === "dashboard") {
    loadDashboard();
  } else {
    loadComponent('main', `https://cdn.jsdelivr.net/gh/EthicalMetrics/website@latest/components/${page}.html`);
  }
  history.pushState({}, "", `#${page}`);
}

// Carga header y footer desde jsDelivr
loadComponent('header', 'https://cdn.jsdelivr.net/gh/EthicalMetrics/website@latest/components/nav.html').then(() => {
  document.querySelectorAll('[data-link]').forEach(link => {
    link.addEventListener('click', e => {
      // Solo intercepta enlaces internos
      if (link.dataset.link && !link.href.startsWith('http')) {
        e.preventDefault();
        navigateTo(link.dataset.link);
      }
    });
  });
});
loadComponent('footer', 'https://cdn.jsdelivr.net/gh/EthicalMetrics/website@latest/components/footer.html');

// Página inicial
let page = getPageName();
if (page === "pricing") {
  loadComponent('main', 'https://cdn.jsdelivr.net/gh/EthicalMetrics/website@latest/components/pricing.html');
} else if (page === "dashboard") {
  loadDashboard();
} else {
  loadComponent('main', `https://cdn.jsdelivr.net/gh/EthicalMetrics/website@latest/components/${page}.html`);
}

window.addEventListener("popstate", () => {
  let page = getPageName();
  if (page === "pricing") {
    loadComponent('main', 'https://cdn.jsdelivr.net/gh/EthicalMetrics/website@latest/components/pricing.html');
  } else if (page === "dashboard") {
    loadDashboard();
  } else {
    loadComponent('main', `https://cdn.jsdelivr.net/gh/EthicalMetrics/website@latest/components/${page}.html`);
  }
});

function loadSection(section) {
  const main = document.getElementById('main');
  main.style.opacity = 0;
  setTimeout(() => {
    main.innerHTML = getSectionHtml(section);
    if (typeof initEffects === 'function') {
      initEffects();
    }
    main.style.opacity = 1;
  }, 300);
}