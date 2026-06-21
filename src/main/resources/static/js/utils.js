function formatearHora(hora) {
    if (!hora) {
        return "";
    }

    return hora.slice(0, 5);
}

function mostrarAlerta(mensaje, tipo = "success") {

    const alertaAnterior = document.getElementById("alerta");

    if (alertaAnterior) {
        alertaAnterior.remove();
    }

    const alerta = document.createElement("div");

    alerta.id = "alerta";

    alerta.className = `alert alert-${tipo} alert-dismissible fade show`;

    alerta.innerHTML = `
        ${mensaje}

        <button
            type="button"
            class="btn-close"
            data-bs-dismiss="alert">
        </button>
    `;

    document.querySelector("main").prepend(alerta);

    document.getElementById("contenedorAlertas")
            .prepend(alerta);

    window.scrollTo({
        top:0,
        behavior:"smooth"
    });

    setTimeout(() => {

        alerta.remove();

    },5000);

}