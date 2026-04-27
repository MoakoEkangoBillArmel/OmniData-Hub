import pandas as pd
from sklearn.decomposition import PCA
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
from typing import List, Dict, Any

def run_pca_and_regression(data: List[Dict[str, Any]], features: List[str], target: str) -> Dict[str, Any]:
    """
    1. Applique l'ACP (PCA) sur les features pour réduire la dimension.
    2. Entraîne un modèle de Régression Multiple sur les composantes principales.
    """
    df = pd.DataFrame(data)
    
    if len(df) < 10:
        raise ValueError("Pas assez de données pour l'entraînement (min 10 requises).")
        
    # S'assurer que les colonnes existent
    missing_cols = [col for col in features + [target] if col not in df.columns]
    if missing_cols:
        raise ValueError(f"Colonnes manquantes dans les données : {missing_cols}")
        
    X = df[features].fillna(df[features].median())
    y = df[target].fillna(df[target].median())
    
    # 1. Analyse en Composantes Principales (ACP)
    # On garde les composantes qui expliquent la majorité de la variance (max 3)
    n_components = min(3, len(features))
    pca = PCA(n_components=n_components)
    X_pca = pca.fit_transform(X)
    
    explained_variance = pca.explained_variance_ratio_.tolist()
    
    # 2. Régression Multiple sur les composantes principales
    X_train, X_test, y_train, y_test = train_test_split(X_pca, y, test_size=0.2, random_state=42)
    
    model = LinearRegression()
    model.fit(X_train, y_train)
    
    y_pred = model.predict(X_test)
    
    mse = mean_squared_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    
    coefficients = model.coef_.tolist()
    intercept = float(model.intercept_)
    
    # Renvoyer les prédictions pour le graphe "Réel vs Prédit"
    predictions = [{"actual": float(a), "predicted": float(p)} for a, p in zip(y_test, y_pred)]
    
    return {
        "pca": {
            "n_components": n_components,
            "explained_variance_ratio": explained_variance
        },
        "regression": {
            "mse": float(mse),
            "r2_score": float(r2),
            "coefficients": coefficients,
            "intercept": intercept,
            "predictions": predictions
        }
    }
