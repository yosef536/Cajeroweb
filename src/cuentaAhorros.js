import Cuenta from "./cuenta.js";

export default class CuentaAhorros extends Cuenta {
    #tasaInteres = 0.015; // 1.5% mensual, fijo del documento

    retirar(monto) {
        const interes = this.saldo * this.#tasaInteres;
        this.consignar(interes, 'Interés añadido');

        return super.retirar(monto);
    }
}