const API_CLIENTES = "http://localhost:8080/clientes";

const formularioCliente = document.getElementById("formularioCliente");
const tablaClientes = document.getElementById("tablaClientes");

const inputNombre = document.getElementById("nombre");
const inputTelefono = document.getElementById("telefono");
const inputEmail = document.getElementById("email");

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

botonCancelarEdicion.addEventListener("click", function () {
    cancelarEdicion();
});

function cargarClientes() {
    fetch(API_CLIENTES)
        .then(response => response.json())
        .then(clientes => {
            tablaClientes.innerHTML = "";

            clientes.forEach(cliente => {
                const fila = document.createElement("tr");

                fila.innerHTML = `
                    <td>${cliente.id}</td>
                    <td>${cliente.nombre}</td>
                    <td>${cliente.telefono}</td>
                    <td>${cliente.email}</td>
                    <td>
                        <button class="btn btn-warning btn-sm me-2" onclick="prepararEdicionCliente(${cliente.id}, '${cliente.nombre}', '${cliente.telefono}', '${cliente.email}')">
                            Editar
                        </button>

                        <button class="btn btn-danger btn-sm" onclick="eliminarCliente(${cliente.id})">
                            Eliminar
                        </button>
                    </td>
                `;

                tablaClientes.appendChild(fila);
            });
        })
        .catch(error => {
            console.error("Error al cargar clientes:", error);
        });
}

function crearCliente() {
    const nuevoCliente = {
        nombre: inputNombre.value,
        telefono: inputTelefono.value,
        email: inputEmail.value
    };

    fetch(API_CLIENTES, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(nuevoCliente)
    })
        .then(response => response.json())
        .then(() => {
            formularioCliente.reset();
            cargarClientes();
        })
        .catch(error => {
            console.error("Error al crear cliente:", error);
        });
}

function prepararEdicionCliente(id, nombre, telefono, email) {
    clienteEditandoId = id;

    inputNombre.value = nombre;
    inputTelefono.value = telefono;
    inputEmail.value = email;

    botonGuardarCliente.textContent = "Guardar cambios";
    botonGuardarCliente.classList.remove("btn-primary");
    botonGuardarCliente.classList.add("btn-success");

    botonCancelarEdicion.classList.remove("d-none");
}

function actualizarCliente() {
    const clienteActualizado = {
        nombre: inputNombre.value,
        telefono: inputTelefono.value,
        email: inputEmail.value
    };

    fetch(`${API_CLIENTES}/${clienteEditandoId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(clienteActualizado)
    })
        .then(response => response.json())
        .then(() => {
            cancelarEdicion();
            cargarClientes();
        })
        .catch(error => {
            console.error("Error al actualizar cliente:", error);
        });
}

function eliminarCliente(id) {
    const confirmar = confirm("¿Seguro que quieres eliminar este cliente?");

    if (!confirmar) {
        return;
    }

    fetch(`${API_CLIENTES}/${id}`, {
        method: "DELETE"
    })
        .then(() => {
            cargarClientes();
        })
        .catch(error => {
            console.error("Error al eliminar cliente:", error);
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