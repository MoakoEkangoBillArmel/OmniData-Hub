"use client";
import { motion } from 'framer-motion';
import { BookOpen, LineChart, Layers, GitBranch, Share2, Target, Network, CheckSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function CoursePage() {
  const router = useRouter();
  useEffect(() => { if (!localStorage.getItem('token')) router.push('/login'); }, [router]);

  const fadeUp = (delay: number) => ({ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay } });

  return (
    <div className="text-foreground pb-20">
      <header className="mb-12 text-center">
        <motion.div {...fadeUp(0)}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold mb-4 border border-indigo-500/20">
            <BookOpen size={14} /> MODULE OFFICIEL
          </div>
          <h1 className="text-4xl font-black gradient-text mb-3">Programme INF 232 EC2</h1>
          <p className="text-slate-500 text-base max-w-2xl mx-auto">
            Cours complet et exhaustif d'Analyse de Données et Machine Learning.
          </p>
        </motion.div>
      </header>

      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Chapitre 1 */}
        <motion.div {...fadeUp(0.1)} className="glass rounded-2xl p-8 border-t-4 border-t-blue-500">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <LineChart className="text-blue-500" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold">1. Régression Linéaire Simple</h2>
              <p className="text-xs text-slate-500">Prédire une valeur à partir d'une seule variable</p>
            </div>
          </div>
          <div className="space-y-4 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            <p>
              <strong>Concept :</strong> La régression linéaire simple vise à modéliser la relation entre deux variables : une variable explicative (X) et une variable à prédire (Y). L'objectif est de tracer une droite droite (la ligne de régression) qui passe le plus près possible de tous les points de données.
            </p>
            <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-center text-blue-400">
              Y = aX + b
            </div>
            <p>
              <strong>Exhaustivité :</strong>
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Le coefficient (a) :</strong> Représente la pente. Si "a" est positif, Y augmente quand X augmente.</li>
              <li><strong>L'ordonnée à l'origine (b) :</strong> La valeur de Y quand X est à zéro.</li>
              <li><strong>L'erreur (Les résidus) :</strong> C'est la distance entre la vraie valeur et la ligne prédite. L'algorithme des "Moindres Carrés Ordinaires" (MCO) cherche à minimiser cette erreur.</li>
              <li><strong>Cas d'usage :</strong> Estimer le prix d'un appartement (Y) uniquement en fonction de sa surface (X).</li>
            </ul>
          </div>
        </motion.div>

        {/* Chapitre 2 */}
        <motion.div {...fadeUp(0.2)} className="glass rounded-2xl p-8 border-t-4 border-t-indigo-500">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
              <Layers className="text-indigo-500" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold">2. Régression Linéaire Multiple</h2>
              <p className="text-xs text-slate-500">Prédire avec plusieurs facteurs simultanés</p>
            </div>
          </div>
          <div className="space-y-4 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            <p>
              <strong>Concept :</strong> Dans la vraie vie, un événement dépend rarement d'un seul facteur. La régression multiple est l'extension logique qui intègre plusieurs variables explicatives (X1, X2, X3...) pour prédire Y. C'est l'algorithme principal utilisé par le Dashboard OmniData-Hub.
            </p>
            <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-center text-indigo-400">
              Y = a₁X₁ + a₂X₂ + ... + aₙXₙ + b
            </div>
            <p>
              <strong>Exhaustivité :</strong>
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Colinéarité :</strong> Si deux variables X (ex: Nb de pièces et Surface) disent la même chose, elles perturbent le modèle. Il faut les surveiller.</li>
              <li><strong>Poids d'importance (Feature Importance) :</strong> Chaque coefficient (a₁, a₂) indique la force d'impact de la variable sur le résultat.</li>
              <li><strong>Évaluation (R²) :</strong> Le coefficient de détermination (R²) mesure le pourcentage de variance de Y expliqué par les X. Un R² de 0.85 signifie que le modèle explique 85% de la réalité.</li>
            </ul>
          </div>
        </motion.div>

        {/* Chapitre 3 */}
        <motion.div {...fadeUp(0.3)} className="glass rounded-2xl p-8 border-t-4 border-t-purple-500">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Share2 className="text-purple-500" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold">3. Techniques de Réduction des Dimensionnalités</h2>
              <p className="text-xs text-slate-500">Simplifier sans perdre l'information (ACP)</p>
            </div>
          </div>
          <div className="space-y-4 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            <p>
              <strong>Concept :</strong> Quand on possède 100 colonnes de données (100 dimensions), l'ordinateur sature (Le fléau de la dimension). La réduction permet de condenser l'information en fusionnant les colonnes similaires en "Super-Variables" invisibles appelées Composantes.
            </p>
            <p>
              <strong>Exhaustivité (L'Analyse en Composantes Principales - ACP / PCA) :</strong>
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>La matrice de covariance :</strong> L'algorithme calcule mathématiquement comment toutes les variables évoluent les unes par rapport aux autres.</li>
              <li><strong>Vecteurs Propres et Valeurs Propres :</strong> Ce sont les directions mathématiques (axes) qui capturent le maximum d'information.</li>
              <li><strong>Avantage :</strong> On peut passer de 50 variables à seulement 3 variables principales, tout en conservant 95% de l'information utile. Cela permet de visualiser des données complexes sur un graphique 2D ou 3D et d'accélérer le Machine Learning.</li>
            </ul>
          </div>
        </motion.div>

        {/* Chapitre 4 */}
        <motion.div {...fadeUp(0.4)} className="glass rounded-2xl p-8 border-t-4 border-t-emerald-500">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <Target className="text-emerald-500" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold">4. Techniques de Classification Supervisée</h2>
              <p className="text-xs text-slate-500">Classer des données selon un historique connu</p>
            </div>
          </div>
          <div className="space-y-4 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            <p>
              <strong>Concept :</strong> Contrairement à la régression (qui prédit un chiffre exact), la classification prédit une <strong>catégorie</strong> (ex: Spam / Non Spam, Achat / Vente, Malade / Sain). Elle est dite "Supervisée" car on fournit à l'IA des exemples concrets pour s'entraîner.
            </p>
            <p>
              <strong>Exhaustivité des algorithmes :</strong>
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Arbres de décision :</strong> Une suite de questions (ex: "L'âge est-il > 30 ?") qui mène à une conclusion.</li>
              <li><strong>Forêt Aléatoire (Random Forest) :</strong> Créer des centaines d'arbres de décision qui votent. C'est l'algorithme robuste que nous utilisons dans le tableau de bord pour définir la <em>Cible</em> (Ex: Excellent, Moyen, Critique).</li>
              <li><strong>Régression Logistique :</strong> Malgré son nom, c'est un outil de classification binaire utilisant la fonction Sigmoïde pour donner une probabilité (ex: 80% de chance d'Achat).</li>
              <li><strong>Matrice de confusion :</strong> L'outil statistique pour évaluer ces modèles (Vrais Positifs, Faux Positifs, etc.).</li>
            </ul>
          </div>
        </motion.div>

        {/* Chapitre 5 */}
        <motion.div {...fadeUp(0.5)} className="glass rounded-2xl p-8 border-t-4 border-t-rose-500">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center">
              <Network className="text-rose-500" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold">5. Techniques de Classification Non-Supervisée</h2>
              <p className="text-xs text-slate-500">Laisser l'IA trouver les groupes cachés</p>
            </div>
          </div>
          <div className="space-y-4 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            <p>
              <strong>Concept :</strong> Ici, l'IA travaille "à l'aveugle". On lui donne des données (ex: une liste d'acheteurs) sans lui dire ce qu'ils sont, et c'est à l'IA de trouver des ressemblances mathématiques pour créer ses propres catégories (<strong>Clustering</strong>).
            </p>
            <p>
              <strong>Exhaustivité des techniques :</strong>
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>K-Means (K-Moyennes) :</strong> L'algorithme place des "centres" aléatoires (centroïdes) sur le graphique et les déplace petit à petit jusqu'à former des grappes parfaites (clusters). Très utilisé en marketing pour segmenter des clients.</li>
              <li><strong>Clustering Hiérarchique :</strong> Regroupe progressivement les points les plus proches deux par deux jusqu'à former un grand arbre (le Dendrogramme).</li>
              <li><strong>DBSCAN :</strong> Cherche les zones de forte densité. Très fort pour repérer les anomalies (Outliers), car les points isolés ne rentrent dans aucune grappe.</li>
            </ul>
          </div>
        </motion.div>

        {/* Exercices Pratiques */}
        <motion.div {...fadeUp(0.6)} className="glass rounded-2xl p-8 border-t-4 border-t-amber-500 bg-amber-500/5 mt-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <CheckSquare className="text-amber-500" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold">Exercices Pratiques & Corrigés</h2>
              <p className="text-xs text-slate-500">Testez vos connaissances sur l'analyse de données</p>
            </div>
          </div>
          
          <div className="space-y-8 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            
            {/* Ex 1 */}
            <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white/50 dark:bg-black/20">
              <h3 className="font-bold text-amber-600 dark:text-amber-400 mb-2">Exercice 1 : Régression Linéaire</h3>
              <p className="mb-4"><strong>Énoncé :</strong> Une entreprise observe que ses ventes (Y) augmentent de 5 unités pour chaque euro dépensé en publicité (X). Sans aucune publicité, l'entreprise vend 20 unités. Quelle est l'équation de la droite de régression ? Quelles seront les ventes si l'entreprise dépense 10 euros ?</p>
              <div className="p-4 bg-emerald-500/10 border-l-4 border-emerald-500 rounded-r-lg">
                <strong className="text-emerald-600 dark:text-emerald-400 block mb-1">Corrigé :</strong>
                <p>1. L'ordonnée à l'origine (b) est 20 (ventes à X=0). La pente (a) est 5. L'équation est donc : <code className="font-mono bg-emerald-500/20 px-1 rounded">Y = 5X + 20</code>.</p>
                <p>2. Si X = 10, alors Y = 5(10) + 20 = 50 + 20 = 70. Les ventes seront de <strong>70 unités</strong>.</p>
              </div>
            </div>

            {/* Ex 2 */}
            <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white/50 dark:bg-black/20">
              <h3 className="font-bold text-amber-600 dark:text-amber-400 mb-2">Exercice 2 : Classification (Matrice de Confusion)</h3>
              <p className="mb-4"><strong>Énoncé :</strong> Un algorithme médical teste 100 patients. Il prédit correctement 40 malades (Vrais Positifs) et 50 sains (Vrais Négatifs). Il se trompe en déclarant 5 sains comme malades (Faux Positifs) et 5 malades comme sains (Faux Négatifs). Calculez la précision globale (Accuracy).</p>
              <div className="p-4 bg-emerald-500/10 border-l-4 border-emerald-500 rounded-r-lg">
                <strong className="text-emerald-600 dark:text-emerald-400 block mb-1">Corrigé :</strong>
                <p>La précision (Accuracy) = (Vrais Positifs + Vrais Négatifs) / Total des tests.</p>
                <p>Accuracy = (40 + 50) / 100 = 90 / 100 = <strong>90%</strong>. Le modèle est fiable à 90%.</p>
              </div>
            </div>

            {/* Ex 3 */}
            <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white/50 dark:bg-black/20">
              <h3 className="font-bold text-amber-600 dark:text-amber-400 mb-2">Exercice 3 : L'Analyse en Composantes Principales (ACP)</h3>
              <p className="mb-4"><strong>Énoncé :</strong> Pourquoi est-il indispensable de centrer et réduire (normaliser) les variables avant de lancer une ACP sur un jeu de données contenant des "Revenus en euros" et des "Âges en années" ?</p>
              <div className="p-4 bg-emerald-500/10 border-l-4 border-emerald-500 rounded-r-lg">
                <strong className="text-emerald-600 dark:text-emerald-400 block mb-1">Corrigé :</strong>
                <p>L'ACP est très sensible aux échelles car elle calcule la variance. Les revenus sont en milliers (ex: 30 000€) et l'âge en dizaines (ex: 40 ans). Si on ne normalise pas, l'ACP considérera que la variable "Revenu" a une variance gigantesque par rapport à l'âge et lui donnera tout le poids du modèle d'Intelligence Artificielle, faussant totalement l'analyse. Centrer/Réduire met toutes les variables sur une échelle comparable (moyenne 0, écart-type 1).</p>
              </div>
            </div>

          </div>
        </motion.div>

      </div>
    </div>
  );
}
