import Cliente from "./cliente";

    // 1. Leer los valores del formulario
const id = document.getElementById("documento").value;
const nombre = document.getElementById("nombre").value;
// ...

// 2. Crear un Cliente con esos datos
const persona = new Cliente(id, nombre, celular, usuario, contraseña);

// 3. Guardar ese cliente en localStorage
localStorage.setItem("clientes", JSON.stringify(listaDeClientes));

import Cuenta from "./cuenta";
