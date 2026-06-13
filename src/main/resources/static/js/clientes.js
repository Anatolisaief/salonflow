const API_CLIENTES = "http://localhost:8080/clientes";

const formularioCliente = document.getElementById("formularioCliente");
const tablaClientes = document.getElementById("tablaClientes");

document.addEventListener("DOMContentLoaded", cargarClientes);

formularioCliente.addEventListener("submit", function (event) {
    event.preventDefault();

    crearCliente();
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
                `;

                tablaClientes.appendChild(fila);
            });
        })
        .catch(error => {
            console.error("Error al cargar clientes:", error);
        });
}

function crearCliente() {
    const nombre = document.getElementById("nombre").value;
    const telefono = document.getElementById("telefono").value;
    const email = document.getElementById("email").value;

    const nuevoCliente = {
        nombre: nombre,
        telefono: telefono,
        email: email
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