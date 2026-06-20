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
    if (!validarPromocion()) {
        return;
    }
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
                <button class="btn btn-editar"
                        onclick="prepararEdicionPromocion(${promocion.id}, '${promocion.nombre}', '${promocion.descripcion}', '${promocion.fechaInicio}', '${promocion.fechaFin}', ${promocion.descuento}, '${serviciosIds}')">
                    Editar
                </button>

                <button class="btn btn-eliminar"
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
    if (!validarPromocion()) {
        return;
    }
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

function validarPromocion() {
    const nombre = inputNombre.value.trim();
    const descripcion = inputDescripcion.value.trim();
    const fechaInicio = inputFechaInicio.value;
    const fechaFin = inputFechaFin.value;
    const descuento = Number(inputDescuento.value);
    const serviciosIds = inputServiciosIds.value
        .split(",")
        .map(id => Number(id.trim()))
        .filter(id => !isNaN(id));

    if (nombre.length < 2) {
        alert("El nombre debe tener al menos 2 caracteres.");
        return false;
    }

    if (nombre.length > 100) {
        alert("El nombre no puede superar los 100 caracteres.");
        return false;
    }

    if (descripcion.length < 5) {
        alert("La descripción debe tener al menos 5 caracteres.");
        return false;
    }

    if (descripcion.length > 255) {
        alert("La descripción no puede superar los 255 caracteres.");
        return false;
    }

    if (fechaInicio === "") {
        alert("Selecciona la fecha de inicio.");
        return false;
    }

    if (fechaFin === "") {
        alert("Selecciona la fecha de fin.");
        return false;
    }

    if (fechaInicio > fechaFin) {
        alert("La fecha de inicio no puede ser posterior a la fecha de fin.");
        return false;
    }

    if (Number.isNaN(descuento) || descuento <= 0 || descuento > 100) {
        alert("El descuento debe estar entre 1 y 100.");
        return false;
    }

    if (serviciosIds.length === 0) {
        alert("Debes introducir al menos un ID de servicio válido.");
        return false;
    }

    return true;
}