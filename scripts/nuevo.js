async function crearCuenta() {
  const res = await fetch("/nuevo");
  const data = await res.json();

  document.getElementById("site").textContent = data.site_id;
  document.getElementById("token").textContent = data.admin_token;
  document.getElementById("script").textContent = data.instruccion;
  document.getElementById("linkDashboard").href = `#dashboard?site=${data.site_id}&token=${data.admin_token}`;

  document.getElementById("resultado").style.display = "block";
}

// Inicialización de eventos para el formulario de crear cuenta
window.initNuevo = function() {
  const btn = document.getElementById("btnCrearCuenta");
  if (btn) {
    btn.onclick = crearCuenta;
  }
  // Aquí puedes agregar más inicializaciones si necesitas
};