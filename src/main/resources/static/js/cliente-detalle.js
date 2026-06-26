const API_CLIENTES="http://localhost:8080/clientes";
const API_SERVICIOS="http://localhost:8080/servicios";

const parametros=new URLSearchParams(window.location.search);
const clienteId=parametros.get("id");

const datosCliente=document.getElementById("datosCliente");
const formularioHistorial=document.getElementById("formularioHistorial");
const tablaHistorial=document.getElementById("tablaHistorial");

const inputFecha=document.getElementById("fecha");
const inputServicioId=document.getElementById("servicioId");
const inputTecnica=document.getElementById("tecnica");
const inputColorAplicado=document.getElementById("colorAplicado");
const inputProductosAplicados=document.getElementById("productosAplicados");
const inputObservacionesHistorial=document.getElementById("observacionesHistorial");

const botonGuardarHistorial=document.getElementById("botonGuardarHistorial");
const botonCancelarEdicionHistorial=document.getElementById("botonCancelarEdicionHistorial");

let historialEditandoId=null;

document.addEventListener("DOMContentLoaded",()=>{
    if(!clienteId){
        mostrarAlerta("✗ No se ha encontrado el cliente.","danger");
        return;
    }
    cargarCliente();
    cargarServicios();
    cargarHistorial();

});

formularioHistorial.addEventListener("submit",event=>{
    event.preventDefault();
    if(historialEditandoId===null){
        crearHistorial();
    }else{
        actualizarHistorial();
    }
});

botonCancelarEdicionHistorial.addEventListener("click",cancelarEdicionHistorial);

function cargarCliente(){
    fetch(`${API_CLIENTES}/${clienteId}`)
    .then(response=>{
        if(!response.ok){
            throw new Error();
        }
        return response.json();
    })
    .then(cliente=>{
        mostrarCliente(cliente);
    })
    .catch(error=>{
        console.error("Error al cargar cliente:",error);
        mostrarAlerta("✗ Ha ocurrido un error inesperado.","danger");
    });
}

function mostrarCliente(cliente){
    datosCliente.innerHTML=`
        <p>
            <i class="bi bi-person me-2"></i>
            <strong>Nombre:</strong> ${cliente.nombre}
        </p>

        <p>
            <i class="bi bi-telephone me-2"></i>
            <strong>Teléfono:</strong> ${cliente.telefono}
        </p>

        <p>
            <i class="bi bi-envelope me-2"></i>
            <strong>Email:</strong> ${cliente.email}
        </p>

        <p>
            <i class="bi bi-cake2 me-2"></i>
            <strong>Fecha de nacimiento:</strong> ${cliente.fechaNacimiento || "No indicada"}
        </p>

        <p>
            <i class="bi bi-exclamation-triangle me-2"></i>
            <strong>Alergias:</strong> ${cliente.alergias || "No indicadas"}
        </p>

        <p>
            <i class="bi bi-card-text me-2"></i>
            <strong>Observaciones:</strong> ${cliente.observaciones || "Sin observaciones"}
        </p>
    `;
}

function cargarHistorial(){
    fetch(`${API_CLIENTES}/${clienteId}/historial`)
    .then(response=>{
        if(!response.ok){
            throw new Error();
        }
        return response.json();
    })
    .then(historial=>{
        mostrarHistorial(historial);
    })
    .catch(error=>{
        console.error("Error al cargar historial:",error);
        mostrarAlerta("✗ Ha ocurrido un error inesperado.","danger");
    });
}

function mostrarHistorial(historial){
    tablaHistorial.innerHTML="";
    historial.forEach(item=>{
        const fila=document.createElement("tr");
        fila.innerHTML=`
            <td>${item.fecha||""}</td>
            <td>${item.servicio?item.servicio.nombre:""}</td>
            <td>${item.tecnica||""}</td>
            <td>${item.colorAplicado||""}</td>
            <td>${item.productosAplicados||""}</td>
            <td>${item.observaciones||""}</td>
            <td>
                <button class="btn btn-editar" onclick="prepararEdicionHistorial(${item.id})">Editar</button>
                <button class="btn btn-eliminar" onclick="abrirModalEliminar(${item.id},eliminarHistorial)">Eliminar</button>
            </td>
        `;
        tablaHistorial.appendChild(fila);
    });
}

function crearHistorial(){
    if(!validarHistorial()){
        return;
    }
    const nuevoHistorial=obtenerDatosHistorial();
    fetch(`${API_CLIENTES}/${clienteId}/historial`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(nuevoHistorial)
    })
    .then(response=>{
        if(!response.ok){
            throw new Error();
        }
        return response.json();
    })
    .then(()=>{
        formularioHistorial.reset();
        cargarHistorial();
        mostrarAlerta("✓ Historial añadido correctamente.","success");
    })
    .catch(error=>{
        console.error("Error al crear historial:",error);
        mostrarAlerta("✗ Ha ocurrido un error inesperado.","danger");
    });
}

