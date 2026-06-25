const API_PROMOCIONES = "http://localhost:8080/promociones";
const API_SERVICIOS="http://localhost:8080/servicios";

const formularioPromocion = document.getElementById("formularioPromocion");
const tablaPromociones = document.getElementById("tablaPromociones");

const inputNombre = document.getElementById("nombre");
const inputDescripcion = document.getElementById("descripcion");
const inputFechaInicio = document.getElementById("fechaInicio");
const inputFechaFin = document.getElementById("fechaFin");
const inputDescuento = document.getElementById("descuento");
const inputServiciosIds = document.getElementById("serviciosIds");

const botonGuardarPromocion = document.getElementById("botonGuardarPromocion");
const botonCancelarEdicion = document.getElementById("botonCancelarEdicion");

let promocionEditandoId = null;
let selectorServicios=null;

document.addEventListener("DOMContentLoaded",()=>{
    cargarPromociones();
    cargarServicios();
});

formularioPromocion.addEventListener("submit", function (event) {
    event.preventDefault();

    if (promocionEditandoId === null) {
        crearPromocion();
    } else {
        actualizarPromocion();
    }
});

botonCancelarEdicion.addEventListener("click", cancelarEdicion);

function cargarPromociones(){
    fetch(API_PROMOCIONES)
    .then(response=>{
        if(!response.ok){
            throw new Error();
        }
        return response.json();
    })
    .then(promociones=>{
        mostrarPromociones(promociones);
    })
    .catch(error=>{
        console.error("Error al cargar promociones:",error);
        mostrarAlerta("✗ Ha ocurrido un error inesperado.","danger");
    });
}

function crearPromocion() {
    if (!validarPromocion()) {
        return;
    }
    const nuevaPromocion = obtenerDatosFormulario();

    fetch(API_PROMOCIONES,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(nuevaPromocion)
    })
    .then(response=>{
        if(!response.ok){
            throw new Error();
        }
        return response.json();
    })
    .then(()=>{
        formularioPromocion.reset();
        cargarPromociones();
        mostrarAlerta("✓ Promoción creada correctamente.","success");
    })
    .catch(error=>{
        console.error("Error al crear promoción:",error);
        mostrarAlerta("✗ Ha ocurrido un error inesperado.","danger");
    });
}

function mostrarPromociones(promociones) {
    tablaPromociones.innerHTML = "";
    promociones.sort((a,b)=>a.id-b.id);

    promociones.forEach(promocion => {
        const fila = document.createElement("tr");

        const nombresServicios = promocion.servicios
            ? promocion.servicios.map(servicio => servicio.nombre).join(", ")
            : "";

        fila.innerHTML = `
            <td>${promocion.id}</td>
            <td>${promocion.nombre}</td>
            <td>${promocion.descripcion}</td>
            <td>${promocion.fechaInicio}</td>
            <td>${promocion.fechaFin}</td>
            <td>${promocion.descuento}%</td>
            <td>${nombresServicios}</td>
            <td>
                <button class="btn btn-editar" onclick="prepararEdicionPromocion(${promocion.id})">
                    Editar
                </button>

                <button class="btn btn-eliminar" onclick="abrirModalEliminar(${promocion.id},eliminarPromocion)">
                    Eliminar
                </button>
            </td>
        `;

        tablaPromociones.appendChild(fila);
    });
}

function prepararEdicionPromocion(id){
    fetch(`${API_PROMOCIONES}/${id}`)
    .then(response=>{
        if(!response.ok){
            throw new Error();
        }
        return response.json();
    })
    .then(promocion=>{
        promocionEditandoId=promocion.id;
        inputNombre.value=promocion.nombre;
        inputDescripcion.value=promocion.descripcion;
        inputFechaInicio.value=promocion.fechaInicio;
        inputFechaFin.value=promocion.fechaFin;
        inputDescuento.value=promocion.descuento;
        const ids=promocion.servicios?promocion.servicios.map(servicio=>String(servicio.id)):[];
        selectorServicios.removeActiveItems();
        selectorServicios.setChoiceByValue(ids);
        botonGuardarPromocion.textContent="Guardar cambios";
        botonGuardarPromocion.classList.remove("btn-primary");
        botonGuardarPromocion.classList.add("btn-success");
        botonCancelarEdicion.classList.remove("d-none");
        window.scrollTo({
            top:0,
            behavior:"smooth"
        });
    })
    .catch(error=>{
        console.error("Error al preparar edición:",error);
        mostrarAlerta("✗ Ha ocurrido un error inesperado.","danger");
    });
}
function actualizarPromocion() {
    if (!validarPromocion()) {
        return;
    }
    const promocionActualizada = obtenerDatosFormulario();

   fetch(`${API_PROMOCIONES}/${promocionEditandoId}`,{
       method:"PUT",
       headers:{
           "Content-Type":"application/json"
       },
       body:JSON.stringify(promocionActualizada)
   })
   .then(response=>{
       if(!response.ok){
           throw new Error();
       }
       return response.json();
   })
   .then(()=>{
       cancelarEdicion();
       cargarPromociones();
       mostrarAlerta("✓ Promoción actualizada correctamente.","success");
   })
   .catch(error=>{
       console.error("Error al actualizar promoción:",error);
       mostrarAlerta("✗ Ha ocurrido un error inesperado.","danger");
   });
}

