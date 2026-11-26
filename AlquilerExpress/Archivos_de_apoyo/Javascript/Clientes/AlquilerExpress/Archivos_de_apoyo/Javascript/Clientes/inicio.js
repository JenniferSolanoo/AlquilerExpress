// Formulario de inicio de sesión
class LoginForm {
    constructor() {
        this.formulario = document.querySelector(".inicio form");
        this.usuario = document.getElementById("usuario");
        this.contrasena = document.getElementById("contrasena");
        this.boton = this.formulario.querySelector('button[type="submit"]');
        this.mensaje = document.getElementById("mensajeInicio");

        if (!this.mensaje) {
            this.mensaje = document.createElement("p");
            this.mensaje.id = "mensajeInicio";
            this.mensaje.setAttribute("role", "status");
            this.formulario.appendChild(this.mensaje);
        }
    }

    avisar(texto, error) {
        this.mensaje.textContent = texto;
        this.mensaje.classList.toggle("error", error);
    }

    async entrar(evento) {
        evento.preventDefault();

        if (!this.formulario.checkValidity()) {
            this.formulario.reportValidity();
            return;
        }

        this.avisar("Verificando credenciales...", false);
        this.boton.disabled = true;

        try {
            const respuesta = await window.api.login(
                this.usuario.value.trim(),
                this.contrasena.value
            );

            window.datos.iniciarSesion(respuesta);
            this.avisar("¡Bienvenido/a! Redirigiendo...", false);

            setTimeout(() => {
                window.location.href = "portalClientes.html";
            }, 700);
        } catch (error) {
            this.avisar(error.message, true);
            this.boton.disabled = false;
        }
    }

    iniciar() {
        this.formulario.addEventListener("submit", evento => this.entrar(evento));
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new LoginForm().iniciar();
});
