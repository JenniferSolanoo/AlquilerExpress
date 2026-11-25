// Lo que se guarda en el navegador: sesión, favoritos y reservas
class Almacenamiento {
    constructor() {
        this.sesionKey = "alquilerexpress_sesion";
        this.favoritosKey = "alquilerexpress_favoritos";
        this.reservasKey = "alquilerexpress_reservas";
        this.perfilKey = "alquilerExpressPerfilDemo";
    }

    leer(clave, valorPorDefecto) {
        try {
            const texto = localStorage.getItem(clave);
            return texto ? JSON.parse(texto) : valorPorDefecto;
        } catch (error) {
            return valorPorDefecto;
        }
    }

    guardar(clave, valor) {
        localStorage.setItem(clave, JSON.stringify(valor));
    }

    iniciarSesion(respuesta) {
        this.guardar(this.sesionKey, {
            tipo: respuesta.tipo,
            datos: respuesta.datos
        });
    }

    sesion() {
        return this.leer(this.sesionKey, null);
    }

    clienteId() {
        const sesion = this.sesion();
        return sesion && sesion.datos ? sesion.datos.id : null;
    }

    actualizarSesion(cambios) {
        const sesion = this.sesion();
        if (!sesion) return;
        this.guardar(this.sesionKey, {
            ...sesion,
            datos: { ...sesion.datos, ...cambios }
        });
    }

    cerrarSesion() {
        localStorage.removeItem(this.sesionKey);
    }

    favoritos() {
        return this.leer(this.favoritosKey, []);
    }

    esFavorito(id) {
        return this.favoritos().includes(Number(id));
    }

    alternarFavorito(id) {
        const lista = this.favoritos();
        const posicion = lista.indexOf(Number(id));

        if (posicion === -1) {
            lista.push(Number(id));
        } else {
            lista.splice(posicion, 1);
        }

        this.guardar(this.favoritosKey, lista);
        return posicion === -1;
    }

    guardarReserva(reserva) {
        const lista = this.leer(this.reservasKey, []);
        lista.unshift(reserva);
        this.guardar(this.reservasKey, lista);
    }
}

window.datos = new Almacenamiento();
