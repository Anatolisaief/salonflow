const API_CITAS = "http://localhost:8080/citas";
const API_CLIENTES = "http://localhost:8080/clientes";
const API_EMPLEADOS = "http://localhost:8080/empleados";
const API_SERVICIOS = "http://localhost:8080/servicios";

const formularioCita = document.getElementById("formularioCita");
const tablaCitas = document.getElementById("tablaCitas");

const inputFechaHora = document.getElementById("fechaHora");
const selectEstado = document.getElementById("estado");
const selectCliente = document.getElementById("clienteId");
const selectEmpleado = document.getElementById("empleadoId");
const selectServicio = document.getElementById("servicioId");

const botonGuardarCita = document.getElementById("botonGuardarCita");
const botonCancelarEdicion = document.getElementById("botonCancelarEdicion");

let citaEditandoId = null;

document.addEventListener("DOMContentLoaded", function () {
    cargarClientes();
    cargarEmpleados();
    cargarServicios();
    cargarCitas();
});

formularioCita.addEventListener("submit", function (event) {
    event.preventDefault();

    if (citaEditandoId === null) {
        crearCita();
    } else {
        actualizarCita();
    }
});

botonCancelarEdicion.addEventListener("click", cancelarEdicion);

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
                    <td>
                        <button class="btn btn-warning btn-sm me-2"
                                onclick="prepararEdicionCita(${cita.id}, '${cita.fechaHora}', '${cita.estado}', ${cita.cliente ? cita.cliente.id : null}, ${cita.empleado ? cita.empleado.id : null}, ${cita.servicio ? cita.servicio.id : null})">
                            Editar
                        </button>

                        <button class="btn btn-danger btn-sm"
                                onclick="eliminarCita(${cita.id})">
                            Eliminar
                        </button>
                    </td>
                `;

                tablaCitas.appendChild(fila);
            });
        })
        .catch(error => {
            console.error("Error al cargar citas:", error);
        });
}

function crearCita() {
    const nuevaCita = obtenerDatosFormulario();

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

function prepararEdicionCita(id, fechaHora, estado, clienteId, empleadoId, servicioId) {
    citaEditandoId = id;

    inputFechaHora.value = fechaHora;
    selectEstado.value = estado;
    selectCliente.value = clienteId;
    selectEmpleado.value = empleadoId;
    selectServicio.value = servicioId;

    botonGuardarCita.textContent = "Guardar cambios";
    botonGuardarCita.classList.remove("btn-primary");
    botonGuardarCita.classList.add("btn-success");

    botonCancelarEdicion.classList.remove("d-none");
}

function actualizarCita() {
    const citaActualizada = obtenerDatosFormulario();

    fetch(`${API_CITAS}/${citaEditandoId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(citaActualizada)
    })
        .then(response => response.json())
        .then(() => {
            cancelarEdicion();
            cargarCitas();
        })
        .catch(error => {
            console.error("Error al actualizar cita:", error);
        });
}

function eliminarCita(id) {
    const confirmar = confirm("¿Seguro que quieres eliminar esta cita?");

    if (!confirmar) {
        return;
    }

    fetch(`${API_CITAS}/${id}`, {
        method: "DELETE"
    })
        .then(() => {
            cargarCitas();
        })
        .catch(error => {
            console.error("Error al eliminar cita:", error);
        });
}

function cancelarEdicion() {
    citaEditandoId = null;

    formularioCita.reset();

    botonGuardarCita.textContent = "Crear cita";
    botonGuardarCita.classList.remove("btn-success");
    botonGuardarCita.classList.add("btn-primary");

    botonCancelarEdicion.classList.add("d-none");
}

function obtenerDatosFormulario() {
    return {
        fechaHora: inputFechaHora.value,
        estado: selectEstado.value,
        clienteId: Number(selectCliente.value),
        empleadoId: Number(selectEmpleado.value),
        servicioId: Number(selectServicio.value)
    };
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