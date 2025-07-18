document.addEventListener('DOMContentLoaded', () => {
    // Lógica para mostrar controles de admin
    const rol = localStorage.getItem('rol');
    const adminControls = document.getElementById('admin-controls');
    if (rol === 'admin') {
        adminControls.style.display = 'block';
    }

    // Funcionalidad del modal para crear avisos
    const modalElement = document.getElementById('modal-nuevo-aviso');
    const modal = new bootstrap.Modal(modalElement);
    const btnPublicar = document.getElementById('btn-publicar-aviso');
    const avisosContainer = document.getElementById('avisos-container');
    const formAviso = document.getElementById('form-nuevo-aviso');

    btnPublicar.addEventListener('click', () => {
        const titulo = document.getElementById('aviso-titulo').value;
        const contenido = document.getElementById('aviso-contenido').value;
        if (!titulo || !contenido) {
            alert('Por favor, completa todos los campos.');
            return;
        }
        const nuevoAvisoHTML = `
            <div class="card card-reducida mx-auto mb-3">
                <div class="card-body">
                    <h5 class="card-title">${titulo}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">Publicado: Ahora | <span class="badge bg-primary">Nuevo</span></h6>
                    <p class="card-text">${contenido.replace(/\n/g, '<br>')}</p>
                </div>
            </div>
        `;
        avisosContainer.insertAdjacentHTML('afterbegin', nuevoAvisoHTML);
        formAviso.reset();
        modal.hide();
    });
});

function logout() {
    if (confirm("¿Estás seguro de que deseas cerrar la sesión?")) {
        localStorage.clear();
        window.location.href = "../inicio/inicio.html";
    }
}
