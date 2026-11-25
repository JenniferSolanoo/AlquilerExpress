from app.models.persona import Persona


class Usuario(Persona):
    def __init__(self, id: int, nombre: str, correo: str, password: str, rol: str = "admin", activo: bool = True):
        super().__init__(id=id, nombre=nombre, correo=correo, activo=activo)
        self.__password = password
        self.rol = rol

    def verificar_password(self, password_ingresada: str) -> bool:
        # Login simple sin encriptación según requerimiento del proyecto
        return self.__password == password_ingresada

    def to_dict(self, incluir_password: bool = False) -> dict:
        data = {
            "id": self.id,
            "nombre": self.nombre,
            "correo": self.correo,
            "rol": self.rol,
            "activo": self.activo,
        }
        if incluir_password:
            data["password"] = self.__password
        return data