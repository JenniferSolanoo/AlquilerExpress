from fastapi import APIRouter, HTTPException
from app.database.database import guardar_registros, leer_registros

router = APIRouter(prefix="/facturas", tags=["Facturas"])


@router.get("/")
def listar_facturas():
    return leer_registros("facturas")


@router.get("/{factura_id}")
def obtener_factura(factura_id: int):
    facturas = leer_registros("facturas")
    for f in facturas:
        if f["id"] == factura_id:
            return f
    raise HTTPException(status_code=404, detail="Factura no encontrada")


@router.delete("/{factura_id}")
def eliminar_factura(factura_id: int):
    facturas = leer_registros("facturas")
    nuevas = [f for f in facturas if f["id"] != factura_id]
    if len(nuevas) == len(facturas):
        raise HTTPException(status_code=404, detail="Factura no encontrada")
    guardar_registros("facturas", nuevas)
    return {"mensaje": "Factura eliminada"}