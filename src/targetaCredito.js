import Cuenta from "./cuenta.js";

export default class TarjetaCredito extends Cuenta {

    obtenerTasa(cuotas) {
        if (cuotas <= 2) {
            return 0;
        } else if (cuotas >= 3 && cuotas <= 6) {
            return 0.019; // 1.9%
        } else {
            return 0.023; // 2.3%
        }
    }
    
    comprar(monto, cuotas) {
        let cuota
        
        const tasa = this.obtenerTasa(cuotas);
        if (tasa === 0) {
            cuota = monto / cuotas;
        } else { 
            cuota = (monto * tasa) / (1 - Math.pow(1 + tasa, -cuotas));
        }

        if (monto > 0 && monto <= this.saldo && cuotas > 0) {
            this.ajustarSaldo(-monto);
            this.registrarMovimiento('compra', monto);
            return `Compra exitosa. Nuevo saldo: ${this.saldo}. Cuota mensual: ${cuota.toFixed(2)}`;
        } else {
            return "Cupo insuficiente para realizar la compra.";
        }
    }
}