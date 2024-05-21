import { PlanetaBase,  } from "./planetaBase.js";
class Planeta extends PlanetaBase{
    constructor(nombre,tamaño,masa,tipo,distanciaAlSol,presentaVida,presentaAnillos,composicionAtmosferica) {
      super(nombre,tamaño,masa,tipo)
      this.distanciaAlSol = distanciaAlSol;
      this.presentaVida = presentaVida;
      this.presentaAnillos = presentaAnillos;
      this.composicionAtmosferica = composicionAtmosferica;
    }

}
export { Planeta };




