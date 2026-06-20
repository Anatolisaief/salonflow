const API_PRODUCTOS = "http://localhost:8080/productos";

const formularioProducto = document.getElementById("formularioProducto");
const tablaProductos = document.getElementById("tablaProductos");

const inputNombre = document.getElementById("nombre");
const inputMarca = document.getElementById("marca");
const inputPrecio = document.getElementById("precio");
const inputStock = document.getElementById("stock");

const tipoBusqueda = document.getElementById("tipoBusqueda");
const textoBusqueda = document.getElementById("textoBusqueda");
const botonBuscarProducto = document.getElementById("botonBuscarProducto");
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

botonBuscarProducto.addEventListener("click", function () {
    buscarProducto();
});

botonMostrarTodos.addEventListener("click", function () {
    textoBusqueda.value = "";
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

    if (!validarProducto()) {
        return;
    }
    const nuevoProducto = {
            nombre: inputNombre.value.trim(),
            marca: inputMarca.value.trim(),
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

    productos.sort((a, b) => a.id - b.id);

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
                        onclick="prepararEdicionProducto(${producto.id})">
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

function prepararEdicionProducto(id) {
    fetch(`${API_PRODUCTOS}/${id}`)
        .then(response => response.json())
        .then(producto => {
            productoEditandoId = producto.id;

            inputNombre.value = producto.nombre;
            inputMarca.value = producto.marca;
            inputPrecio.value = producto.precio;
            inputStock.value = producto.stock;

            botonGuardarProducto.textContent = "Guardar cambios";
            botonGuardarProducto.classList.remove("btn-primary");
            botonGuardarProducto.classList.add("btn-success");

            botonCancelarEdicion.classList.remove("d-none");

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        })
        .catch(error => {
            console.error("Error al preparar edición:", error);
        });
}

function actualizarProducto() {

    if (!validarProducto()) {
        return;
    }
    const productoActualizado = {
        nombre: inputNombre.value.trim(),
        marca: inputMarca.value.trim(),
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
    const nombreCodificado = encodeURIComponent(nombre);

    fetch(`${API_PRODUCTOS}/nombre/${nombreCodificado}`)
        .then(response => response.json())
        .then(productos => {
            mostrarProductos(productos);
        })
        .catch(error => {
            console.error("Error al buscar productos por nombre:", error);
        });
}

function buscarProductosPorMarca(marca) {
    const marcaCodificada = encodeURIComponent(marca);

    fetch(`${API_PRODUCTOS}/marca/${marcaCodificada}`)
        .then(response => response.json())
        .then(productos => {
            mostrarProductos(productos);
        })
        .catch(error => {
            console.error("Error al buscar productos por marca:", error);
        });
}

function buscarProducto() {
    const tipo = tipoBusqueda.value;
    const valor = textoBusqueda.value.trim();

    if (valor === "") {
        cargarProductos();
        return;
    }

    if (tipo === "nombre") {
        buscarProductosPorNombre(valor);
    }

    if (tipo === "marca") {
        buscarProductosPorMarca(valor);
    }

    if (tipo === "id") {
        buscarProductoPorId(valor);
    }
}

function buscarProductoPorId(id) {
    fetch(`${API_PRODUCTOS}/${id}`)
        .then(response => response.json())
        .then(producto => {
            if (producto === null || producto.id === undefined) {
                mostrarProductos([]);
            } else {
                mostrarProductos([producto]);
            }
        })
        .catch(error => {
            console.error("Error al buscar producto por ID:", error);
            mostrarProductos([]);
        });
}

function validarProducto() {
    const nombre = inputNombre.value.trim();
    const marca = inputMarca.value.trim();
    const precio = Number(inputPrecio.value);
    const stock = Number(inputStock.value);

    if (nombre.length < 2) {
        alert("El nombre debe tener al menos 2 caracteres.");
        return false;
    }

    if (nombre.length > 100) {
        alert("El nombre no puede superar los 100 caracteres.");
        return false;
    }

    if (marca.length < 2) {
        alert("La marca debe tener al menos 2 caracteres.");
        return false;
    }

    if (marca.length > 50) {
        alert("La marca no puede superar los 50 caracteres.");
        return false;
    }

    if (Number.isNaN(precio) || precio <= 0) {
        alert("El precio debe ser mayor que 0.");
        return false;
    }

    if (precio > 9999) {
        alert("El precio no puede superar 9999.");
        return false;
    }

    if (!Number.isInteger(stock) || stock < 0) {
        alert("El stock debe ser un número entero igual o mayor que 0.");
        return false;
    }

    if (stock > 10000) {
        alert("El stock no puede superar 10000 unidades.");
        return false;
    }

    return true;
}