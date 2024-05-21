export class PlanetaBase {
    constructor(nombre,tamaño,masa,tipo) {
        this.id = Math.random();
        this.nobre = nombre;
        this.tamaño = tamaño;
        this.masa = masa;
        this.tipo = tipo;
    }
}

