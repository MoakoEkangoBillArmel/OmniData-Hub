import pandas as pd
from sklearn.cluster import KMeans
from typing import List, Dict, Any

def run_kmeans_clustering(data: List[Dict[str, Any]], features: List[str], n_clusters: int = 3) -> Dict[str, Any]:
    df = pd.DataFrame(data)
    
    if len(df) < n_clusters:
        raise ValueError("Pas assez de données pour le clustering.")
        
    missing_cols = [col for col in features if col not in df.columns]
    if missing_cols:
        raise ValueError(f"Colonnes manquantes : {missing_cols}")
        
    X = df[features].fillna(df[features].median())
    
    kmeans = KMeans(n_clusters=n_clusters, random_state=42)
    clusters = kmeans.fit_predict(X)
    
    df['cluster'] = clusters
    
    # Remplacer NaN par None pour la sortie JSON
    import numpy as np
    df = df.replace({np.nan: None})
    
    return {
        "n_clusters": n_clusters,
        "centroids": kmeans.cluster_centers_.tolist(),
        "clustered_data": df.to_dict(orient="records")
    }
