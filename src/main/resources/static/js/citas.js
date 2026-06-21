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

const tipoBusqueda = document.getElementById("tipoBusqueda");
const textoBusqueda = document.getElementById("textoBusqueda");
const botonBuscarCita = document.getElementById("botonBuscarCita");
const botonMostrarTodas = document.getElementById("botonMostrarTodas");

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

botonBuscarCita.addEventListener("click", buscarCitas);

botonMostrarTodas.addEventListener("click", function () {
    textoBusqueda.value = "";
    cargarCitas();
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
            mostrarAlerta(
                    "✗ Ha ocurrido un error inesperado.",
                    "danger"
                );
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
            mostrarAlerta(
                    "✗ Ha ocurrido un error inesperado.",
                    "danger"
                );
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
            mostrarAlerta(
                    "✗ Ha ocurrido un error inesperado.",
                    "danger"
                );
        });
}

function cargarCitas() {
    fetch(API_CITAS)
        .then(response => response.json())
        .then(citas => {
            mostrarCitas(citas);
        })
        .catch(error => {
            console.error("Error al cargar citas:", error);
            mostrarAlerta(
                    "✗ Ha ocurrido un error inesperado.",
                    "danger"
                );
        });
}

function mostrarCitas(citas) {
    tablaCitas.innerHTML = "";

    citas.sort((a, b) => a.id - b.id);

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
                <button class="btn btn-editar"
                        onclick="prepararEdicionCita(${cita.id})">
                    Editar
                </button>

                <button class="btn btn-eliminar"
                        onclick="eliminarCita(${cita.id})">
                    Eliminar
                </button>
            </td>
        `;

        tablaCitas.appendChild(fila);
    });
}

function crearCita() {
    if (!validarCita()) {
        return;
    }

    const nuevaCita = obtenerDatosFormulario();

    fetch(API_CITAS, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(nuevaCita)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(
                    "No se pudo crear la cita. El empleado ya tiene una cita en esa fecha y hora."
                );
            }

            return response.json();
        })
        .then(() => {
            formularioCita.reset();
            cargarCitas();
            mostrarAlerta(
                "✓ Cita creada correctamente.",
                "success"
            );
        })
        .catch(error => {

            console.error("Error al crear cita:", error);
            mostrarAlerta(
                    `✗ ${error.message}`,
                    "danger"
                );
        });
}

function prepararEdicionCita(id) {
    fetch(`${API_CITAS}/${id}`)
        .then(response => response.json())
        .then(cita => {
            citaEditandoId = cita.id;

            inputFechaHora.value = cita.fechaHora;
            selectEstado.value = cita.estado;
            selectCliente.value = cita.cliente ? cita.cliente.id : "";
            selectEmpleado.value = cita.empleado ? cita.empleado.id : "";
            selectServicio.value = cita.servicio ? cita.servicio.id : "";

            botonGuardarCita.textContent = "Guardar cambios";
            botonGuardarCita.classList.remove("btn-primary");
            botonGuardarCita.classList.add("btn-success");

            botonCancelarEdicion.classList.remove("d-none");

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        })
        .catch(error => {
            console.error("Error al preparar edición de cita:", error);
            mostrarAlerta(
                    "✗ Ha ocurrido un error inesperado.",
                    "danger"
                );
        });
}

function actualizarCita() {
    if (!validarCita()) {
        return;
    }

    const citaActualizada = obtenerDatosFormulario();

    fetch(`${API_CITAS}/${citaEditandoId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(citaActualizada)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(
                    "No se pudo actualizar la cita. El empleado ya tiene otra cita en esa fecha y hora."
                );
            }

            return response.json();
        })
        .then(() => {
            cancelarEdicion();
            cargarCitas();
            mostrarAlerta(
                "✓ Cita actualizada correctamente.",
                "success"
            );
        })
        .catch(error => {

            console.error("Error al actualizar cita:", error);
            mostrarAlerta(
                    `✗ ${error.message}`,
                    "danger"
                );
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
            mostrarAlerta(
                "✓ Cita eliminada correctamente.",
                "success"
            );
        })
        .catch(error => {
            console.error("Error al eliminar cita:", error);
            mostrarAlerta(
                    "✗ Ha ocurrido un error inesperado.",
                    "danger"
                );
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

function buscarCitas() {
    const tipo = tipoBusqueda.value;
    const valor = textoBusqueda.value.trim().toLowerCase();

    if (valor === "") {
        cargarCitas();
        return;
    }

    fetch(API_CITAS)
        .then(response => response.json())
        .then(citas => {
            const citasFiltradas = citas.filter(cita => {
                if (tipo === "id") {
                    return String(cita.id) === valor;
                }

                if (tipo === "estado") {
                    return cita.estado.toLowerCase().includes(valor);
                }

                if (tipo === "cliente") {
                    return cita.cliente &&
                        cita.cliente.nombre.toLowerCase().includes(valor);
                }

                if (tipo === "empleado") {
                    return cita.empleado &&
                        cita.empleado.nombre.toLowerCase().includes(valor);
                }

                return false;
            });

            mostrarCitas(citasFiltradas);

            if (citasFiltradas.length === 0) {
                mostrarAlerta(
                    "⚠ No se encontraron citas.",
                    "warning"
                );
            }
        })
        .catch(error => {
            console.error("Error al buscar citas:", error);
            mostrarAlerta(
                "✗ Ha ocurrido un error inesperado.",
                "danger"
            );
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

function validarCita() {

    const fechaHora=inputFechaHora.value;
    const estado=selectEstado.value;
    const clienteId=selectCliente.value;
    const empleadoId=selectEmpleado.value;
    const servicioId=selectServicio.value;

    if(fechaHora===""){

        mostrarAlerta(
            "✗ Selecciona la fecha y hora de la cita.",
            "danger"
        );
        return false;
    }

    const fechaSeleccionada=new Date(fechaHora);
    const fechaActual=new Date();

    if(fechaSeleccionada<fechaActual){

        mostrarAlerta(
            "✗ La cita no puede tener una fecha pasada.",
            "danger"
        );
        return false;
    }

    if(estado===""){

        mostrarAlerta(
            "✗ Selecciona el estado de la cita.",
            "danger"
        );
        return false;
    }

    if(clienteId===""){

        mostrarAlerta(
            "✗ Selecciona un cliente.",
            "danger"
        );
        return false;
    }

    if(empleadoId===""){

        mostrarAlerta(
            "✗ Selecciona un empleado.",
            "danger"
        );
        return false;
    }

    if(servicioId===""){

        mostrarAlerta(
            "✗ Selecciona un servicio.",
            "danger"
        );
        return false;
    }
    return true;

}