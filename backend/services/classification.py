import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
from typing import List, Dict, Any

def run_random_forest(data: List[Dict[str, Any]], features: List[str], target: str) -> Dict[str, Any]:
    df = pd.DataFrame(data)
    
    if len(df) < 10:
        raise ValueError("Pas assez de données pour entraîner le modèle (min 10 requises).")
        
    missing_cols = [col for col in features + [target] if col not in df.columns]
    if missing_cols:
        raise ValueError(f"Colonnes manquantes : {missing_cols}")
        
    X = df[features].fillna(df[features].median())
    y = df[target]
    
    y = y.astype(str)
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    clf = RandomForestClassifier(n_estimators=100, random_state=42)
    clf.fit(X_train, y_train)
    
    y_pred = clf.predict(X_test)
    
    accuracy = accuracy_score(y_test, y_pred)
    report = classification_report(y_test, y_pred, output_dict=True)
    
    return {
        "accuracy": float(accuracy),
        "classification_report": report,
        "feature_importances": dict(zip(features, clf.feature_importances_.tolist()))
    }
