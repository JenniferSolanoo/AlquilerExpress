from datetime import datetime
from fastapi import APIRouter, HTTPException
from app.database.database import leer_registros, guardar_registros, siguiente_id
from app.functional.operaciones import calcular_totales_factura
from app.schemas.alquilerexpress_schema import AlquilerCreate

router = APIRouter(prefix="/alquileres", tags=["Alquileres"])


@router.get("/")
def listar_alquileres():
    return leer_registros("alquileres")


@router.post("/", status_code=201)
def crear_alquiler(data: AlquilerCreate):
    clientes = leer_registros("clientes")
    cliente = next((c for c in clientes if c["id"] == data.cliente_id), None)
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")

    vehiculos = leer_registros("vehiculos")
    v_idx = next((i for i, v in enumerate(vehiculos) if v["id"] == data.vehiculo_id), None)
    if v_idx is None:
        raise HTTPException(status_code=404, detail="Vehículo no encontrado")

    vehiculo = vehiculos[v_idx]
    if not vehiculo.get("disponible", False):
        raise HTTPException(status_code=400, detail="El vehículo no está disponible para alquiler")

    if data.dias <= 0:
        raise HTTPException(status_code=400, detail="Los días de alquiler deben ser mayores que cero")

    # Actualiza disponibilidad del vehículo automáticamente
    stock_actual = int(vehiculo.get("stock", 1))
    nuevo_stock = max(0, stock_actual - 1)
    vehiculos[v_idx]["stock"] = nuevo_stock
    vehiculos[v_idx]["disponible"] = nuevo_stock > 0
    guardar_registros("vehiculos", vehiculos)

    calculo = calcular_totales_factura(
        detalles=[
            {
                "concepto": f"Alquiler {vehiculo['marca']} {vehiculo['modelo']} ({data.dias} días)",
                "cantidad": data.dias,
                "precio_unitario": vehiculo["precio_dia"],
            }
        ],
        tasa_impuesto=data.tasa_impuesto,
    )

    alquileres = leer_registros("alquileres")
    alquiler_id = siguiente_id(alquileres)
    alquiler = {
        "id": alquiler_id,
        "cliente_id": data.cliente_id,
        "vehiculo_id": data.vehiculo_id,
        "dias": data.dias,
        "fecha_inicio": data.fecha_inicio,
        "fecha_fin": data.fecha_fin,
        "estado": "activo",
        "total": calculo["total"],
    }
    alquileres.append(alquiler)
    guardar_registros("alquileres", alquileres)

    # Genera factura asociada automáticamente
    facturas = leer_registros("facturas")
    factura_id = siguiente_id(facturas)
    factura = {
        "id": factura_id,
        "numero": f"FAC-{factura_id:05d}",
        "fecha": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "alquiler_id": alquiler_id,
        "cliente": {
            "id": cliente["id"],
            "nombre": cliente["nombre"],
            "correo": cliente["correo"],
        },
        "detalle": calculo["detalles"],
        "subtotal": calculo["subtotal"],
        "impuesto": calculo["impuesto"],
        "total": calculo["total"],
        "estado_pago": "pendiente",
    }
    facturas.append(factura)
    guardar_registros("facturas", facturas)

    return {"alquiler": alquiler, "factura": factura}


@router.put("/{alquiler_id}/devolver")
def devolver_vehiculo(alquiler_id: int):
    alquileres = leer_registros("alquileres")
    a_idx = next((i for i, a in enumerate(alquileres) if a["id"] == alquiler_id), None)
    if a_idx is None:
        raise HTTPException(status_code=404, detail="Alquiler no encontrado")

    alquiler = alquileres[a_idx]
    if alquiler["estado"] == "devuelto":
        raise HTTPException(status_code=400, detail="Este alquiler ya fue devuelto")

    alquileres[a_idx]["estado"] = "devuelto"
    guardar_registros("alquileres", alquileres)

    vehiculos = leer_registros("vehiculos")
    v_idx = next((i for i, v in enumerate(vehiculos) if v["id"] == alquiler["vehiculo_id"]), None)
    if v_idx is not None:
        nuevo_stock = int(vehiculos[v_idx].get("stock", 0)) + 1
        vehiculos[v_idx]["stock"] = nuevo_stock
        vehiculos[v_idx]["disponible"] = True
        guardar_registros("vehiculos", vehiculos)

    return {"mensaje": "Vehículo devuelto y disponibilidad actualizada", "alquiler": alquileres[a_idx]}