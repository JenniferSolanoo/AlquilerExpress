from fastapi import APIRouter, HTTPException
from app.database.database import leer_registros
from app.models.cliente import Cliente
from app.models.usuario import Usuario
from app.schemas.alquilerexpress_schema import LoginRequest

router = APIRouter(prefix="/login", tags=["Autenticación"])


@router.post("/")
def login(credentials: LoginRequest):
    ident = credentials.identificador().lower()
    clave = credentials.clave()

    if not ident or not clave:
        raise HTTPException(status_code=400, detail="Debe ingresar usuario/correo y contraseña")

    usuarios = leer_registros("usuarios")
    for u in usuarios:
        coincide_ident = (
            str(u.get("correo", "")).lower() == ident
            or str(u.get("nombre", "")).lower() == ident
        )
        if coincide_ident and u.get("activo", True):
            obj_usuario = Usuario(
                id=u["id"],
                nombre=u["nombre"],
                correo=u["correo"],
                password=u.get("password", ""),
                rol=u.get("rol", "admin"),
                activo=u.get("activo", True),
            )
            if obj_usuario.verificar_password(clave):
                return {
                    "autenticado": True,
                    "tipo": "usuario",
                    "datos": obj_usuario.to_dict(incluir_password=False),
                }

    clientes = leer_registros("clientes")
    for c in clientes:
        coincide_ident = (
            str(c.get("correo", "")).lower() == ident
            or str(c.get("nombre", "")).lower() == ident
            or (c.get("dni") and str(c.get("dni")).lower() == ident)
        )
        if coincide_ident and c.get("activo", True):
            obj_cliente = Cliente(
                id=c["id"],
                nombre=c["nombre"],
                correo=c["correo"],
                telefono=c.get("telefono", ""),
                licencia=c.get("licencia", ""),
                password=c.get("password", "12345678"),
                activo=c.get("activo", True),
                apellido=c.get("apellido", ""),
                sexo=c.get("sexo", "no_indica"),
                nacionalidad=c.get("nacionalidad", "hondurena"),
                dni=c.get("dni"),
                pasaporte=c.get("pasaporte"),
                pais=c.get("pais", "Honduras"),
                ciudad=c.get("ciudad", "Tegucigalpa"),
            )
            if obj_cliente.verificar_password(clave):
                return {
                    "autenticado": True,
                    "tipo": "cliente",
                    "datos": obj_cliente.to_dict(incluir_password=False),
                }

    raise HTTPException(status_code=401, detail="Credenciales incorrectas")