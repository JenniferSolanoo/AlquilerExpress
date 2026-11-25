class Vehiculo:
    def __init__(
        self,
        id: int,
        marca: str,
        modelo: str,
        anio: int,
        categoria: str,
        precio_dia: float,
        disponible: bool = True,
    ):
        self.id = id
        self.marca = marca
        self.modelo = modelo
        self.anio = anio
        self.categoria = categoria
        self.__precio_dia = float(precio_dia)
        self.__disponible = bool(disponible)

    @property
    def precio_dia(self) -> float:
        return self.__precio_dia

    @precio_dia.setter
    def precio_dia(self, nuevo_precio: float) -> None:
        if nuevo_precio <= 0:
            raise ValueError("El precio por día debe ser mayor que cero")
        self.__precio_dia = round(float(nuevo_precio), 2)

    @property
    def disponible(self) -> bool:
        return self.__disponible

    def marcar_no_disponible(self) -> None:
        self.__disponible = False

    def marcar_disponible(self) -> None:
        self.__disponible = True

    def calcular_costo_alquiler(self, dias: int) -> float:
        if dias <= 0:
            raise ValueError("La cantidad de días debe ser mayor que cero")
        return round(self.__precio_dia * dias, 2)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "marca": self.marca,
            "modelo": self.modelo,
            "anio": self.anio,
            "categoria": self.categoria,
            "precio_dia": self.__precio_dia,
            "disponible": self.__disponible,
        }