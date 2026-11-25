from typing import Optional
from pydantic import BaseModel, EmailStr, field_validator


class LoginRequest(BaseModel):
    # Acepta "usuario" (correo, nombre o dni) o "correo"
    usuario: Optional[str] = None
    correo: Optional[str] = None
    contrasena: Optional[str] = None
    password: Optional[str] = None

    def identificador(self) -> str:
        return (self.usuario or self.correo or "").strip()

    def clave(self) -> str:
        return self.contrasena if self.contrasena is not None else (self.password or "")


class UsuarioCreate(BaseModel):
    nombre: str
    correo: EmailStr
    password: str
    rol: str = "admin"


class UsuarioUpdate(BaseModel):
    nombre: Optional[str] = None
    correo: Optional[EmailStr] = None
    password: Optional[str] = None
    rol: Optional[str] = None
    activo: Optional[bool] = None


class ClienteCreate(BaseModel):
    nombre: str
    apellido: str = ""
    sexo: str = "no_indica"
    nacionalidad: str = "hondurena"
    dni: Optional[str] = None
    pasaporte: Optional[str] = None
    pais: str = "Honduras"
    ciudad: str = "Tegucigalpa"
    licencia: str
    telefono: str
    correo: EmailStr
    contrasena: Optional[str] = None
    password: Optional[str] = None
    aceptarTerminos: bool = True

    @field_validator("contrasena", mode="before")
    @classmethod
    def permitir_password_alternativo(cls, v, info):
        if v:
            return v
        return info.data.get("password") or "12345678"


class ClienteUpdate(BaseModel):
    nombre: Optional[str] = None
    apellido: Optional[str] = None
    sexo: Optional[str] = None
    nacionalidad: Optional[str] = None
    dni: Optional[str] = None
    pasaporte: Optional[str] = None
    pais: Optional[str] = None
    ciudad: Optional[str] = None
    licencia: Optional[str] = None
    telefono: Optional[str] = None
    correo: Optional[EmailStr] = None
    activo: Optional[bool] = None


class VehiculoCreate(BaseModel):
    marca: str
    modelo: str
    anio: int
    categoria: str
    precio_dia: float
    disponible: bool = True
    stock: int = 1
    ubicacion: str = "Tegucigalpa"
    imagen: str = ""


class VehiculoUpdate(BaseModel):
    marca: Optional[str] = None
    modelo: Optional[str] = None
    anio: Optional[int] = None
    categoria: Optional[str] = None
    precio_dia: Optional[float] = None
    disponible: Optional[bool] = None
    stock: Optional[int] = None
    ubicacion: Optional[str] = None
    imagen: Optional[str] = None


class CalculadoraCostoRequest(BaseModel):
    vehiculo_id: int
    dias: int
    tasa_impuesto: float = 0.15


class CompraCreate(BaseModel):
    vehiculo_id: int
    cantidad: int
    costo_unitario: float
    proveedor: str = "Proveedor General"


class AlquilerCreate(BaseModel):
    cliente_id: int
    vehiculo_id: int
    dias: int
    fecha_inicio: str
    fecha_fin: str
    ubicacion_recogida: str = "Tegucigalpa"
    edad_conductor: str = "25-29"
    tasa_impuesto: float = 0.15


class PagoCreate(BaseModel):
    factura_id: int
    monto: float
    metodo: str = "simulado_tarjeta"