// Modal de detalle: costo estimado y confirmación de la reserva
class Reserva {
    constructor(api, almacenamiento) {
        this.api = api;
        this.datos = almacenamiento;
        this.vehiculo = null;
        this.criterios = null;
        this.dialogo = this.crearDialogo();
    }

    crearDialogo() {
        const dialogo = document.createElement("dialog");
        dialogo.id = "modalReserva";
        dialogo.className = "modal-reserva";
        dialogo.innerHTML = `
            <div class="modal-reserva-cabecera">
                <div>
                    <p class="reserva-etiqueta">DETALLE DEL VEHÍCULO</p>
                    <h2 id="reservaTitulo"></h2>
                </div>
                <button type="button" id="reservaCerrarX" class="cerrar-x" aria-label="Cerrar">×</button>
            </div>
            <div id="reservaDatos" class="reserva-datos"></div>
            <div id="reservaCosto" class="reserva-costo">Calculando el costo...</div>
            <p id="reservaMensaje" class="reserva-mensaje" role="status"></p>
            <div class="reserva-acciones">
                <button type="button" id="reservaCerrar" class="boton-claro">Cerrar</button>
                <button type="button" id="reservaConfirmar" class="boton-detalles">Reservar</button>
            </div>`;

        document.body.appendChild(dialogo);

        dialogo.querySelector("#reservaCerrar").addEventListener("click", () => this.cerrar());
        dialogo.querySelector("#reservaCerrarX").addEventListener("click", () => this.cerrar());
        dialogo.querySelector("#reservaConfirmar").onclick = () => this.confirmar();

        return dialogo;
    }

    abrir(vehiculo, criterios) {
        this.vehiculo = vehiculo;
        this.criterios = criterios;

        const filas = [
            ["Categoría", vehiculo.categoria || "-"],
            ["Año", vehiculo.anio || "-"],
            ["Precio por día", vehiculo.precio],
            ["Recogida", criterios.fechaRecogida + " · " + criterios.horaRecogida],
            ["Devolución", criterios.fechaDevolucion + " · " + criterios.horaDevolucion]
        ];

        // filter + reduce: quitamos filas vacías y armamos el HTML acumulando
        const detalles = filas
            .filter(fila => fila[1])
            .reduce((html, fila) =>
                html + `<p><strong>${escapar(fila[0])}:</strong> ${escapar(fila[1])}</p>`, "");

        this.dialogo.querySelector("#reservaTitulo").textContent = vehiculo.nombre;
        this.dialogo.querySelector("#reservaDatos").innerHTML = detalles;

        const mensaje = this.dialogo.querySelector("#reservaMensaje");
        const boton = this.dialogo.querySelector("#reservaConfirmar");
        mensaje.textContent = "";
        mensaje.classList.remove("exito");
        boton.textContent = "Reservar";
        boton.disabled = false;
        boton.onclick = () => this.confirmar();

        if (typeof this.dialogo.showModal === "function") this.dialogo.showModal();
        else this.dialogo.setAttribute("open", "");

        this.calcularCosto();
    }

    cerrar() {
        if (typeof this.dialogo.close === "function") this.dialogo.close();
        else this.dialogo.removeAttribute("open");
    }

    async calcularCosto() {
        const caja = this.dialogo.querySelector("#reservaCosto");

        try {
            const costo = await this.api.calcularCosto(this.vehiculo.id, this.criterios.dias);
            caja.innerHTML = `
                <p><strong>Días:</strong> ${costo.dias}</p>
                <p><strong>Subtotal:</strong> L ${costo.subtotal.toFixed(2)}</p>
                <p><strong>Impuesto (15%):</strong> L ${costo.impuesto.toFixed(2)}</p>
                <p class="total"><strong>Total: L ${costo.total.toFixed(2)}</strong></p>`;
        } catch (error) {
            caja.textContent = "No se pudo calcular el total: " + error.message;
        }
    }

    async confirmar() {
        const sesion = this.datos.sesion();
        const mensaje = this.dialogo.querySelector("#reservaMensaje");
        const boton = this.dialogo.querySelector("#reservaConfirmar");

        if (!sesion || sesion.tipo !== "cliente") {
            mensaje.innerHTML = 'Inicia sesión como cliente para reservar. <a href="inicio.html">Ir a iniciar sesión</a>';
            boton.textContent = "Iniciar sesión";
            boton.onclick = () => { window.location.href = "inicio.html"; };
            return;
        }

        boton.disabled = true;
        boton.textContent = "Reservando...";

        try {
            const respuesta = await this.api.reservar({
                cliente_id: this.datos.clienteId(),
                vehiculo_id: this.vehiculo.id,
                dias: this.criterios.dias,
                fecha_inicio: this.criterios.fechaRecogida + "T" + this.criterios.horaRecogida,
                fecha_fin: this.criterios.fechaDevolucion + "T" + this.criterios.horaDevolucion,
                ubicacion_recogida: this.criterios.recogida,
                edad_conductor: this.criterios.edadConductor
            });

            this.datos.guardarReserva({
                id: respuesta.alquiler.id,
                vehiculo: this.vehiculo.nombre,
                total: respuesta.alquiler.total,
                factura: respuesta.factura.numero
            });

            mensaje.textContent = "Reserva confirmada. Factura: " + respuesta.factura.numero;
            mensaje.classList.add("exito");
            boton.textContent = "Listo";
            boton.onclick = () => {
                this.cerrar();
                window.dispatchEvent(new Event("reservaConfirmada"));
            };
        } catch (error) {
            mensaje.textContent = error.message;
            boton.disabled = false;
            boton.textContent = "Reintentar";
        }
    }
}
