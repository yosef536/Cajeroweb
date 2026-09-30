let intervaloConteo = null;

function iniciarConteoRegresivo(bloqueadoHasta) {
    clearInterval(intervaloConteo); // por si ya había uno corriendo, lo mata primero

    intervaloConteo = setInterval(function () {
        const segundosRestantes = Math.ceil((bloqueadoHasta - Date.now()) / 1000);

        if (segundosRestantes <= 0) {
            clearInterval(intervaloConteo);
            document.getElementById("login-message").hidden = true;
        } else {
            document.getElementById("login-message").textContent = `Cuenta bloqueada. Espera ${segundosRestantes} segundos.`;
        }
    }, 1000);
}

document.getElementById("login-form").addEventListener("submit", function (evento) {
    evento.preventDefault();

    const usuario = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // 1. Traer el registro de intentos 
    const intentosLogin = JSON.parse(localStorage.getItem("intentosLogin")) || {};

    // 2. Ver si tiene un bloqueo activo
    const registroUsuario = intentosLogin[usuario];

    if (registroUsuario && registroUsuario.bloqueadoHasta && Date.now() < registroUsuario.bloqueadoHasta) {
        iniciarConteoRegresivo(registroUsuario.bloqueadoHasta);
        const segundosRestantes = Math.ceil((registroUsuario.bloqueadoHasta - Date.now()) / 1000);
        document.getElementById("login-message").hidden = false;
        document.getElementById("login-message").textContent = `Cuenta bloqueada. Espera ${segundosRestantes} segundos.`;
        return; // corta aquí, ni siquiera revisa la contraseña
    }

    // 3. Buscar el cliente (esto ya lo sabes hacer)
    const clientesGuardados = JSON.parse(localStorage.getItem("clientes")) || [];
    const clienteEncontrado = clientesGuardados.find(function (cliente) {
        return cliente.nombreUsuario === usuario && cliente.contraseña === password;
    });


    if (clienteEncontrado) {
        delete intentosLogin[usuario]; // limpia el historial de fallos al entrar bien
        localStorage.setItem("intentosLogin", JSON.stringify(intentosLogin));
        localStorage.setItem("usuarioActivo", usuario);
        window.location.href = "panel.html";
    } else {
        // 4. Sumar un fallo A ESTE usuario específico
        const intentosPrevios = registroUsuario ? registroUsuario.intentos : 0;
        const nuevosIntentos = intentosPrevios + 1;

        intentosLogin[usuario] = { intentos: nuevosIntentos, bloqueadoHasta: null };

        document.getElementById("attempts-indicator").hidden = false;
        document.getElementById("attempts-count").textContent = nuevosIntentos;

        document.getElementById("attempts-indicator").hidden = false;
        document.getElementById("attempts-count").textContent = nuevosIntentos;

        document.getElementById("login-message").hidden = false;
        document.getElementById("login-message").textContent = "Usuario o contraseña incorrectos.";

        if (nuevosIntentos >= 3) {
            intentosLogin[usuario].bloqueadoHasta = Date.now() + 20000;
            iniciarConteoRegresivo(intentosLogin[usuario].bloqueadoHasta);
            document.getElementById("login-message").hidden = false;
            document.getElementById("login-message").textContent = "Cuenta bloqueada por 20 segundos.";
        }

        localStorage.setItem("intentosLogin", JSON.stringify(intentosLogin));
    }
});
