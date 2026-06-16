const API_PRODUCTOS = "http://localhost:8080/productos";

const formularioProducto = document.getElementById("formularioProducto");
const tablaProductos = document.getElementById("tablaProductos");

const inputNombre = document.getElementById("nombre");
const inputMarca = document.getElementById("marca");
const inputPrecio = document.getElementById("precio");
const inputStock = document.getElementById("stock");

const buscarNombre = document.getElementById("buscarNombre");
const buscarMarca = document.getElementById("buscarMarca");

const botonBuscarNombre = document.getElementById("botonBuscarNombre");
const botonBuscarMarca = document.getElementById("botonBuscarMarca");
const botonMostrarTodos = document.getElementById("botonMostrarTodos");

const botonGuardarProducto = document.getElementById("botonGuardarProducto");
const botonCancelarEdicion = document.getElementById("botonCancelarEdicion");

let productoEditandoId = null;

document.addEventListener("DOMContentLoaded", cargarProductos);

formularioProducto.addEventListener("submit", function (event) {
    event.preventDefault();

    if (productoEditandoId === null) {
        crearProducto();
    } else {
        actualizarProducto();
    }
});

botonCancelarEdicion.addEventListener("click", cancelarEdicion);

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
    const nuevoProducto = {
        nombre: inputNombre.value,
        marca: inputMarca.value,
        precio: Number(inputPrecio.value),
        stock: Number(inputStock.value)
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
            <td>
                <button class="btn btn-editar"
                        onclick="prepararEdicionProducto(${producto.id}, '${producto.nombre}', '${producto.marca}', ${producto.precio}, ${producto.stock})">
                    Editar
                </button>

                <button class="btn btn-eliminar"
                        onclick="eliminarProducto(${producto.id})">
                    Eliminar
                </button>
            </td>
        `;

        tablaProductos.appendChild(fila);
    });
}

function prepararEdicionProducto(id, nombre, marca, precio, stock) {
    productoEditandoId = id;

    inputNombre.value = nombre;
    inputMarca.value = marca;
    inputPrecio.value = precio;
    inputStock.value = stock;

    botonGuardarProducto.textContent = "Guardar cambios";
    botonGuardarProducto.classList.remove("btn-primary");
    botonGuardarProducto.classList.add("btn-success");

    botonCancelarEdicion.classList.remove("d-none");
}

function actualizarProducto() {
    const productoActualizado = {
        nombre: inputNombre.value,
        marca: inputMarca.value,
        precio: Number(inputPrecio.value),
        stock: Number(inputStock.value)
    };

    fetch(`${API_PRODUCTOS}/${productoEditandoId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(productoActualizado)
    })
        .then(response => response.json())
        .then(() => {
            cancelarEdicion();
            cargarProductos();
        })
        .catch(error => {
            console.error("Error al actualizar producto:", error);
        });
}

function eliminarProducto(id) {
    const confirmar = confirm("¿Seguro que quieres eliminar este producto?");

    if (!confirmar) {
        return;
    }

    fetch(`${API_PRODUCTOS}/${id}`, {
        method: "DELETE"
    })
        .then(() => {
            cargarProductos();
        })
        .catch(error => {
            console.error("Error al eliminar producto:", error);
        });
}

function cancelarEdicion() {
    productoEditandoId = null;

    formularioProducto.reset();

    botonGuardarProducto.textContent = "Crear producto";
    botonGuardarProducto.classList.remove("btn-success");
    botonGuardarProducto.classList.add("btn-primary");

    botonCancelarEdicion.classList.add("d-none");
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