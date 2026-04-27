# setup.ps1 - Script d'installation pour OmniData-Hub

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Initialisation de OmniData-Hub       " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# 1. Vérification des prérequis
Write-Host "`n[1/4] Vérification des prérequis..." -ForegroundColor Yellow

if (!(Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Error "Python n'est pas installé ou n'est pas dans le PATH."
    exit 1
}

if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Error "Node.js n'est pas installé ou n'est pas dans le PATH."
    exit 1
}

# 2. Configuration du Backend (FastAPI)
Write-Host "`n[2/4] Configuration du Backend (Python/FastAPI)..." -ForegroundColor Yellow

if (!(Test-Path -Path "backend")) {
    New-Item -ItemType Directory -Path "backend" | Out-Null
}
Set-Location -Path "backend"

Write-Host "  -> Création de l'environnement virtuel..."
python -m venv venv

Write-Host "  -> Activation de l'environnement et installation des dépendances..."
& .\venv\Scripts\python.exe -m pip install --upgrade pip
& .\venv\Scripts\pip.exe install fastapi uvicorn pandas scikit-learn beautifulsoup4 httpx pydantic supabase python-dotenv numpy

# Génération des fichiers backend de base
New-Item -ItemType File -Path "main.py" -Force | Out-Null
Set-Content -Path "main.py" -Value @"
from fastapi import FastAPI

app = FastAPI(title="OmniData-Hub API")

@app.get("/")
def read_root():
    return {"message": "Bienvenue sur l'API OmniData-Hub"}
"@

Set-Location -Path ".."

# 3. Configuration du Frontend (Next.js)
Write-Host "`n[3/4] Configuration du Frontend (Next.js)..." -ForegroundColor Yellow

if (!(Test-Path -Path "frontend")) {
    Write-Host "  -> Initialisation de Next.js..."
    npx.cmd -y create-next-app@latest frontend --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
}

Set-Location -Path "frontend"

Write-Host "  -> Installation des dépendances additionnelles..."
npm install framer-motion recharts @supabase/supabase-js lucide-react clsx tailwind-merge @radix-ui/react-slot class-variance-authority

Set-Location -Path ".."

Write-Host "`n[4/4] Installation terminée avec succès !" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Pour démarrer le Backend :"
Write-Host "  cd backend"
Write-Host "  .\venv\Scripts\Activate.ps1"
Write-Host "  uvicorn main:app --reload"
Write-Host ""
Write-Host "Pour démarrer le Frontend :"
Write-Host "  cd frontend"
Write-Host "  npm run dev"
Write-Host "========================================" -ForegroundColor Cyan
