import CuentaAhorros from "./cuentaAhorros.js";
import CuentaCorriente from "./cuentaCorriente.js";
import TarjetaCredito from "./tarjetaCredito.js";
import Cliente from "./cliente.js";

const navItems = document.querySelectorAll('.panel-nav-item');
const views = document.querySelectorAll('.panel-view');

navItems.forEach(item => {
    item.addEventListener('click', () => {
        navItems.forEach(i => i.classList.remove('is-active'));
        views.forEach(v => v.classList.remove('is-active'));

        item.classList.add('is-active');
        document.getElementById('view-' + item.dataset.target).classList.add('is-active');
    });
});
document.querySelector('a[href="login.html"]').addEventListener("click", function () {
    localStorage.removeItem("usuarioActivo");
});

const usuarioActivo = localStorage.getItem("usuarioActivo");

const clientesGuardados = JSON.parse(localStorage.getItem("clientes")) || [];

const clienteActivo = clientesGuardados.find(function (cliente) {
    return cliente.nombreUsuario === usuarioActivo;
});

const cuentasGuardadas = JSON.parse(localStorage.getItem("cuentas")) || [];

const cuentasDelCliente = cuentasGuardadas.filter(function (cuenta) {
    return cuenta.clienteUsuario === usuarioActivo;;
});

function reconstruirCuenta(cuentaPlana) {
    let cuenta;
    if (cuentaPlana.tipo === "ahorros") {
        cuenta = new CuentaAhorros(cuentaPlana.numeroCuenta, cuentaPlana.saldo, clienteActivo);
    } else if (cuentaPlana.tipo === "corriente") {
        cuenta = new CuentaCorriente(cuentaPlana.numeroCuenta, cuentaPlana.saldo, clienteActivo);
    } else if (cuentaPlana.tipo === "tarjeta") {
        cuenta = new TarjetaCredito(cuentaPlana.numeroCuenta, cuentaPlana.saldo, clienteActivo);
    }
    cuenta.cargarMovimientos(cuentaPlana.movimientos);
    return cuenta;
}

const cuentasReales = cuentasDelCliente.map(function (cuentaPlana) {
    return reconstruirCuenta(cuentaPlana);
});


function buscarCuentaPorTipo(tipo) {
    return cuentasReales.find(function (cuenta) {
        if (tipo === "ahorros") return cuenta instanceof CuentaAhorros;
        if (tipo === "corriente") return cuenta instanceof CuentaCorriente;
        if (tipo === "tarjeta") return cuenta instanceof TarjetaCredito;
    });
}

function actualizarSaldoMostrado() {
    const tipoSeleccionado = document.getElementById("producto-saldo").value;
    const cuenta = buscarCuentaPorTipo(tipoSeleccionado);

    document.getElementById("balance-amount").textContent = `$${cuenta.saldo.toLocaleString('es-CO')}`;

}
document.getElementById("producto-saldo").addEventListener("change", actualizarSaldoMostrado);

actualizarSaldoMostrado(); 

function guardarCuentas() {
    const todasLasCuentas = JSON.parse(localStorage.getItem("cuentas")) || [];

    const cuentasActualizadas = todasLasCuentas.map(function (cuentaPlana) {
        const cuentaReal = cuentasReales.find(function (c) {
            return c.numeroCuenta === cuentaPlana.numeroCuenta;
        });

        if (cuentaReal) {
            return {
                numeroCuenta: cuentaReal.numeroCuenta,
                tipo: cuentaPlana.tipo,
                saldo: cuentaReal.saldo,
                clienteUsuario: cuentaPlana.clienteUsuario,
                movimientos: cuentaReal.movimientos,
            };
        } else {
            return cuentaPlana;
        }
    });

    localStorage.setItem("cuentas", JSON.stringify(cuentasActualizadas));
}

document.getElementById("consignar-form").addEventListener("submit", function (evento) {
    evento.preventDefault();

    const tipoSeleccionado = document.getElementById("producto-consignar").value;
    const monto = Number(document.getElementById("monto-consignar").value);

    const cuenta = buscarCuentaPorTipo(tipoSeleccionado);
    const resultado = cuenta.consignar(monto);

    guardarCuentas();
    actualizarSaldoMostrado()

    document.getElementById("consignar-message").hidden = false;
    document.getElementById("consignar-message").textContent = resultado;
});


document.getElementById("retirar-form").addEventListener("submit", function (evento) {
    evento.preventDefault();

    const tipoSeleccionado = document.getElementById("producto-retirar").value;
    const monto = Number(document.getElementById("monto-retirar").value);

    const cuenta = buscarCuentaPorTipo(tipoSeleccionado);
    const resultado = cuenta.retirar(monto);

    guardarCuentas();
    actualizarSaldoMostrado();

    document.getElementById("retirar-message").hidden = false;
    document.getElementById("retirar-message").textContent = resultado;
});

