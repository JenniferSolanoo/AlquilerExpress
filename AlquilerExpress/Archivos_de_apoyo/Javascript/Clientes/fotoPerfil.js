
/*
 PROYECTO: AlquilerExpress
 ARCHIVO: fotoPerfil.js
 DESCRIPCIÓN: Permite cambiar y guardar la foto de perfil.
*/

document.addEventListener("DOMContentLoaded", () => {

    const avatar = document.getElementById("avatarIniciales");
    const boton = document.getElementById("cambiarFoto");
    const selector = document.getElementById("fotoPerfil");

    const clave = "alquilerexpress_foto_perfil";

    if (!avatar || !boton || !selector) {
        console.warn("Faltan elementos del cambio de foto.");
        return;
    }

    // Mostrar fotografía en el avatar
    function mostrarFoto(foto) {
        avatar.style.backgroundImage = `url("${foto}")`;
        avatar.classList.add("con-foto");
    }

    // Recuperar fotografía guardada
    try {
        const fotoGuardada = localStorage.getItem(clave);

        if (fotoGuardada) {
            mostrarFoto(fotoGuardada);
        }
    } catch (error) {
        console.warn("No se pudo recuperar la fotografía.");
    }

    // Abrir selector de imágenes
    boton.addEventListener("click", () => {
        selector.click();
    });

    // Seleccionar nueva fotografía
    selector.addEventListener("change", () => {

        const archivo = selector.files[0];

        if (!archivo) return;

        const formatos = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (!formatos.includes(archivo.type)) {
            alert("Selecciona una imagen JPG, PNG o WEBP.");
            selector.value = "";
            return;
        }

        if (archivo.size > 5 * 1024 * 1024) {
            alert("La imagen no debe superar los 5 MB.");
            selector.value = "";
            return;
        }

        const lector = new FileReader();

        lector.onload = () => {

            const imagen = new Image();

            imagen.onload = () => {

                const canvas = document.createElement("canvas");
                const contexto = canvas.getContext("2d");

                if (!contexto) return;

                canvas.width = 300;
                canvas.height = 300;

                // Recortar fotografía al centro
                const lado = Math.min(
                    imagen.width,
                    imagen.height
                );

                const origenX = (imagen.width - lado) / 2;
                const origenY = (imagen.height - lado) / 2;

                contexto.drawImage(
                    imagen,
                    origenX,
                    origenY,
                    lado,
                    lado,
                    0,
                    0,
                    300,
                    300
                );

                const fotoFinal = canvas.toDataURL(
                    "image/jpeg",
                    0.8
                );

                mostrarFoto(fotoFinal);

                // Guardar en el navegador
                try {
                    localStorage.setItem(clave, fotoFinal);
                } catch (error) {
                    alert("La foto se muestra, pero no se pudo guardar.");
                }

                selector.value = "";
            };

            imagen.onerror = () => {
                alert("No se pudo abrir la imagen.");
            };

            imagen.src = lector.result;
        };

        lector.onerror = () => {
            alert("No se pudo leer el archivo.");
        };

        lector.readAsDataURL(archivo);
    });
});
