const API_PRODUCTOS = "http://localhost:8080/productos";

const formularioProducto = document.getElementById("formularioProducto");
const tablaProductos = document.getElementById("tablaProductos");

const buscarNombre = document.getElementById("buscarNombre");
const buscarMarca = document.getElementById("buscarMarca");

const botonBuscarNombre = document.getElementById("botonBuscarNombre");
const botonBuscarMarca = document.getElementById("botonBuscarMarca");
const botonMostrarTodos = document.getElementById("botonMostrarTodos");

document.addEventListener("DOMContentLoaded", cargarProductos);

formularioProducto.addEventListener("submit", function (event) {
    event.preventDefault();
    crearProducto();
});

botonBuscarNombre.addEventListener("click", function () {
    const nombre = buscarNombre.value.trim();

    if (nombre !== "") {
        buscarProductosPorNombre(nombre);
    }
});

botonBuscarMarca.addEventListener("click", function () {
    const marca = buscarMarca.value.trim();

    if (marca !== "") {
        buscarProductosPorMarca(marca);
    }
});

botonMostrarTodos.addEventListener("click", function () {
    buscarNombre.value = "";
    buscarMarca.value = "";
    cargarProductos();
});

function cargarProductos() {
    fetch(API_PRODUCTOS)
        .then(response => response.json())
        .then(productos => {
            mostrarProductos(productos);
        })
        .catch(error => {
            console.error("Error al cargar productos:", error);
        });
}

function crearProducto() {
    const nombre = document.getElementById("nombre").value;
    const marca = document.getElementById("marca").value;
    const precio = Number(document.getElementById("precio").value);
    const stock = Number(document.getElementById("stock").value);

    const nuevoProducto = {
        nombre: nombre,
        marca: marca,
        precio: precio,
        stock: stock
    };

    fetch(API_PRODUCTOS, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(nuevoProducto)
    })
        .then(response => response.json())
        .then(() => {
            formularioProducto.reset();
            cargarProductos();
        })
        .catch(error => {
            console.error("Error al crear producto:", error);
        });
}

function buscarProductosPorNombre(nombre) {
    fetch(`${API_PRODUCTOS}/nombre/${nombre}`)
        .then(response => response.json())
        .then(productos => {
            mostrarProductos(productos);
        })
        .catch(error => {
            console.error("Error al buscar productos por nombre:", error);
        });
}

function buscarProductosPorMarca(marca) {
    fetch(`${API_PRODUCTOS}/marca/${marca}`)
        .then(response => response.json())
        .then(productos => {
            mostrarProductos(productos);
        })
        .catch(error => {
            console.error("Error al buscar productos por marca:", error);
        });
}

function mostrarProductos(productos) {
    tablaProductos.innerHTML = "";

    productos.forEach(producto => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${producto.id}</td>
            <td>${producto.nombre}</td>
            <td>${producto.marca}</td>
            <td>${producto.precio}</td>
            <td>${producto.stock}</td>
        `;

        tablaProductos.appendChild(fila);
    });
}