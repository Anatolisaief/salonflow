const API_EMPLEADOS = "http://localhost:8080/empleados";

const formularioEmpleado = document.getElementById("formularioEmpleado");
const tablaEmpleados = document.getElementById("tablaEmpleados");

const inputNombre = document.getElementById("nombre");
const inputCargo = document.getElementById("cargo");
const inputHoraInicio = document.getElementById("horaInicio");
const inputHoraFin = document.getElementById("horaFin");

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

botonCancelarEdicion.addEventListener("click", cancelarEdicion);

function cargarEmpleados() {
    fetch(API_EMPLEADOS)
        .then(response => response.json())
        .then(empleados => {
            tablaEmpleados.innerHTML = "";

            empleados.sort((a, b) => a.id - b.id);

            empleados.forEach(empleado => {
                const fila = document.createElement("tr");

                fila.innerHTML = `
                    <td>${empleado.id}</td>
                    <td>${empleado.nombre}</td>
                    <td>${empleado.cargo}</td>
                    <td>
                        ${formatearHora(empleado.horaInicio)}
                        -
                        ${formatearHora(empleado.horaFin)}
                    </td>
                    <td>
                        <button class="btn btn-editar"
                                onclick="prepararEdicionEmpleado(${empleado.id})">
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
            mostrarAlerta("✗ Ha ocurrido un error inesperado.", "danger");
        });
}

function crearEmpleado() {
    if (!validarEmpleado()) {
        return;
    }

    const nuevoEmpleado = {
        nombre: inputNombre.value.trim(),
        cargo: inputCargo.value.trim(),
        horaInicio: inputHoraInicio.value,
        horaFin: inputHoraFin.value
    };

    fetch(API_EMPLEADOS,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(nuevoEmpleado)
    })
    .then(response=>{
        if(!response.ok){
            throw new Error();
        }
        return response.json();
    })
    .then(()=>{
        formularioEmpleado.reset();
        cargarEmpleados();
        mostrarAlerta("✓ Empleado creado correctamente.","success");
    })
    .catch(error=>{
        console.error("Error al crear empleado:",error);
        mostrarAlerta("✗ Ha ocurrido un error inesperado.","danger");
    });
}

function prepararEdicionEmpleado(id) {
    fetch(`${API_EMPLEADOS}/${id}`)
        .then(response => response.json())
        .then(empleado => {
            empleadoEditandoId = empleado.id;

            inputNombre.value = empleado.nombre;
            inputCargo.value = empleado.cargo;
            inputHoraInicio.value = empleado.horaInicio;
            inputHoraFin.value = empleado.horaFin;

            botonGuardarEmpleado.textContent = "Guardar cambios";
            botonGuardarEmpleado.classList.remove("btn-primary");
            botonGuardarEmpleado.classList.add("btn-success");

            botonCancelarEdicion.classList.remove("d-none");

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        })
        .catch(error => {
            console.error("Error al preparar edición:", error);
            mostrarAlerta("✗ Ha ocurrido un error inesperado.", "danger");
        });
}

function actualizarEmpleado() {
    if (!validarEmpleado()) {
        return;
    }

    const empleadoActualizado = {
        nombre: inputNombre.value.trim(),
        cargo: inputCargo.value.trim(),
        horaInicio: inputHoraInicio.value,
        horaFin: inputHoraFin.value
    };

    fetch(`${API_EMPLEADOS}/${empleadoEditandoId}`,{
        method:"PUT",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(empleadoActualizado)
    })
    .then(response=>{
        if(!response.ok){
            throw new Error();
        }
        return response.json();
    })
    .then(()=>{
        cancelarEdicion();
        cargarEmpleados();
        mostrarAlerta("✓ Empleado actualizado correctamente.","success");
    })
    .catch(error=>{
        console.error("Error al actualizar empleado:",error);
        mostrarAlerta("✗ Ha ocurrido un error inesperado.","danger");
    });
}

function eliminarEmpleado(id) {
    const confirmar = confirm("¿Seguro que quieres eliminar este empleado?");

    if (!confirmar) {
        return;
    }

    fetch(`${API_EMPLEADOS}/${id}`,{
        method:"DELETE"
    })
    .then(response=>{
        if(!response.ok){
            throw new Error();
        }
    })
    .then(()=>{
        cargarEmpleados();
        mostrarAlerta("✓ Empleado eliminado correctamente.","success");
    })
    .catch(error=>{
        console.error("Error al eliminar empleado:",error);
        mostrarAlerta("✗ Ha ocurrido un error inesperado.","danger");
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

function validarEmpleado() {
    const nombre = inputNombre.value.trim();
    const cargo = inputCargo.value.trim();
    const horaInicio = inputHoraInicio.value;
    const horaFin = inputHoraFin.value;

    if (nombre.length < 2) {
        mostrarAlerta("✗ El nombre debe tener al menos 2 caracteres.", "danger");
        return false;
    }

    if (nombre.length > 50) {
        mostrarAlerta("✗ El nombre no puede superar los 50 caracteres.", "danger");
        return false;
    }

    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s'-]+$/.test(nombre)) {
        mostrarAlerta("✗ El nombre solo puede contener letras, espacios, guiones y apóstrofes.", "danger");
        return false;
    }

    if (cargo.length < 2) {
        mostrarAlerta("✗ El cargo debe tener al menos 2 caracteres.", "danger");
        return false;
    }

    if (cargo.length > 50) {
        mostrarAlerta("✗ El cargo no puede superar los 50 caracteres.", "danger");
        return false;
    }

    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/.test(cargo)) {
        mostrarAlerta("✗ El cargo solo puede contener letras y espacios.", "danger");
        return false;
    }

    if (horaInicio === "") {
        mostrarAlerta("✗ Selecciona la hora de inicio.", "danger");
        return false;
    }

    if (horaFin === "") {
        mostrarAlerta("✗ Selecciona la hora de fin.", "danger");
        return false;
    }

    if (horaInicio >= horaFin) {
        mostrarAlerta("✗ La hora de inicio debe ser anterior a la hora de fin.", "danger");
        return false;
    }

    return true;
}
