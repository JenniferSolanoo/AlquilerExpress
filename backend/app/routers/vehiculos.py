from fastapi import APIRouter, HTTPException
from app.database.database import leer_registros, guardar_registros, siguiente_id
from app.functional.operaciones import filtrar_vehiculos
from app.models.vehiculo import Vehiculo
from app.schemas.alquilerexpress_schema import VehiculoCreate, VehiculoUpdate, CalculadoraCostoRequest

router = APIRouter(prefix="/vehiculos", tags=["Vehículos"])


@router.get("/")
def listar_vehiculos(
    disponibles: bool = False,
    marca: str | None = None,
    anio: int | None = None,
    categoria: str | None = None,
):
    vehiculos = leer_registros("vehiculos")
    return filtrar_vehiculos(
        vehiculos=vehiculos,
        solo_disponibles=disponibles,
        marca=marca,
        anio=anio,
        categoria=categoria,
    )


@router.post("/calcular-costo")
def calcular_costo(payload: CalculadoraCostoRequest):
    vehiculos = leer_registros("vehiculos")
    encontrados = [v for v in vehiculos if v["id"] == payload.vehiculo_id]
    if not encontrados:
        raise HTTPException(status_code=404, detail="Vehículo no encontrado")

    v = encontrados[0]
    vehiculo_obj = Vehiculo(
        id=v["id"],
        marca=v["marca"],
        modelo=v["modelo"],
        anio=v["anio"],
        categoria=v["categoria"],
        precio_dia=v["precio_dia"],
        disponible=v["disponible"],
    )
    try:
        subtotal = vehiculo_obj.calcular_costo_alquiler(payload.dias)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    impuesto = round(subtotal * payload.tasa_impuesto, 2)
    total = round(subtotal + impuesto, 2)
    return {
        "vehiculo_id": v["id"],
        "vehiculo": f"{v['marca']} {v['modelo']} ({v['anio']})",
        "disponible": v["disponible"],
        "dias": payload.dias,
        "precio_dia": vehiculo_obj.precio_dia,
        "subtotal": subtotal,
        "impuesto": impuesto,
        "total": total,
    }


@router.post("/", status_code=201)
def crear_vehiculo(data: VehiculoCreate):
    vehiculos = leer_registros("vehiculos")
    nuevo_id = siguiente_id(vehiculos)
    try:
        obj = Vehiculo(
            id=nuevo_id,
            marca=data.marca,
            modelo=data.modelo,
            anio=data.anio,
            categoria=data.categoria,
            precio_dia=data.precio_dia,
            disponible=data.disponible,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    registro = obj.to_dict()
    vehiculos.append(registro)
    guardar_registros("vehiculos", vehiculos)
    return registro


@router.put("/{vehiculo_id}")
def actualizar_vehiculo(vehiculo_id: int, data: VehiculoUpdate):
    vehiculos = leer_registros("vehiculos")
    for idx, v in enumerate(vehiculos):
        if v["id"] == vehiculo_id:
            obj = Vehiculo(
                id=v["id"],
                marca=data.marca if data.marca is not None else v["marca"],
                modelo=data.modelo if data.modelo is not None else v["modelo"],
                anio=data.anio if data.anio is not None else v["anio"],
                categoria=data.categoria if data.categoria is not None else v["categoria"],
                precio_dia=data.precio_dia if data.precio_dia is not None else v["precio_dia"],
                disponible=data.disponible if data.disponible is not None else v["disponible"],
            )
            vehiculos[idx] = obj.to_dict()
            guardar_registros("vehiculos", vehiculos)
            return vehiculos[idx]
    raise HTTPException(status_code=404, detail="Vehículo no encontrado")


@router.delete("/{vehiculo_id}")
def eliminar_vehiculo(vehiculo_id: int):
    vehiculos = leer_registros("vehiculos")
    nuevos = [v for v in vehiculos if v["id"] != vehiculo_id]
    if len(nuevos) == len(vehiculos):
        raise HTTPException(status_code=404, detail="Vehículo no encontrado")
    guardar_registros("vehiculos", nuevos)
    return {"mensaje": "Vehículo eliminado"}