const API_CITAS="http://localhost:8080/citas";
const tablaProximasCitas=document.getElementById("tablaProximasCitas");

document.addEventListener("DOMContentLoaded", function () {
    cargarTotal("http://localhost:8080/clientes", "totalClientes");
    cargarTotal("http://localhost:8080/empleados", "totalEmpleados");
    cargarTotal("http://localhost:8080/servicios", "totalServicios");
    cargarTotal("http://localhost:8080/citas", "totalCitas");
    cargarTotal("http://localhost:8080/productos", "totalProductos");
    cargarTotal("http://localhost:8080/promociones", "totalPromociones");
    cargarProximasCitas();
});

function cargarTotal(url, elementoId) {
    fetch(url)
        .then(response => response.json())
        .then(datos => {
            document.getElementById(elementoId).textContent = datos.length;
        })
        .catch(error => {
            console.error("Error cargando datos:", error);
        });
}

function cargarProximasCitas(){
    fetch(API_CITAS)
    .then(response=>response.json())
    .then(citas=>{
        console.log(citas);
        const ahora=new Date();
        const proximas=citas
            .filter(cita=>new Date(cita.fechaHora)>=ahora)
            .sort((a,b)=>new Date(a.fechaHora)-new Date(b.fechaHora))
            .slice(0,5);
        mostrarProximasCitas(proximas);
    })
    .catch(error=>{
        console.error("Error al cargar próximas citas:",error);
    });
}

function mostrarProximasCitas(citas){
    tablaProximasCitas.innerHTML="";
    citas.forEach(cita=>{
        const fila=document.createElement("tr");
        fila.innerHTML=`
            <td>${formatearFecha(cita.fechaHora)}</td>
            <td>${cita.cliente?cita.cliente.nombre:""}</td>
            <td>${cita.empleado?cita.empleado.nombre:""}</td>
            <td>${cita.servicio?cita.servicio.nombre:""}</td>
            <td>${cita.estado}</td>
        `;
        tablaProximasCitas.appendChild(fila);
    });
}

function formatearFecha(fechaHora){
    if(!fechaHora){
        return "";
    }
    const fecha=new Date(fechaHora);
    return fecha.toLocaleString("es-ES",{
        dateStyle:"short",
        timeStyle:"short"
    });
}