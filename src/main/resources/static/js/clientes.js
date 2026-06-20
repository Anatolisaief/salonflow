const API_CLIENTES = "http://localhost:8080/clientes";

const formularioCliente = document.getElementById("formularioCliente");
const tablaClientes = document.getElementById("tablaClientes");

const inputNombre = document.getElementById("nombre");
const inputTelefono = document.getElementById("telefono");
const inputEmail = document.getElementById("email");

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
        });
}

function crearCliente() {

    if (!validarCliente()) {
        return;
    }
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
            <td>
                <button class="btn btn-editar"
                        onclick="prepararEdicionCliente(${cliente.id})">
                    Editar
                </button>

                <button class="btn btn-eliminar"
                        onclick="eliminarCliente(${cliente.id})">
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
        });
}

function actualizarCliente() {

    if (!validarCliente()) {
        return;
    }
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
        })
        .catch(error => {
            console.error("Error al buscar clientes:", error);
        });
}


function validarCliente() {

    const nombre = inputNombre.value.trim();
    const telefono = inputTelefono.value.trim();
    const email = inputEmail.value.trim();

    if (nombre.length < 2) {
        alert("El nombre debe tener al menos 2 caracteres.");
        return false;
    }

    if (nombre.length > 50) {
        alert("El nombre no puede superar los 50 caracteres.");
        return false;
    }

    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s'-]+$/.test(nombre)) {
        alert("El nombre solo puede contener letras, espacios, guiones y apóstrofes.");
        return false;
    }

    if (!/^[0-9]{9}$/.test(telefono)) {
        alert("El teléfono debe tener exactamente 9 números.");
        return false;
    }

    if (email.length > 100) {
        alert("El email no puede superar los 100 caracteres.");
        return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert("Introduce un email válido.");
        return false;
    }

    return true;

}