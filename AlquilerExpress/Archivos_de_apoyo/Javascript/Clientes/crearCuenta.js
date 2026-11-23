
document.addEventListener("DOMContentLoaded", function () {

    // ELEMENTOS DEL FORMULARIO

    const formulario = document.getElementById("formRegistro");

    const nacionalidad = document.getElementById("nacionalidad");

    const campoDNI = document.getElementById("campoDNI");
    const camposExtranjero = document.getElementById("camposExtranjero");

    const dni = document.getElementById("dni");
    const pasaporte = document.getElementById("pasaporte");
    const pais = document.getElementById("pais");

    const licencia = document.getElementById("licencia");
    const mensaje = document.getElementById("mensajeRegistro");


    // CAMBIAR CAMPOS SEGUN NACIONALIDAD

    nacionalidad.addEventListener("change", function () {

        if (nacionalidad.value === "hondurena") {

            // MOSTRAR DNI
            campoDNI.hidden = false;
            dni.disabled = false;
            dni.required = true;

            // OCULTAR PASAPORTE Y PAIS
            camposExtranjero.hidden = true;

            pasaporte.disabled = true;
            pasaporte.required = false;

            pais.disabled = true;
            pais.required = false;

            // LIMPIAR CAMPOS
            pasaporte.value = "";
            pais.value = "";

        } else if (nacionalidad.value === "extranjera") {

            // OCULTAR DNI
            campoDNI.hidden = true;
            dni.disabled = true;
            dni.required = false;

            // MOSTRAR PASAPORTE Y PAIS
            camposExtranjero.hidden = false;

            pasaporte.disabled = false;
            pasaporte.required = true;

            pais.disabled = false;
            pais.required = true;

            // LIMPIAR DNI
            dni.value = "";

        }

        mensaje.textContent = "";

    });


    // VALIDAR EL FORMULARIO

    formulario.addEventListener("submit", function (event) {

        event.preventDefault();

        mensaje.textContent = "";

        // VALIDAR CAMPOS OBLIGATORIOS
        if (!formulario.checkValidity()) {
            formulario.reportValidity();
            return;
        }

        // VALIDAR DNI HONDUREÑO
        if (nacionalidad.value === "hondurena") {

            if (!/^[0-9]{13}$/.test(dni.value)) {

                mensaje.textContent =
                    "El DNI debe contener exactamente 13 dígitos.";

                dni.focus();
                return;
            }
        }

        // VALIDAR DATOS DE EXTRANJEROS
        if (nacionalidad.value === "extranjera") {

            if (pasaporte.value.trim() === "") {

                mensaje.textContent =
                    "Ingrese su número de pasaporte.";

                pasaporte.focus();
                return;
            }

            if (pais.value === "") {

                mensaje.textContent =
                    "Seleccione el país de emisión.";

                pais.focus();
                return;
            }
        }

        // VALIDAR LICENCIA DE CONDUCIR
        if (licencia.value.trim() === "") {

            mensaje.textContent =
                "Ingrese su número de licencia de conducir.";

            licencia.focus();
            return;
        }

        // FORMULARIO LISTO PARA CONECTAR AL BACKEND

        mensaje.textContent =
            "Formulario validado correctamente. " +
            "Falta conectar el registro con el servidor.";

    });

});
