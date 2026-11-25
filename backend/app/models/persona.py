class Persona:
    def __init__(self, id: int, nombre: str, correo: str, activo: bool = True):
        self._id = id
        self._nombre = nombre
        self.__correo = correo
        self.__activo = activo

    @property
    def id(self) -> int:
        return self._id

    @property
    def nombre(self) -> str:
        return self._nombre

    @nombre.setter
    def nombre(self, valor: str) -> None:
        if not valor.strip():
            raise ValueError("El nombre no puede estar vacío")
        self._nombre = valor.strip()

    @property
    def correo(self) -> str:
        return self.__correo

    @correo.setter
    def correo(self, nuevo_correo: str) -> None:
        if "@" not in nuevo_correo:
            raise ValueError("Correo inválido")
        self.__correo = nuevo_correo.strip()

    @property
    def activo(self) -> bool:
        return self.__activo

    def activar(self) -> None:
        self.__activo = True

    def desactivar(self) -> None:
        self.__activo = False