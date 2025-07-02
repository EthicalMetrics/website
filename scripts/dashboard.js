// Declaramos el objeto charts al inicio para almacenar todas las instancias de gráficos
let charts = {};

/**
 * Función principal que inicializa el dashboard
 * Se llama cuando la página está lista para cargar los datos y gráficos
 */
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

  // Mostrar estado de carga
  const mainElement = document.getElementById("main");
  if (mainElement) {
    mainElement.innerHTML = `
      <div class="loading-state">
        <div class="spinner"></div>
        <p>Cargando datos del dashboard...</p>
      </div>
    `;
  }

  // Fetch a la API para obtener los datos
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

      /**********************************************************************
       * SECCIÓN DE GRÁFICOS
       * Cada gráfico sigue el mismo patrón:
       * 1. Obtener el elemento canvas
       * 2. Verificar si existe
       * 3. Destruir la instancia anterior si existe
       * 4. Crear el nuevo gráfico
       **********************************************************************/

      // 1. Gráfico de Módulos (Barras)
      const modulosCanvas = document.getElementById("modulosChart");
      if (modulosCanvas) {
        if (charts.modulosChart) {
          charts.modulosChart.destroy();
        }
        charts.modulosChart = new Chart(modulosCanvas, {
          type: 'bar',
          data: {
            labels: porModulo.map(d => d.modulo || 'Sin nombre'),
            datasets: [{
              label: 'Usos por módulo',
              data: porModulo.map(d => d.total || 0),
              backgroundColor: '#3cbf8e',
              borderColor: '#2a9c7a',
              borderWidth: 1,
              borderRadius: 4
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return `${context.dataset.label}: ${context.raw}`;
                  }
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Cantidad de usos'
                }
              }
            }
          }
        });
      } else {
        console.error("No se encontró el elemento canvas con ID 'modulosChart'");
      }

      // 2. Gráfico de Visitas por Día (Línea)
      const visitasCanvas = document.getElementById("visitasChart");
      if (visitasCanvas) {
        if (charts.visitasChart) {
          charts.visitasChart.destroy();
        }
        charts.visitasChart = new Chart(visitasCanvas, {
          type: 'line',
          data: {
            labels: porDia.map(d => d.dia || 'Sin fecha'),
            datasets: [{
              label: 'Visitas por día',
              data: porDia.map(d => d.total || 0),
              borderColor: '#846bff',
              backgroundColor: 'rgba(132, 107, 255, 0.1)',
              borderWidth: 2,
              tension: 0.1,
              fill: true,
              pointBackgroundColor: '#846bff',
              pointRadius: 4,
              pointHoverRadius: 6
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Visitas'
                }
              }
            }
          }
        });
      } else {
        console.error("No se encontró el elemento canvas con ID 'visitasChart'");
      }

      // 3. Gráfico de Navegadores (Dona)
      const navegadoresCanvas = document.getElementById("navegadoresChart");
      if (navegadoresCanvas) {
        if (charts.navegadoresChart) {
          charts.navegadoresChart.destroy();
        }
        charts.navegadoresChart = new Chart(navegadoresCanvas, {
          type: 'doughnut',
          data: {
            labels: navegadores.map(d => d.navegador || 'Desconocido'),
            datasets: [{
              label: 'Navegadores',
              data: navegadores.map(d => d.total || 0),
              backgroundColor: [
                '#3cbf8e', 
                '#1a2330', 
                '#f5a623', 
                '#e94e77', 
                '#4a90e2',
                '#846bff',
                '#00b4d8'
              ],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'right',
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const label = context.label || '';
                    const value = context.raw || 0;
                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                    const percentage = Math.round((value / total) * 100);
                    return `${label}: ${value} (${percentage}%)`;
                  }
                }
              }
            }
          }
        });
      } else {
        console.error("No se encontró el elemento canvas con ID 'navegadoresChart'");
      }

      // 4. Gráfico de Referencias (Tarta)
      const referenciasCanvas = document.getElementById("referenciasChart");
      if (referenciasCanvas) {
        if (charts.referenciasChart) {
          charts.referenciasChart.destroy();
        }
        charts.referenciasChart = new Chart(referenciasCanvas, {
          type: 'pie',
          data: {
            labels: referencias.map(d => d.referencia || 'Directo'),
            datasets: [{
              label: 'Referencias',
              data: referencias.map(d => d.total || 0),
              backgroundColor: [
                '#3cbf8e', 
                '#1a2330', 
                '#f5a623', 
                '#e94e77', 
                '#4a90e2',
                '#846bff'
              ],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'right',
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const label = context.label || '';
                    const value = context.raw || 0;
                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                    const percentage = Math.round((value / total) * 100);
                    return `${label}: ${value} (${percentage}%)`;
                  }
                }
              }
            }
          }
        });
      } else {
        console.error("No se encontró el elemento canvas con ID 'referenciasChart'");
      }

      // 5. Gráfico de Páginas más visitadas (Barras horizontales)
      const paginasCanvas = document.getElementById("paginasChart");
      if (paginasCanvas) {
        if (charts.paginasChart) {
          charts.paginasChart.destroy();
        }
        charts.paginasChart = new Chart(paginasCanvas, {
          type: 'bar',
          data: {
            labels: paginas.map(d => {
              // Acortar URLs largas para mejor visualización
              const pagina = d.pagina || 'Sin nombre';
              return pagina.length > 30 ? pagina.substring(0, 30) + '...' : pagina;
            }),
            datasets: [{
              label: 'Páginas más vistas',
              data: paginas.map(d => d.total || 0),
              backgroundColor: '#4a90e2',
              borderColor: '#3a7bc8',
              borderWidth: 1,
              borderRadius: 4
            }]
          },
          options: {
            indexAxis: 'y', // Hace el gráfico horizontal
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return `${context.dataset.label}: ${context.raw}`;
                  },
                  afterLabel: function(context) {
                    // Mostrar la URL completa en el tooltip
                    const index = context.dataIndex;
                    return paginas[index]?.pagina || '';
                  }
                }
              }
            },
            scales: {
              x: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Visitas'
                }
              }
            }
          }
        });
      } else {
        console.error("No se encontró el elemento canvas con ID 'paginasChart'");
      }

      // 6. Duración media de sesión (Elemento de texto)
      const duracionDiv = document.getElementById("duracionMedia");
      if (duracionDiv) {
        const segundos = Math.round(duracionMedia / 1000);
        const minutos = Math.floor(segundos / 60);
        const segundosRestantes = segundos % 60;
        
        if (minutos > 0) {
          duracionDiv.textContent = `${minutos}m ${segundosRestantes}s`;
        } else {
          duracionDiv.textContent = `${segundos}s`;
        }
      } else {
        console.error("No se encontró el elemento con ID 'duracionMedia'");
      }

      // 7. Gráfico de Dispositivos (Dona)
      const dispositivosCanvas = document.getElementById("dispositivosChart");
      if (dispositivosCanvas) {
        if (charts.dispositivosChart) {
          charts.dispositivosChart.destroy();
        }
        charts.dispositivosChart = new Chart(dispositivosCanvas, {
          type: 'doughnut',
          data: {
            labels: dispositivos.map(d => d.dispositivo || 'Desconocido'),
            datasets: [{
              label: 'Dispositivos',
              data: dispositivos.map(d => d.total || 0),
              backgroundColor: [
                '#3cbf8e', // Móvil
                '#1a2330', // Escritorio
                '#f5a623'  // Tablet
              ],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'right',
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const label = context.label || '';
                    const value = context.raw || 0;
                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                    const percentage = Math.round((value / total) * 100);
                    return `${label}: ${value} (${percentage}%)`;
                  }
                }
              }
            }
          }
        });
      } else {
        console.error("No se encontró el elemento canvas con ID 'dispositivosChart'");
      }

      // 8. Gráfico de Países (Tarta)
      const paisesCanvas = document.getElementById("paisesChart");
      if (paisesCanvas) {
        if (charts.paisesChart) {
          charts.paisesChart.destroy();
        }
        charts.paisesChart = new Chart(paisesCanvas, {
          type: 'pie',
          data: {
            labels: paises.map(d => d.pais || 'Desconocido'),
            datasets: [{
              label: 'Países',
              data: paises.map(d => d.total || 0),
              backgroundColor: [
                '#4a90e2', 
                '#3cbf8e', 
                '#f5a623', 
                '#e94e77', 
                '#1a2330',
                '#846bff'
              ],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'right',
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const label = context.label || '';
                    const value = context.raw || 0;
                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                    const percentage = Math.round((value / total) * 100);
                    return `${label}: ${value} (${percentage}%)`;
                  }
                }
              }
            }
          }
        });
      } else {
        console.error("No se encontró el elemento canvas con ID 'paisesChart'");
      }

      // 9. Usuarios activos (Elemento de texto)
      const usuariosActivosDiv = document.getElementById("usuariosActivos");
      if (usuariosActivosDiv) {
        usuariosActivosDiv.textContent = usuariosActivos;
      } else {
        console.error("No se encontró el elemento con ID 'usuariosActivos'");
      }

      // 10. Gráfico de Idiomas del navegador (Tarta)
      const browserLangCanvas = document.getElementById("browserLangChart");
      if (browserLangCanvas) {
        if (charts.browserLangChart) {
          charts.browserLangChart.destroy();
        }
        charts.browserLangChart = new Chart(browserLangCanvas, {
          type: 'pie',
          data: {
            labels: browserLangs.map(d => {
              const lang = d.lang || 'Desconocido';
              // Convertir códigos de idioma a nombres legibles
              if (lang === 'es') return 'Español';
              if (lang === 'en') return 'Inglés';
              if (lang === 'pt') return 'Portugués';
              if (lang === 'fr') return 'Francés';
              return lang;
            }),
            datasets: [{
              label: 'Idiomas',
              data: browserLangs.map(d => d.total || 0),
              backgroundColor: [
                '#3cbf8e', 
                '#1a2330', 
                '#f5a623', 
                '#e94e77', 
                '#4a90e2',
                '#846bff'
              ],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'right',
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const label = context.label || '';
                    const value = context.raw || 0;
                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                    const percentage = Math.round((value / total) * 100);
                    return `${label}: ${value} (${percentage}%)`;
                  }
                }
              }
            }
          }
        });
      } else {
        console.error("No se encontró el elemento canvas con ID 'browserLangChart'");
      }

      // 11. Gráfico de Sistemas Operativos (Dona)
      const osCanvas = document.getElementById("osChart");
      if (osCanvas) {
        if (charts.osChart) {
          charts.osChart.destroy();
        }
        charts.osChart = new Chart(osCanvas, {
          type: 'doughnut',
          data: {
            labels: osArr.map(d => {
              const os = d.os || 'Desconocido';
              // Simplificar nombres de SO
              if (os.includes('Windows')) return 'Windows';
              if (os.includes('Mac')) return 'macOS';
              if (os.includes('Linux')) return 'Linux';
              if (os.includes('Android')) return 'Android';
              if (os.includes('iOS')) return 'iOS';
              return os;
            }),
            datasets: [{
              label: 'Sistemas operativos',
              data: osArr.map(d => d.total || 0),
              backgroundColor: [
                '#4a90e2', // Windows
                '#3cbf8e', // macOS
                '#f5a623', // Linux
                '#e94e77', // Android
                '#1a2330'  // iOS
              ],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'right',
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const label = context.label || '';
                    const value = context.raw || 0;
                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                    const percentage = Math.round((value / total) * 100);
                    return `${label}: ${value} (${percentage}%)`;
                  }
                }
              }
            }
          }
        });
      } else {
        console.error("No se encontró el elemento canvas con ID 'osChart'");
      }

      // 12. Gráfico de Ciudades (Barras)
      const cityCanvas = document.getElementById("cityChart");
      if (cityCanvas) {
        if (charts.cityChart) {
          charts.cityChart.destroy();
        }
        charts.cityChart = new Chart(cityCanvas, {
          type: 'bar',
          data: {
            labels: cities.map(d => d.city || 'Desconocida'),
            datasets: [{
              label: 'Ciudades',
              data: cities.map(d => d.total || 0),
              backgroundColor: '#846bff',
              borderColor: '#6a4dff',
              borderWidth: 1,
              borderRadius: 4
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return `${context.dataset.label}: ${context.raw}`;
                  }
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Visitas'
                }
              }
            }
          }
        });
      } else {
        console.error("No se encontró el elemento canvas con ID 'cityChart'");
      }

      // 13. Gráfico de Comparativa Semanal (Línea)
      const weekCompareCanvas = document.getElementById("weekCompareChart");
      if (weekCompareCanvas && weekCompare.length > 0) {
        if (charts.weekCompareChart) {
          charts.weekCompareChart.destroy();
        }
        charts.weekCompareChart = new Chart(weekCompareCanvas, {
          type: 'line',
          data: {
            labels: weekCompare.map(d => d.label || 'Día'),
            datasets: [
              { 
                label: 'Semana actual', 
                data: weekCompare.map(d => d.current || 0),
                borderColor: '#3cbf8e',
                backgroundColor: 'rgba(60, 191, 142, 0.1)',
                borderWidth: 2,
                tension: 0.1,
                fill: true
              },
              { 
                label: 'Semana pasada', 
                data: weekCompare.map(d => d.previous || 0),
                borderColor: '#e94e77',
                backgroundColor: 'rgba(233, 78, 119, 0.1)',
                borderWidth: 2,
                borderDash: [5, 5],
                tension: 0.1,
                fill: true
              }
            ]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const datasetLabel = context.dataset.label || '';
                    const value = context.raw || 0;
                    return `${datasetLabel}: ${value}`;
                  }
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Visitas'
                }
              }
            }
          }
        });
      } else if (!weekCompareCanvas) {
        console.error("No se encontró el elemento canvas con ID 'weekCompareChart'");
      }

      // 14. Gráfico de Comparativa Mensual (Línea)
      const monthCompareCanvas = document.getElementById("monthCompareChart");
      if (monthCompareCanvas && monthCompare.length > 0) {
        if (charts.monthCompareChart) {
          charts.monthCompareChart.destroy();
        }
        charts.monthCompareChart = new Chart(monthCompareCanvas, {
          type: 'line',
          data: {
            labels: monthCompare.map(d => d.label || 'Día'),
            datasets: [
              { 
                label: 'Mes actual', 
                data: monthCompare.map(d => d.current || 0),
                borderColor: '#4a90e2',
                backgroundColor: 'rgba(74, 144, 226, 0.1)',
                borderWidth: 2,
                tension: 0.1,
                fill: true
              },
              { 
                label: 'Mes pasado', 
                data: monthCompare.map(d => d.previous || 0),
                borderColor: '#f5a623',
                backgroundColor: 'rgba(245, 166, 35, 0.1)',
                borderWidth: 2,
                borderDash: [5, 5],
                tension: 0.1,
                fill: true
              }
            ]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const datasetLabel = context.dataset.label || '';
                    const value = context.raw || 0;
                    return `${datasetLabel}: ${value}`;
                  }
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Visitas'
                }
              }
            }
          }
        });
      } else if (!monthCompareCanvas) {
        console.error("No se encontró el elemento canvas con ID 'monthCompareChart'");
      }

      // 15. Gráfico de Retención (Barras)
      const retentionCanvas = document.getElementById("retentionChart");
      if (retentionCanvas && retention.length > 0) {
        if (charts.retentionChart) {
          charts.retentionChart.destroy();
        }
        charts.retentionChart = new Chart(retentionCanvas, {
          type: 'bar',
          data: {
            labels: retention.map(d => d.label || 'Día'),
            datasets: [{
              label: 'Retención (%)',
              data: retention.map(d => d.value || 0),
              backgroundColor: '#846bff',
              borderColor: '#6a4dff',
              borderWidth: 1,
              borderRadius: 4
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return `${context.dataset.label}: ${context.raw}%`;
                  }
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                max: 100,
                title: {
                  display: true,
                  text: 'Porcentaje'
                }
              }
            }
          }
        });
      } else if (!retentionCanvas) {
        console.error("No se encontró el elemento canvas con ID 'retentionChart'");
      }

      // 16. Gráfico de Funnel (Barras)
      const funnelCanvas = document.getElementById("funnelChart");
      if (funnelCanvas && funnel.length > 0) {
        if (charts.funnelChart) {
          charts.funnelChart.destroy();
        }
        charts.funnelChart = new Chart(funnelCanvas, {
          type: 'bar',
          data: {
            labels: funnel.map(d => d.step || 'Paso'),
            datasets: [{
              label: 'Usuarios',
              data: funnel.map(d => d.value || 0),
              backgroundColor: '#3cbf8e',
              borderColor: '#2a9c7a',
              borderWidth: 1,
              borderRadius: 4
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return `${context.dataset.label}: ${context.raw}`;
                  }
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Usuarios'
                }
              }
            }
          }
        });
      } else if (!funnelCanvas) {
        console.error("No se encontró el elemento canvas con ID 'funnelChart'");
      }

      // Ocultar el estado de carga una vez que todo está cargado
      if (mainElement) {
        const loadingElement = mainElement.querySelector('.loading-state');
        if (loadingElement) {
          loadingElement.style.display = 'none';
        }
      }

    })
    .catch(error => {
      console.error("Error al cargar el dashboard:", error);
      
      // Mostrar mensaje de error detallado
      const mainElement = document.getElementById("main");
      if (mainElement) {
        mainElement.innerHTML = `
          <div class="error-container">
            <h2>❌ Error al cargar el dashboard</h2>
            <p>${error.message}</p>
            <p>Por favor, verifica:</p>
            <ul>
              <li>Que la URL incluya los parámetros correctos</li>
              <li>Que el token sea válido</li>
              <li>Que tengas conexión a internet</li>
            </ul>
            <button onclick="window.location.reload()">Reintentar</button>
          </div>
        `;
      }
    });
};