const menu = document.getElementById('menu');
const sidebar = document.getElementById('sidebar');

menu.addEventListener('click', () => {

    sidebar.classList.toggle('menu-toggle');
    menu.classList.toggle('menu-toggle')
});

// Funcion para el cierre de sesion
function logout() {
    localStorage.clear();
    window.location.href = "/inicio/inicio.html"; // Cambia por la ruta de tu pantalla de inicio/login
}


// Funcion para Mostrar vistas segun el rol
const rol = localStorage.getItem('rol');

  // Ocultar todo primero
  const elementos = {
    'admin': [],
    'propietario': ['sidebar-mantenimiento', 'card-mantenimiento'],
    'operador': ['sidebar-pagos', 'sidebar-cuentas', 'sidebar-propietarios', 'card-pagos', 'card-propietarios'],
  };

  if (rol && elementos[rol]) {
    elementos[rol].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });
  }

  // Opcional: personalizar título
  if (rol) {
    const h2 = document.querySelector('main h2');
    if (h2) {
      h2.textContent = `Panel de Control - ${rol.charAt(0).toUpperCase() + rol.slice(1)}`;
    }
  }