# OmniData-Hub

OmniData-Hub est une solution complète d'analyse de données et de prédiction, conçue pour centraliser le flux d'informations (via scraping et API) et fournir des insights exploitables grâce au Machine Learning.

## 🛠 Stack Technique

### Backend
* **FastAPI** : Framework principal pour l'API.
* **PostgreSQL** : Stockage persistant des données.
* **SQLAlchemy** : ORM pour la gestion de la base.
* **Scikit-learn** : Intelligence artificielle et modèles prédictifs.

### Frontend
* **Next.js 14** : Architecture moderne avec App Router.
* **Tailwind CSS** : Design système utilitaire.
* **Framer Motion** : Interactions et animations fluides.
* **Recharts** : Visualisation de données interactive.

## 🚀 Installation rapide

### 1. Backend
```bash
cd backend
python -m venv venv
# Windows
.\venv\Scripts\activate
# Installation
pip install -r requirements.txt
# Lancement
uvicorn main:app --reload
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📂 Organisation du code

* `/backend` : Contient toute la logique serveur, le scraping et les services de prédiction.
* `/frontend` : Interface utilisateur Next.js optimisée pour le dashboarding.

---

## 👤 Auteur
**MOAKO EKANGO BILL**

---

## 📄 Licence
MIT

