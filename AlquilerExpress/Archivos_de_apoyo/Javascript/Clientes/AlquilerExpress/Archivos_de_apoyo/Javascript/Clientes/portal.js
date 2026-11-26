// Arma el portal: une buscador, lista y reserva
class Portal {
    constructor() {
        this.buscador = new Buscador();
        this.reserva = new Reserva(window.api, window.datos);
        this.lista = new ListaVehiculos(window.api, window.datos, this.reserva, this.buscador);
    }

    iniciar() {
        this.buscador.iniciar();
        this.lista.iniciar();

        this.buscador.formulario.addEventListener("busqueda", () => {
            this.lista.cargar();
            document.getElementById("vehiculos").scrollIntoView({ behavior: "smooth" });
        });

        window.addEventListener("reservaConfirmada", () => this.lista.cargar());

        this.configurarMenu();

        document.querySelectorAll('a[href="inicio.html"]').forEach(enlace => {
            enlace.addEventListener("click", () => window.datos.cerrarSesion());
        });

        this.lista.cargar();
    }

    configurarMenu() {
        const boton = document.querySelector(".boton-menu");
        const menu = document.querySelector(".menu-lateral");
        if (!boton || !menu) return;

        boton.setAttribute("aria-expanded", "false");
        boton.addEventListener("click", () => {
            const abierto = menu.classList.toggle("menu-abierto");
            boton.setAttribute("aria-expanded", String(abierto));

            // en pantallas pequeñas lo mostramos flotante
            if (window.innerWidth <= 900) {
                menu.style.display = abierto ? "block" : "";
                menu.style.position = abierto ? "fixed" : "";
                menu.style.top = abierto ? "78px" : "";
                menu.style.right = abierto ? "12px" : "";
                menu.style.left = abierto ? "auto" : "";
                menu.style.zIndex = abierto ? "1000" : "";
            }
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new Portal().iniciar();
});
