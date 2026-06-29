const datosPerfil=document.getElementById("datosPerfil");

document.addEventListener("DOMContentLoaded",cargarPerfil);

function cargarPerfil(){
    fetch("/auth/me")
    .then(response=>{
        if(!response.ok){
            throw new Error();
        }
        return response.json();
    })
    .then(usuario=>{
        datosPerfil.innerHTML=`
            <p><strong>Usuario:</strong> ${usuario.username}</p>
            <p><strong>Rol:</strong> ${usuario.rol}</p>
            <p><strong>Nombre mostrado:</strong> ${usuario.nombreMostrado}</p>
            <p><strong>Empleado asociado:</strong> ${usuario.empleadoNombre || "Sin empleado asociado"}</p>
        `;
    })
    .catch(error=>{
        console.error("Error al cargar perfil:",error);
        mostrarAlerta("✗ Error al cargar el perfil.","danger");
    });
}