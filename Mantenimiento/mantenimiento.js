// Clase para manejar las tareas de mantenimiento
class MantenimientoManager {
    constructor() {
        this.tasks = this.loadTasks();
        this.init();
    }

    // Cargar tareas desde localStorage
    loadTasks() {
        const saved = localStorage.getItem('mantenimientoTasks');
        return saved ? JSON.parse(saved) : [];
    }

    // Guardar tareas en localStorage
    saveTasks() {
        localStorage.setItem('mantenimientoTasks', JSON.stringify(this.tasks));
    }

    // Generar ID único para cada tarea
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Añadir nueva tarea
    addTask(taskData) {
        const newTask = {
            id: this.generateId(),
            titulo: taskData.titulo,
            ubicacion: taskData.ubicacion,
            frecuencia: taskData.frecuencia,
            fechaIncidencia: taskData.fechaIncidencia,
            fechaLimite: taskData.fechaAsignada, // Para compatibilidad con el calendario
            fechaAsignada: taskData.fechaAsignada,
            prioridad: taskData.prioridad,
            tipo: taskData.tipo,
            descripcion: taskData.descripcion,
            estado: 'pendiente',
            fechaCreacion: new Date().toISOString()
        };

        this.tasks.push(newTask);
        this.saveTasks();
        this.renderTasks();
        this.updateKPIs();
        return newTask;
    }