function prepararEdicionHistorial(id){
    fetch(`${API_CLIENTES}/${clienteId}/historial/${id}`)
    .then(response=>{
        if(!response.ok){
            throw new Error();
        }
        return response.json();
    })
    .then(item=>{
        historialEditandoId=item.id;
        inputFecha.value=item.fecha||"";
        inputServicioId.value=item.servicio?item.servicio.id:"";
        inputTecnica.value=item.tecnica||"";
        inputColorAplicado.value=item.colorAplicado||"";
        inputProductosAplicados.value=item.productosAplicados||"";
        inputObservacionesHistorial.value=item.observaciones||"";
        botonGuardarHistorial.textContent="Guardar cambios";
        botonGuardarHistorial.classList.remove("btn-primary");
        botonGuardarHistorial.classList.add("btn-success");
        botonCancelarEdicionHistorial.classList.remove("d-none");
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

function actualizarHistorial(){
    if(!validarHistorial()){
        return;
    }
    const historialActualizado=obtenerDatosHistorial();
    fetch(`${API_CLIENTES}/${clienteId}/historial/${historialEditandoId}`,{
        method:"PUT",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(historialActualizado)
    })
    .then(response=>{
        if(!response.ok){
            throw new Error();
        }
        return response.json();
    })
    .then(()=>{
        cancelarEdicionHistorial();
        cargarHistorial();
        mostrarAlerta("✓ Historial actualizado correctamente.","success");
    })
    .catch(error=>{
        console.error("Error al actualizar historial:",error);
        mostrarAlerta("✗ Ha ocurrido un error inesperado.","danger");
    });
}

function eliminarHistorial(id){
    fetch(`${API_CLIENTES}/${clienteId}/historial/${id}`,{
        method:"DELETE"
    })
    .then(response=>{
        if(!response.ok){
            throw new Error();
        }
    })
    .then(()=>{
        cargarHistorial();
        mostrarAlerta("✓ Historial eliminado correctamente.","success");
    })
    .catch(error=>{
        console.error("Error al eliminar historial:",error);
        mostrarAlerta("✗ Ha ocurrido un error inesperado.","danger");
    });
}

function cancelarEdicionHistorial(){
    historialEditandoId=null;
    formularioHistorial.reset();
    botonGuardarHistorial.textContent="Añadir historial";
    botonGuardarHistorial.classList.remove("btn-success");
    botonGuardarHistorial.classList.add("btn-primary");
    botonCancelarEdicionHistorial.classList.add("d-none");
}

function obtenerDatosHistorial(){
    return{
        fecha:inputFecha.value||null,
        servicioId:inputServicioId.value?Number(inputServicioId.value):null,
        tecnica:inputTecnica.value.trim(),
        colorAplicado:inputColorAplicado.value.trim(),
        productosAplicados:inputProductosAplicados.value.trim(),
        observaciones:inputObservacionesHistorial.value.trim()
    };
}

function cargarServicios(){
    fetch(API_SERVICIOS)
    .then(response=>{
        if(!response.ok){
            throw new Error();
        }
        return response.json();
    })
    .then(servicios=>{
        inputServicioId.innerHTML='<option value="">Sin servicio seleccionado</option>';
        servicios.sort((a,b)=>a.id-b.id);
        servicios.forEach(servicio=>{
            const option=document.createElement("option");
            option.value=servicio.id;
            option.textContent=`${servicio.nombre} - ${servicio.precio} €`;
            inputServicioId.appendChild(option);
        });
    })
    .catch(error=>{
        console.error("Error al cargar servicios:",error);
        mostrarAlerta("✗ Ha ocurrido un error al cargar los servicios.","danger");
    });
}

function validarHistorial(){
    const tecnica=inputTecnica.value.trim();
    const colorAplicado=inputColorAplicado.value.trim();
    const productosAplicados=inputProductosAplicados.value.trim();
    const observaciones=inputObservacionesHistorial.value.trim();
    if(tecnica.length>100){
        mostrarAlerta("✗ La técnica no puede superar los 100 caracteres.","danger");
        return false;
    }
    if(colorAplicado.length>150){
        mostrarAlerta("✗ El color aplicado no puede superar los 150 caracteres.","danger");
        return false;
    }
    if(productosAplicados.length>255){
        mostrarAlerta("✗ Los productos aplicados no pueden superar los 255 caracteres.","danger");
        return false;
    }
    if(observaciones.length>500){
        mostrarAlerta("✗ Las observaciones no pueden superar los 500 caracteres.","danger");
        return false;
    }
    return true;
}