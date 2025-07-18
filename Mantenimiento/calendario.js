// Variables globales para el calendario
let currentDate = new Date();
const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

// Función para cargar tareas desde localStorage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('mantenimientoTasks')) || [];
    return tasks;
}

// Función para obtener tareas de un día específico
function getTasksForDate(date) {
    const tasks = loadTasks();
    const dateStr = date.toISOString().split('T')[0];
    return tasks.filter(task => {
        if (task.fechaLimite === dateStr) {
            return true;
        }
        if (task.tipo === 'programada' && task.frecuencia) {
            const taskDate = new Date(task.fechaLimite);
            const diffTime = Math.abs(date - taskDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            switch (task.frecuencia) {
                case 'diaria':
                    return diffDays % 1 === 0;
                case 'semanal':
                    return diffDays % 7 === 0;
                case 'mensual':
                    return date.getDate() === taskDate.getDate();
                case 'anual':
                    return date.getDate() === taskDate.getDate() && date.getMonth() === taskDate.getMonth();
            }
        }
        return false;
    });
}

// Función para generar el calendario
function generateCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    document.getElementById('monthYear').textContent = `${monthNames[month]} ${year}`;
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    let startDay = firstDay.getDay();
    startDay = startDay === 0 ? 6 : startDay - 1;
    const calendarBody = document.getElementById('calendarBody');
    calendarBody.innerHTML = '';
    let date = 1;
    const today = new Date();
    for (let i = 0; i < 6; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < 7; j++) {
            const cell = document.createElement('td');
            if (i === 0 && j < startDay) {
                const prevMonth = new Date(year, month - 1, 0);
                const prevDate = prevMonth.getDate() - (startDay - j - 1);
                cell.innerHTML = `<div class="day-number">${prevDate}</div><div class="task-container"></div>`;
                cell.classList.add('other-month');
            } else if (date > daysInMonth) {
                const nextDate = date - daysInMonth;
                cell.innerHTML = `<div class="day-number">${nextDate}</div><div class="task-container"></div>`;
                cell.classList.add('other-month');
                date++;
            } else {
                const currentCellDate = new Date(year, month, date);
                if (currentCellDate.toDateString() === today.toDateString()) {
                    cell.classList.add('today');
                }
                let cellContent = `<div class="day-number">${date}</div>`;
                let taskContainer = '<div class="task-container">';
                const dayTasks = getTasksForDate(currentCellDate);
                dayTasks.forEach(task => {
                    const taskClass = task.prioridad || 'programada';
                    const taskElement = `<div class="task ${taskClass}" title="${task.descripcion || task.titulo}">${task.titulo}</div>`;
                    taskContainer += taskElement;
                });
                taskContainer += '</div>';
                cellContent += taskContainer;
                cell.innerHTML = cellContent;
                date++;
            }
            row.appendChild(cell);
        }
        calendarBody.appendChild(row);
        if (date > daysInMonth) {
            break;
        }
    }
}

function previousMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    generateCalendar();
}

function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    generateCalendar();
}

function logout() {
    if (confirm("¿Estás seguro de que deseas cerrar la sesión?")) {
        localStorage.clear();
        window.location.href = "../inicio/inicio.html";
    }
}

function updateCalendar() {
    generateCalendar();
}

window.addEventListener('storage', function(e) {
    if (e.key === 'mantenimientoTasks') {
        updateCalendar();
    }
});

document.addEventListener('DOMContentLoaded', function() {
    generateCalendar();
    setInterval(updateCalendar, 60000);
});
