import Cliente from "./cliente.js";

// 1. leer los datos del formulario

document.getElementById("registro-form").addEventListener("submit", function (evento) {
    evento.preventDefault();

    const documento = document.getElementById("documento").value;
    const celular = document.getElementById("celular").value;
    const nombre = document.getElementById("nombre").value;
    const usuario = document.getElementById("usuario").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("password-confirm").value;

// 2. Validar que los campos no estén vacíos y que las contraseñas coincidan

    if (documento === "" || celular === "" || nombre === "" || usuario === "" || password === "") {
        alert("Por favor, completa todos los campos.");
        return;
    }

    if (password !== passwordConfirm) {
        alert("Las contraseñas no coinciden. Por favor, inténtalo de nuevo.");
        return;
    }

// 3. Crear un nuevo cliente
    //guardar los datos en el localStorage
    const nuevoCliente = new Cliente(documento, nombre, celular, usuario, password);

    // 1. Traer los clientes que ya existan, o un array vacío si es la primera vez
    const clientesGuardados = JSON.parse(localStorage.getItem("clientes")) || [];

    // 2. Armar un objeto plano con los datos del nuevo cliente (usando los getters)
    const clientePlano = {
        identificacion: nuevoCliente.identificacion,
        nombres: nuevoCliente.nombres,
        celular: nuevoCliente.celular,
        nombreUsuario: nuevoCliente.nombreUsuario,
        contraseña: nuevoCliente.contraseña,
    };

    clientesGuardados.push(clientePlano);

    // 3. Guardar la lista completa de vuelta
    localStorage.setItem("clientes", JSON.stringify(clientesGuardados));

    alert("Cuenta creada con éxito. Ahora puedes iniciar sesión.");
    window.location.href = "login.html";
});