function mostrarMovimientos() {
    const tbody = document.getElementById("movements-body");
    let todosLosMovimientos = [];

    cuentasReales.forEach(function (cuenta) {
        cuenta.movimientos.forEach(function (mov) {
            todosLosMovimientos.push(mov);
        });
    });

    todosLosMovimientos.sort(function (a, b) {
        return new Date(b.fecha) - new Date(a.fecha);
    });

    if (todosLosMovimientos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" class="movements-empty">Aún no tienes movimientos registrados.</td></tr>';
        return;
    }

    tbody.innerHTML = "";
    todosLosMovimientos.forEach(function (mov) {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${new Date(mov.fecha).toLocaleString('es-CO')}</td>
            <td>${mov.tipo}</td>
            <td>$${mov.valor.toLocaleString('es-CO')}</td>
        `;
        tbody.appendChild(fila);
    });
}

document.querySelector('[data-target="movimientos"]').addEventListener("click", mostrarMovimientos);

const clienteActivoReal = new Cliente(
    clienteActivo.identificacion,
    clienteActivo.nombres,
    clienteActivo.celular,
    clienteActivo.nombreUsuario,
    clienteActivo.contraseña
);

document.getElementById("user-greeting").textContent = clienteActivo.nombres;
document.getElementById("perfil-nombre").value = clienteActivo.nombres;
document.getElementById("perfil-celular").value = clienteActivo.celular;

function guardarCliente() {
    const todosLosClientes = JSON.parse(localStorage.getItem("clientes")) || [];
    const actualizados = todosLosClientes.map(function (clientePlano) {
        if (clientePlano.nombreUsuario === usuarioActivo) {
            return {
                identificacion: clientePlano.identificacion,
                nombres: clienteActivo.nombres,
                celular: clienteActivo.celular,
                nombreUsuario: clientePlano.nombreUsuario,
                contraseña: clientePlano.contraseña,
            };
        }
        return clientePlano;
    });
    localStorage.setItem("clientes", JSON.stringify(actualizados));
}

document.getElementById("perfil-form").addEventListener("submit", function (evento) {
    evento.preventDefault();

    clienteActivo.nombres = document.getElementById("perfil-nombre").value;
    clienteActivo.celular = document.getElementById("perfil-celular").value;

    guardarCliente();
});

document.getElementById("password-form").addEventListener("submit", function (evento) {
    evento.preventDefault();

    const actual = document.getElementById("clave-actual").value;
    const nueva = document.getElementById("clave-nueva").value;
    const nuevaConfirm = document.getElementById("clave-nueva-confirm").value;

    if (nueva !== nuevaConfirm) {
        document.getElementById("password-message").hidden = false;
        document.getElementById("password-message").textContent = "Las contraseñas nuevas no coinciden.";
        return;
    }

    const resultado = clienteActivoReal.cambiarContraseña(actual, nueva);

    document.getElementById("password-message").hidden = false;
    document.getElementById("password-message").textContent = resultado;

    if (resultado === "Contraseña cambiada con éxito") {
        clienteActivo.contraseña = clienteActivoReal.contraseña;
        guardarCliente();
    }
});


function guardarCuentaExterna(cuenta) {
    const todasLasCuentas = JSON.parse(localStorage.getItem("cuentas")) || [];
    const actualizadas = todasLasCuentas.map(function (cuentaPlana) {
        if (cuentaPlana.numeroCuenta === cuenta.numeroCuenta) {
            return {
                numeroCuenta: cuenta.numeroCuenta,
                tipo: cuentaPlana.tipo,
                saldo: cuenta.saldo,
                clienteUsuario: cuentaPlana.clienteUsuario,
                movimientos: cuenta.movimientos,
            };
        }
        return cuentaPlana;
    });
    localStorage.setItem("cuentas", JSON.stringify(actualizadas));
}

document.getElementById("transferir-form").addEventListener("submit", function (evento) {
    evento.preventDefault();

    const tipoOrigen = document.getElementById("producto-origen").value;
    const destinoTipo = document.getElementById("destino-tipo").value;
    const destinoValor = document.getElementById("destino-valor").value.trim();
    const monto = Number(document.getElementById("monto-transferir").value);

    const cuentaOrigen = buscarCuentaPorTipo(tipoOrigen);
    let cuentaDestino;

    if (destinoTipo === "propio") {
        if (destinoValor === tipoOrigen) {
            document.getElementById("transferir-message").hidden = false;
            document.getElementById("transferir-message").textContent = "No puedes transferir al mismo producto.";
            return;
        }
        cuentaDestino = buscarCuentaPorTipo(destinoValor);
    } else {
        const [usuarioDestino, tipoDestino] = destinoValor.split(":");
        const todasLasCuentas = JSON.parse(localStorage.getItem("cuentas")) || [];
        const cuentaPlanaDestino = todasLasCuentas.find(function (c) {
            return c.clienteUsuario === usuarioDestino && c.tipo === tipoDestino;
        });

        if (!cuentaPlanaDestino) {
            document.getElementById("transferir-message").hidden = false;
            document.getElementById("transferir-message").textContent = "Cuenta destino no encontrada.";
            return;
        }
        cuentaDestino = reconstruirCuenta(cuentaPlanaDestino);
    }

    const resultadoRetiro = cuentaOrigen.retirar(monto);
    if (!resultadoRetiro.startsWith("Retiro exitoso")) {
        document.getElementById("transferir-message").hidden = false;
        document.getElementById("transferir-message").textContent = resultadoRetiro;
        return;
    }

    cuentaDestino.consignar(monto, "Transferencia recibida");

    if (destinoTipo === "terceros") {
        guardarCuentaExterna(cuentaDestino);
    }

    guardarCuentas();
    actualizarSaldoMostrado();

    document.getElementById("transferir-message").hidden = false;
    document.getElementById("transferir-message").textContent = "Transferencia exitosa.";
});
