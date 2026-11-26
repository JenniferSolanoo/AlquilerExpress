// Registro de un nuevo cliente
class RegistroForm {
    constructor() {
        this.formulario = document.getElementById("formRegistro");
        this.nacionalidad = document.getElementById("nacionalidad");
        this.campoDni = document.getElementById("campoDNI");
        this.camposExtranjero = document.getElementById("camposExtranjero");
        this.dni = document.getElementById("dni");
        this.pasaporte = document.getElementById("pasaporte");
        this.pais = document.getElementById("pais");
        this.licencia = document.getElementById("licencia");
        this.mensaje = document.getElementById("mensajeRegistro");
        this.boton = this.formulario.querySelector('button[type="submit"]');
    }

    valor(id) {
        return document.getElementById(id).value.trim();
    }

    iniciar() {
        this.nacionalidad.addEventListener("change", () => this.cambiarNacionalidad());
        this.formulario.addEventListener("submit", evento => this.enviar(evento));
    }

    cambiarNacionalidad() {
        const esHondurena = this.nacionalidad.value === "hondurena";

        this.campoDni.hidden = !esHondurena;
        this.dni.disabled = !esHondurena;
        this.dni.required = esHondurena;

        this.camposExtranjero.hidden = esHondurena;
        this.pasaporte.disabled = esHondurena;
        this.pasaporte.required = !esHondurena;
        this.pais.disabled = esHondurena;
        this.pais.required = !esHondurena;

        if (esHondurena) {
            this.pasaporte.value = "";
            this.pais.value = "";
        } else {
            this.dni.value = "";
        }

        this.mensaje.textContent = "";
    }

    validar() {
        if (!this.formulario.checkValidity()) {
            this.formulario.reportValidity();
            return false;
        }

        if (this.nacionalidad.value === "hondurena" && !/^\d{13}$/.test(this.dni.value)) {
            this.mensaje.textContent = "El DNI debe contener exactamente 13 dígitos.";
            this.dni.focus();
            return false;
        }

        if (this.nacionalidad.value === "extranjera") {
            if (!this.pasaporte.value.trim()) {
                this.mensaje.textContent = "Ingrese su número de pasaporte.";
                this.pasaporte.focus();
                return false;
            }
            if (!this.pais.value) {
                this.mensaje.textContent = "Seleccione el país de emisión.";
                this.pais.focus();
                return false;
            }
        }

        if (!this.licencia.value.trim()) {
            this.mensaje.textContent = "Ingrese su número de licencia de conducir.";
            this.licencia.focus();
            return false;
        }

        return true;
    }

    datosCliente() {
        const extranjero = this.nacionalidad.value === "extranjera";

        return {
            nombre: this.valor("nombre"),
            apellido: this.valor("apellido"),
            sexo: this.valor("sexo"),
            nacionalidad: this.nacionalidad.value,
            dni: extranjero ? null : this.dni.value.trim(),
            pasaporte: extranjero ? this.pasaporte.value.trim() : null,
            pais: extranjero ? this.pais.value : "Honduras",
            ciudad: "Tegucigalpa",
            licencia: this.licencia.value.trim(),
            telefono: this.valor("telefono"),
            correo: this.valor("correo"),
            contrasena: document.getElementById("contrasena").value,
            aceptarTerminos: document.getElementById("aceptarTerminos").checked
        };
    }

    async enviar(evento) {
        evento.preventDefault();
        this.mensaje.textContent = "";

        if (!this.validar()) return;

        this.boton.disabled = true;
        this.boton.textContent = "Creando cuenta...";

        try {
            await window.api.registrarCliente(this.datosCliente());
            this.mensaje.textContent = "¡Cuenta creada! Redirigiendo al inicio de sesión...";
            this.mensaje.classList.add("exito");

            setTimeout(() => {
                window.location.href = "inicio.html";
            }, 1500);
        } catch (error) {
            this.mensaje.textContent = error.message;
            this.mensaje.classList.remove("exito");
            this.boton.disabled = false;
            this.boton.textContent = "Crear cuenta";
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new RegistroForm().iniciar();
});
