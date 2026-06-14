const API_EMPLEADOS = "http://localhost:8080/empleados";

const formularioEmpleado = document.getElementById("formularioEmpleado");
const tablaEmpleados = document.getElementById("tablaEmpleados");

document.addEventListener("DOMContentLoaded", cargarEmpleados);

formularioEmpleado.addEventListener("submit", function (event) {
    event.preventDefault();
    crearEmpleado();
});

function cargarEmpleados() {
    fetch(API_EMPLEADOS)
        .then(response => response.json())
        .then(empleados => {
            tablaEmpleados.innerHTML = "";

            empleados.forEach(empleado => {
                const fila = document.createElement("tr");

                fila.innerHTML = `
                    <td>${empleado.id}</td>
                    <td>${empleado.nombre}</td>
                    <td>${empleado.cargo}</td>
                    <td>${empleado.horario}</td>
                `;

                tablaEmpleados.appendChild(fila);
            });
        })
        .catch(error => {
            console.error("Error al cargar empleados:", error);
        });
}

function crearEmpleado() {
    const nombre = document.getElementById("nombre").value;
    const cargo = document.getElementById("cargo").value;
    const horario = document.getElementById("horario").value;

    const nuevoEmpleado = {
        nombre: nombre,
        cargo: cargo,
        horario: horario
    };

    fetch(API_EMPLEADOS, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(nuevoEmpleado)
    })
        .then(response => response.json())
        .then(() => {
            formularioEmpleado.reset();
            cargarEmpleados();
        })
        .catch(error => {
            console.error("Error al crear empleado:", error);
        });
}