import Cliente from "./cliente.js";
let erroes = 0
document.getElementById("login-form").addEventListener("submit", function (evento) {
    evento.preventDefault();

    // 1. Lee lo que el usuario escribió
    const usuario = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // 2. Trae los clientes guardados 
    const clientesGuardados = JSON.parse(localStorage.getItem("clientes",)) || [];

    // 3. Busca uno cuyo nombreUsuario Y contraseña coincidan
    const clienteEncontrado = clientesGuardados.find(function (cliente) {
        return cliente.nombreUsuario === usuario && cliente.contraseña === password;
    });

    // 4. Según si lo encontró o no, decide qué hacer
    if (clienteEncontrado) {
    window.location.href = "panel.html";
} else {
    erroes++;
    document.getElementById("login-message").hidden = false;

    document.getElementById("attempts-indicator").hidden = false;
    document.getElementById("attempts-count").textContent = erroes;

    if (erroes >= 3) {
        document.getElementById("login-message").textContent = "Cuenta bloqueada por exceso de intentos.";
        document.getElementById("username").disabled = true;
        document.getElementById("password").disabled = true;
    }
}
});