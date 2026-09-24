// 1. Crear la clase de Persona
export default class Cliente {
    // 2. Crear las Propiedades
    #identificacion
    #nombres
    #celular
    #nombreUsuario
    #contraseña

    // 3. Crear el constructor
    constructor(identificacion, nombres, celular, nombreUsuario, contraseña) {
        this.#identificacion = identificacion
        this.#nombres = nombres
        this.#celular = celular
        this.#nombreUsuario = nombreUsuario
        this.#contraseña = contraseña

    }
    //#region
    // 4. Crear los métodos de acceso (getters y setters)
    get identificacion() { return this.#identificacion }
    get nombres() { return this.#nombres }
    get celular() { return this.#celular }
    get nombreUsuario() { return this.#nombreUsuario }
    get contraseña() { return this.#contraseña }
    //#endregion

    set nombres(nombres) { this.#nombres = nombres } // ---> esto permita modificar el nombre de la persona
    set celular(celular) { this.#celular = celular } // ---> esto permita modificar el celular de la persona

    cambiarContraseña(actual, nueva) {
        if (actual === this.#contraseña) {
            this.#contraseña = nueva;
            return "Contraseña cambiada con éxito";
        } else {
            return "Contraseña actual incorrecta. No se pudo cambiar la contraseña.";
        }
    }

    // 5. Crear el método para mostrar la información de la persona
    mostrarInformacion() {
        return `--------- Datos de la Persona ---------\n
        Identificación: ---> ${this.#identificacion}\n
        Nombres: ---> ${this.#nombres}\n
        Celular: ---> ${this.#celular}\n
        Nombre de Usuario: ---> ${this.#nombreUsuario}\n
        Contraseña: ---> ${this.#contraseña}\n
        ---------FIN DE LOS DATOS DE LA PERSONA---------`
    }
}