// Fechas y datos del formulario de búsqueda
class Buscador {
    constructor() {
        this.formulario = document.querySelector(".formulario-busqueda");
        this.recogida = document.getElementById("recogida");
        this.entrada = document.getElementById("fechaRecogida");
        this.salida = document.getElementById("fechaDevolucion");
        this.horaEntrada = document.getElementById("horaRecogida");
        this.horaSalida = document.getElementById("horaDevolucion");
        this.edad = document.getElementById("edadConductor");
        this.mensaje = document.getElementById("mensajeBusqueda");
        this.clave = "alquilerexpress_busqueda";

        if (!this.mensaje) {
            this.mensaje = document.createElement("p");
            this.mensaje.id = "mensajeBusqueda";
            this.formulario.appendChild(this.mensaje);
        }
    }

    formato(fecha) {
        const mes = String(fecha.getMonth() + 1).padStart(2, "0");
        const dia = String(fecha.getDate()).padStart(2, "0");
        return fecha.getFullYear() + "-" + mes + "-" + dia;
    }

    iniciar() {
        const hoy = this.formato(new Date());
        this.entrada.min = hoy;
        this.salida.min = hoy;
        this.entrada.value = this.sumarDias(hoy, 1);
        this.salida.value = this.sumarDias(hoy, 3);

        this.entrada.addEventListener("change", () => {
            this.salida.min = this.entrada.value;
            if (this.salida.value < this.salida.min) {
                this.salida.value = this.salida.min;
            }
            this.mensaje.textContent = "";
        });

        this.salida.addEventListener("change", () => {
            this.mensaje.textContent = "";
        });

        this.formulario.addEventListener("submit", evento => {
            evento.preventDefault();
            if (!this.validar()) return;
            this.guardar();
            this.formulario.dispatchEvent(new CustomEvent("busqueda", { bubbles: true }));
        });

        this.guardar();
    }

    sumarDias(fecha, dias) {
        const nueva = new Date(fecha + "T00:00:00");
        nueva.setDate(nueva.getDate() + dias);
        return this.formato(nueva);
    }

    validar() {
        this.mensaje.textContent = "";

        const mismaFecha = this.entrada.value === this.salida.value;
        const mismaHora = this.horaEntrada.value === this.horaSalida.value;

        if (!this.entrada.value || !this.salida.value ||
            this.salida.value < this.entrada.value || (mismaFecha && mismaHora)) {
            this.mensaje.textContent = "La devolución debe ser posterior a la recogida.";
            return false;
        }
        return true;
    }

    criterios() {
        const inicio = new Date(this.entrada.value + "T00:00:00");
        const fin = new Date(this.salida.value + "T00:00:00");
        const dias = Math.max(1, Math.round((fin - inicio) / 86400000));

        return {
            recogida: this.recogida.value,
            fechaRecogida: this.entrada.value,
            horaRecogida: this.horaEntrada.value,
            fechaDevolucion: this.salida.value,
            horaDevolucion: this.horaSalida.value,
            edadConductor: this.edad.value,
            dias: dias
        };
    }

    guardar() {
        sessionStorage.setItem(this.clave, JSON.stringify(this.criterios()));
    }

    leer() {
        try {
            return JSON.parse(sessionStorage.getItem(this.clave)) || this.criterios();
        } catch (error) {
            return this.criterios();
        }
    }
}
