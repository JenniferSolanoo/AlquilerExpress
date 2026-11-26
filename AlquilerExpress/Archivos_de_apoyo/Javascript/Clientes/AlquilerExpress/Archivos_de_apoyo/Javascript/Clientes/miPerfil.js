// Pantalla "Mi perfil": edición y guardado
class PerfilForm {
    constructor() {
        this.nombres = ["nombre", "apellido", "correo", "telefono", "ciudad", "pais"];
        this.campos = this.nombres.map(id => document.getElementById(id));
        this.formulario = document.getElementById("formularioPerfil");
        this.editar = document.getElementById("editarDatos");
        this.cancelar = document.getElementById("cancelarDatos");
        this.acciones = document.getElementById("accionesFormulario");
        this.notificacion = document.getElementById("notificacion");
        this.nombreVisible = document.getElementById("nombreVisible");
        this.correoVisible = document.getElementById("correoVisible");
        this.avatar = document.getElementById("avatarIniciales");
        this.claveLocal = "alquilerExpressPerfilDemo";
        this.clienteId = window.datos.clienteId();
        this.perfil = {
            nombre: "", apellido: "", correo: "",
            telefono: "", ciudad: "", pais: "Honduras"
        };
    }

    iniciar() {
        this.cargarLocal();
        this.mostrar();
        this.modoEdicion(false);
        this.escuchar();

        if (this.clienteId) this.cargarDelServidor();
        if (window.lucide) window.lucide.createIcons();
    }

    cargarLocal() {
        const guardado = window.datos.leer(this.claveLocal, null);
        if (!guardado) return;

        this.nombres.forEach(nombre => {
            if (typeof guardado[nombre] === "string") {
                this.perfil[nombre] = guardado[nombre];
            }
        });
    }

    async cargarDelServidor() {
        try {
            const cliente = await window.api.obtenerCliente(this.clienteId);
            this.nombres.forEach(nombre => {
                if (typeof cliente[nombre] === "string") {
                    this.perfil[nombre] = cliente[nombre];
                }
            });
            this.mostrar();
        } catch (error) {
            console.warn("Perfil en modo local:", error.message);
        }
    }

    mostrar() {
        this.campos.forEach(campo => {
            campo.value = this.perfil[campo.name] || "";
        });

        this.nombreVisible.textContent =
            [this.perfil.nombre, this.perfil.apellido].filter(Boolean).join(" ") || "Tu nombre";

        this.correoVisible.textContent = this.perfil.correo || "Agrega tu correo electrónico";

        const iniciales = [this.perfil.nombre, this.perfil.apellido]
            .filter(Boolean)
            .map(parte => parte.charAt(0).toUpperCase())
            .join("");

        this.avatar.textContent = iniciales || "AE";
    }

    modoEdicion(editando) {
        this.campos.forEach(campo => {
            campo.readOnly = !editando;
        });

        const pais = document.getElementById("pais");
        if (pais) pais.disabled = !editando;

        this.editar.hidden = editando;
        this.acciones.hidden = !editando;
        if (editando) this.campos[0].focus();
    }

    avisar(texto) {
        this.notificacion.textContent = texto;
        this.notificacion.hidden = false;
        clearTimeout(this.temporizador);
        this.temporizador = setTimeout(() => {
            this.notificacion.hidden = true;
        }, 4000);
    }

    escuchar() {
        this.editar.addEventListener("click", () => this.modoEdicion(true));

        this.cancelar.addEventListener("click", () => {
            this.mostrar();
            this.modoEdicion(false);
        });

        this.formulario.addEventListener("submit", evento => this.guardar(evento));

        document.querySelectorAll('a[href="inicio.html"]').forEach(enlace => {
            enlace.addEventListener("click", () => window.datos.cerrarSesion());
        });
    }

    async guardar(evento) {
        evento.preventDefault();
        if (!this.formulario.reportValidity()) return;

        const nuevo = {};
        this.campos.forEach(campo => {
            nuevo[campo.name] = campo.value.trim();
        });

        const boton = this.formulario.querySelector('button[type="submit"]');
        let enServidor = false;

        if (this.clienteId) {
            boton.disabled = true;
            try {
                const actualizado = await window.api.actualizarCliente(this.clienteId, nuevo);
                window.datos.actualizarSesion(actualizado);
                enServidor = true;
            } catch (error) {
                console.warn("No se pudo actualizar en el servidor:", error.message);
            }
            boton.disabled = false;
        }

        try {
            window.datos.guardar(this.claveLocal, nuevo);
            this.perfil = nuevo;
            this.mostrar();
            this.modoEdicion(false);
            this.avisar(enServidor
                ? "Los cambios se guardaron correctamente."
                : "Cambios guardados solo en este navegador.");
        } catch (error) {
            this.avisar("No se pudieron guardar los cambios.");
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new PerfilForm().iniciar();
});
