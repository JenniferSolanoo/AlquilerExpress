import json
from pathlib import Path

BASE_DATA_DIR = Path(__file__).resolve().parent / "data"


def _ruta_archivo(nombre_entidad: str) -> Path:
    BASE_DATA_DIR.mkdir(parents=True, exist_ok=True)
    return BASE_DATA_DIR / f"{nombre_entidad}.json"


def leer_registros(nombre_entidad: str) -> list[dict]:
    ruta = _ruta_archivo(nombre_entidad)
    if not ruta.exists():
        ruta.write_text("[]", encoding="utf-8")
        return []
    contenido = ruta.read_text(encoding="utf-8").strip()
    if not contenido:
        return []
    return json.loads(contenido)


def guardar_registros(nombre_entidad: str, registros: list[dict]) -> None:
    ruta = _ruta_archivo(nombre_entidad)
    ruta.write_text(json.dumps(registros, indent=2, ensure_ascii=False), encoding="utf-8")


def siguiente_id(registros: list[dict]) -> int:
    if not registros:
        return 1
    return max(int(r.get("id", 0)) for r in registros) + 1