from functools import reduce
from typing import Callable, Iterable


def aplicar_filtro(predicado: Callable[[dict], bool], elementos: Iterable[dict]) -> list[dict]:
    """Función de orden superior que aplica un predicado mediante filter."""
    return list(filter(predicado, elementos))


def filtrar_vehiculos(
    vehiculos: list[dict],
    solo_disponibles: bool = False,
    marca: str | None = None,
    anio: int | None = None,
    categoria: str | None = None,
) -> list[dict]:
    """Filtra vehículos combinando funciones puras, lambda y filter."""
    resultado = list(vehiculos)

    if solo_disponibles:
        resultado = aplicar_filtro(lambda v: bool(v.get("disponible", False)), resultado)

    if marca:
        marca_norm = marca.strip().lower()
        resultado = aplicar_filtro(
            lambda v: str(v.get("marca", "")).strip().lower() == marca_norm,
            resultado,
        )

    if anio is not None:
        resultado = aplicar_filtro(lambda v: int(v.get("anio", 0)) == anio, resultado)

    if categoria:
        cat_norm = categoria.strip().lower()
        resultado = aplicar_filtro(
            lambda v: str(v.get("categoria", "")).strip().lower() == cat_norm,
            resultado,
        )

    return resultado


def calcular_importe_linea(item: dict) -> float:
    """Función pura para calcular el importe de un ítem/detalle."""
    cantidad = float(item.get("cantidad", 1))
    precio_unitario = float(item.get("precio_unitario", 0.0))
    return round(cantidad * precio_unitario, 2)


def proyectar_detalles_con_importe(detalles: list[dict]) -> list[dict]:
    """Transforma cada línea de detalle agregando su importe calculado con map y lambda."""
    return list(
        map(
            lambda d: {
                **d,
                "importe": calcular_importe_linea(d),
            },
            detalles,
        )
    )


def sumar_importes(detalles_con_importe: list[dict]) -> float:
    """Calcula el subtotal usando reduce y una función lambda."""
    total = reduce(
        lambda acumulado, linea: acumulado + float(linea.get("importe", 0.0)),
        detalles_con_importe,
        0.0,
    )
    return round(total, 2)


def calcular_totales_factura(detalles: list[dict], tasa_impuesto: float = 0.15) -> dict:
    """Función pura que devuelve detalles, subtotal, impuesto y total."""
    lineas = proyectar_detalles_con_importe(detalles)
    subtotal = sumar_importes(lineas)
    impuesto = round(subtotal * tasa_impuesto, 2)
    total = round(subtotal + impuesto, 2)
    return {
        "detalles": lineas,
        "subtotal": subtotal,
        "impuesto": impuesto,
        "total": total,
    }