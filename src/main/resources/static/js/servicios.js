const API_SERVICIOS = "http://localhost:8080/servicios";

const formularioServicio = document.getElementById("formularioServicio");
const tablaServicios = document.getElementById("tablaServicios");

const inputNombre = document.getElementById("nombre");
const inputPrecio = document.getElementById("precio");
const inputDuracion = document.getElementById("duracion");

const botonGuardarServicio = document.getElementById("botonGuardarServicio");
const botonCancelarEdicion = document.getElementById("botonCancelarEdicion");

let servicioEditandoId = null;

document.addEventListener("DOMContentLoaded", cargarServicios);

formularioServicio.addEventListener("submit", function (event) {
    event.preventDefault();

    if (servicioEditandoId === null) {
        crearServicio();
    } else {
        actualizarServicio();
    }
});

botonCancelarEdicion.addEventListener("click", cancelarEdicion);

function cargarServicios(){
    fetch(API_SERVICIOS)
    .then(response=>{
        if(!response.ok){
            throw new Error();
        }
        return response.json();
    })
    .then(servicios=>{
        mostrarServicios(servicios);
    })
    .catch(error=>{
        console.error("Error al cargar servicios:",error);
        mostrarAlerta("✗ Ha ocurrido un error inesperado.","danger");
    });
}
function mostrarServicios(servicios){
    tablaServicios.innerHTML="";
    servicios.sort((a,b)=>a.id-b.id);
    servicios.forEach(servicio=>{
        const fila=document.createElement("tr");
        fila.innerHTML=`
            <td>${servicio.id}</td>
            <td>${servicio.nombre}</td>
            <td>${servicio.precio.toFixed(2)} €</td>
            <td>${servicio.duracion} min</td>
            <td>
                <button class="btn btn-editar" onclick="prepararEdicionServicio(${servicio.id})">Editar</button>
                <button class="btn btn-eliminar" onclick="eliminarServicio(${servicio.id})">Eliminar</button>
            </td>
        `;
        tablaServicios.appendChild(fila);
    });
}

function crearServicio() {
    if (!validarServicio()) {
        return;
    }
    const nuevoServicio={
        nombre:inputNombre.value.trim(),
        precio:Number(inputPrecio.value),
        duracion:Number(inputDuracion.value)
    };

    fetch(API_SERVICIOS,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(nuevoServicio)
    })
    .then(response=>{
        if(!response.ok){
            throw new Error();
        }
        return response.json();
    })
    .then(()=>{
        formularioServicio.reset();
        cargarServicios();
        mostrarAlerta("✓ Servicio creado correctamente.","success");
    })
    .catch(error=>{
        console.error("Error al crear servicio:",error);
        mostrarAlerta("✗ Ha ocurrido un error inesperado.","danger");
    });
}

function prepararEdicionServicio(id){
    fetch(`${API_SERVICIOS}/${id}`)
    .then(response=>{
        if(!response.ok){
            throw new Error();
        }
        return response.json();
    })
    .then(servicio=>{
        servicioEditandoId=servicio.id;
        inputNombre.value=servicio.nombre;
        inputPrecio.value=servicio.precio;
        inputDuracion.value=servicio.duracion;
        botonGuardarServicio.textContent="Guardar cambios";
        botonGuardarServicio.classList.remove("btn-primary");
        botonGuardarServicio.classList.add("btn-success");
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

function actualizarServicio() {
    if (!validarServicio()) {
        return;
    }
    const servicioActualizado={
        nombre:inputNombre.value.trim(),
        precio:Number(inputPrecio.value),
        duracion:Number(inputDuracion.value)
    };

    fetch(`${API_SERVICIOS}/${servicioEditandoId}`,{
        method:"PUT",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(servicioActualizado)
    })
    .then(response=>{
        if(!response.ok){
            throw new Error();
        }
        return response.json();
    })
    .then(()=>{
        cancelarEdicion();
        cargarServicios();
        mostrarAlerta("✓ Servicio actualizado correctamente.","success");
    })
    .catch(error=>{
        console.error("Error al actualizar servicio:",error);
        mostrarAlerta("✗ Ha ocurrido un error inesperado.","danger");
    });
}

function eliminarServicio(id) {
    const confirmar = confirm("¿Seguro que quieres eliminar este servicio?");

    if (!confirmar) {
        return;
    }

    fetch(`${API_SERVICIOS}/${id}`,{
        method:"DELETE"
    })
    .then(response=>{
        if(!response.ok){
            throw new Error();
        }
    })
    .then(()=>{
        cargarServicios();
        mostrarAlerta("✓ Servicio eliminado correctamente.","success");
    })
    .catch(error=>{
        console.error("Error al eliminar servicio:",error);
        mostrarAlerta("✗ Ha ocurrido un error inesperado.","danger");
    });
}

function cancelarEdicion() {
    servicioEditandoId = null;
    formularioServicio.reset();
    botonGuardarServicio.textContent = "Crear servicio";
    botonGuardarServicio.classList.remove("btn-success");
    botonGuardarServicio.classList.add("btn-primary");
    botonCancelarEdicion.classList.add("d-none");
}

function validarServicio() {

    const nombre=inputNombre.value.trim();
    const precio=Number(inputPrecio.value);
    const duracion=Number(inputDuracion.value);

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

    if(!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü0-9\s'.-]+$/.test(nombre)){

        mostrarAlerta(
            "✗ El nombre contiene caracteres no válidos.",
            "danger"
        );
        return false;

    }

    if(Number.isNaN(precio)||precio<=0){

        mostrarAlerta(
            "✗ El precio debe ser mayor que 0.",
            "danger"
        );
        return false;

    }

    if(precio>9999){

        mostrarAlerta(
            "✗ El precio no puede superar 9999 €.",
            "danger"
        );
        return false;

    }

    if(!Number.isInteger(duracion)||duracion<=0){

        mostrarAlerta(
            "✗ La duración debe ser un número entero mayor que 0.",
            "danger"
        );
        return false;

    }

    if(duracion>480){

        mostrarAlerta(
            "✗ La duración no puede superar los 480 minutos.",
            "danger"
        );
        return false;

    }

    return true;

}