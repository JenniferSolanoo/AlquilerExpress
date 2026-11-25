from app.models.persona import Persona


class Cliente(Persona):
    def __init__(
        self,
        id: int,
        nombre: str,
        correo: str,
        telefono: str,
        licencia: str,
        password: str = "12345678",
        activo: bool = True,
        apellido: str = "",
        sexo: str = "no_indica",
        nacionalidad: str = "hondurena",
        dni: str | None = None,
        pasaporte: str | None = None,
        pais: str = "Honduras",
        ciudad: str = "Tegucigalpa",
    ):
        super().__init__(id=id, nombre=nombre, correo=correo, activo=activo)
        self.apellido = apellido
        self.sexo = sexo
        self.nacionalidad = nacionalidad
        self.dni = dni
        self.pasaporte = pasaporte
        self.pais = pais
        self.ciudad = ciudad
        self.__password = password

    def verificar_password(self, password_ingresada: str) -> bool:
        return self.__password == password_ingresada

    def to_dict(self, incluir_password: bool = False) -> dict:
        data = {
            "id": self.id,
            "nombre": self.nombre,
            "apellido": self.apellido,
            "sexo": self.sexo,
            "nacionalidad": self.nacionalidad,
            "dni": self.dni,
            "pasaporte": self.pasaporte,
            "pais": self.pais,
            "ciudad": self.ciudad,
            "correo": self.correo,
            "telefono": self.telefono,
            "licencia": self.licencia,
            "activo": self.activo,
        }
        if incluir_password:
            data["password"] = self.__password
        return data