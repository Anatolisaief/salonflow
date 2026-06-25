const API_CLIENTES = "http://localhost:8080/clientes";

const formularioCliente = document.getElementById("formularioCliente");
const tablaClientes = document.getElementById("tablaClientes");

const inputNombre = document.getElementById("nombre");
const inputTelefono = document.getElementById("telefono");
const inputEmail = document.getElementById("email");
const inputFechaNacimiento=document.getElementById("fechaNacimiento");
const inputAlergias=document.getElementById("alergias");
const inputObservaciones=document.getElementById("observaciones");

const tipoBusqueda = document.getElementById("tipoBusqueda");
const textoBusqueda = document.getElementById("textoBusqueda");
const botonBuscarCliente = document.getElementById("botonBuscarCliente");
const botonMostrarTodos = document.getElementById("botonMostrarTodos");

const botonGuardarCliente = document.getElementById("botonGuardarCliente");
const botonCancelarEdicion = document.getElementById("botonCancelarEdicion");

let clienteEditandoId = null;

document.addEventListener("DOMContentLoaded", cargarClientes);

formularioCliente.addEventListener("submit", function (event) {
    event.preventDefault();

    if (clienteEditandoId === null) {
        crearCliente();
    } else {
        actualizarCliente();
    }
});

botonCancelarEdicion.addEventListener("click", cancelarEdicion);

botonBuscarCliente.addEventListener("click", buscarClientes);

botonMostrarTodos.addEventListener("click", function () {
    textoBusqueda.value = "";
    cargarClientes();
});

function cargarClientes() {
    fetch(API_CLIENTES)
        .then(response => response.json())
        .then(clientes => {
            mostrarClientes(clientes);
        })
        .catch(error => {
            console.error("Error al cargar clientes:", error);
            mostrarAlerta(
                "✗ Ha ocurrido un error al cargar los clientes.",
                "danger"
            );
        });
}

function crearCliente() {

    if (!validarCliente()) {
        return;
    }
    const nuevoCliente={
        nombre:inputNombre.value.trim(),
        telefono:inputTelefono.value.trim(),
        email:inputEmail.value.trim(),
        fechaNacimiento:inputFechaNacimiento.value||null,
        alergias:inputAlergias.value.trim(),
        observaciones:inputObservaciones.value.trim()
    };

    fetch(API_CLIENTES,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(nuevoCliente)
    })
    .then(response=>{

        if(!response.ok){
            throw new Error();
        }
        return response.json();

    })
    .then(()=>{

        formularioCliente.reset();
        cargarClientes();
        mostrarAlerta(
            "✓ Cliente creado correctamente.",
            "success"
        );

    })
    .catch(error=>{

        console.error("Error al crear cliente:",error);
        mostrarAlerta(
            "✗ Ha ocurrido un error inesperado.",
            "danger"
        );

    });
}

