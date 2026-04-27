# 🚀 OmniData-Hub

**OmniData-Hub** est une plateforme SaaS d'analyse de données avancée, combinant l'intelligence artificielle, le web scraping et des visualisations interactives pour transformer les données brutes en décisions stratégiques.

---

## 🌟 Fonctionnalités Clés

- **📈 Analyse Prédictive** : Intégration de modèles de Machine Learning (Scikit-learn) pour des prévisions précises.
- **🔍 Web Scraping Dynamique** : Extraction de données en temps réel depuis diverses sources (Finance, Web).
- **📊 Visualisations Premium** : Tableaux de bord interactifs propulsés par Recharts et Framer Motion.
- **⚡ Backend Haute Performance** : API robuste construite avec FastAPI et SQLAlchemy.
- **🎨 Interface Moderne** : Design "Hacker-style" sombre et épuré avec Next.js 14 et Tailwind CSS.

---

## 🛠️ Stack Technique

### Frontend
- **Framework** : [Next.js 14](https://nextjs.org/) (App Router)
- **Styling** : [Tailwind CSS](https://tailwindcss.com/)
- **Animations** : [Framer Motion](https://www.framer.com/motion/)
- **Charts** : [Recharts](https://recharts.org/)
- **Icons** : [Lucide React](https://lucide.dev/)

### Backend
- **Framework** : [FastAPI](https://fastapi.tiangolo.com/)
- **Base de données** : [PostgreSQL](https://www.postgresql.org/) avec SQLAlchemy
- **Data Science** : Pandas, Scikit-learn, yfinance
- **Authentification** : JWT (JSON Web Tokens)

---

## 🚀 Installation et Lancement

### Prérequis
- Node.js (v18+)
- Python (v3.10+)
- PostgreSQL

### 1. Configuration du Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Sur Windows: venv\Scripts\activate
pip install -r requirements.txt
# Configurez vos variables d'environnement dans un fichier .env
uvicorn main:app --reload
```

### 2. Configuration du Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 📂 Structure du Projet

```text
OmniData-Hub/
├── backend/            # API FastAPI, Modèles ML, Logique métier
│   ├── app/            # Code source backend
│   └── requirements.txt
├── frontend/           # Application Next.js
│   ├── src/            # Composants et pages
│   └── package.json
├── docs/               # Documentation supplémentaire (à venir)
└── README.md           # Documentation principale
```

---

## 👤 Auteur
**King-Dev**

---

## 📄 Licence
Ce projet est sous licence MIT.
