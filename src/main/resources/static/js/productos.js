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

function cargarProductos(){
    fetch(API_PRODUCTOS)
        .then(response=>response.json())
        .then(productos=>{
            mostrarProductos(productos);
        })
        .catch(error=>{
            console.error("Error al cargar productos:",error);
            mostrarAlerta("✗ Ha ocurrido un error inesperado.","danger");
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

    fetch(API_PRODUCTOS,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(nuevoProducto)
    })
    .then(response=>{
        if(!response.ok){
            throw new Error();
        }
        return response.json();
    })
    .then(()=>{
        formularioProducto.reset();
        cargarProductos();
        mostrarAlerta("✓ Producto creado correctamente.","success");
    })
    .catch(error=>{
        console.error("Error al crear producto:",error);
        mostrarAlerta("✗ Ha ocurrido un error inesperado.","danger");
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
            <td>${producto.precio.toFixed(2)} €</td>
            <td>${producto.stock}</td>
            <td>
                <button class="btn btn-editar"
                        onclick="prepararEdicionProducto(${producto.id})">
                    Editar
                </button>

                <button class="btn btn-eliminar"
                        onclick="abrirModalEliminar(${producto.id},eliminarProducto)">
                    Eliminar
                </button>
            </td>
        `;

        tablaProductos.appendChild(fila);
    });
}

function prepararEdicionProducto(id){
    fetch(`${API_PRODUCTOS}/${id}`)
        .then(response=>{
            if(!response.ok){
                throw new Error();
            }
            return response.json();
        })
        .then(producto=>{
            productoEditandoId=producto.id;
            inputNombre.value=producto.nombre;
            inputMarca.value=producto.marca;
            inputPrecio.value=producto.precio;
            inputStock.value=producto.stock;
            botonGuardarProducto.textContent="Guardar cambios";
            botonGuardarProducto.classList.remove("btn-primary");
            botonGuardarProducto.classList.add("btn-success");
            botonCancelarEdicion.classList.remove("d-none");
            window.scrollTo({
                top:0,
                behavior:"smooth"
            });
        })
        .catch(error=>{
            console.error("Error al preparar edición:",error);
            mostrarAlerta("✗ Ha ocurrido un error inesperado.","danger");
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

   fetch(`${API_PRODUCTOS}/${productoEditandoId}`,{
       method:"PUT",
       headers:{
           "Content-Type":"application/json"
       },
       body:JSON.stringify(productoActualizado)
   })
   .then(response=>{
       if(!response.ok){
           throw new Error();
       }
       return response.json();
   })
   .then(()=>{
       cancelarEdicion();
       cargarProductos();
       mostrarAlerta("✓ Producto actualizado correctamente.","success");
   })
   .catch(error=>{
       console.error("Error al actualizar producto:",error);
       mostrarAlerta("✗ Ha ocurrido un error inesperado.","danger");
   });
}

function eliminarProducto(id) {

    fetch(`${API_PRODUCTOS}/${id}`,{
        method:"DELETE"
    })
    .then(response=>{
        if(!response.ok){
            throw new Error();
        }
    })
    .then(()=>{
        cargarProductos();
        mostrarAlerta("✓ Producto eliminado correctamente.","success");
    })
    .catch(error=>{
        console.error("Error al eliminar producto:",error);
        mostrarAlerta("✗ Ha ocurrido un error inesperado.","danger");
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
        .then(response=>{
            if(!response.ok){
                throw new Error();
            }

            return response.json();
        })
        .then(productos=>{
            mostrarProductos(productos);
            if(productos.length===0){
                mostrarAlerta("⚠ No se encontraron productos.","warning");
            }
        })
        .catch(error=>{
            console.error("Error al buscar productos por nombre:",error);
            mostrarAlerta("✗ Ha ocurrido un error inesperado.","danger");
        });
}

function buscarProductosPorMarca(marca) {
    const marcaCodificada = encodeURIComponent(marca);

    fetch(`${API_PRODUCTOS}/marca/${marcaCodificada}`)
        .then(response=>{
            if(!response.ok){
                throw new Error();
            }

            return response.json();
        })
        .then(productos=>{
            mostrarProductos(productos);
            if(productos.length===0){
                mostrarAlerta("⚠ No se encontraron productos.","warning");
            }
        })
        .catch(error=>{
            console.error("Error al buscar productos por marca:",error);
            mostrarAlerta("✗ Ha ocurrido un error inesperado.","danger");
        });
}

function buscarProducto() {
    const tipo = tipoBusqueda.value;
    const valor = textoBusqueda.value.trim();

    if (valor === "") {
        cargarProductos();
        return;
    }

    if(tipo==="nombre"){
        buscarProductosPorNombre(valor);
    }else if(tipo==="marca"){
        buscarProductosPorMarca(valor);
    }else if(tipo==="id"){
        buscarProductoPorId(valor);
    }
}

function buscarProductoPorId(id){
    fetch(`${API_PRODUCTOS}/${id}`)
    .then(response=>{
        if(response.status===404){
            mostrarProductos([]);
            mostrarAlerta("⚠ No se encontraron productos.","warning");
            return null;
        }

        if(!response.ok){
            throw new Error();
        }

        return response.json();
    })
    .then(producto=>{
        if(producto===null){
            return;
        }

        mostrarProductos([producto]);
    })
    .catch(error=>{
        console.error("Error al buscar producto por ID:",error);
        mostrarAlerta("✗ Ha ocurrido un error inesperado.","danger");
    });
}

function validarProducto() {

    const nombre=inputNombre.value.trim();
    const marca=inputMarca.value.trim();
    const precio=Number(inputPrecio.value);
    const stock=Number(inputStock.value);

    if(nombre.length<2){

        mostrarAlerta(
            "✗ El nombre debe tener al menos 2 caracteres.",
            "danger"
        );
        return false;

    }

    if(nombre.length>100){

        mostrarAlerta(
            "✗ El nombre no puede superar los 100 caracteres.",
            "danger"
        );
        return false;

    }

    if(marca.length<2){

        mostrarAlerta(
            "✗ La marca debe tener al menos 2 caracteres.",
            "danger"
        );
        return false;

    }

    if(marca.length>50){

        mostrarAlerta(
            "✗ La marca no puede superar los 50 caracteres.",
            "danger"
        );
        return false;

    }

    if(Number.isNaN(precio)||precio<=0){

        mostrarAlerta(
            "✗ El precio debe ser mayor que 0.",
            "danger"
        );
        return false;

    }

    if(precio>9999){

        mostrarAlerta(
            "✗ El precio no puede superar 9999 €.",
            "danger"
        );
        return false;

    }

    if(!Number.isInteger(stock)||stock<0){

        mostrarAlerta(
            "✗ El stock debe ser un número entero igual o mayor que 0.",
            "danger"
        );
        return false;

    }

    if(stock>10000){

        mostrarAlerta(
            "✗ El stock no puede superar las 10000 unidades.",
            "danger"
        );
        return false;
    }

    return true;
}