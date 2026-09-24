export default class Cuenta {
    #numeroCuenta
    #saldo
    #cliente
    #movimientos

    constructor(numeroCuenta, saldo, cliente) {
        this.#numeroCuenta = numeroCuenta
        this.#saldo = saldo
        this.#cliente = cliente
        this.#movimientos = []
    }

    get numeroCuenta() { return this.#numeroCuenta }
    get saldo() { return this.#saldo }
    get cliente() { return this.#cliente }
    get movimientos() { return this.#movimientos }

    registrarMovimiento(tipo, valor) {
        this.#movimientos.push({ fecha: new Date(), tipo, valor });
    }

    // dentro de Cuenta, junto a los demás métodos
    ajustarSaldo(monto) {
        this.#saldo += monto; // acepta positivo o negativo, sin preguntar nada
    }

    consignar(monto, tipoMovimiento = 'consignación') {
        if (monto > 0) {
            this.ajustarSaldo(monto);
            this.registrarMovimiento(tipoMovimiento, monto);
            return `Depósito exitoso. Nuevo saldo: ${this.saldo}`;
        } else {
            return "Monto de depósito inválido.";
        }
    }

    retirar(monto) {
        if (monto > 0 && monto <= this.#saldo) {
            this.ajustarSaldo(-monto)
            this.registrarMovimiento('retiro', monto);
            return `Retiro exitoso. Nuevo saldo: ${this.#saldo}`;
        } else {
            return "Monto de retiro inválido o saldo insuficiente.";
        }
    }

    mostrarInformacion() {
        return `--------- Datos de la Cuenta ---------\n
        Número de Cuenta: ---> ${this.#numeroCuenta}\n
        Saldo: ---> ${this.#saldo}\n
        Cliente: ---> ${this.#cliente.mostrarInformacion()}\n
        ---------FIN DE LOS DATOS DE LA CUENTA---------`
    }
}