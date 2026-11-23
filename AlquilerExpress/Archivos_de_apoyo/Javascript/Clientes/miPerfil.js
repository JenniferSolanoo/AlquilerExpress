/* Mi perfil de AlquilerExpress
   DEMOSTRACIÓN FRONTEND: los datos se guardan en este navegador,
   no en la base de datos de la aplicación. */

document.addEventListener('DOMContentLoaded', () => {
    const clave = 'alquilerExpressPerfilDemo';
    const nombresCampos = ['nombre', 'apellido', 'correo', 'telefono', 'ciudad', 'pais'];
    const campos = nombresCampos.map((nombre) => document.getElementById(nombre));
    const formulario = document.getElementById('formularioPerfil');
    const editar = document.getElementById('editarDatos');
    const cancelar = document.getElementById('cancelarDatos');
    const acciones = document.getElementById('accionesFormulario');
    const borrar = document.getElementById('borrarDatos');
    const notificacion = document.getElementById('notificacion');

    const valoresIniciales = {
        nombre: '', apellido: '', correo: '', telefono: '', ciudad: '', pais: 'Honduras'
    };
    let datos = { ...valoresIniciales };
    let temporizador;

    // Recuperar solamente los campos conocidos de una demostración previa.
    try {
        const guardados = JSON.parse(localStorage.getItem(clave) || 'null');
        if (guardados && typeof guardados === 'object' && !Array.isArray(guardados)) {
            nombresCampos.forEach((nombre) => {
                if (typeof guardados[nombre] === 'string') datos[nombre] = guardados[nombre];
            });
        }
    } catch (error) {
        // Si el navegador bloquea el almacenamiento, el formulario aún se puede visualizar.
    }

    function rellenarFormulario() {
        campos.forEach((campo) => { campo.value = datos[campo.name] || ''; });
    }

    function actualizarPortada() {
        const nombreCompleto = [datos.nombre, datos.apellido].filter(Boolean).join(' ').trim();
        document.getElementById('nombreVisible').textContent = nombreCompleto || 'Tu nombre';
        document.getElementById('correoVisible').textContent = datos.correo || 'Agrega tu correo electrónico';

        const iniciales = [datos.nombre, datos.apellido]
            .filter((parte) => parte.trim())
            .map((parte) => parte.trim().charAt(0).toUpperCase())
            .join('');
        document.getElementById('avatarIniciales').textContent = iniciales || 'AE';
    }

    function modoEdicion(estaEditando) {
        campos.forEach((campo) => { campo.readOnly = !estaEditando; });
        editar.hidden = estaEditando;
        acciones.hidden = !estaEditando;
        if (estaEditando) document.getElementById('nombre').focus();
    }

    function mostrarMensaje(mensaje) {
        clearTimeout(temporizador);
        notificacion.textContent = mensaje;
        notificacion.hidden = false;
        temporizador = setTimeout(() => { notificacion.hidden = true; }, 4000);
    }

    editar.addEventListener('click', () => modoEdicion(true));
    cancelar.addEventListener('click', () => {
        rellenarFormulario();
        modoEdicion(false);
    });

    formulario.addEventListener('submit', (evento) => {
        evento.preventDefault();
        const nuevosDatos = {};
        campos.forEach((campo) => { nuevosDatos[campo.name] = campo.value.trim(); });
        // checkValidity se ejecuta automáticamente en la mayoría de navegadores.
        // Evitamos guardar nombres vacíos o un correo inválido.
        if (!formulario.reportValidity()) return;

        try {
            localStorage.setItem(clave, JSON.stringify(nuevosDatos));
            datos = nuevosDatos;
            rellenarFormulario();
            actualizarPortada();
            modoEdicion(false);
            mostrarMensaje('Los cambios se guardaron en este navegador.');
        } catch (error) {
            mostrarMensaje('El navegador no permitió guardar los cambios.');
        }
    });

    borrar.addEventListener('click', () => {
        if (!window.confirm('¿Quieres borrar los datos de demostración de este navegador?')) return;
        try {
            localStorage.removeItem(clave);
            datos = { ...valoresIniciales };
            rellenarFormulario();
            actualizarPortada();
            modoEdicion(false);
            mostrarMensaje('Se borraron los datos de demostración.');
        } catch (error) {
            mostrarMensaje('El navegador no permitió borrar los datos.');
        }
    });

    rellenarFormulario();
    actualizarPortada();
    modoEdicion(false);
    if (window.lucide) window.lucide.createIcons();
});
