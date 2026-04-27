"use client";
import { motion } from 'framer-motion';
import { Activity, BrainCircuit, GitBranch, Database } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function MethodologyPage() {
  const router = useRouter();
  useEffect(() => { if (!localStorage.getItem('token')) router.push('/login'); }, [router]);

  const fadeUp = (delay: number) => ({ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay } });

  return (
    <div className="text-foreground pb-20">
      <header className="mb-12 text-center">
        <motion.div {...fadeUp(0)}>
          <h1 className="text-4xl font-black gradient-text mb-3">Comment notre modèle prédit l'avenir</h1>
          <p className="text-slate-500 text-base max-w-2xl mx-auto">
            Découvrez avec des mots simples comment l'Intelligence Artificielle d'OmniData-Hub trouve la logique cachée dans vos chiffres pour prédire ce qui va se passer.
          </p>
        </motion.div>
      </header>

      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Régression */}
        <motion.div {...fadeUp(0.1)} className="glass rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Activity className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold">Trouver la recette mathématique (Régression Linéaire)</h2>
              <p className="text-xs text-slate-500">Pour estimer une valeur précise (un prix, un rendement)</p>
            </div>
          </div>
          <p className="text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
            La Régression Linéaire est l'outil principal de prédiction de notre application. L'idée est simple : l'IA va essayer de créer une "recette de cuisine" (une formule) pour deviner un résultat en donnant plus ou moins de poids à chaque ingrédient (vos données).
          </p>
          <div className="text-center py-6 bg-slate-900 rounded-xl font-mono text-blue-300 text-lg mb-4">
            <span className="text-white font-sans">Le Prix d'une Maison =</span> <br/>
            Un prix de base <br/>
            <span className="text-emerald-400">+ (Nombre de chambres × 50 000€)</span> <br/>
            <span className="text-rose-400">− (Distance de la ville en km × 2 000€)</span>
          </div>
          <p className="text-sm text-slate-500">
            Dans notre outil, l'ordinateur fait ce calcul des milliers de fois pour trouver exactement par quoi il faut multiplier la "Distance" ou les "Chambres" pour que la formule fonctionne sur les données que nous avons récupérées sur le Web.
          </p>
        </motion.div>

        {/* Random Forest */}
        <motion.div {...fadeUp(0.2)} className="glass rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <GitBranch className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold">Le Comité d'Experts (La Forêt Aléatoire)</h2>
              <p className="text-xs text-slate-500">Pour classer dans des catégories (ex: Bon, Moyen, Mauvais)</p>
            </div>
          </div>
          <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
            Parfois, on ne veut pas un nombre exact, on veut juste savoir si l'action est "À acheter" ou "À vendre". Pour cela, on utilise une méthode appelée <strong>Forêt Aléatoire (Random Forest)</strong>.
          </p>
          <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-5 border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold mb-2 text-sm text-purple-500">L'Exemple du Médecin</h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-4">
              Imaginez que vous avez une maladie rare. Si vous demandez à 1 seul médecin (un "Arbre" de décision), il pourrait se tromper s'il a mal lu un de vos symptômes.
              Mais si vous demandez à <strong>100 médecins différents</strong> (une "Forêt" d'arbres), et que chacun vous donne son diagnostic (par exemple : 80 disent "Repos", 20 disent "Médicament"), vous avez beaucoup plus de chances que la majorité (Repos) ait raison.
            </p>
            <p className="text-sm text-slate-500 leading-relaxed">
              C'est exactement ce que fait notre IA. Elle crée 100 petits algorithmes qui regardent vos données sous différents angles. Chacun donne son avis, et <strong>la majorité l'emporte !</strong> C'est de là que vient notre "Taux de Confiance".
            </p>
          </div>
        </motion.div>

        {/* NLP */}
        <motion.div {...fadeUp(0.3)} className="glass rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <BrainCircuit className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold">L'humeur du web (Analyse de Sentiment)</h2>
              <p className="text-xs text-slate-500">Transformer les mots en chiffres</p>
            </div>
          </div>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            Les chiffres (comme une surface en m² ou un taux en %) sont faciles à calculer. Mais comment l'IA comprend-elle qu'une cryptomonnaie va s'effondrer à cause d'un scandale sur Twitter ?
            <br/><br/>
            L'IA lit les textes, détecte les mots positifs ("succès", "croissance") et négatifs ("faillite", "chute"), et les convertit en une note : le fameux <strong>Sentiment Social</strong>. Cette note devient alors une donnée mathématique que la Régression Linéaire peut intégrer dans sa formule.
          </p>
        </motion.div>

        {/* Collecte Web */}
        <motion.div {...fadeUp(0.4)} className="glass rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
              <Database className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold">D'où viennent vos données ? (Le Scraping)</h2>
              <p className="text-xs text-slate-500">La collecte d'informations en ligne</p>
            </div>
          </div>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            Pour que l'IA puisse apprendre la bonne formule, il lui faut des exemples du passé. Dès que vous lancez une analyse sur OmniData-Hub, notre robot (le <em>Scraper</em>) navigue instantanément sur le Web (Yahoo Finance, la Banque Mondiale, l'OMS, etc.) pour récupérer les véritables données de l'industrie choisie.
          </p>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            Ces données brutes sont ensuite aspirées dans notre système, nettoyées, standardisées, puis passées à la Régression Linéaire et à la Forêt Aléatoire pour en tirer votre <strong>Règle d'Or</strong>.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
