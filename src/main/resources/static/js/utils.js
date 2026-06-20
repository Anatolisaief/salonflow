function formatearHora(hora) {
    if (!hora) {
        return "";
    }

    return hora.slice(0, 5);
}