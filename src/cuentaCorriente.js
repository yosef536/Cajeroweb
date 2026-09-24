import Cuenta from "./cuenta.js";

export default class CuentaCorriente extends Cuenta {
    #porcentajeSobregiro = 0.20; // 20%, fijo del documento

    retirar(monto) {
        const limiteRetiro = this.saldo + (this.saldo * this.#porcentajeSobregiro);

        if (monto > 0 && monto <= limiteRetiro) {
            this.ajustarSaldo(-monto);
            this.registrarMovimiento('retiro', monto);
            return `Retiro exitoso. Nuevo saldo: ${this.saldo}`;
        } else {
            return "Monto de retiro inválido: supera el límite con sobregiro incluido.";
        }
    }
}