from datetime import datetime
from fastapi import APIRouter, HTTPException
from app.database.database import guardar_registros, leer_registros, siguiente_id
from app.schemas.alquilerexpress_schema import PagoCreate

router = APIRouter(prefix="/pagos", tags=["Pagos"])


@router.get("/")
def listar_pagos():
    return leer_registros("pagos")


@router.post("/", status_code=201)
def registrar_pago(data: PagoCreate):
    facturas = leer_registros("facturas")
    f_idx = next((i for i, f in enumerate(facturas) if f["id"] == data.factura_id), None)
    if f_idx is None:
        raise HTTPException(status_code=404, detail="Factura no encontrada")

    if data.monto <= 0:
        raise HTTPException(status_code=400, detail="El monto del pago debe ser mayor que cero")

    pagos = leer_registros("pagos")
    pago = {
        "id": siguiente_id(pagos),
        "factura_id": data.factura_id,
        "monto": round(float(data.monto), 2),
        "metodo": data.metodo,
        "estado": "pagado_simulado",
        "fecha": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    }
    pagos.append(pago)
    guardar_registros("pagos", pagos)

    facturas[f_idx]["estado_pago"] = "pagada"
    guardar_registros("facturas", facturas)

    return {"pago": pago, "factura": facturas[f_idx]}