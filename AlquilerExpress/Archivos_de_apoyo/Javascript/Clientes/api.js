// Conexión con la API de FastAPI
class Api {
    constructor(base) {
        this.base = base;
    }

    async pedir(ruta, metodo = "GET", cuerpo) {
        const opciones = {
            method: metodo,
            headers: { Accept: "application/json" }
        };

        if (cuerpo) {
            opciones.headers["Content-Type"] = "application/json";
            opciones.body = JSON.stringify(cuerpo);
        }

        let respuesta;
        try {
            respuesta = await fetch(this.base + ruta, opciones);
        } catch (error) {
            throw new Error("No se pudo conectar con el servidor.");
        }

        const datos = await respuesta.json().catch(() => null);

        if (!respuesta.ok) {
            throw new Error(datos && datos.detail ? datos.detail : "Error en la petición");
        }

        return datos;
    }

    login(usuario, contrasena) {
        return this.pedir("/login/", "POST", { usuario, contrasena });
    }

    registrarCliente(datos) {
        return this.pedir("/clientes/", "POST", datos);
    }

    obtenerCliente(id) {
        return this.pedir("/clientes/" + id);
    }

    actualizarCliente(id, datos) {
        return this.pedir("/clientes/" + id, "PUT", datos);
    }

    vehiculosDisponibles() {
        return this.pedir("/vehiculos/?disponibles=true");
    }

    calcularCosto(vehiculoId, dias) {
        return this.pedir("/vehiculos/calcular-costo", "POST", {
            vehiculo_id: vehiculoId,
            dias: dias,
            tasa_impuesto: 0.15
        });
    }

    reservar(datos) {
        return this.pedir("/alquileres/", "POST", datos);
    }
}

const base = window.ALQUILEREXPRESS_API_URL ||
    (location.protocol === "file:" ? "http://localhost:8000" : "");

window.api = new Api(base);