function mostrarClientes(clientes) {
    tablaClientes.innerHTML = "";

    clientes.sort((a, b) => a.id - b.id);

    clientes.forEach(cliente => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${cliente.id}</td>
            <td>${cliente.nombre}</td>
            <td>${cliente.telefono}</td>
            <td>${cliente.email}</td>
            <td>${cliente.fechaNacimiento||""}</td>
            <td>
            <button
                class="btn btn-ficha"
                onclick="window.location.href='cliente-detalle.html?id=${cliente.id}'">
                Ver ficha
            </button>
                <button class="btn btn-editar"
                        onclick="prepararEdicionCliente(${cliente.id})">
                    Editar
                </button>

                <button class="btn btn-eliminar"
                       onclick="abrirModalEliminar(${cliente.id},eliminarCliente)">
                    Eliminar
                </button>
            </td>
        `;

        tablaClientes.appendChild(fila);
    });
}

function prepararEdicionCliente(id) {
    fetch(`${API_CLIENTES}/${id}`)
        .then(response => response.json())
        .then(cliente => {
            clienteEditandoId = cliente.id;

            inputNombre.value = cliente.nombre;
            inputTelefono.value = cliente.telefono;
            inputEmail.value = cliente.email;
            inputFechaNacimiento.value=cliente.fechaNacimiento||"";
            inputAlergias.value=cliente.alergias||"";
            inputObservaciones.value=cliente.observaciones||"";

            botonGuardarCliente.textContent = "Guardar cambios";
            botonGuardarCliente.classList.remove("btn-primary");
            botonGuardarCliente.classList.add("btn-success");

            botonCancelarEdicion.classList.remove("d-none");

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        })
        .catch(error => {
            console.error("Error al preparar edición:", error);
            mostrarAlerta(
                            "✗ Ha ocurrido un error inesperado.",
                            "danger"
                        );
        });
}

function actualizarCliente() {

    if (!validarCliente()) {
        return;
    }
    const clienteActualizado={
        nombre:inputNombre.value.trim(),
        telefono:inputTelefono.value.trim(),
        email:inputEmail.value.trim(),
        fechaNacimiento:inputFechaNacimiento.value||null,
        alergias:inputAlergias.value.trim(),
        observaciones:inputObservaciones.value.trim()
    };

    fetch(`${API_CLIENTES}/${clienteEditandoId}`,{
        method:"PUT",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(clienteActualizado)
    })
    .then(response=>{

        if(!response.ok){
            throw new Error();
        }

        return response.json();

    })
    .then(()=>{

        cancelarEdicion();
        cargarClientes();
        mostrarAlerta(
            "✓ Cliente actualizado correctamente.",
            "success"
        );

    })
    .catch(error=>{
        console.error("Error al actualizar cliente:",error);
        mostrarAlerta(
            "✗ Ha ocurrido un error inesperado.",
            "danger"
        );

    });
}

function eliminarCliente(id) {

   fetch(`${API_CLIENTES}/${id}`, {
       method: "DELETE"
   })
       .then(response => {
           if (!response.ok) {
               throw new Error();
           }
       })
       .then(() => {
           cargarClientes();
           mostrarAlerta(
               "✓ Cliente eliminado correctamente.",
               "success"
           );
       })
        .catch(error => {
            console.error("Error al eliminar cliente:", error);
            mostrarAlerta(
                            "✗ Ha ocurrido un error inesperado.",
                            "danger"
                        );
        });
}

function cancelarEdicion() {
    clienteEditandoId = null;

    formularioCliente.reset();

    botonGuardarCliente.textContent = "Crear cliente";
    botonGuardarCliente.classList.remove("btn-success");
    botonGuardarCliente.classList.add("btn-primary");

    botonCancelarEdicion.classList.add("d-none");
}

function buscarClientes() {
    const tipo = tipoBusqueda.value;
    const valor = textoBusqueda.value.trim().toLowerCase();

    if (valor === "") {
        cargarClientes();
        return;
    }

    fetch(API_CLIENTES)
        .then(response => response.json())
        .then(clientes => {
            const clientesFiltrados = clientes.filter(cliente => {
                if (tipo === "id") {
                    return String(cliente.id) === valor;
                }

                if (tipo === "nombre") {
                    return cliente.nombre.toLowerCase().includes(valor);
                }

                if (tipo === "telefono") {
                    return cliente.telefono.toLowerCase().includes(valor);
                }

                if (tipo === "email") {
                    return cliente.email.toLowerCase().includes(valor);
                }

                return false;
            });

            mostrarClientes(clientesFiltrados);

            if (clientesFiltrados.length === 0) {
                mostrarAlerta(
                    "⚠ No se encontraron clientes.",
                    "warning"
                );
            }
        })
        .catch(error => {
            console.error("Error al buscar clientes:", error);
            mostrarAlerta(
                "✗ Ha ocurrido un error inesperado.",
                "danger"
            );
        });
}


function validarCliente() {

    const nombre=inputNombre.value.trim();
    const telefono=inputTelefono.value.trim();
    const email=inputEmail.value.trim();
    const alergias=inputAlergias.value.trim();
    const observaciones=inputObservaciones.value.trim();

    if(alergias.length>255){
        mostrarAlerta("✗ Las alergias no pueden superar los 255 caracteres.","danger");
        return false;
    }

    if(observaciones.length>500){
        mostrarAlerta("✗ Las observaciones no pueden superar los 500 caracteres.","danger");
        return false;
    }

    if(nombre.length<2){

        mostrarAlerta(
            "✗ El nombre debe tener al menos 2 caracteres.",
            "danger"
        );
        return false;

    }

    if(nombre.length>50){

        mostrarAlerta(
            "✗ El nombre no puede superar los 50 caracteres.",
            "danger"
        );
        return false;

    }

    if(!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s'-]+$/.test(nombre)){

        mostrarAlerta(
            "✗ El nombre solo puede contener letras, espacios, guiones y apóstrofes.",
            "danger"
        );
        return false;
    }

    if(!/^[0-9]{9}$/.test(telefono)){

        mostrarAlerta(
            "✗ El teléfono debe tener exactamente 9 números.",
            "danger"
        );
        return false;

    }

    if(email.length>100){

        mostrarAlerta(
            "✗ El email no puede superar los 100 caracteres.",
            "danger"
        );
        return false;
    }

    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){

        mostrarAlerta(
            "✗ Introduce un email válido.",
            "danger"
        );
        return false;
    }

    return true;

}
