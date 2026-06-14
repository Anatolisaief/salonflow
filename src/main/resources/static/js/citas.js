const API_CITAS = "http://localhost:8080/citas";
const API_CLIENTES = "http://localhost:8080/clientes";
const API_EMPLEADOS = "http://localhost:8080/empleados";
const API_SERVICIOS = "http://localhost:8080/servicios";

const formularioCita = document.getElementById("formularioCita");
const tablaCitas = document.getElementById("tablaCitas");

const selectCliente = document.getElementById("clienteId");
const selectEmpleado = document.getElementById("empleadoId");
const selectServicio = document.getElementById("servicioId");

document.addEventListener("DOMContentLoaded", function () {
    cargarClientes();
    cargarEmpleados();
    cargarServicios();
    cargarCitas();
});

formularioCita.addEventListener("submit", function (event) {
    event.preventDefault();
    crearCita();
});

function cargarClientes() {
    fetch(API_CLIENTES)
        .then(response => response.json())
        .then(clientes => {
            clientes.forEach(cliente => {
                const option = document.createElement("option");

                option.value = cliente.id;
                option.textContent = `${cliente.nombre} - ${cliente.telefono}`;

                selectCliente.appendChild(option);
            });
        })
        .catch(error => {
            console.error("Error al cargar clientes:", error);
        });
}

function cargarEmpleados() {
    fetch(API_EMPLEADOS)
        .then(response => response.json())
        .then(empleados => {
            empleados.forEach(empleado => {
                const option = document.createElement("option");

                option.value = empleado.id;
                option.textContent = `${empleado.nombre} - ${empleado.cargo}`;

                selectEmpleado.appendChild(option);
            });
        })
        .catch(error => {
            console.error("Error al cargar empleados:", error);
        });
}

function cargarServicios() {
    fetch(API_SERVICIOS)
        .then(response => response.json())
        .then(servicios => {
            servicios.forEach(servicio => {
                const option = document.createElement("option");

                option.value = servicio.id;
                option.textContent = `${servicio.nombre} - ${servicio.precio} €`;

                selectServicio.appendChild(option);
            });
        })
        .catch(error => {
            console.error("Error al cargar servicios:", error);
        });
}

function cargarCitas() {
    fetch(API_CITAS)
        .then(response => response.json())
        .then(citas => {
            tablaCitas.innerHTML = "";

            citas.forEach(cita => {
                const fila = document.createElement("tr");

                fila.innerHTML = `
                    <td>${cita.id}</td>
                    <td>${formatearFecha(cita.fechaHora)}</td>
                    <td>${cita.estado}</td>
                    <td>${cita.cliente ? cita.cliente.nombre : ""}</td>
                    <td>${cita.empleado ? cita.empleado.nombre : ""}</td>
                    <td>${cita.servicio ? cita.servicio.nombre : ""}</td>
                `;

                tablaCitas.appendChild(fila);
            });
        })
        .catch(error => {
            console.error("Error al cargar citas:", error);
        });
}

function crearCita() {
    const fechaHora = document.getElementById("fechaHora").value;
    const estado = document.getElementById("estado").value;
    const clienteId = Number(selectCliente.value);
    const empleadoId = Number(selectEmpleado.value);
    const servicioId = Number(selectServicio.value);

    const nuevaCita = {
        fechaHora: fechaHora,
        estado: estado,
        clienteId: clienteId,
        empleadoId: empleadoId,
        servicioId: servicioId
    };

    fetch(API_CITAS, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(nuevaCita)
    })
        .then(response => response.json())
        .then(() => {
            formularioCita.reset();
            cargarCitas();
        })
        .catch(error => {
            console.error("Error al crear cita:", error);
        });
}

function formatearFecha(fechaHora) {
    if (!fechaHora) {
        return "";
    }

    const fecha = new Date(fechaHora);

    return fecha.toLocaleString("es-ES", {
        dateStyle: "short",
        timeStyle: "short"
    });
}