from fastapi import FastAPI, HTTPException, UploadFile, File, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from typing import List, Dict, Any
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from io import StringIO
import numpy as np

# Imports Database & Auth
from sqlalchemy.orm import Session
import database, models, auth
from database import get_db

# Imports Services
from services.cleaner import clean_data
from services.prediction import run_pca_and_regression
from services.clustering import run_kmeans_clustering
from services.classification import run_random_forest

# Init DB
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="OmniData-Hub API v2", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

# --- SCHEMAS ---
class UserCreate(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    role: str
    query_count: int
    
    class Config:
        from_attributes = True

class DataPayload(BaseModel):
    data: List[Dict[str, Any]]
    target_column: str = "yield_tons_ha"
    features: List[str] = ["temperature_c", "rainfall_mm", "soil_ph", "fertilizer_kg_ha", "farm_area_ha"]

class ScrapePayload(BaseModel):
    industry: str
    country: str
    crop_type: str
    region: str
    count: int = 30

# --- DEPENDENCIES ---
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    import jwt
    try:
        payload = jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Token invalide")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Token expiré ou invalide")
    
    user = db.query(models.User).filter(models.User.email == email).first()
    if user is None:
        raise HTTPException(status_code=401, detail="Utilisateur non trouvé")
    return user

def require_admin(current_user: models.User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Accès refusé. Privilèges administrateur requis.")
    return current_user

def increment_query_count(db: Session, user: models.User):
    user.query_count += 1
    db.commit()

# --- AUTH ROUTES ---
@app.post("/api/auth/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Cet email est déjà enregistré.")
    
    hashed_pwd = auth.get_password_hash(user.password)
    # Le premier utilisateur inscrit devient admin automatiquement (pour la démo)
    is_first = db.query(models.User).count() == 0
    role = "admin" if is_first else "user"
    
    new_user = models.User(email=user.email, hashed_password=hashed_pwd, role=role)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/api/auth/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect")
    
    access_token = auth.create_access_token(data={"sub": user.email, "role": user.role})
    return {"access_token": access_token, "token_type": "bearer", "role": user.role}

@app.get("/api/auth/me", response_model=UserResponse)
def get_me(current_user: models.User = Depends(get_current_user)):
    return current_user

# --- ADMIN ROUTES ---
@app.get("/api/admin/users", response_model=List[UserResponse])
def get_all_users(db: Session = Depends(get_db), current_admin: models.User = Depends(require_admin)):
    users = db.query(models.User).all()
    return users

# --- CORE API ROUTES ---
@app.get("/")
def read_root():
    return {"message": "Bienvenue sur l'API OmniData-Hub v2"}

@app.post("/api/scrape")
def scrape_data(payload: ScrapePayload, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        from services.scraper import scrape_data_by_industry
        result = scrape_data_by_industry(payload.industry, payload.country, payload.crop_type, payload.region, payload.count)
        increment_query_count(db, current_user)
        return {"status": "success", "data": result["data"], "features": result["features"], "target": result["target"], "sources": result.get("sources", [])}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/upload")
async def upload_csv(file: UploadFile = File(...), current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        content = await file.read()
        df = pd.read_csv(StringIO(content.decode('utf-8')))
        df = df.replace({np.nan: None})
        data = df.to_dict(orient="records")
        increment_query_count(db, current_user)
        return {"status": "success", "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la lecture du fichier : {str(e)}")

@app.post("/api/clean")
def clean_dataset(payload: DataPayload, current_user: models.User = Depends(get_current_user)):
    try:
        cleaned_data, stats = clean_data(payload.data, payload.features)
        return {"status": "success", "cleaned_data": cleaned_data, "stats": stats}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/predict/regression")
def predict_regression(payload: DataPayload, current_user: models.User = Depends(get_current_user)):
    try:
        results = run_pca_and_regression(payload.data, payload.features, payload.target_column)
        return {"status": "success", "results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/predict/classification")
def predict_classification(payload: DataPayload, current_user: models.User = Depends(get_current_user)):
    try:
        results = run_random_forest(payload.data, payload.features, "target_category")
        return {"status": "success", "results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
