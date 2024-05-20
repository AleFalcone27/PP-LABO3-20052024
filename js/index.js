import { Planeta } from "./Planeta.js";
import { escribirStorage, leerStorage, objectToJson } from "./local-storage.js";
import { mostrarSpinner, ocultarSpinner } from "./spinner.js";

const items = await leerStorage() || [];

const frm = document.getElementById("form-item");
const btnGuardar = document.getElementById("btnGuardar");
const btnEliminar = document.getElementById("btnEliminar");
const btnEliminarTodo = document.getElementById("btnEliminarTodo");
const btnModificar = document.getElementById("btnModificar");

document.addEventListener("DOMContentLoaded", () => {
  manejadorTabla();
  btnGuardar.addEventListener("click", manejadorCargarRegistro);
  btnEliminar.addEventListener('click', manejadorEliminarRegistro);
  btnModificar.addEventListener("click", manejadorModificar);
  btnEliminarTodo.addEventListener('click', manejadorEliminarTodo);
  document.addEventListener("click", manejadorClick);
});


function manejadorEliminarTodo() {
  if (confirm("¿Desea ELIMINAR TODOS los planetas?")) {
    items.length = 0;
    try {
      escribirStorage("Planetas", objectToJson(items)); // Actualiza el almacenamiento
      manejadorTabla();
    } catch (error) {
      console.error("Error al eliminar todos los planetas:", error);
    }
    actualizarFormulario();
    document.getElementsByName("id")[0].setAttribute("id", '0'); // Reseteamos el id del formulario
  }
}



function manejadorEliminarRegistro() {
  if (confirm("¿Desea ELIMINAR el planeta seleccionado?")) {
    const idSeleccionado = parseFloat(document.getElementsByName("id")[0].getAttribute("id"));

    const itemsActualizado = items.filter(p => p.id !== idSeleccionado);

    try {
      escribirStorage("Planetas", objectToJson(itemsActualizado));
      items.length = 0;
      itemsActualizado.forEach(item => items.push(item));
      manejadorTabla();
    } catch (error) {
      console.error("Error al eliminar el planeta:", error);
    }
  }
}



function manejadorClick(e) {
  if (e.target.matches("td")) {
    const id = parseFloat(e.target.parentNode.dataset.id);
    const planetaSeleccionado = items.find(p => p.id === id);
    if (planetaSeleccionado) {
      console.log("Planeta Seleccionado:", planetaSeleccionado);
    } else {
      console.log("No se encontró ningún planeta con el ID especificado.");
    }

    document.getElementsByName("id")[0].setAttribute("id", planetaSeleccionado.id);
    document.getElementById("nombre").value = planetaSeleccionado.nombre;
    document.getElementById("tamaño").value = planetaSeleccionado.tamaño;
    document.getElementById("masa").value = planetaSeleccionado.masa;
    document.getElementById("tipo").value = planetaSeleccionado.tipo;
    document.getElementById("distanciaAlSol").value = planetaSeleccionado.distanciaAlSol;
    document.getElementById("composicionAtmosferica").value = planetaSeleccionado.composicionAtmosferica;
    let presentaVidaElement = document.getElementById("presentaVida");
    let presentaAnillosElement = document.getElementById("presentaAnillos");

    if (planetaSeleccionado.presentaVida.toLowerCase() === 'si') {
      presentaVidaElement.checked = true;
    } else {
      presentaVidaElement.checked = false;
    }

    if (planetaSeleccionado.presentaAnillos.toLowerCase() === 'si') {
      presentaAnillosElement.checked = true;
    } else {
      presentaAnillosElement.checked = false;
    }

  }

}

function manejadorCargarRegistro(e) {
  e.preventDefault()

  const nombre = document.getElementById("nombre").value;
  const tamaño = document.getElementById("tamaño").value;
  const masa = document.getElementById("masa").value;
  const tipo = document.getElementById("tipo").value;
  const distanciaAlSol = document.getElementById("distanciaAlSol").value;
  const composicionAtmosferica = document.getElementById("composicionAtmosferica").value;
  let presentaVida = document.getElementById("presentaVida").checked;
  let presentaAnillos = document.getElementById("presentaAnillos").checked;


  if (validarParametros(nombre, tamaño, masa, tipo, distanciaAlSol, composicionAtmosferica, presentaVida, presentaAnillos)) {

    presentaVida = presentaVida ? 'Si' : 'no';
    presentaAnillos = presentaAnillos ? 'Si' : 'no';

    const nuevoPlaneta = new Planeta(nombre, tamaño, masa, tipo, distanciaAlSol, presentaVida, presentaAnillos, composicionAtmosferica);
    console.log('Planeta dado de alta correctamente');
    escribirStorage('Planetas', objectToJson(nuevoPlaneta));
    items.push(nuevoPlaneta);
    manejadorTabla();
    actualizarFormulario()
  }
  else {
    alert("El planeta no paso las validaciones")
  }
}


