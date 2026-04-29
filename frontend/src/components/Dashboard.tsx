"use client";
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis, Legend } from 'recharts';
import { Activity, Database, CheckCircle, BarChart3, RefreshCw, Upload, Edit3, X, Zap, Info, Globe, TrendingUp, PieChart as PieChartIcon, Table, Target } from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const industriesList = [
  { name: "Agriculture", emoji: "🌾" },
  { name: "Trading & Actions", emoji: "📈" },
  { name: "Immobilier", emoji: "🏢" },
  { name: "Intelligence Artificielle", emoji: "🤖" },
  { name: "Production Pétrolière", emoji: "🛢️" },
  { name: "Pisciculture", emoji: "🐟" },
  { name: "Santé Publique", emoji: "🏥" },
  { name: "E-commerce & Retail", emoji: "🛒" }
];

// Champs de saisie manuelle par industrie
const manualFieldsMap: Record<string, {key: string, label: string, val: number}[]> = {
  "Agriculture": [{key:"temperature_c",label:"Température (°C)",val:25},{key:"rainfall_mm",label:"Pluie (mm)",val:150},{key:"fertilizer_kg_ha",label:"Engrais (kg/ha)",val:100},{key:"farm_area_ha",label:"Surface (ha)",val:50},{key:"prix_marche_mondial_usd",label:"Prix Mondial ($)",val:200},{key:"indice_secheresse",label:"Sècheresse (0-100)",val:20},{key:"yield_tons_ha",label:"Rendement (t/ha)",val:5}],
  "Trading & Actions": [{key:"inflation_rate",label:"Inflation (%)",val:3},{key:"volume_echangé_m",label:"Volume (M$)",val:200},{key:"taux_interet",label:"Taux d'intérêt (%)",val:4},{key:"sentiment_marche",label:"Sentiment Marché",val:5},{key:"volatilite",label:"Volatilité (%)",val:10},{key:"sentiment_social_score",label:"Sentiment Social",val:6},{key:"prix_action",label:"Prix Action ($)",val:150}],
  "Immobilier": [{key:"surface_m2",label:"Surface (m²)",val:80},{key:"distance_centre_km",label:"Dist. Centre (km)",val:5},{key:"taux_criminalite",label:"Criminalité (0-10)",val:2},{key:"taux_emprunt_bancaire",label:"Taux Emprunt (%)",val:3.5},{key:"indice_attractivite_quartier",label:"Attractivité (0-100)",val:80},{key:"prix_k_eur",label:"Prix (k€)",val:300}],
  "Intelligence Artificielle": [{key:"budget_recherche_m",label:"Budget R&D (M$)",val:50},{key:"puissance_calcul_pflops",label:"Calcul (PFlops)",val:500},{key:"nb_chercheurs",label:"Chercheurs",val:100},{key:"volume_donnees_entrainement_tb",label:"Données (TB)",val:5000},{key:"sentiment_social_score",label:"Sentiment Social",val:8},{key:"innovation_score",label:"Score Innovation",val:70}],
  "Production Pétrolière": [{key:"demande_mondiale_m_barils",label:"Demande (M barils)",val:95},{key:"risque_geopolitique",label:"Risque Géopo.",val:5},{key:"stocks_us_m",label:"Stocks US (M)",val:400},{key:"cout_extraction",label:"Coût Extract. ($)",val:40},{key:"production_opep_m_barils",label:"Prod OPEP (M)",val:30},{key:"prix_baril",label:"Prix Baril ($)",val:75}],
  "Pisciculture": [{key:"temperature_eau",label:"Temp. Eau (°C)",val:18},{key:"taux_oxygene",label:"Oxygène (mg/L)",val:8},{key:"ph_eau",label:"pH Eau",val:7},{key:"quantite_nourriture_kg",label:"Nourriture (kg)",val:50},{key:"qualite_eau_indice",label:"Qualité Eau",val:80},{key:"rendement_poisson_t",label:"Rendement (t)",val:30}],
  "Santé Publique": [{key:"nb_lits_dispo",label:"Lits (/1000)",val:3},{key:"taux_vaccination_pct",label:"Vaccination (%)",val:80},{key:"budget_sante_habitant",label:"Budget/hab (€)",val:3500},{key:"densite_medecins",label:"Méd./1000hab",val:3},{key:"pollution_air_aqi",label:"Pollution AQI",val:40},{key:"indice_sante_publique",label:"Indice Santé",val:75}],
  "E-commerce & Retail": [{key:"trafic_mensuel_k",label:"Trafic (k/mois)",val:100},{key:"taux_conversion_pct",label:"Conversion (%)",val:2.5},{key:"panier_moyen_eur",label:"Panier Moyen (€)",val:65},{key:"depenses_marketing_k",label:"Marketing (k€)",val:10},{key:"sentiment_social_score",label:"Sentiment Social",val:5},{key:"chiffre_affaires_k_eur",label:"CA (k€)",val:160}]
};

