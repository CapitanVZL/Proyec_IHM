const form = document.getElementById("loginForm");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    if (email === "admin@gmail.com" && password === "1234") {
        localStorage.setItem("rol", "admin");
        window.location.href = "/index.html";
    } else if (email === "propietario@gmail.com" && password === "12345") {
        localStorage.setItem("rol", "propietario");
        window.location.href = "/index.html";
    } else if (email === "operador@gmail.com" && password === "4321") {
        localStorage.setItem("rol", "operador");
        window.location.href = "/index.html";
    } else {
        alert("Usuario o contraseña incorrectos");
    }

});