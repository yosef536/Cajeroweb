
import Cuenta from "./cuenta.js";

export default class TarjetaCredito extends Cuenta {

    obtenerTasa(cuotas) {
        if (cuotas <= 2) {
            return 0;
        } else if (cuotas >= 3 && cuotas <= 6) {
            return 0.019; // 1.9 % mensual
        } else {
            return 0.023; // 2.3 % mensual
        }
    }

    comprar(monto, cuotas) {
        if (
            !Number.isFinite(monto) ||
            !Number.isInteger(cuotas) ||
            monto <= 0 ||
            cuotas <= 0
        ) {
            return "Monto o número de cuotas inválido.";
        }

        if (monto > this.saldo) {
            return "Cupo insuficiente para realizar la compra.";
        }

        const tasa = this.obtenerTasa(cuotas);
        let cuota;

        if (tasa === 0) {
            cuota = monto / cuotas;
        } else {
            cuota =
                (monto * tasa) /
                (1 - Math.pow(1 + tasa, -cuotas));
        }

        this.ajustarSaldo(-monto);
        this.registrarMovimiento("compra", monto);

        return `Compra exitosa.
Monto de la compra: ${monto.toFixed(2)}
Número de cuotas: ${cuotas}
Tasa mensual: ${(tasa * 100).toFixed(1)}%
Cuota mensual: ${cuota.toFixed(2)}
Nuevo saldo disponible: ${this.saldo.toFixed(2)}`;
    }
}
