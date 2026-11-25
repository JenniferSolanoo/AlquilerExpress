from datetime import datetime
from fastapi import APIRouter, HTTPException
from app.database.database import leer_registros, guardar_registros, siguiente_id
from app.schemas.alquilerexpress_schema import CompraCreate

router = APIRouter(prefix="/compras", tags=["Compras / Inventario"])


@router.get("/")
def listar_compras():
    return leer_registros("compras")


@router.post("/", status_code=201)
def registrar_compra(data: CompraCreate):
    vehiculos = leer_registros("vehiculos")
    vehiculo_idx = next((i for i, v in enumerate(vehiculos) if v["id"] == data.vehiculo_id), None)
    if vehiculo_idx is None:
        raise HTTPException(status_code=404, detail="Vehículo no encontrado para registrar compra")
    if data.cantidad <= 0:
        raise HTTPException(status_code=400, detail="La cantidad debe ser mayor que cero")

    # Incrementa inventario y marca disponibilidad
    stock_actual = int(vehiculos[vehiculo_idx].get("stock", 1 if vehiculos[vehiculo_idx].get("disponible") else 0))
    nuevo_stock = stock_actual + data.cantidad
    vehiculos[vehiculo_idx]["stock"] = nuevo_stock
    vehiculos[vehiculo_idx]["disponible"] = True
    guardar_registros("vehiculos", vehiculos)

    compras = leer_registros("compras")
    compra = {
        "id": siguiente_id(compras),
        "vehiculo_id": data.vehiculo_id,
        "cantidad": data.cantidad,
        "costo_unitario": data.costo_unitario,
        "total_compra": round(data.cantidad * data.costo_unitario, 2),
        "proveedor": data.proveedor,
        "fecha": datetime.now().isoformat(),
        "stock_resultante": nuevo_stock,
    }
    compras.append(compra)
    guardar_registros("compras", compras)
    return compra