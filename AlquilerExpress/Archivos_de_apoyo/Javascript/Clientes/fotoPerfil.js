
/* ALQUILEREXPRESS - FOTO DE PERFIL */

document.addEventListener("DOMContentLoaded", () => {

    const avatar = document.getElementById("avatarIniciales");
    const boton = document.getElementById("cambiarFoto");
    const selector = document.getElementById("fotoPerfil");

    const clave = "alquilerexpress_foto_perfil";

    if (!avatar || !boton || !selector) {
        console.error("Faltan elementos para cambiar la foto.");
        return;
    }

    // Mostrar fotografía
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
        console.warn("No se pudo recuperar la foto.");
    }

    // Abrir selector de fotografías
    boton.addEventListener("click", () => {
        selector.click();
    });

    // Cuando se selecciona una fotografía
    selector.addEventListener("change", () => {

        const archivo = selector.files[0];

        if (!archivo) {
            return;
        }

        const formatosPermitidos = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (!formatosPermitidos.includes(archivo.type)) {
            alert("Selecciona una imagen JPG, PNG o WEBP.");
            selector.value = "";
            return;
        }

        if (archivo.size > 5 * 1024 * 1024) {
            alert("La imagen no puede superar los 5 MB.");
            selector.value = "";
            return;
        }

        const lector = new FileReader();

        lector.onload = () => {

            const imagen = new Image();

            imagen.onload = () => {

                const canvas = document.createElement("canvas");

                canvas.width = 300;
                canvas.height = 300;

                const contexto = canvas.getContext("2d");

                if (!contexto) {
                    alert("No se pudo procesar la fotografía.");
                    return;
                }

                // Recortar la imagen al centro
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

                // Convertir a JPG comprimido
                const fotoFinal = canvas.toDataURL(
                    "image/jpeg",
                    0.8
                );

                // Mostrar la fotografía
                mostrarFoto(fotoFinal);

                // Guardar en el navegador
                try {
                    localStorage.setItem(clave, fotoFinal);

                } catch (error) {
                    alert(
                        "La foto se muestra, pero no se pudo guardar."
                    );
                }

                selector.value = "";
            };

            imagen.onerror = () => {
                alert("No se pudo abrir la imagen.");
            };

            imagen.src = lector.result;
        };

        lector.onerror = () => {
            alert("No se pudo leer la fotografía.");
        };

        lector.readAsDataURL(archivo);
    });

});
