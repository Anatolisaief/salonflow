const API_SERVICIOS = "http://localhost:8080/servicios";

const formularioServicio = document.getElementById("formularioServicio");
const tablaServicios = document.getElementById("tablaServicios");

document.addEventListener("DOMContentLoaded", cargarServicios);

formularioServicio.addEventListener("submit", function (event) {
    event.preventDefault();
    crearServicio();
});

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
                `;

                tablaServicios.appendChild(fila);
            });
        })
        .catch(error => {
            console.error("Error al cargar servicios:", error);
        });
}

function crearServicio() {
    const nombre = document.getElementById("nombre").value;
    const precio = Number(document.getElementById("precio").value);
    const duracion = Number(document.getElementById("duracion").value);

    const nuevoServicio = {
        nombre: nombre,
        precio: precio,
        duracion: duracion
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