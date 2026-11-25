from fastapi import APIRouter, HTTPException
from app.database.database import guardar_registros, leer_registros, siguiente_id
from app.models.usuario import Usuario
from app.schemas.alquilerexpress_schema import UsuarioCreate, UsuarioUpdate

router = APIRouter(prefix="/usuarios", tags=["Usuarios"])


@router.get("/")
def listar_usuarios():
    usuarios = leer_registros("usuarios")
    return [
        {k: v for k, v in u.items() if k != "password"}
        for u in usuarios
    ]


@router.get("/{usuario_id}")
def obtener_usuario(usuario_id: int):
    usuarios = leer_registros("usuarios")
    for u in usuarios:
        if u["id"] == usuario_id:
            return {k: v for k, v in u.items() if k != "password"}
    raise HTTPException(status_code=404, detail="Usuario no encontrado")


@router.post("/", status_code=201)
def crear_usuario(data: UsuarioCreate):
    usuarios = leer_registros("usuarios")
    if any(u.get("correo") == data.correo for u in usuarios):
        raise HTTPException(status_code=400, detail="Ya existe un usuario con ese correo")

    try:
        obj = Usuario(
            id=siguiente_id(usuarios),
            nombre=data.nombre,
            correo=data.correo,
            password=data.password,
            rol=data.rol,
            activo=True,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    registro = obj.to_dict(incluir_password=True)
    usuarios.append(registro)
    guardar_registros("usuarios", usuarios)
    return obj.to_dict(incluir_password=False)


@router.put("/{usuario_id}")
def actualizar_usuario(usuario_id: int, data: UsuarioUpdate):
    usuarios = leer_registros("usuarios")
    for idx, u in enumerate(usuarios):
        if u["id"] == usuario_id:
            activo = data.activo if data.activo is not None else u.get("activo", True)
            try:
                obj = Usuario(
                    id=u["id"],
                    nombre=data.nombre if data.nombre is not None else u["nombre"],
                    correo=data.correo if data.correo is not None else u["correo"],
                    password=data.password if data.password is not None else u.get("password", ""),
                    rol=data.rol if data.rol is not None else u.get("rol", "admin"),
                    activo=activo,
                )
            except ValueError as exc:
                raise HTTPException(status_code=400, detail=str(exc))

            usuarios[idx] = obj.to_dict(incluir_password=True)
            guardar_registros("usuarios", usuarios)
            return obj.to_dict(incluir_password=False)

    raise HTTPException(status_code=404, detail="Usuario no encontrado")


@router.delete("/{usuario_id}")
def eliminar_usuario(usuario_id: int):
    usuarios = leer_registros("usuarios")
    nuevos = [u for u in usuarios if u["id"] != usuario_id]
    if len(nuevos) == len(usuarios):
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    guardar_registros("usuarios", nuevos)
    return {"mensaje": "Usuario eliminado"}