document.addEventListener("DOMContentLoaded", function () {
    cargarTotal("http://localhost:8080/clientes", "totalClientes");
    cargarTotal("http://localhost:8080/empleados", "totalEmpleados");
    cargarTotal("http://localhost:8080/servicios", "totalServicios");
    cargarTotal("http://localhost:8080/citas", "totalCitas");
    cargarTotal("http://localhost:8080/productos", "totalProductos");
    cargarTotal("http://localhost:8080/promociones", "totalPromociones");
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