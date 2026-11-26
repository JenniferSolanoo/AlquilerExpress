// Carga y dibuja la lista de vehículos disponibles
class ListaVehiculos {
    constructor(api, almacenamiento, reserva, buscador) {
        this.api = api;
        this.datos = almacenamiento;
        this.reserva = reserva;
        this.buscador = buscador;
        this.lista = document.getElementById("listaVehiculos");
        this.vacio = document.getElementById("mensajeSinVehiculos");
        this.vehiculos = [];
    }

    iniciar() {
        this.lista.addEventListener("click", evento => this.dentroDelClick(evento));
    }

    async cargar() {
        this.vacio.hidden = true;
        this.lista.innerHTML = '<p class="cargando">Consultando vehículos...</p>';

        try {
            const respuesta = await this.api.vehiculosDisponibles();

            // filter + map: dejamos solo los disponibles y los convertimos en objetos
            this.vehiculos = respuesta
                .filter(item => item.disponible !== false)
                .map(item => new Vehiculo(item));

            this.pintar();
        } catch (error) {
            this.lista.innerHTML = '<p class="cargando">' + escapar(error.message) + '</p>';
        }
    }

    pintar() {
        if (this.vehiculos.length === 0) {
            this.lista.innerHTML = "";
            this.vacio.hidden = false;
            return;
        }

        this.lista.innerHTML = this.vehiculos.map(vehiculo =>
            vehiculo.tarjeta(this.datos.esFavorito(vehiculo.id))
        ).join("");

        this.lista.querySelectorAll(".imagen-vehiculo img").forEach(imagen => {
            imagen.addEventListener("error", () => {
                imagen.src = Vehiculo.imagenPorDefecto();
            });
        });

        if (window.lucide) window.lucide.createIcons();
    }

    dentroDelClick(evento) {
        const corazon = evento.target.closest("[data-favorito]");
        if (corazon) {
            this.cambiarFavorito(corazon);
            return;
        }

        const boton = evento.target.closest("[data-detalles]");
        if (boton) {
            const id = Number(boton.dataset.detalles);
            const vehiculo = this.vehiculos.find(item => Number(item.id) === id);
            if (vehiculo) {
                this.reserva.abrir(vehiculo, this.buscador.leer());
            }
        }
    }

    cambiarFavorito(boton) {
        const id = Number(boton.dataset.favorito);
        const activo = this.datos.alternarFavorito(id);

        boton.classList.toggle("activo", activo);
        boton.setAttribute("aria-pressed", String(activo));
        boton.setAttribute("aria-label", activo ? "Quitar de favoritos" : "Agregar a favoritos");
        boton.innerHTML = '<i data-lucide="heart"></i>';

        if (window.lucide) window.lucide.createIcons();
    }
}
