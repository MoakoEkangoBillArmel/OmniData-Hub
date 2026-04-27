import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from typing import List, Dict, Any, Tuple

def clean_data(data: List[Dict[str, Any]], feature_columns: List[str]) -> Tuple[List[Dict[str, Any]], Dict[str, Any]]:
    """
    Nettoie les données :
    1. Imputation des valeurs manquantes.
    2. Suppression des outliers via IQR.
    3. Standardisation via StandardScaler.
    """
    df = pd.DataFrame(data)
    initial_count = len(df)
    
    # 1. Imputation (Remplacer NaN par la médiane pour les colonnes numériques)
    for col in feature_columns:
        if col in df.columns:
            # Remplir les valeurs manquantes
            df[col] = df[col].fillna(df[col].median())
            
    # 2. Détection et suppression des Outliers (Méthode IQR)
    outliers_indices = set()
    for col in feature_columns:
        if col in df.columns and pd.api.types.is_numeric_dtype(df[col]):
            Q1 = df[col].quantile(0.25)
            Q3 = df[col].quantile(0.75)
            IQR = Q3 - Q1
            lower_bound = Q1 - 1.5 * IQR
            upper_bound = Q3 + 1.5 * IQR
            
            outliers = df[(df[col] < lower_bound) | (df[col] > upper_bound)].index
            outliers_indices.update(outliers)
            
    df_cleaned = df.drop(index=list(outliers_indices)).copy()
    cleaned_count = len(df_cleaned)
    outliers_removed = initial_count - cleaned_count
    
    # 3. Normalisation (StandardScaler)
    scaler = StandardScaler()
    # On normalise uniquement s'il reste des données et si toutes les features sont présentes
    valid_features = [col for col in feature_columns if col in df_cleaned.columns and pd.api.types.is_numeric_dtype(df_cleaned[col])]
    if len(df_cleaned) > 0 and valid_features:
        df_cleaned[valid_features] = scaler.fit_transform(df_cleaned[valid_features])
        
    stats = {
        "initial_rows": initial_count,
        "cleaned_rows": cleaned_count,
        "outliers_removed": outliers_removed,
        "features_scaled": valid_features
    }
    
    # On remplace les NaN résiduels par None pour éviter les erreurs de sérialisation JSON
    df_cleaned = df_cleaned.replace({np.nan: None})
    return df_cleaned.to_dict(orient="records"), stats
