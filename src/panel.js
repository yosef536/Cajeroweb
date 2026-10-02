import CuentaAhorros from "./cuentaAhorros.js";
import CuentaCorriente from "./cuentaCorriente.js";
import TarjetaCredito from "./tarjetaCredito.js";

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
    if (cuentaPlana.tipo === "ahorros") {
        return new CuentaAhorros(cuentaPlana.numeroCuenta, cuentaPlana.saldo, clienteActivo);
    } else if (cuentaPlana.tipo === "corriente") {
        return new CuentaCorriente(cuentaPlana.numeroCuenta, cuentaPlana.saldo, clienteActivo);
    } else if (cuentaPlana.tipo === "tarjeta") {
        return new TarjetaCredito(cuentaPlana.numeroCuenta, cuentaPlana.saldo, clienteActivo);
    }
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
