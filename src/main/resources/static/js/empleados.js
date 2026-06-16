const API_EMPLEADOS = "http://localhost:8080/empleados";

const formularioEmpleado = document.getElementById("formularioEmpleado");
const tablaEmpleados = document.getElementById("tablaEmpleados");

const inputNombre = document.getElementById("nombre");
const inputCargo = document.getElementById("cargo");
const inputHorario = document.getElementById("horario");

const botonGuardarEmpleado = document.getElementById("botonGuardarEmpleado");
const botonCancelarEdicion = document.getElementById("botonCancelarEdicion");

let empleadoEditandoId = null;

document.addEventListener("DOMContentLoaded", cargarEmpleados);

formularioEmpleado.addEventListener("submit", function (event) {
    event.preventDefault();

    if (empleadoEditandoId === null) {
        crearEmpleado();
    } else {
        actualizarEmpleado();
    }
});

botonCancelarEdicion.addEventListener("click", function () {
    cancelarEdicion();
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
                    <td>
                        <button class="btn btn-editar"
                                onclick="prepararEdicionEmpleado(${empleado.id}, '${empleado.nombre}', '${empleado.cargo}', '${empleado.horario}')">
                            Editar
                        </button>

                       <button class="btn btn-eliminar"
                                onclick="eliminarEmpleado(${empleado.id})">
                            Eliminar
                        </button>
                    </td>
                `;

                tablaEmpleados.appendChild(fila);
            });
        })
        .catch(error => {
            console.error("Error al cargar empleados:", error);
        });
}

function crearEmpleado() {
    const nuevoEmpleado = {
        nombre: inputNombre.value,
        cargo: inputCargo.value,
        horario: inputHorario.value
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

function prepararEdicionEmpleado(id, nombre, cargo, horario) {
    empleadoEditandoId = id;

    inputNombre.value = nombre;
    inputCargo.value = cargo;
    inputHorario.value = horario;

    botonGuardarEmpleado.textContent = "Guardar cambios";
    botonGuardarEmpleado.classList.remove("btn-primary");
    botonGuardarEmpleado.classList.add("btn-success");

    botonCancelarEdicion.classList.remove("d-none");
}

function actualizarEmpleado() {
    const empleadoActualizado = {
        nombre: inputNombre.value,
        cargo: inputCargo.value,
        horario: inputHorario.value
    };

    fetch(`${API_EMPLEADOS}/${empleadoEditandoId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(empleadoActualizado)
    })
        .then(response => response.json())
        .then(() => {
            cancelarEdicion();
            cargarEmpleados();
        })
        .catch(error => {
            console.error("Error al actualizar empleado:", error);
        });
}

function eliminarEmpleado(id) {
    const confirmar = confirm("¿Seguro que quieres eliminar este empleado?");

    if (!confirmar) {
        return;
    }

    fetch(`${API_EMPLEADOS}/${id}`, {
        method: "DELETE"
    })
        .then(() => {
            cargarEmpleados();
        })
        .catch(error => {
            console.error("Error al eliminar empleado:", error);
        });
}

function cancelarEdicion() {
    empleadoEditandoId = null;

    formularioEmpleado.reset();

    botonGuardarEmpleado.textContent = "Crear empleado";
    botonGuardarEmpleado.classList.remove("btn-success");
    botonGuardarEmpleado.classList.add("btn-primary");

    botonCancelarEdicion.classList.add("d-none");
}