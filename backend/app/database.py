from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from urllib.parse import quote_plus
from dotenv import load_dotenv

load_dotenv()

db_user = os.getenv("DB_USER", "elemen13_db")
db_password = quote_plus(os.getenv("DB_PASSWORD", ""))
db_host = os.getenv("DB_HOST", "localhost")
db_port = os.getenv("DB_PORT", "3306")
db_name = os.getenv("DB_NAME", "elemen13_elemental_visions")

if db_password:
    default_database_url = f"mysql+pymysql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}?charset=utf8mb4"
else:
    default_database_url = (
        f"mysql+pymysql://{db_user}@{db_host}:{db_port}/{db_name}?charset=utf8mb4"
    )

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", default_database_url)

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}
    if "sqlite" in SQLALCHEMY_DATABASE_URL
    else {},
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
