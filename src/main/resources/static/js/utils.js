let idEliminar=null;
let funcionEliminar=null;
let modalEliminar=null;

function abrirModalEliminar(id,funcion){
    idEliminar=id;
    funcionEliminar=funcion;

    const modalElemento=document.getElementById("modalEliminar");
    modalEliminar=bootstrap.Modal.getOrCreateInstance(modalElemento);
    modalEliminar.show();
}

document.addEventListener("DOMContentLoaded",()=>{
    const botonConfirmar=document.getElementById("btnConfirmarEliminar");

    if(botonConfirmar){
        botonConfirmar.addEventListener("click",()=>{
            if(funcionEliminar&&idEliminar!==null){
                funcionEliminar(idEliminar);
            }

            bootstrap.Modal.getOrCreateInstance(document.getElementById("modalEliminar")).hide();
            idEliminar=null;
            funcionEliminar=null;
        });
    }
});

function formatearHora(hora) {
    if (!hora) {
        return "";
    }

    return hora.slice(0, 5);
}

function mostrarAlerta(mensaje,tipo="success"){
    const alertaAnterior=document.getElementById("alerta");
    if(alertaAnterior){
        alertaAnterior.remove();
    }
    const alerta=document.createElement("div");
    alerta.id="alerta";
    alerta.className=`alert alert-${tipo} alert-dismissible fade show`;
    alerta.innerHTML=`
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    const contenedor=document.getElementById("contenedorAlertas");
    if(contenedor){
        contenedor.prepend(alerta);
    }else{
        document.querySelector("main").prepend(alerta);
    }
    window.scrollTo({
        top:0,
        behavior:"smooth"
    });
    setTimeout(()=>{
        alerta.remove();
    },5000);
}