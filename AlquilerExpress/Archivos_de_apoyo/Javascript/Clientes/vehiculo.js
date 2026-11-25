// Un vehículo y la tarjeta que se pinta en el portal
function escapar(texto) {
    return String(texto == null ? "" : texto)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

class Vehiculo {
    constructor(datos) {
        Object.assign(this, datos);
    }

    get nombre() {
        return (this.marca || "") + " " + (this.modelo || "");
    }

    get precio() {
        return "L " + Number(this.precio_dia || 0).toFixed(2);
    }

    static imagenPorDefecto() {
        const dibujo = '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="360">' +
            '<rect width="600" height="360" fill="#FAEFF4"/>' +
            '<path d="M120 210h360v65H120zM175 145h250l40 65H135z" fill="#945A73"/>' +
            '<circle cx="190" cy="275" r="25" fill="#493B43"/>' +
            '<circle cx="410" cy="275" r="25" fill="#493B43"/></svg>';

        return "data:image/svg+xml," + encodeURIComponent(dibujo);
    }

    foto() {
        if (this.imagen && /^(https?:\/\/|data:image\/)/.test(this.imagen)) {
            return this.imagen;
        }
        return Vehiculo.imagenPorDefecto();
    }

    tarjeta(favorito) {
        const id = Number(this.id);

        return `
        <article class="tarjeta-vehiculo" data-vehiculo="${id}">
            <div class="imagen-vehiculo">
                <img src="${escapar(this.foto())}" alt="${escapar(this.nombre)}" loading="lazy">
                <button type="button" class="agregar-favorito ${favorito ? "activo" : ""}"
                        data-favorito="${id}" aria-pressed="${favorito}"
                        aria-label="${favorito ? "Quitar de favoritos" : "Agregar a favoritos"}">
                    <i data-lucide="heart"></i>
                </button>
            </div>
            <div class="informacion-vehiculo">
                <span class="categoria-vehiculo">${escapar(this.categoria || "Vehículo")}</span>
                <h3>${escapar(this.nombre)}</h3>
                <p>Listo para tu próximo viaje</p>
                <div class="caracteristicas-vehiculo">
                    <span><i data-lucide="calendar-days"></i> ${escapar(this.anio || "-")}</span>
                    <span><i data-lucide="car-front"></i> ${escapar(this.categoria || "-")}</span>
                    <span><i data-lucide="check-circle-2"></i> Disponible</span>
                </div>
                <div class="vehiculo-inferior">
                    <div class="precio-vehiculo">
                        <span>Precio por día</span>
                        <strong>${this.precio}</strong>
                    </div>
                    <button type="button" class="boton-detalles" data-detalles="${id}">Ver detalles</button>
                </div>
            </div>
        </article>`;
    }
}
