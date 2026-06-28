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