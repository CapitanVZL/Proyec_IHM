const form = document.getElementById('formTarea');
const tabla = document.getElementById('tablaTareas');
const historial = document.getElementById('historial');

form.addEventListener('submit', function (e) {
    e.preventDefault();
    const inputs = form.querySelectorAll('input');
    const area = inputs[0].value;
    const desc = inputs[1].value;
    const fecha = inputs[2].value;
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${fecha}</td>
      <td>${area}</td>
      <td>${desc}</td>
      <td><span class="badge bg-warning text-dark">Pendiente</span></td>
      <td><button class="btn btn-sm btn-outline-success marcar">✔️ Realizada</button></td>
    `;
    tabla.appendChild(fila);
    form.reset();
});

tabla.addEventListener('click', function (e) {
    if (e.target.classList.contains('marcar')) {
        const row = e.target.closest('tr');
        const area = row.children[1].innerText;
        const desc = row.children[2].innerText;
        const fecha = row.children[0].innerText;
        const item = document.createElement('li');
        item.className = 'list-group-item realizada';
        item.textContent = `${fecha} - ${area} - ${desc}`;
        historial.appendChild(item);
        row.remove();
    }
});

function logout() {
    window.location.href = "../inicio/inicio.html";
}