function manejadorTabla(e) {
  mostrarSpinner()
  delay(2000).then(() => {
    const tabla = createTable(items)
    const contenedor = document.getElementById("container-table");
    renderTabla(tabla, contenedor);
    ocultarSpinner();
  });
}

/*
Limpiamos la tabla y le escribimos todos los 
*/
function renderTabla(tabla, contenedor) {
  while (contenedor.hasChildNodes()) {
    contenedor.removeChild(contenedor.firstChild)
  }
  if (tabla) {
    contenedor.appendChild(tabla);
  }
}


function createTable(items) {
  const tabla = document.createElement('table');
  tabla.classList.add('my-table');

  if (items.length > 0) {
    tabla.appendChild(createThead(Object.keys(items[0])));
    const tbody = createTbody(items);
    tabla.appendChild(tbody);
  } else {
    const thead = document.createElement('thead');
    const tr = document.createElement('tr');
    const th = document.createElement('th');
    th.textContent = 'No hay planetas disponibles';

    tr.appendChild(th);
    thead.appendChild(tr);
    tabla.appendChild(thead);
  }
  return tabla;
}


function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


function createTbody(items) {
  const tbody = document.createElement("tbody");
  items.forEach((element) => {
    const tr = document.createElement("tr");
    for (const key in element) {
      if (key === 'id') {
        tr.setAttribute("data-id", element[key]);
      } else {
        const td = document.createElement("td");
        td.textContent = element[key];
        tr.appendChild(td);
      }
    }
    tbody.appendChild(tr);
  });
  return tbody;
}



function createThead() {
  const thead = document.createElement("thead");
  const tr = document.createElement("tr");

  if (items.length > 0) {
    const keys = Object.keys(items[0]);
    keys.forEach(key => {
      if (key !== 'id') {
        const th = document.createElement("th");
        th.textContent = key;
        th.textContent = th.textContent.toUpperCase();
        tr.appendChild(th);
      }
    });
  } else {
    const th = document.createElement('th');
    th.textContent = 'No hay planetas disponibles';
    tr.appendChild(th);
  }

  thead.appendChild(tr);
  return thead;
}

function actualizarFormulario() {
  frm.reset();
}

function manejadorModificar() {
  const idSeleccionado = parseFloat(document.getElementsByName("id")[0].getAttribute("id"));
  const planetaSeleccionadoIndex = items.findIndex(p => p.id === idSeleccionado);

  if (planetaSeleccionadoIndex !== -1) {
    const nombre = document.getElementById("nombre").value;
    const tamaño = document.getElementById("tamaño").value;
    const masa = document.getElementById("masa").value;
    const tipo = document.getElementById("tipo").value;
    const distanciaAlSol = document.getElementById("distanciaAlSol").value;
    const composicionAtmosferica = document.getElementById("composicionAtmosferica").value;
    const presentaVida = document.getElementById("presentaVida").checked;
    const presentaAnillos = document.getElementById("presentaAnillos").checked; 

    items[planetaSeleccionadoIndex] = new Planeta(nombre, tamaño, masa, tipo, distanciaAlSol, presentaVida ? 'Si' : 'no', presentaAnillos ? 'Si' : 'no', composicionAtmosferica);

    try {
      escribirStorage("Planetas", objectToJson(items));

      manejadorTabla();
      actualizarFormulario();

    } catch (error) {
      console.error("Error al guardar los cambios:", error);
    }
  } else {
    console.log("No se encontró ningún planeta con el ID especificado.");
  }
};



function validarParametros(nombre, tamaño, masa, tipo, distanciaAlSol, composicionAtmosferica, presentaVida, presentaAnillos) {
  return (
    nombre.length > 2 &&
    tamaño > 1 &&
    masa > 2 &&
    distanciaAlSol > 0 &&
    presentaVida !== undefined &&
    presentaAnillos !== undefined &&
    composicionAtmosferica.length > 0
  )
}