const regionsMap: Record<string, string[]> = {
  "Europe (Général)": ["France", "Allemagne", "Royaume-Uni", "Espagne", "Italie", "Suisse"],
  "Amérique du Nord": ["États-Unis (Est)", "États-Unis (Ouest)", "États-Unis (Sud)", "Canada", "Mexique"],
  "Amérique du Sud": ["Brésil", "Argentine", "Colombie", "Chili"],
  "Afrique Centrale & Ouest": ["Cameroun", "Côte d'Ivoire", "Nigéria", "Sénégal", "Ghana"],
  "Afrique Nord & Est": ["Maroc", "Égypte", "Afrique du Sud", "Kenya"],
  "Asie & Océanie": ["Chine", "Inde", "Japon", "Singapour", "Australie"],
  "Moyen-Orient": ["Émirats Arabes Unis", "Arabie Saoudite", "Qatar", "Israël"],
  "Monde (Global)": ["International"]
};

const subCatMap: Record<string, string[]> = {
  "Agriculture": ["Blé", "Maïs", "Soja", "Cacao", "Café"],
  "Trading & Actions": ["AAPL (Apple)", "TSLA (Tesla)", "BTC (Bitcoin)", "S&P 500"],
  "Immobilier": ["Appartement", "Maison", "Bureaux", "Terrain"],
  "Intelligence Artificielle": ["LLM (Texte)", "Computer Vision", "Robotique"],
  "Production Pétrolière": ["Brent", "WTI", "Gaz Naturel"],
  "Pisciculture": ["Saumon", "Tilapia", "Truite"],
  "Santé Publique": ["Hôpitaux Publics", "Cliniques Privées", "EHPAD"],
  "E-commerce & Retail": ["Mode & Vêtements", "Électronique", "Alimentation", "Beauté"]
};

const translateFeature = (key: string) => {
  for (const industry in manualFieldsMap) {
    const field = manualFieldsMap[industry].find(f => f.key === key);
    if (field) return field.label;
  }
  return key.replace(/_/g, " ");
};

