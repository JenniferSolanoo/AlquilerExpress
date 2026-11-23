
document.addEventListener("DOMContentLoaded", function() {

    let contrasena = document.getElementById("contrasena");
    let boton = document.querySelector(".ver-contrasena");

    boton.addEventListener("click", function() {

        if (contrasena.type === "password") {
            contrasena.type = "text";
            boton.classList.add("activa");
            boton.setAttribute("aria-label", "Ocultar contraseña");
            boton.setAttribute("aria-pressed", "true");
        } else {
            contrasena.type = "password";
            boton.classList.remove("activa");
            boton.setAttribute("aria-label", "Mostrar contraseña");
            boton.setAttribute("aria-pressed", "false");
        }

    });

});
