const API_CITAS="http://localhost:8080/citas";
const tablaProximasCitas=document.getElementById("tablaProximasCitas");
const API_PRODUCTOS="http://localhost:8080/productos";
const tablaStockBajo=document.getElementById("tablaStockBajo");
const API_PROMOCIONES="http://localhost:8080/promociones";
const tablaPromocionesActivas=document.getElementById("tablaPromocionesActivas");

document.addEventListener("DOMContentLoaded", function () {
    cargarTotal("http://localhost:8080/clientes", "totalClientes");
    cargarTotal("http://localhost:8080/empleados", "totalEmpleados");
    cargarTotal("http://localhost:8080/servicios", "totalServicios");
    cargarTotal("http://localhost:8080/citas", "totalCitas");
    cargarTotal("http://localhost:8080/productos", "totalProductos");
    cargarTotal("http://localhost:8080/promociones", "totalPromociones");
    cargarProximasCitas();
    cargarProductosStockBajo();
    cargarPromocionesActivas();
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
            <td>${crearBadgeEstado(cita.estado)}</td>
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

function cargarProductosStockBajo(){

    fetch(API_PRODUCTOS)
    .then(response=>response.json())
    .then(productos=>{

        const stockBajo=productos
            .filter(producto=>producto.stock<=5)
            .sort((a,b)=>a.stock-b.stock);

        mostrarProductosStockBajo(stockBajo);

    })
    .catch(error=>{
        console.error("Error al cargar productos:",error);
    });

}

function mostrarProductosStockBajo(productos){

    tablaStockBajo.innerHTML="";

    productos.forEach(producto=>{

        const fila=document.createElement("tr");

        fila.innerHTML=`
            <td>${producto.nombre}</td>
            <td>${producto.marca}</td>
            <td>${crearBadgeStock(producto.stock)}</td>
        `;

        tablaStockBajo.appendChild(fila);

    });

}

function cargarPromocionesActivas(){

    fetch(API_PROMOCIONES)
    .then(response=>response.json())
    .then(promociones=>{
        const hoy=new Date();
        const activas=promociones.filter(promocion=>{

            const inicio=new Date(promocion.fechaInicio);
            const fin=new Date(promocion.fechaFin);
            return inicio<=hoy&&fin>=hoy;

        });
        mostrarPromocionesActivas(activas);
    })
    .catch(error=>{
        console.error("Error al cargar promociones:",error);
    });

}

function mostrarPromocionesActivas(promociones){

    tablaPromocionesActivas.innerHTML="";
    promociones.forEach(promocion=>{

        const fila=document.createElement("tr");
        fila.innerHTML=`
            <td>${promocion.nombre}</td>
            <td>${promocion.descuento}%</td>
            <td>${promocion.fechaFin}</td>
        `;
        tablaPromocionesActivas.appendChild(fila);

    });

}