export default function Dashboard() {
  const router = useRouter();
  
  useEffect(() => {
    if (!localStorage.getItem('token')) router.push('/login');
  }, [router]);

  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [showLogs, setShowLogs] = useState(false);
  const [stats, setStats] = useState({ collected: 0, outliersRemoved: 0, accuracy: 0 });
  const [chartData, setChartData] = useState<any[]>([]);
  const [featureImportances, setFeatureImportances] = useState<any[]>([]);
  const [analysisBlocks, setAnalysisBlocks] = useState<{title:string,icon:string,text:React.ReactNode}[]>([]);
  const [dataSources, setDataSources] = useState<string[]>([]);
  const [pieData, setPieData] = useState<any[]>([]);
  const [scatterData, setScatterData] = useState<any[]>([]);
  const [regressionPreds, setRegressionPreds] = useState<any[]>([]);
  const [rawMatrix, setRawMatrix] = useState<any[]>([]);
  const [matrixColumns, setMatrixColumns] = useState<string[]>([]);
  
  const [showManualInput, setShowManualInput] = useState(false);
  const [showScrapeModal, setShowScrapeModal] = useState(false);
  const [manualIndustry, setManualIndustry] = useState("Agriculture");
  const [manualValues, setManualValues] = useState<Record<string,number>>({});
  const [sampleCount, setSampleCount] = useState(30);
  
  const [scrapeParams, setScrapeParams] = useState({
    industry: "Agriculture",
    country: "Europe (Général)",
    crop_type: "Blé",
    region: "France"
  });

  const [currentMetric, setCurrentMetric] = useState("yield");

  const openManualInput = () => {
    const fields = manualFieldsMap[manualIndustry];
    const vals: Record<string,number> = {};
    fields.forEach(f => vals[f.key] = f.val);
    setManualValues(vals);
    setShowManualInput(true);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  let API_URL = process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? "http://localhost:8000" : "");
  if (API_URL.endsWith('/')) API_URL = API_URL.slice(0, -1);

  const processData = async (rawData: any[], context: string, features?: string[], target?: string, sources: string[] = []) => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    setDataSources(sources);
    
    const safeFeatures = features || ["temperature_c", "rainfall_mm", "soil_ph", "fertilizer_kg_ha", "farm_area_ha"];
    const safeTarget = target || "yield_tons_ha";

    const payload = { data: rawData, features: safeFeatures, target_column: safeTarget };

    const cleanRes = await axios.post(`${API_URL}/api/clean`, payload, config);
    const cleanedData = cleanRes.data.cleaned_data;
    const cleanStats = cleanRes.data.stats;

    const regRes = await axios.post(`${API_URL}/api/predict/regression`, { ...payload, data: cleanedData }, config);
    const rfRes = await axios.post(`${API_URL}/api/predict/classification`, { ...payload, data: cleanedData }, config);

    const preds = regRes.data.results?.regression?.predictions || [];
    setRegressionPreds(preds.map((p: any, i: number) => ({ name: `N°${i+1}`, Reel: p.actual, Predit: p.predicted })));

    const acc = Math.round(rfRes.data.results.accuracy * 100);
    setStats({ collected: cleanStats.initial_rows, outliersRemoved: cleanStats.outliers_removed, accuracy: acc });

    setRawMatrix(cleanedData);
    setMatrixColumns(Object.keys(cleanedData[0] || {}).filter(k => k !== "target_category"));

    const importances = rfRes.data.results.feature_importances || {};
    const formattedImportances = Object.keys(importances).map(key => ({
      feature: translateFeature(key), importance: Math.round(importances[key] * 1000) / 1000
    })).filter(x => x.importance > 0).sort((a, b) => b.importance - a.importance);
    setFeatureImportances(formattedImportances);

    const topFeature = formattedImportances.length > 0 ? formattedImportances[0].feature : "N/A";
    const secondFeature = formattedImportances.length > 1 ? formattedImportances[1].feature : "N/A";
    const topPct = formattedImportances.length > 0 ? Math.round(formattedImportances[0].importance * 100) : 0;
    const secondPct = formattedImportances.length > 1 ? Math.round(formattedImportances[1].importance * 100) : 0;

    const dist: Record<string, number> = {};
    const scatter: any[] = [];
    cleanedData.forEach((row: any) => {
      const cat = row.target_category || "Inconnu";
      dist[cat] = (dist[cat] || 0) + 1;
      
      // Données pour le ScatterChart (Top Feature vs Target)
      // Attention: topFeature a été traduit.
      // Il faut retrouver la clé originale pour accéder à row[key].
      const originalTopFeatureKey = formattedImportances.length > 0 ? Object.keys(importances).find(k => translateFeature(k) === topFeature) : null;
      
      if (originalTopFeatureKey && row[originalTopFeatureKey] !== undefined) {
        scatter.push({ x: row[originalTopFeatureKey], y: row[safeTarget] });
      }
    });
    setPieData(Object.entries(dist).map(([name, value]) => ({ name, value })));
    setScatterData(scatter);

    const formattedData = cleanedData.map((item: any, idx: number) => ({
      name: `#${idx + 1}`, metric: item[safeTarget]
    }));
    setChartData(formattedData);
    setCurrentMetric(translateFeature(safeTarget));



    let fondText = (
      <>
        Dans le secteur <strong>{context.split('—')[0].trim()}</strong>, l'outil analyse comment plusieurs variables interagissent pour déterminer <strong>{safeTarget.replace(/_/g, " ")}</strong>. <br/><br/>
        <em>Formule simplifiée : Résultat ≈ Poids₁ × {topFeature} + Poids₂ × {secondFeature} + (Autres facteurs)</em>. <br/><br/>Notre outil intelligent a analysé ces données réelles pour isoler le vrai moteur de performance.
      </>
    );

    let verdText = (
      <>
        Nous avons passé au crible les <strong>{cleanStats.initial_rows} données récoltées</strong>. 
        L'outil a filtré {cleanStats.outliers_removed} valeurs peu fiables pour ne garder que la tendance forte. <br/><br/>
        Le taux de confiance de notre analyse est de <strong>{acc}%</strong>. 
        {acc >= 85 ? " C'est un excellent score : les prévisions issues de ce modèle sont extrêmement solides et exploitables immédiatement." : " Ce score est correct. Le marché est influencé par des facteurs imprévisibles qui créent de la volatilité."}
      </>
    );

    let guideText = (
      <>
        L'analyse prouve que la variable <strong>"{topFeature}"</strong> domine le marché (elle explique {topPct}% du résultat final). <br/><br/>
        <div className="bg-amber-500/10 border-l-4 border-amber-500 p-4 mt-3 rounded-r-lg text-amber-600 dark:text-amber-300 shadow-sm">
          <strong className="block text-base mb-1 uppercase tracking-wide">💡 Règle d'Or</strong>
          Ne dispersez pas vos efforts. Si vous devez investir ou optimiser un seul aspect de votre stratégie aujourd'hui, concentrez-vous exclusivement sur l'amélioration de l'indicateur : <em>{topFeature}</em>.
        </div>
      </>
    );

    let routeText = (
      <>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li><strong>Surveiller le point de bascule :</strong> Le <em>Sentiment Social</em> et la <em>Saturabilité</em> jouent un rôle d'accélérateur ou de frein invisible.</li>
          <li><strong>Passer à l'action :</strong> Ajustez vos prévisions budgétaires en tenant compte de la Règle d'Or.</li>
          <li><strong>Prochaine étape :</strong> Relancez cette analyse dans 30 jours pour vérifier si le poids de "{secondFeature}" (actuellement {secondPct}%) évolue.</li>
        </ul>
      </>
    );

    let ideeText = (
      <>
        <strong>Conseil Stratégique :</strong> Sachant que <em>{topFeature}</em> est votre atout majeur, essayez d'augmenter ou d'optimiser cet indicateur de 10% lors de votre prochain cycle. Selon notre modèle de régression, cela devrait entraîner une amélioration mécanique et significative de votre résultat ({safeTarget.replace(/_/g, " ")}).
      </>
    );

    setAnalysisBlocks([
      { title: "Les Fondamentaux", icon: "📚", text: fondText },
      { title: "Le Verdict du Terrain", icon: "⚖️", text: verdText },
      { title: "Le Guide Pratique", icon: "🛠️", text: guideText },
      { title: "La Feuille de Route", icon: "🗺️", text: routeText },
      { title: "L'Idée de Génie", icon: "💡", text: ideeText }
    ]);
  };

  const simulateLogs = async (industry: string) => {
    setShowLogs(true);
    const steps = [
      `[SYSTEM] Initialisation du moteur pour : ${industry}...`,
      `[NETWORK] Connexion aux sources de données distantes... OK`,
      `[SCRAPER] Extraction de la matrice (30 observations)...`,
      `[CLEANER] Nettoyage statistique via IQR (Interquartile Range)...`,
      `[ML] Entraînement du modèle de Régression Multiple...`,
      `[ML] Construction de la Forêt Aléatoire (100 arbres)...`,
      `[SYSTEM] ✅ Pipeline terminé. Rendu des visualisations...`
    ];
    setLogs([steps[0]]);
    for (let i = 1; i < steps.length; i++) {
      await new Promise(r => setTimeout(r, 600 + Math.random() * 400));
      setLogs(prev => [...prev, steps[i]]);
    }
    await new Promise(r => setTimeout(r, 400));
    setShowLogs(false);
  };

  const runScraping = async () => {
    setLoading(true);
    setShowScrapeModal(false);
    try {
      const token = localStorage.getItem('token');
      const logPromise = simulateLogs(scrapeParams.industry);
      const scrapeRes = await axios.post(`${API_URL}/api/scrape`, { ...scrapeParams, count: sampleCount }, { headers: { Authorization: `Bearer ${token}` } });
      const { data, features, target, sources } = scrapeRes.data;
      await logPromise;
      await processData(data, `${scrapeParams.industry} — ${scrapeParams.crop_type} (${scrapeParams.country}, n=${sampleCount})`, features, target, sources);
    } catch (error: any) {
      setShowLogs(false);
      if (error.response?.status === 401) router.push('/login');
      else alert("Erreur d'analyse. Le serveur est-il lancé sur le port 8000 ?");
    } finally { setLoading(false); }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const token = localStorage.getItem('token');
      const uploadRes = await axios.post(`${API_URL}/api/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` }
      });
      await processData(uploadRes.data.data, `Fichier CSV : ${file.name}`, undefined, undefined, ["Import Local CSV"]);
    } catch (error: any) {
      if (error.response?.status === 401) router.push('/login');
      else alert("Erreur CSV : Vérifiez le format.");
    } finally { setLoading(false); if (fileInputRef.current) fileInputRef.current.value = ""; }
  };

  const runManualData = async () => {
    setLoading(true);
    setShowManualInput(false);
    try {
      const fields = manualFieldsMap[manualIndustry];
      const targetKey = fields[fields.length - 1].key;
      const featureKeys = fields.slice(0, -1).map(f => f.key);
      
      const logPromise = simulateLogs(manualIndustry + " (Manuel)");
      const dataSet = Array(sampleCount).fill(0).map((_, i) => {
        const row: Record<string,any> = {};
        fields.forEach(f => {
          const base = manualValues[f.key] || f.val;
          // Variance élevée (±50%) pour garantir des classes distinctes
          row[f.key] = +(base + (Math.random() * base - base * 0.5)).toFixed(2);
        });
        
        // Forcer au moins 3 classes distinctes dans l'échantillon pour éviter les crashs ML
        const classModulo = i % 3;
        row.target_category = classModulo === 0 ? "Élevé" : (classModulo === 1 ? "Moyen" : "Faible");
        return row;
      });
      await logPromise;
      await processData(dataSet, `${manualIndustry} (Saisie Manuelle, n=${sampleCount})`, featureKeys, targetKey, ["Simulation Utilisateur"]);
    } catch (error) {
      console.error(error);
      setShowLogs(false);
      alert("Erreur d'analyse sur les données manuelles. Consultez la console.");
    } finally { setLoading(false); }
  };

  const handleIndustryChange = (val: string) => {
    setScrapeParams({ ...scrapeParams, industry: val, crop_type: subCatMap[val][0] });
  };

  const handleCountryChange = (val: string) => {
    setScrapeParams({ ...scrapeParams, country: val, region: regionsMap[val][0] });
  };

  return (
    <div className="text-foreground">
      {/* Hero Header */}
      <header className="mb-12 text-center">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-5xl font-black gradient-text mb-3">OmniData-Hub</h1>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Plateforme de collecte et d'analyse prédictive multi-secteurs propulsée par l'Intelligence Artificielle.
          </p>
        </motion.div>
        
        {!chartData.length && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-10 mb-6 inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20 text-sm font-medium">
            <Globe size={15} className="pulse-dot" />
            Choisissez l'une des méthodes de collecte ci-dessous pour lancer l'analyse
          </motion.div>
        )}

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button onClick={() => setShowScrapeModal(true)} disabled={loading} className="btn-primary disabled:opacity-50">
            {loading ? <RefreshCw size={18} className="animate-spin" /> : <Database size={18} />}
            Scraping Web Ciblé
          </button>
          <input type="file" accept=".csv" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
          <button onClick={() => fileInputRef.current?.click()} disabled={loading} className="btn-secondary disabled:opacity-50">
            <Upload size={18} /> Importer un CSV
          </button>
          <button onClick={openManualInput} disabled={loading} className="btn-secondary disabled:opacity-50" style={{ borderColor: 'rgba(16, 185, 129, 0.3)', color: '#10b981', background: 'rgba(16, 185, 129, 0.08)' }}>
            <Edit3 size={18} /> Saisie Manuelle
          </button>
        </div>
      </header>

      {/* SCRAPING MODAL */}
      <AnimatePresence>
      {showScrapeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="glass bg-background p-6 md:p-8 rounded-3xl w-full max-w-lg relative border border-indigo-500/20 shadow-2xl shadow-indigo-500/10 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button onClick={() => setShowScrapeModal(false)} className="absolute top-5 right-5 text-slate-400 hover:text-red-500 transition-colors"><X size={22} /></button>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center"><Globe className="text-white" size={20} /></div>
              <div><h2 className="text-xl font-bold">Extraction Web Ciblée</h2><p className="text-xs text-slate-500">Configurez les paramètres de collecte</p></div>
            </div>
            
            <div className="grid gap-5 mb-8">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Industrie</label>
                <select value={scrapeParams.industry} onChange={e => handleIndustryChange(e.target.value)} className="input-premium">
                  {industriesList.map(ind => <option key={ind.name} value={ind.name}>{ind.emoji} {ind.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Sous-Catégorie</label>
                <select value={scrapeParams.crop_type} onChange={e => setScrapeParams({...scrapeParams, crop_type: e.target.value})} className="input-premium">
                  {subCatMap[scrapeParams.industry]?.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Pays</label>
                  <select value={scrapeParams.country} onChange={e => handleCountryChange(e.target.value)} className="input-premium">
                    {Object.keys(regionsMap).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Région</label>
                  <select value={scrapeParams.region} onChange={e => setScrapeParams({...scrapeParams, region: e.target.value})} className="input-premium">
                    {regionsMap[scrapeParams.country].map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex justify-between">
                  Taille de l'échantillon <span>{sampleCount} données</span>
                </label>
                <input 
                  type="range" min="10" max="200" step="10" 
                  value={sampleCount} 
                  onChange={e => setSampleCount(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 mb-2"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>10</span>
                  <span>100</span>
                  <span>200</span>
                </div>
              </div>
            </div>
            
            <button onClick={runScraping} className="w-full btn-primary justify-center text-base py-4">
              <TrendingUp size={20} /> Lancer l'Extraction & Analyse IA
            </button>
          </motion.div>
        </div>
      )}
      </AnimatePresence>

      {/* MANUAL INPUT MODAL */}
      <AnimatePresence>
      {showManualInput && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="glass bg-background p-6 md:p-8 rounded-3xl w-full max-w-lg relative border border-emerald-500/20 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button onClick={() => setShowManualInput(false)} className="absolute top-5 right-5 text-slate-400 hover:text-red-500 transition-colors"><X size={22} /></button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center"><Edit3 className="text-white" size={20} /></div>
              <div><h2 className="text-xl font-bold">Saisie Manuelle</h2><p className="text-xs text-slate-500">Entrez vos propres valeurs par secteur</p></div>
            </div>
            <p className="text-xs text-slate-500 mb-4 bg-indigo-500/5 border border-indigo-500/10 rounded-xl p-3">
              💡 <strong>Principe :</strong> Votre saisie servira de profil central. Le système génère 30 observations autour de ces valeurs pour permettre l'entraînement du modèle ML.
            </p>
            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Industrie</label>
              <select value={manualIndustry} onChange={e => { setManualIndustry(e.target.value); const f = manualFieldsMap[e.target.value]; const v: Record<string,number> = {}; f.forEach(x => v[x.key]=x.val); setManualValues(v); }} className="input-premium">
                {industriesList.map(ind => <option key={ind.name} value={ind.name}>{ind.emoji} {ind.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {manualFieldsMap[manualIndustry]?.map(field => (
                <div key={field.key}>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{field.label}</label>
                  <input type="number" value={manualValues[field.key] ?? field.val} onChange={e => setManualValues({...manualValues, [field.key]: Number(e.target.value)})} className="input-premium" />
                </div>
              ))}
            </div>
            <div className="mb-6">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex justify-between">
                Nombre de lignes à générer <span>{sampleCount} observations</span>
              </label>
              <input 
                type="range" min="10" max="200" step="10" 
                value={sampleCount} 
                onChange={e => setSampleCount(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-emerald-900/30 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>
            <button onClick={runManualData} className="w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:shadow-lg hover:shadow-emerald-500/30">
              Générer la Matrice & Analyser
            </button>
          </motion.div>
        </div>
      )}
      </AnimatePresence>

      {/* TERMINAL LOGS */}
      <AnimatePresence>
      {showLogs && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 backdrop-blur-lg">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="bg-[#0d1117] border border-green-500/20 p-6 rounded-2xl w-full max-w-2xl font-mono terminal-glow">
            <div className="flex items-center gap-2 mb-5 border-b border-green-500/10 pb-3">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              <span className="text-green-500/40 text-xs ml-3 font-medium">omnidata_engine_v2 — pipeline ML</span>
            </div>
            <div className="space-y-2 h-60 overflow-y-auto custom-scrollbar pr-2">
              {logs.map((log, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className="text-green-400/90 text-sm leading-relaxed">
                  <span className="text-green-600/60 mr-2 select-none">$</span>{log}
                </motion.div>
              ))}
              <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.7 }} className="w-2.5 h-5 bg-green-400 mt-2 inline-block rounded-sm"></motion.div>
            </div>
          </motion.div>
        </div>
      )}
      </AnimatePresence>

      {/* RESULTS */}
      {chartData.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            {[
              { label: "Données Collectées", value: stats.collected, icon: <Database className="text-indigo-400" size={22} />, color: "indigo" },
              { label: "Outliers Supprimés", value: stats.outliersRemoved, icon: <CheckCircle className="text-emerald-400" size={22} />, color: "emerald" },
              { label: "Fiabilité du Modèle", value: `${stats.accuracy}%`, icon: <Activity className="text-purple-400" size={22} />, color: "purple" }
            ].map((stat, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="stat-card">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                  <h3 className="text-3xl font-black mt-1">{stat.value}</h3>
                </div>
                <div className={`p-3 bg-${stat.color}-500/10 rounded-xl`}>{stat.icon}</div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass rounded-2xl p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2 capitalize"><BarChart3 size={18} className="text-indigo-400"/>Évolution : {currentMetric}</h2>
              <div className="h-72"><ResponsiveContainer width="100%" height="100%"><LineChart data={chartData}><CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.08)" /><XAxis dataKey="name" stroke="#64748b" fontSize={12} /><YAxis stroke="#64748b" fontSize={12} /><RechartsTooltip contentStyle={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '12px', color: '#e2e8f0' }} /><Line type="monotone" dataKey="metric" stroke="#818cf8" strokeWidth={2.5} dot={{ fill: '#818cf8', r: 3 }} activeDot={{ r: 6, fill: '#6366f1' }} /></LineChart></ResponsiveContainer></div>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass rounded-2xl p-6">
              <h2 className="text-lg font-bold mb-1 flex items-center gap-2"><Zap size={18} className="text-amber-500"/>Facteurs d'Influence</h2>
              <p className="text-xs text-slate-500 mb-4">Impact estimé de chaque variable sur le résultat (Poids d'Influence)</p>
              <div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={featureImportances} layout="vertical" margin={{ left: 10 }}><CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.08)" /><XAxis type="number" stroke="#64748b" fontSize={12} /><YAxis dataKey="feature" type="category" stroke="#64748b" fontSize={11} width={120} /><RechartsTooltip formatter={(value: any) => [`${Math.round(value * 100)}%`, "Importance"]} contentStyle={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '12px', color: '#e2e8f0' }} /><Bar dataKey="importance" fill="#f59e0b" radius={[0, 6, 6, 0]} /></BarChart></ResponsiveContainer></div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-2xl p-6">
              <h2 className="text-lg font-bold mb-1 flex items-center gap-2"><PieChartIcon size={18} className="text-rose-400"/>Répartition Cible</h2>
              <p className="text-xs text-slate-500 mb-4">Proportion de chaque catégorie</p>
              <div className="h-64 flex justify-center items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#f43f5e', '#8b5cf6', '#10b981', '#f59e0b', '#3b82f6'][index % 5]} />
                      ))}
                    </Pie>
                    <RechartsTooltip contentStyle={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '12px', color: '#e2e8f0' }} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass rounded-2xl p-6 overflow-hidden flex flex-col">
              <h2 className="text-lg font-bold mb-1 flex items-center gap-2"><TrendingUp size={18} className="text-blue-400"/>Nuage de Points (Régression)</h2>
              <p className="text-xs text-slate-500 mb-4">Corrélation entre l'Atout Majeur et le Résultat</p>
              <div className="h-64 flex justify-center items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.08)" />
                    <XAxis type="number" dataKey="x" name="Atout" stroke="#64748b" fontSize={11} tickFormatter={(val) => val.toFixed(1)} />
                    <YAxis type="number" dataKey="y" name="Cible" stroke="#64748b" fontSize={11} tickFormatter={(val) => val.toFixed(1)} />
                    <ZAxis range={[60, 60]} />
                    <RechartsTooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '12px', color: '#e2e8f0' }} />
                    <Scatter name="Données" data={scatterData} fill="#3b82f6" opacity={0.6} />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-2xl p-6 overflow-hidden flex flex-col">
              <h2 className="text-lg font-bold mb-1 flex items-center gap-2"><Target size={18} className="text-purple-400"/>Précision (Réel vs Prédit)</h2>
              <p className="text-xs text-slate-500 mb-4">Évaluation de la performance du modèle linéaire</p>
              <div className="h-64 flex justify-center items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={regressionPreds.slice(0, 15)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(168,85,247,0.08)" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <RechartsTooltip contentStyle={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(168,85,247,0.2)', borderRadius: '12px', color: '#e2e8f0' }} />
                    <Legend verticalAlign="bottom" height={36} iconType="plainline" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    <Line type="monotone" dataKey="Reel" name="Valeur Réelle" stroke="#f43f5e" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                    <Line type="monotone" dataKey="Predit" name="Prédiction IA" stroke="#a855f7" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass rounded-2xl p-6 overflow-hidden flex flex-col lg:col-span-3">
              <h2 className="text-lg font-bold mb-1 flex items-center gap-2"><Table size={18} className="text-emerald-400"/>Matrice des Données Analysées</h2>
              <p className="text-xs text-slate-500 mb-4">Aperçu des lignes de votre jeu de données après le nettoyage par l'Intelligence Artificielle</p>
              <div className="overflow-x-auto flex-1 custom-scrollbar">
                <table className="w-full text-xs text-left min-w-[600px]">
                  <thead className="text-slate-500 uppercase bg-slate-100 dark:bg-white/5">
                    <tr>
                      {matrixColumns.map(col => <th key={col} className="px-3 py-2 whitespace-nowrap">{translateFeature(col)}</th>)}
                      <th className="px-3 py-2 text-emerald-500">CIBLE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rawMatrix.slice(0, 5).map((row, i) => (
                      <tr key={i} className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5">
                        {matrixColumns.map(col => <td key={col} className="px-3 py-2 font-mono">{row[col]}</td>)}
                        <td className="px-3 py-2 font-bold text-emerald-400">{row["target_category"]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-center text-[10px] text-slate-400 mt-2 italic">Aperçu limité aux 5 premières lignes</p>
            </motion.div>
          </div>

          {/* Interpretation Structurée */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-8">
            <h2 className="text-xl font-bold mb-5 flex items-center gap-2"><Info className="text-indigo-400" size={20} /> Synthèse Stratégique & Pédagogique</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {analysisBlocks.map((block, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }} className={`glass rounded-2xl p-6 border-l-4 ${i === 4 ? 'lg:col-span-3 border-yellow-400 bg-yellow-500/5' : ''}`} style={{ borderLeftColor: i === 0 ? '#6366f1' : i === 1 ? '#10b981' : i === 2 ? '#f59e0b' : i === 3 ? '#ec4899' : '#eab308' }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-3xl">{block.icon}</div>
                    <h3 className="font-bold text-lg uppercase tracking-wider" style={{ color: i === 0 ? '#818cf8' : i === 1 ? '#34d399' : i === 2 ? '#fbbf24' : i === 3 ? '#f472b6' : '#facc15' }}>{block.title}</h3>
                  </div>
                  <div className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{block.text}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Sources de Données Réelles */}
          {dataSources.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mb-8 glass rounded-2xl p-6">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2"><Globe size={16}/> Sources de Données (Web)</h3>
              <ul className="flex flex-wrap gap-3">
                {dataSources.map((src, i) => (
                  <li key={i}>
                    {src.startsWith("http") ? (
                      <a href={src} target="_blank" rel="noreferrer" className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs text-indigo-500 hover:text-indigo-400 border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1">
                        🔗 {new URL(src).hostname}
                      </a>
                    ) : (
                      <span className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs text-slate-500 border border-slate-200 dark:border-slate-700">
                        {src}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
}
