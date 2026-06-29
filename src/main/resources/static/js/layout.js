window.usuarioActual=null;

fetch("header.html")
.then(response=>response.text())
.then(data=>{
    document.getElementById("header").innerHTML=data;
    const paginaActual=window.location.pathname.split("/").pop();
    document.querySelectorAll(".nav-link").forEach(link=>{
        if(link.getAttribute("href")===paginaActual){
            link.classList.add("active");
        }
    });
    aplicarPermisosMenu();
    const botonUsuario=document.getElementById("botonUsuario");
    const menuUsuario=document.getElementById("menuUsuario");

    if(botonUsuario && menuUsuario){
        botonUsuario.addEventListener("click",event=>{
            event.stopPropagation();
            menuUsuario.classList.toggle("activo");
        });

        document.addEventListener("click",event=>{
            if(!menuUsuario.contains(event.target) && !botonUsuario.contains(event.target)){
                menuUsuario.classList.remove("activo");
            }
        });
    }
});


fetch("footer.html")
.then(response=>response.text())
.then(data=>{
    document.getElementById("footer").innerHTML=data;
});

function aplicarPermisosMenu(){
    fetch("/auth/me")
        .then(response=>{
            if(!response.ok){
                throw new Error();
            }
            return response.json();
        })
        .then(usuario=>{
            window.usuarioActual=usuario;
            const nombre=document.getElementById("usuarioNavbarNombre");
            const rol=document.getElementById("usuarioNavbarRol");

            if(nombre){
                nombre.textContent=usuario.nombreMostrado;
            }

            if(rol){
                rol.textContent=usuario.rol;
            }

            if(usuario.rol!=="ADMIN"){
                document.querySelectorAll(".admin-only").forEach(elemento=>{
                    elemento.remove();
                });
            }
        })
        .catch(error=>{
            console.error("Error al aplicar permisos del menú:",error);
        });
}