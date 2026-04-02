from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from .routes import router

app = FastAPI()

cors_origins = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:5173,http://localhost:5174,http://127.0.0.1:5173,http://127.0.0.1:5174",
)
allowed_origins = [
    origin.strip() for origin in cors_origins.split(",") if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
