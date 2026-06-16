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

function cargarServicios() {
    fetch(API_SERVICIOS)
        .then(response => response.json())
        .then(servicios => {
            tablaServicios.innerHTML = "";

            servicios.forEach(servicio => {
                const fila = document.createElement("tr");

                fila.innerHTML = `
                    <td>${servicio.id}</td>
                    <td>${servicio.nombre}</td>
                    <td>${servicio.precio} €</td>
                    <td>${servicio.duracion} min</td>
                    <td>
                        <button class="btn btn-editar"
                                onclick="prepararEdicionServicio(${servicio.id}, '${servicio.nombre}', ${servicio.precio}, ${servicio.duracion})">
                            Editar
                        </button>

                       <button class="btn btn-eliminar"
                                onclick="eliminarServicio(${servicio.id})">
                            Eliminar
                        </button>
                    </td>
                `;

                tablaServicios.appendChild(fila);
            });
        })
        .catch(error => {
            console.error("Error al cargar servicios:", error);
        });
}

function crearServicio() {
    const nuevoServicio = {
        nombre: inputNombre.value,
        precio: Number(inputPrecio.value),
        duracion: Number(inputDuracion.value)
    };

    fetch(API_SERVICIOS, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(nuevoServicio)
    })
        .then(response => response.json())
        .then(() => {
            formularioServicio.reset();
            cargarServicios();
        })
        .catch(error => {
            console.error("Error al crear servicio:", error);
        });
}

function prepararEdicionServicio(id, nombre, precio, duracion) {
    servicioEditandoId = id;

    inputNombre.value = nombre;
    inputPrecio.value = precio;
    inputDuracion.value = duracion;

    botonGuardarServicio.textContent = "Guardar cambios";
    botonGuardarServicio.classList.remove("btn-primary");
    botonGuardarServicio.classList.add("btn-success");

    botonCancelarEdicion.classList.remove("d-none");
}

function actualizarServicio() {
    const servicioActualizado = {
        nombre: inputNombre.value,
        precio: Number(inputPrecio.value),
        duracion: Number(inputDuracion.value)
    };

    fetch(`${API_SERVICIOS}/${servicioEditandoId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(servicioActualizado)
    })
        .then(response => response.json())
        .then(() => {
            cancelarEdicion();
            cargarServicios();
        })
        .catch(error => {
            console.error("Error al actualizar servicio:", error);
        });
}

function eliminarServicio(id) {
    const confirmar = confirm("¿Seguro que quieres eliminar este servicio?");

    if (!confirmar) {
        return;
    }

    fetch(`${API_SERVICIOS}/${id}`, {
        method: "DELETE"
    })
        .then(() => {
            cargarServicios();
        })
        .catch(error => {
            console.error("Error al eliminar servicio:", error);
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