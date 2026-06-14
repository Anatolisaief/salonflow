const API_PROMOCIONES = "http://localhost:8080/promociones";

const formularioPromocion = document.getElementById("formularioPromocion");
const tablaPromociones = document.getElementById("tablaPromociones");

document.addEventListener("DOMContentLoaded", cargarPromociones);

formularioPromocion.addEventListener("submit", function (event) {
    event.preventDefault();
    crearPromocion();
});

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
    const nombre = document.getElementById("nombre").value;
    const descripcion = document.getElementById("descripcion").value;
    const fechaInicio = document.getElementById("fechaInicio").value;
    const fechaFin = document.getElementById("fechaFin").value;
    const descuento = Number(document.getElementById("descuento").value);

    const serviciosIdsTexto = document.getElementById("serviciosIds").value;

    const serviciosIds = serviciosIdsTexto
        .split(",")
        .map(id => Number(id.trim()))
        .filter(id => !isNaN(id));

    const nuevaPromocion = {
        nombre: nombre,
        descripcion: descripcion,
        fechaInicio: fechaInicio,
        fechaFin: fechaFin,
        descuento: descuento,
        serviciosIds: serviciosIds
    };

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

        fila.innerHTML = `
            <td>${promocion.id}</td>
            <td>${promocion.nombre}</td>
            <td>${promocion.descripcion}</td>
            <td>${promocion.fechaInicio}</td>
            <td>${promocion.fechaFin}</td>
            <td>${promocion.descuento}%</td>
            <td>${nombresServicios}</td>
        `;

        tablaPromociones.appendChild(fila);
    });
}