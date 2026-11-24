
/* ALQUILEREXPRESS - MI PERFIL */

document.addEventListener("DOMContentLoaded", () => {

    const clave = "alquilerExpressPerfilDemo";

    const nombresCampos = [
        "nombre",
        "apellido",
        "correo",
        "telefono",
        "ciudad",
        "pais"
    ];

    const campos = nombresCampos.map(nombre =>
        document.getElementById(nombre)
    );

    const formulario = document.getElementById("formularioPerfil");
    const editar = document.getElementById("editarDatos");
    const cancelar = document.getElementById("cancelarDatos");
    const acciones = document.getElementById("accionesFormulario");
    const notificacion = document.getElementById("notificacion");

    const nombreVisible = document.getElementById("nombreVisible");
    const correoVisible = document.getElementById("correoVisible");
    const avatar = document.getElementById("avatarIniciales");

    if (
        !formulario || !editar || !cancelar ||
        !acciones || !notificacion ||
        !nombreVisible || !correoVisible ||
        !avatar || campos.some(campo => !campo)
    ) {
        console.error("Faltan elementos del perfil en el HTML.");
        return;
    }

    const valoresIniciales = {
        nombre: "",
        apellido: "",
        correo: "",
        telefono: "",
        ciudad: "",
        pais: "Honduras"
    };

    let datos = { ...valoresIniciales };
    let temporizador;

    // Recuperar datos guardados
    try {
        const guardados = JSON.parse(
            localStorage.getItem(clave) || "null"
        );

        if (guardados && typeof guardados === "object") {
            nombresCampos.forEach(nombre => {
                if (typeof guardados[nombre] === "string") {
                    datos[nombre] = guardados[nombre];
                }
            });
        }
    } catch (error) {
        console.warn("No se pudieron recuperar los datos.");
    }

    // Mostrar datos en el formulario
    function rellenarFormulario() {
        campos.forEach(campo => {
            campo.value = datos[campo.name] || "";
        });
    }

    // Actualizar nombre, correo e iniciales
    function actualizarPortada() {

        const nombreCompleto = [
            datos.nombre,
            datos.apellido
        ].filter(Boolean).join(" ").trim();

        nombreVisible.textContent = nombreCompleto || "Tu nombre";

        correoVisible.textContent =
            datos.correo || "Agrega tu correo electrónico";

        const iniciales = [
            datos.nombre,
            datos.apellido
        ]
        .filter(parte => parte.trim())
        .map(parte => parte.trim().charAt(0).toUpperCase())
        .join("");

        avatar.textContent = iniciales || "AE";
    }

    // Activar o desactivar edición
    function modoEdicion(estaEditando) {

        campos.forEach(campo => {
            campo.readOnly = !estaEditando;
        });

        editar.hidden = estaEditando;
        acciones.hidden = !estaEditando;

        if (estaEditando) {
            document.getElementById("nombre").focus();
        }
    }

    // Mostrar notificaciones
    function mostrarMensaje(mensaje) {

        clearTimeout(temporizador);

        notificacion.textContent = mensaje;
        notificacion.hidden = false;

        temporizador = setTimeout(() => {
            notificacion.hidden = true;
        }, 4000);
    }

    // Botón editar
    editar.addEventListener("click", () => {
        modoEdicion(true);
    });

    // Botón cancelar
    cancelar.addEventListener("click", () => {
        rellenarFormulario();
        modoEdicion(false);
    });

    // Guardar cambios
    formulario.addEventListener("submit", evento => {

        evento.preventDefault();

        if (!formulario.reportValidity()) {
            return;
        }

        const nuevosDatos = {};

        campos.forEach(campo => {
            nuevosDatos[campo.name] = campo.value.trim();
        });

        try {
            localStorage.setItem(
                clave,
                JSON.stringify(nuevosDatos)
            );

            datos = nuevosDatos;

            rellenarFormulario();
            actualizarPortada();
            modoEdicion(false);

            mostrarMensaje("Los cambios se guardaron correctamente.");

        } catch (error) {
            mostrarMensaje("No se pudieron guardar los cambios.");
        }
    });

    // Inicializar perfil
    rellenarFormulario();
    actualizarPortada();
    modoEdicion(false);

    if (window.lucide) {
        window.lucide.createIcons();
    }

});
