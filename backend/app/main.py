from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import alquileres, auth, clientes, compras, facturas, pagos, usuarios, vehiculos

app = FastAPI(
    title="API Rent a Car - Paradigmas de Programación",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(usuarios.router)
app.include_router(clientes.router)
app.include_router(vehiculos.router)
app.include_router(compras.router)
app.include_router(alquileres.router)
app.include_router(pagos.router)
app.include_router(facturas.router)


@app.get("/")
def raiz():
    return {"mensaje": "Backend FastAPI Rent a Car activo"}