import re
from fastapi import APIRouter, HTTPException
from app.database.database import guardar_registros, leer_registros, siguiente_id
from app.models.cliente import Cliente
from app.schemas.alquilerexpress_schema import ClienteCreate, ClienteUpdate

router = APIRouter(prefix="/clientes", tags=["Clientes"])


@router.get("/")
def listar_clientes():
    clientes = leer_registros("clientes")
    return [{k: v for k, v in c.items() if k != "password"} for c in clientes]


@router.get("/{cliente_id}")
def obtener_cliente(cliente_id: int):
    clientes = leer_registros("clientes")
    for c in clientes:
        if c["id"] == cliente_id:
            return {k: v for k, v in c.items() if k != "password"}
    raise HTTPException(status_code=404, detail="Cliente no encontrado")


@router.post("/", status_code=201)
def crear_cliente(data: ClienteCreate):
    if not data.aceptarTerminos:
        raise HTTPException(status_code=400, detail="Debe aceptar los términos y condiciones")

    if data.nacionalidad == "hondurena":
        if not data.dni or not re.fullmatch(r"[0-9]{13}", data.dni.strip()):
            raise HTTPException(status_code=400, detail="El DNI debe contener exactamente 13 dígitos")
    elif data.nacionalidad == "extranjera":
        if not (data.pasaporte and data.pasaporte.strip()):
            raise HTTPException(status_code=400, detail="Ingrese su número de pasaporte")
        if not (data.pais and data.pais.strip()):
            raise HTTPException(status_code=400, detail="Seleccione el país de emisión")

    clientes = leer_registros("clientes")
    if any(str(c.get("correo", "")).lower() == data.correo.lower() for c in clientes):
        raise HTTPException(status_code=400, detail="Ya existe un cliente con ese correo")

    clave_final = data.contrasena or data.password or "12345678"
    try:
        obj = Cliente(
            id=siguiente_id(clientes),
            nombre=data.nombre,
            correo=data.correo,
            telefono=data.telefono,
            licencia=data.licencia,
            password=clave_final,
            activo=True,
            apellido=data.apellido,
            sexo=data.sexo,
            nacionalidad=data.nacionalidad,
            dni=data.dni.strip() if data.dni else None,
            pasaporte=data.pasaporte.strip() if data.pasaporte else None,
            pais=data.pais,
            ciudad=data.ciudad,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    registro = obj.to_dict(incluir_password=True)
    clientes.append(registro)
    guardar_registros("clientes", clientes)
    return obj.to_dict(incluir_password=False)


@router.put("/{cliente_id}")
def actualizar_cliente(cliente_id: int, data: ClienteUpdate):
    clientes = leer_registros("clientes")
    for idx, c in enumerate(clientes):
        if c["id"] == cliente_id:
            try:
                obj = Cliente(
                    id=c["id"],
                    nombre=data.nombre if data.nombre is not None else c["nombre"],
                    correo=data.correo if data.correo is not None else c["correo"],
                    telefono=data.telefono if data.telefono is not None else c.get("telefono", ""),
                    licencia=data.licencia if data.licencia is not None else c.get("licencia", ""),
                    password=c.get("password", "12345678"),
                    activo=data.activo if data.activo is not None else c.get("activo", True),
                    apellido=data.apellido if data.apellido is not None else c.get("apellido", ""),
                    sexo=data.sexo if data.sexo is not None else c.get("sexo", "no_indica"),
                    nacionalidad=data.nacionalidad if data.nacionalidad is not None else c.get("nacionalidad", "hondurena"),
                    dni=data.dni if data.dni is not None else c.get("dni"),
                    pasaporte=data.pasaporte if data.pasaporte is not None else c.get("pasaporte"),
                    pais=data.pais if data.pais is not None else c.get("pais", "Honduras"),
                    ciudad=data.ciudad if data.ciudad is not None else c.get("ciudad", "Tegucigalpa"),
                )
            except ValueError as exc:
                raise HTTPException(status_code=400, detail=str(exc))

            clientes[idx] = obj.to_dict(incluir_password=True)
            guardar_registros("clientes", clientes)
            return obj.to_dict(incluir_password=False)

    raise HTTPException(status_code=404, detail="Cliente no encontrado")


@router.delete("/{cliente_id}")
def eliminar_cliente(cliente_id: int):
    clientes = leer_registros("clientes")
    nuevos = [c for c in clientes if c["id"] != cliente_id]
    if len(nuevos) == len(clientes):
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    guardar_registros("clientes", nuevos)
    return {"mensaje": "Cliente eliminado"}