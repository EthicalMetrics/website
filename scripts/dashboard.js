// Declaramos el objeto charts al inicio para almacenar todas las instancias de gráficos
let charts = {};

window.initDashboard = function() {
  console.log("initDashboard called - Inicializando dashboard");

  // Obtenemos los parámetros de la URL (están después del hash #dashboard?)
  const hash = window.location.hash;
  const queryString = hash.includes('?') ? hash.split('?')[1] : '';
  const urlParams = new URLSearchParams(queryString);
  
  // Extraemos los parámetros necesarios
  const site = urlParams.get("site");
  const token = urlParams.get("token");

  // Validación básica de parámetros
  if (!site || !token) {
    document.getElementById("main").innerHTML = `
      <div class="error-container">
        <h2>🔒 Acceso denegado</h2>
        <p>Asegúrate de que la URL incluya los parámetros site y token correctos después de #dashboard.</p>
        <p>Ejemplo: #dashboard?site=TU_SITIO&token=TU_TOKEN</p>
      </div>
    `;
    return;
  }

  // Carga los datos desde tu backend Go
  fetch(`https://ethicalmetrics.onrender.com/stats?site=${site}&token=${token}`)
    .then(res => {
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
      return res.json();
    })
    .then(data => {
      console.log("Datos recibidos de la API:", data);

      // Actualizar el título del dashboard con el nombre del sitio
      if (data.site_name) {
        const h1 = document.querySelector('.dashboard-title h1');
        if (h1) {
          h1.textContent = data.site_name;
          h1.title = `Dashboard de ${data.site_name}`;
        }
      }

      // Procesamos los datos para asegurarnos que son arrays válidos
      const porModulo = Array.isArray(data.por_modulo) ? data.por_modulo : [];
      const porDia = Array.isArray(data.por_dia) ? data.por_dia : [];
      const navegadores = Array.isArray(data.navegadores) ? data.navegadores : [];
      const referencias = Array.isArray(data.referencias) ? data.referencias : [];
      const paginas = Array.isArray(data.paginas) ? data.paginas : [];
      const duracionMedia = data.duracion_media || 0;
      const browserLangs = Array.isArray(data.browser_langs) ? data.browser_langs : [];
      const osArr = Array.isArray(data.os) ? data.os : [];
      const cities = Array.isArray(data.cities) ? data.cities : [];
      const dispositivos = Array.isArray(data.dispositivos) ? data.dispositivos : [];
      const paises = Array.isArray(data.paises) ? data.paises : [];
      const usuariosActivos = typeof data.usuarios_activos === "number" ? data.usuarios_activos : 0;
      const weekCompare = Array.isArray(data.week_compare) ? data.week_compare : [];
      const monthCompare = Array.isArray(data.month_compare) ? data.month_compare : [];
      const retention = Array.isArray(data.retention) ? data.retention : [];
      const funnel = Array.isArray(data.funnel) ? data.funnel : [];

      // 1. Gráfico de Módulos (Barras)
      if (document.getElementById("modulosChart")) {
        if (charts.modulosChart) charts.modulosChart.destroy();
        charts.modulosChart = new Chart(document.getElementById("modulosChart"), {
          type: 'bar',
          data: {
            labels: porModulo.map(d => d.modulo),
            datasets: [{
              label: 'Usos por módulo',
              data: porModulo.map(d => d.total),
              backgroundColor: '#3cbf8e'
            }]
          }
        });
      }

      // 2. Gráfico de Visitas por Día (Línea)
      if (document.getElementById("visitasChart")) {
        if (charts.visitasChart) charts.visitasChart.destroy();
        charts.visitasChart = new Chart(document.getElementById("visitasChart"), {
          type: 'line',
          data: {
            labels: porDia.map(d => d.dia),
            datasets: [{
              label: 'Visitas por día',
              data: porDia.map(d => d.total),
              borderColor: '#846bff',
              fill: false
            }]
          }
        });
      }

      // 3. Gráfico de Navegadores (Dona)
      if (document.getElementById("navegadoresChart")) {
        if (charts.navegadoresChart) charts.navegadoresChart.destroy();
        charts.navegadoresChart = new Chart(document.getElementById("navegadoresChart"), {
          type: 'doughnut',
          data: {
            labels: navegadores.map(d => d.navegador),
            datasets: [{
              label: 'Navegadores',
              data: navegadores.map(d => d.total),
              backgroundColor: ['#3cbf8e', '#1a2330', '#f5a623', '#e94e77', '#4a90e2']
            }]
          }
        });
      }

      // 4. Gráfico de Referencias (Tarta)
      if (document.getElementById("referenciasChart")) {
        if (charts.referenciasChart) charts.referenciasChart.destroy();
        charts.referenciasChart = new Chart(document.getElementById("referenciasChart"), {
          type: 'pie',
          data: {
            labels: referencias.map(d => d.referencia),
            datasets: [{
              label: 'Referencias',
              data: referencias.map(d => d.total),
              backgroundColor: ['#3cbf8e', '#1a2330', '#f5a623', '#e94e77', '#4a90e2']
            }]
          }
        });
      }

      // 5. Gráfico de Páginas más visitadas (Barras)
      if (document.getElementById("paginasChart")) {
        if (charts.paginasChart) charts.paginasChart.destroy();
        charts.paginasChart = new Chart(document.getElementById("paginasChart"), {
          type: 'bar',
          data: {
            labels: paginas.map(d => d.pagina),
            datasets: [{
              label: 'Páginas más vistas',
              data: paginas.map(d => d.total),
              backgroundColor: '#4a90e2'
            }]
          }
        });
      }

      // 6. Duración media de sesión
      const duracionDiv = document.getElementById("duracionMedia");
      if (duracionDiv) {
        const segundos = Math.round(duracionMedia / 1000);
        duracionDiv.textContent = segundos + 's';
      }

      // 7. Gráfico de Dispositivos
      if (document.getElementById("dispositivosChart")) {
        if (charts.dispositivosChart) charts.dispositivosChart.destroy();
        charts.dispositivosChart = new Chart(document.getElementById("dispositivosChart"), {
          type: 'doughnut',
          data: {
            labels: dispositivos.map(d => d.dispositivo),
            datasets: [{
              label: 'Dispositivos',
              data: dispositivos.map(d => d.total),
              backgroundColor: ['#3cbf8e', '#1a2330', '#f5a623']
            }]
          }
        });
      }

      // 8. Gráfico de Países
      if (document.getElementById("paisesChart")) {
        if (charts.paisesChart) charts.paisesChart.destroy();
        charts.paisesChart = new Chart(document.getElementById("paisesChart"), {
          type: 'pie',
          data: {
            labels: paises.map(d => d.pais),
            datasets: [{
              label: 'Países',
              data: paises.map(d => d.total),
              backgroundColor: ['#4a90e2', '#3cbf8e', '#f5a623', '#e94e77', '#1a2330']
            }]
          }
        });
      }

      // 9. Usuarios activos
      const usuariosActivosDiv = document.getElementById("usuariosActivos");
      if (usuariosActivosDiv) {
        usuariosActivosDiv.textContent = usuariosActivos;
      }

      // 10. Gráfico de Idiomas
      if (document.getElementById("browserLangChart")) {
        if (charts.browserLangChart) charts.browserLangChart.destroy();
        charts.browserLangChart = new Chart(document.getElementById("browserLangChart"), {
          type: 'pie',
          data: {
            labels: browserLangs.map(d => d.lang),
            datasets: [{
              label: 'Idiomas',
              data: browserLangs.map(d => d.total),
              backgroundColor: ['#3cbf8e', '#1a2330', '#f5a623', '#e94e77', '#4a90e2']
            }]
          }
        });
      }

      // 11. Gráfico de Sistemas Operativos
      if (document.getElementById("osChart")) {
        if (charts.osChart) charts.osChart.destroy();
        charts.osChart = new Chart(document.getElementById("osChart"), {
          type: 'doughnut',
          data: {
            labels: osArr.map(d => d.os),
            datasets: [{
              label: 'Sistemas operativos',
              data: osArr.map(d => d.total),
              backgroundColor: ['#4a90e2', '#3cbf8e', '#f5a623', '#e94e77', '#1a2330']
            }]
          }
        });
      }

      // 12. Gráfico de Ciudades
      if (document.getElementById("cityChart")) {
        if (charts.cityChart) charts.cityChart.destroy();
        charts.cityChart = new Chart(document.getElementById("cityChart"), {
          type: 'bar',
          data: {
            labels: cities.map(d => d.city),
            datasets: [{
              label: 'Ciudades',
              data: cities.map(d => d.total),
              backgroundColor: '#846bff'
            }]
          }
        });
      }

      // 13. Comparativa semanal
      if (Array.isArray(data.week_compare) && document.getElementById("weekCompareChart")) {
        if (charts.weekCompareChart) charts.weekCompareChart.destroy();
        charts.weekCompareChart = new Chart(document.getElementById("weekCompareChart"), {
          type: 'line',
          data: {
            labels: data.week_compare.map(d => d.label),
            datasets: [
              { label: 'Semana actual', data: data.week_compare.map(d => d.current), borderColor: '#3cbf8e', fill: false },
              { label: 'Semana pasada', data: data.week_compare.map(d => d.previous), borderColor: '#e94e77', fill: false }
            ]
          }
        });
      }

      // 14. Comparativa mensual
      if (Array.isArray(data.month_compare) && document.getElementById("monthCompareChart")) {
        if (charts.monthCompareChart) charts.monthCompareChart.destroy();
        charts.monthCompareChart = new Chart(document.getElementById("monthCompareChart"), {
          type: 'line',
          data: {
            labels: data.month_compare.map(d => d.label),
            datasets: [
              { label: 'Mes actual', data: data.month_compare.map(d => d.current), borderColor: '#4a90e2', fill: false },
              { label: 'Mes pasado', data: data.month_compare.map(d => d.previous), borderColor: '#f5a623', fill: false }
            ]
          }
        });
      }

      // 15. Retención
      if (Array.isArray(data.retention) && document.getElementById("retentionChart")) {
        if (charts.retentionChart) charts.retentionChart.destroy();
        charts.retentionChart = new Chart(document.getElementById("retentionChart"), {
          type: 'bar',
          data: {
            labels: data.retention.map(d => d.label),
            datasets: [{
              label: 'Retención (%)',
              data: data.retention.map(d => d.value),
              backgroundColor: '#846bff'
            }]
          }
        });
      }

      // 16. Funnel
      if (Array.isArray(data.funnel) && document.getElementById("funnelChart")) {
        if (charts.funnelChart) charts.funnelChart.destroy();
        charts.funnelChart = new Chart(document.getElementById("funnelChart"), {
          type: 'bar',
          data: {
            labels: data.funnel.map(d => d.step),
            datasets: [{
              label: 'Usuarios',
              data: data.funnel.map(d => d.value),
              backgroundColor: '#3cbf8e'
            }]
          }
        });
      }

    })
    .catch(error => {
      console.error("Error al cargar el dashboard:", error);
      document.getElementById("main").innerHTML = `
        <div class="error-container">
          <h2>❌ Error al cargar los datos</h2>
          <p>${error.message}</p>
          <button onclick="window.location.reload()">Reintentar</button>
        </div>
      `;
    });
};