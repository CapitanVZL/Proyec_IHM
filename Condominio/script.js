// Sidebar desplegable
const menu = document.getElementById('menu');
const sidebar = document.getElementById('sidebar');

menu.addEventListener('click', () => {

  sidebar.classList.toggle('menu-toggle');
  menu.classList.toggle('menu-toggle')
});


// Funcion para el cierre de sesion
function logout() {
  localStorage.clear();
  window.location.href = "/inicio/inicio.html"; 
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

// Diferenciar entre el las funciones de los diferentes roles

// 1.Mantenimiento --> admin --> operador
document.getElementById("btn-mantenimiento").addEventListener("click", function () {
  const rol = localStorage.getItem("rol"); // "admin" o "operador"

  if (rol === "admin") {
    window.location.href = "/Admin/mantenimiento.html";
  } else if (rol === "operador") {
    window.location.href = "/operador/mantenimiento.html";
  } else {
    alert("Rol no definido. Por favor inicia sesión.");
  }
});

// 2.Pago --> admin --> propietario

document.getElementById("btn-pago").addEventListener("click", function () {
  const rol = localStorage.getItem("rol"); // "admin" o "propietario"

  if (rol === "admin") {
    window.location.href = "/Admin/pagos.html";
  } else if (rol === "propietario") {
    window.location.href = "/propietario/pagos.html";
  } else {
    alert("Rol no definido. Por favor inicia sesión.");
  }
});

// 3.Propietarios -->admin -->propietario

document.getElementById("btn-propietarios").addEventListener("click", function () {
  const rol = localStorage.getItem("rol"); // "admin" o "propietario"

  if (rol === "admin") {
    window.location.href = "/Admin/propietario.html";
  } else if (rol === "propietario") {
    window.location.href = "/propietario/propietario.html";
  } else {
    alert("Rol no definido. Por favor inicia sesión.");
  }
});

// 4.calendario -->admin -->propietario --> operador
document.getElementById("btn-calendario").addEventListener("click", function () {
  const rol = localStorage.getItem("rol");

  if (rol === "admin") {
    window.location.href = "/Admin/calendario.html";
  } else if (rol === "propietario") {
    window.location.href = "/propietario/calendario.html";
  } else if(rol === "operador"){
    window.location.href="/operador/calendario.html"
    
  }else{
    alert("Rol no definido. Por favor inicia sesión.");
  }
});


// 5.avisos -->admin -->propietario --> operador
document.getElementById("btn-avisos").addEventListener("click", function () {
  const rol = localStorage.getItem("rol");

  if (rol === "admin") {
    window.location.href = "/Admin/avisos.html";
  } else if (rol === "propietario") {
    window.location.href = "/propietario/avisos.html";
  } else if(rol === "operador"){
    window.location.href="/operador/avisos.html"
    
  }else{
    Swal.fire({
            icon: 'warning',
            title: 'Rol no definido',
            text: 'Por favor inicia sesión',
            width: '400px',
            confirmButtonText: 'Entendido',
        });
  }
});


//MANEJO DE LOS ROLES EN SIDEBAR

  if (!rol) {
    alert("No has iniciado sesión. Redirigiendo...");
    window.location.href = "/inicio/inicio.html";
  }

  // Redirige rutas según el rol
  if (rol === "admin") {
    document.querySelector("#sidebar-mantenimiento a").href = "/Admin/mantenimiento.html";
    document.querySelector("#sidebar-cuentas a").href = "/Admin/EstadoCuenta.html";
    document.querySelector("#sidebar-pagos a").href = "/Admin/pagos.html";
    document.querySelector("#sidebar-avisos a").href = "/Admin/avisos.html";
    document.querySelector("#sidebar-calendario a").href = "/Admin/calendario.html";
    document.querySelector("#sidebar-propietarios a").href = "/Admin/propietario.html";
  }

  if (rol === "operador") {
    document.querySelector("#sidebar-mantenimiento a").href = "/Operador/mantenimiento.html";
    document.querySelector("#sidebar-calendario a").href = "/Operador/calendario.html";
    document.querySelector("#sidebar-avisos a").href = "/Operador/avisos.html";

    // // Oculta opciones que el operador no debería ver
    // document.querySelector("#sidebar-pagos").style.display = "none";
    // document.querySelector("#sidebar-cuentas").style.display = "none";
    // document.querySelector("#sidebar-propietarios").style.display = "none";
  }

  if (rol === "propietario") {
    document.querySelector("#sidebar-cuentas a").href = "/Propietario/cuentas.html";
    document.querySelector("#sidebar-pagos a").href = "/Propietario/pagos.html";
    document.querySelector("#sidebar-calendario a").href = "/Propietario/calendario.html";
    document.querySelector("#sidebar-avisos a").href = "/Propietario/avisos.html";
    document.querySelector("#sidebar-propietarios a").href = "/Propietario/propietario.html";
    

    // // Oculta opciones que el propietario no debería ver
    // document.querySelector("#sidebar-mantenimiento").style.display = "none";
    // document.querySelector("#sidebar-propietarios").style.display = "none";
  }