    // Actualizar estado de una tarea
    updateTaskStatus(taskId, newStatus) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.estado = newStatus;
            this.saveTasks();
            this.renderTasks();
            this.updateKPIs();
        }
    }

    // Eliminar tarea
    deleteTask(taskId) {
        this.tasks = this.tasks.filter(t => t.id !== taskId);
        this.saveTasks();
        this.renderTasks();
        this.updateKPIs();
    }

    // Renderizar tareas en la tabla
    renderTasks(filter = 'todas') {
        const tbody = document.getElementById('task-list-body');
        if (!tbody) return;

        let filteredTasks = this.tasks;
        
        if (filter !== 'todas') {
            filteredTasks = this.tasks.filter(task => {
                switch (filter) {
                    case 'pendientes':
                        return task.estado === 'pendiente';
                    case 'activas':
                        return task.estado === 'activa';
                    case 'completadas':
                        return task.estado === 'completada';
                    default:
                        return true;
                }
            });
        }

        tbody.innerHTML = '';

        filteredTasks.forEach(task => {
            const row = this.createTaskRow(task);
            tbody.appendChild(row);
        });
    }

    // Crear fila de tarea
    createTaskRow(task) {
        const row = document.createElement('tr');
        row.dataset.taskId = task.id;

        const estadoConfig = {
            pendiente: { text: 'Pendiente', class: 'bg-danger' },
            activa: { text: 'Activa', class: 'bg-warning text-dark' },
            completada: { text: 'Completada', class: 'bg-success' }
        };

        const estado = estadoConfig[task.estado] || estadoConfig.pendiente;

        row.innerHTML = `
            <td>${task.titulo}</td>
            <td>${task.ubicacion}</td>
            <td>${this.formatFrecuencia(task.frecuencia)}</td>
            <td>${new Date(task.fechaIncidencia).toLocaleDateString('es-ES')}</td>
            <td>${new Date(task.fechaAsignada).toLocaleDateString('es-ES')}</td>
            <td><span class="badge ${estado.class}">${estado.text}</span></td>
            <td>
                <div class="dropdown">
                    <button class="btn btn-sm btn-light" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="fas fa-ellipsis-v"></i>
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end" style="position: fixed; z-index: 1050;">
                        ${task.estado !== 'activa' ? '<li><a class="dropdown-item action-btn" href="#" data-action="activar">Marcar como Activa</a></li>' : ''}
                        ${task.estado !== 'completada' ? '<li><a class="dropdown-item action-btn" href="#" data-action="completar">Marcar como Completada</a></li>' : ''}
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item action-btn text-danger" href="#" data-action="eliminar">Eliminar</a></li>
                    </ul>
                </div>
            </td>
        `;

        return row;
    }

    // Formatear frecuencia para mostrar
    formatFrecuencia(frecuencia) {
        const frecuencias = {
            unica: 'Única',
            semanal: 'Semanal',
            mensual: 'Mensual',
            anual: 'Anual'
        };
        return frecuencias[frecuencia] || 'Única';
    }

    // Actualizar KPIs
    updateKPIs() {
        const activas = this.tasks.filter(t => t.estado === 'activa').length;
        const pendientes = this.tasks.filter(t => t.estado === 'pendiente').length;
        const total = this.tasks.length;

        document.getElementById('kpi-activas').textContent = activas;
        document.getElementById('kpi-pendientes').textContent = pendientes;
        document.getElementById('kpi-total').textContent = total;
    }

    // Inicializar la aplicación
    init() {
        this.renderTasks();
        this.updateKPIs();
        this.setupEventListeners();
    }

    // Configurar event listeners
    setupEventListeners() {
        const modalElement = document.getElementById('modal-agregar-tarea');
        const modal = new bootstrap.Modal(modalElement);
        const btnGuardar = document.getElementById('btn-guardar-tarea');
        const form = document.getElementById('form-add-task');
        const tbody = document.getElementById('task-list-body');

        // Guardar nueva tarea
        btnGuardar.addEventListener('click', () => {
            const taskData = {
                titulo: document.getElementById('task-titulo').value,
                ubicacion: document.getElementById('task-ubicacion').value,
                frecuencia: document.getElementById('task-frecuencia').value,
                fechaIncidencia: document.getElementById('task-fecha-incidencia').value,
                fechaAsignada: document.getElementById('task-fecha-asignada').value,
                prioridad: document.getElementById('task-prioridad').value,
                tipo: document.getElementById('task-tipo').value,
                descripcion: document.getElementById('task-descripcion').value
            };

            const alertaError = document.getElementById('alerta-error-tarea');
            if (!taskData.titulo || !taskData.ubicacion || !taskData.fechaIncidencia || !taskData.fechaAsignada) {
                // Mostrar alerta visual
                alertaError.classList.remove('d-none');
                setTimeout(() => {
                    alertaError.classList.add('d-none');
                }, 3000);
                return;
            } else {
                alertaError.classList.add('d-none');
            }

            this.addTask(taskData);
            form.reset();
            modal.hide();
        });

        // Filtros
        document.getElementById('btnradio1').addEventListener('change', () => this.renderTasks('todas'));
        document.getElementById('btnradio2').addEventListener('change', () => this.renderTasks('pendientes'));
        document.getElementById('btnradio3').addEventListener('change', () => this.renderTasks('activas'));
        document.getElementById('btnradio4').addEventListener('change', () => this.renderTasks('completadas'));

        // Acciones de las tareas
        let tareaAEliminar = null;
        const modalEliminarElement = document.getElementById('modal-confirmar-eliminar');
        const modalEliminar = new bootstrap.Modal(modalEliminarElement);
        const btnConfirmarEliminar = document.getElementById('btn-confirmar-eliminar');
        const modalEliminarBody = modalEliminarElement.querySelector('.modal-body p.fs-5');

        tbody.addEventListener('click', (e) => {
            if (e.target.classList.contains('action-btn')) {
                e.preventDefault();
                const action = e.target.dataset.action;
                const row = e.target.closest('tr');
                const taskId = row.dataset.taskId;
                const taskTitle = row.querySelector('td').textContent;

                switch (action) {
                    case 'activar':
                        this.updateTaskStatus(taskId, 'activa');
                        break;
                    case 'completar':
                        this.updateTaskStatus(taskId, 'completada');
                        break;
                    case 'eliminar':
                        tareaAEliminar = taskId;
                        // Mostrar el nombre de la tarea en el modal
                        if (modalEliminarBody) {
                            modalEliminarBody.textContent = `¿Estás seguro de que deseas eliminar la tarea "${taskTitle}"?`;
                        }
                        modalEliminar.show();
                        break;
                }
            }
        });

        btnConfirmarEliminar.addEventListener('click', () => {
            if (tareaAEliminar) {
                this.deleteTask(tareaAEliminar);
                tareaAEliminar = null;
                modalEliminar.hide();
            }
        });
    }
}

// Inicializar la aplicación cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    new MantenimientoManager();
});

function logout() {
    if (confirm("¿Estás seguro de que deseas cerrar la sesión?")) {
        localStorage.clear();
        window.location.href = "../inicio/inicio.html";
    }
}