function eliminarPromocion(id) {

    fetch(`${API_PROMOCIONES}/${id}`,{
        method:"DELETE"
    })
    .then(response=>{
        if(!response.ok){
            throw new Error();
        }
    })
    .then(()=>{
        cargarPromociones();
        mostrarAlerta("✓ Promoción eliminada correctamente.","success");
    })
    .catch(error=>{
        console.error("Error al eliminar promoción:",error);
        mostrarAlerta("✗ Ha ocurrido un error inesperado.","danger");
    });
}

function cancelarEdicion(){
    promocionEditandoId=null;
    formularioPromocion.reset();
    selectorServicios.removeActiveItems();
    botonGuardarPromocion.textContent="Crear promoción";
    botonGuardarPromocion.classList.remove("btn-success");
    botonGuardarPromocion.classList.add("btn-primary");
    botonCancelarEdicion.classList.add("d-none");
}

function obtenerDatosFormulario(){
    const serviciosIds=Array.from(inputServiciosIds.selectedOptions).map(option=>Number(option.value));
    return{
        nombre:inputNombre.value.trim(),
        descripcion:inputDescripcion.value.trim(),
        fechaInicio:inputFechaInicio.value,
        fechaFin:inputFechaFin.value,
        descuento:Number(inputDescuento.value),
        serviciosIds:serviciosIds
    };
}

function cargarServicios(){
    fetch(API_SERVICIOS)
    .then(response=>response.json())
    .then(servicios=>{
        const opciones=servicios.map(servicio=>({
            value:servicio.id,
            label:`${servicio.nombre} - ${servicio.precio} €`
        }));
        selectorServicios=new Choices(inputServiciosIds,{
            removeItemButton:true,
            searchEnabled:true,
            placeholderValue:"Selecciona servicios",
            searchPlaceholderValue:"Buscar servicio..."
        });
        selectorServicios.setChoices(opciones,"value","label",true);
    })
    .catch(error=>{
        console.error("Error al cargar servicios:",error);
        mostrarAlerta("✗ Ha ocurrido un error al cargar los servicios.","danger");
    });
}

function validarPromocion() {

    const nombre=inputNombre.value.trim();
    const descripcion=inputDescripcion.value.trim();
    const fechaInicio=inputFechaInicio.value;
    const fechaFin=inputFechaFin.value;
    const descuento=Number(inputDescuento.value);

    const serviciosIds=Array.from(inputServiciosIds.selectedOptions).map(option=>Number(option.value));

    if(nombre.length<2){

        mostrarAlerta(
            "✗ El nombre debe tener al menos 2 caracteres.",
            "danger"
        );
        return false;
    }

    if(nombre.length>100){

        mostrarAlerta(
            "✗ El nombre no puede superar los 100 caracteres.",
            "danger"
        );
        return false;
    }

    if(descripcion.length<5){

        mostrarAlerta(
            "✗ La descripción debe tener al menos 5 caracteres.",
            "danger"
        );
        return false;
    }

    if(descripcion.length>255){

        mostrarAlerta(
            "✗ La descripción no puede superar los 255 caracteres.",
            "danger"
        );
        return false;
    }

    if(fechaInicio===""){

        mostrarAlerta(
            "✗ Selecciona la fecha de inicio.",
            "danger"
        );
       return false;
    }

    if(fechaFin===""){

        mostrarAlerta(
            "✗ Selecciona la fecha de fin.",
            "danger"
        );
        return false;

    }

    if(fechaInicio>fechaFin){

        mostrarAlerta(
            "✗ La fecha de inicio no puede ser posterior a la fecha de fin.",
            "danger"
        );
        return false;

    }

    if(Number.isNaN(descuento)||descuento<=0||descuento>100){

        mostrarAlerta(
            "✗ El descuento debe estar entre 1 y 100.",
            "danger"
        );
        return false;
    }

    if(serviciosIds.length===0){
        mostrarAlerta("✗ Debes seleccionar al menos un servicio.","danger");
        return false;
    }
    return true;


}