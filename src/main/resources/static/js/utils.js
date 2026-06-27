let idEliminar=null;
let funcionEliminar=null;
let modalEliminar=null;

function abrirModalEliminar(id,funcion){
    idEliminar=id;
    funcionEliminar=funcion;

    const modalElemento=document.getElementById("modalEliminar");
    const botonConfirmar=document.getElementById("btnConfirmarEliminar");

    botonConfirmar.onclick=function(){
        if(funcionEliminar&&idEliminar!==null){
            funcionEliminar(idEliminar);
        }

        bootstrap.Modal.getOrCreateInstance(modalElemento).hide();

        idEliminar=null;
        funcionEliminar=null;
    };

    modalEliminar=bootstrap.Modal.getOrCreateInstance(modalElemento);
    modalEliminar.show();
}



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

function crearBadgeEstado(estado){
    if(estado==="PENDIENTE"){
        return '<span class="badge-salon badge-pendiente">PENDIENTE</span>';
    }
    if(estado==="CONFIRMADA"){
        return '<span class="badge-salon badge-confirmada">CONFIRMADA</span>';
    }
    if(estado==="CANCELADA"){
        return '<span class="badge-salon badge-cancelada">CANCELADA</span>';
    }
    if(estado==="REALIZADA"){
        return '<span class="badge-salon badge-realizada">REALIZADA</span>';
    }
    return `<span class="badge-salon badge-pendiente">${estado}</span>`;
}

function crearBadgeStock(stock){
    if(stock<=2){
        return `<span class="badge-salon badge-stock-rojo">${stock}</span>`;
    }
    if(stock<=5){
        return `<span class="badge-salon badge-stock-naranja">${stock}</span>`;
    }
    return `<span class="badge-salon badge-stock-verde">${stock}</span>`;
}