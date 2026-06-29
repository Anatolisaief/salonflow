const API_USUARIOS="http://localhost:8080/usuarios";
const API_EMPLEADOS = "http://localhost:8080/empleados";

const formularioUsuario=document.getElementById("formularioUsuario");
const tablaUsuarios=document.getElementById("tablaUsuarios");

const inputUsername=document.getElementById("username");
const inputPassword=document.getElementById("password");
const inputRol=document.getElementById("rol");
const inputEmpleado = document.getElementById("empleado");
const botonGuardarUsuario=document.getElementById("botonGuardarUsuario");
const botonCancelarEdicionUsuario=document.getElementById("botonCancelarEdicionUsuario");

let listaUsuarios=[];
let usuarioEditandoId = null;

document.addEventListener("DOMContentLoaded", () => {
    cargarUsuarios();
    cargarEmpleados();
});

formularioUsuario.addEventListener("submit",event=>{
    event.preventDefault();

    if(usuarioEditandoId===null){
        crearUsuario();
    }else{
        actualizarUsuario();
    }
});
botonCancelarEdicionUsuario.addEventListener("click",cancelarEdicionUsuario);


function cargarUsuarios(){
    fetch(API_USUARIOS)
    .then(response=>{
        if(!response.ok){
            throw new Error();
        }
        return response.json();
    })
    .then(usuarios=>{
        listaUsuarios=usuarios;
        mostrarUsuarios(usuarios);
    })
    .catch(error=>{
        console.error("Error al cargar usuarios:",error);
        mostrarAlerta("✗ Ha ocurrido un error inesperado.","danger");
    });
}

function mostrarUsuarios(usuarios){
    tablaUsuarios.innerHTML="";

    usuarios.sort((a,b)=>a.id-b.id);

    usuarios.forEach(usuario=>{
        const fila=document.createElement("tr");

       fila.innerHTML=`
           <td>${usuario.id}</td>
           <td>${usuario.username}</td>
           <td>${usuario.rol}</td>
           <td>${usuario.empleadoNombre ?? "Sin empleado"}</td>
           <td>
               <button class="btn btn-editar"
                       onclick="prepararEdicionUsuario(${usuario.id})">
                   Editar
               </button>
               <button class="btn btn-eliminar"
                       onclick="abrirModalEliminar(${usuario.id},eliminarUsuario)">
                   Eliminar
               </button>
           </td>
       `;

        tablaUsuarios.appendChild(fila);
    });
}

function crearUsuario(){
    if(!validarUsuario()){
        return;
    }

    const nuevoUsuario={
        username:inputUsername.value.trim(),
        password:inputPassword.value.trim(),
        rol:inputRol.value,
        empleadoId:inputEmpleado.value==="" ? null : Number(inputEmpleado.value)
    };

    fetch(API_USUARIOS,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(nuevoUsuario)
    })
    .then(response=>{
        if(!response.ok){
            throw new Error();
        }
        return response.json();
    })
    .then(()=>{
        formularioUsuario.reset();
        cargarUsuarios();
        mostrarAlerta("✓ Usuario creado correctamente.","success");
    })
    .catch(error=>{
        console.error("Error al crear usuario:",error);
        mostrarAlerta("✗ Ha ocurrido un error inesperado.","danger");
    });
}

function eliminarUsuario(id){
    fetch(`${API_USUARIOS}/${id}`,{
        method:"DELETE"
    })
    .then(response=>{
        if(!response.ok){
            throw new Error();
        }
    })
    .then(()=>{
        cargarUsuarios();
        mostrarAlerta("✓ Usuario eliminado correctamente.","success");
    })
    .catch(error=>{
        console.error("Error al eliminar usuario:",error);
        mostrarAlerta("✗ Ha ocurrido un error inesperado.","danger");
    });
}

function prepararEdicionUsuario(id){

    const usuario = listaUsuarios.find(u => u.id === id);

    inputUsername.value = usuario.username;
    inputRol.value = usuario.rol;
    inputPassword.value = "";
    inputEmpleado.value = usuario.empleadoId ?? "";

    usuarioEditandoId = id;

    botonGuardarUsuario.textContent="Guardar cambios";
    botonGuardarUsuario.classList.remove("btn-primary");
    botonGuardarUsuario.classList.add("btn-success");

    botonCancelarEdicionUsuario.classList.remove("d-none");

    window.scrollTo({
        top:0,
        behavior:"smooth"
    });
}

function cancelarEdicionUsuario(){

    usuarioEditandoId=null;

    formularioUsuario.reset();
    inputEmpleado.value="";

    botonGuardarUsuario.textContent="Crear usuario";
    botonGuardarUsuario.classList.remove("btn-success");
    botonGuardarUsuario.classList.add("btn-primary");

    botonCancelarEdicionUsuario.classList.add("d-none");
}

function actualizarUsuario(){

    const usuario={
        username:inputUsername.value.trim(),
        password:inputPassword.value.trim(),
        rol:inputRol.value,
        empleadoId:inputEmpleado.value==="" ? null : Number(inputEmpleado.value)
    };

    fetch(`${API_USUARIOS}/${usuarioEditandoId}`,{
        method:"PUT",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(usuario)
    })
    .then(response=>{
        if(!response.ok){
            throw new Error();
        }
        return response.json();
    })
    .then(()=>{
        cargarUsuarios();

        cancelarEdicionUsuario();

        mostrarAlerta("✓ Usuario actualizado correctamente.");
    })
    .catch(()=>{
        mostrarAlerta("✗ Error al actualizar el usuario.","danger");
    });

}

function validarUsuario(){
    const username=inputUsername.value.trim();
    const password=inputPassword.value.trim();
    const rol=inputRol.value;

    if(username.length<3){
        mostrarAlerta("✗ El usuario debe tener al menos 3 caracteres.","danger");
        return false;
    }

    if(username.length>50){
        mostrarAlerta("✗ El usuario no puede superar los 50 caracteres.","danger");
        return false;
    }

    if(usuarioEditandoId===null && password.length<6){
        mostrarAlerta("✗ La contraseña debe tener al menos 6 caracteres.","danger");
        return false;
    }

    if(usuarioEditandoId!==null && password!=="" && password.length<6){
        mostrarAlerta("✗ La nueva contraseña debe tener al menos 6 caracteres.","danger");
        return false;
    }

    if(rol===""){
        mostrarAlerta("✗ Selecciona un rol.","danger");
        return false;
    }

    return true;
}

function cargarEmpleados(){

    fetch(API_EMPLEADOS)
        .then(response=>{
            if(!response.ok){
                throw new Error();
            }
            return response.json();
        })
        .then(empleados=>{

            inputEmpleado.innerHTML=
                `<option value="">Ninguno</option>`;

            empleados.sort((a,b)=>a.nombre.localeCompare(b.nombre));

            empleados.forEach(empleado=>{

                inputEmpleado.innerHTML+=`
                    <option value="${empleado.id}">
                        ${empleado.nombre}
                    </option>
                `;

            });

        })
        .catch(error=>{
            console.error("Error al cargar empleados:",error);
            mostrarAlerta("✗ Error al cargar los empleados.","danger");
        });

}