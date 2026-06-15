const API_PROMOCIONES = "http://localhost:8080/promociones";

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

document.addEventListener("DOMContentLoaded", cargarPromociones);

formularioPromocion.addEventListener("submit", function (event) {
    event.preventDefault();

    if (promocionEditandoId === null) {
        crearPromocion();
    } else {
        actualizarPromocion();
    }
});

botonCancelarEdicion.addEventListener("click", cancelarEdicion);

function cargarPromociones() {
    fetch(API_PROMOCIONES)
        .then(response => response.json())
        .then(promociones => {
            mostrarPromociones(promociones);
        })
        .catch(error => {
            console.error("Error al cargar promociones:", error);
        });
}

function crearPromocion() {
    const nuevaPromocion = obtenerDatosFormulario();

    fetch(API_PROMOCIONES, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(nuevaPromocion)
    })
        .then(response => response.json())
        .then(() => {
            formularioPromocion.reset();
            cargarPromociones();
        })
        .catch(error => {
            console.error("Error al crear promoción:", error);
        });
}

function mostrarPromociones(promociones) {
    tablaPromociones.innerHTML = "";

    promociones.forEach(promocion => {
        const fila = document.createElement("tr");

        const nombresServicios = promocion.servicios
            ? promocion.servicios.map(servicio => servicio.nombre).join(", ")
            : "";

        const serviciosIds = promocion.servicios
            ? promocion.servicios.map(servicio => servicio.id).join(",")
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
                <button class="btn btn-warning btn-sm me-2"
                        onclick="prepararEdicionPromocion(${promocion.id}, '${promocion.nombre}', '${promocion.descripcion}', '${promocion.fechaInicio}', '${promocion.fechaFin}', ${promocion.descuento}, '${serviciosIds}')">
                    Editar
                </button>

                <button class="btn btn-danger btn-sm"
                        onclick="eliminarPromocion(${promocion.id})">
                    Eliminar
                </button>
            </td>
        `;

        tablaPromociones.appendChild(fila);
    });
}

function prepararEdicionPromocion(id, nombre, descripcion, fechaInicio, fechaFin, descuento, serviciosIds) {
    promocionEditandoId = id;

    inputNombre.value = nombre;
    inputDescripcion.value = descripcion;
    inputFechaInicio.value = fechaInicio;
    inputFechaFin.value = fechaFin;
    inputDescuento.value = descuento;
    inputServiciosIds.value = serviciosIds;

    botonGuardarPromocion.textContent = "Guardar cambios";
    botonGuardarPromocion.classList.remove("btn-primary");
    botonGuardarPromocion.classList.add("btn-success");

    botonCancelarEdicion.classList.remove("d-none");
}

function actualizarPromocion() {
    const promocionActualizada = obtenerDatosFormulario();

    fetch(`${API_PROMOCIONES}/${promocionEditandoId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(promocionActualizada)
    })
        .then(response => response.json())
        .then(() => {
            cancelarEdicion();
            cargarPromociones();
        })
        .catch(error => {
            console.error("Error al actualizar promoción:", error);
        });
}

function eliminarPromocion(id) {
    const confirmar = confirm("¿Seguro que quieres eliminar esta promoción?");

    if (!confirmar) {
        return;
    }

    fetch(`${API_PROMOCIONES}/${id}`, {
        method: "DELETE"
    })
        .then(() => {
            cargarPromociones();
        })
        .catch(error => {
            console.error("Error al eliminar promoción:", error);
        });
}

function cancelarEdicion() {
    promocionEditandoId = null;

    formularioPromocion.reset();

    botonGuardarPromocion.textContent = "Crear promoción";
    botonGuardarPromocion.classList.remove("btn-success");
    botonGuardarPromocion.classList.add("btn-primary");

    botonCancelarEdicion.classList.add("d-none");
}

function obtenerDatosFormulario() {
    const serviciosIds = inputServiciosIds.value
        .split(",")
        .map(id => Number(id.trim()))
        .filter(id => !isNaN(id));

    return {
        nombre: inputNombre.value,
        descripcion: inputDescripcion.value,
        fechaInicio: inputFechaInicio.value,
        fechaFin: inputFechaFin.value,
        descuento: Number(inputDescuento.value),
        serviciosIds: serviciosIds
    };
}