"use client";
import { motion } from 'framer-motion';
import { Filter, Percent, Layers, TrendingUp, HelpCircle, BookOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function StatisticsPage() {
  const router = useRouter();
  useEffect(() => { if (!localStorage.getItem('token')) router.push('/login'); }, [router]);

  const fadeUp = (delay: number) => ({ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay } });

  return (
    <div className="text-foreground pb-20">
      <header className="mb-12 text-center">
        <motion.div {...fadeUp(0)}>
          <h1 className="text-4xl font-black gradient-text mb-3">Comprendre vos Données (Le Cours)</h1>
          <p className="text-slate-500 text-base max-w-2xl mx-auto">
            L'Intelligence Artificielle n'est pas magique. Avant d'analyser vos données, elle doit faire le ménage. Voici comment OmniData-Hub nettoie et prépare vos informations de manière très simple.
          </p>
        </motion.div>
      </header>

      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* IQR Section - Terre à Terre */}
        <motion.div {...fadeUp(0.1)} className="glass rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Filter className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold">La chasse aux intrus : Le nettoyage des données</h2>
              <p className="text-xs text-slate-500">Filtrage des anomalies (Méthode de l'Écart Interquartile)</p>
            </div>
          </div>
          <div className="bg-amber-500/10 border-l-4 border-amber-500 p-4 mb-6 rounded-r-lg text-amber-600 dark:text-amber-300">
            <strong className="flex items-center gap-2 mb-1"><HelpCircle size={16}/> L'Exemple de la cour d'école</strong>
            Imaginez que vous voulez calculer la taille moyenne d'une classe d'élèves de 10 ans. Les enfants mesurent entre 1m30 et 1m50. Mais dans vos données, une erreur de frappe indique qu'un élève mesure <strong>30 mètres</strong> ! <br/>Si vous faites une moyenne simple, votre résultat sera complètement faux.
          </div>
          <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
            Pour éviter cela, notre outil utilise une méthode appelée <strong>Écart Interquartile (IQR)</strong>. Plutôt que de regarder la moyenne, il coupe la liste de toutes vos données en 4 parts égales, regarde la "majorité au centre" (la moitié des valeurs normales), et décide d'éliminer automatiquement tout ce qui est beaucoup trop loin de cette zone centrale (notre fameux élève de 30 mètres).
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { step: "01", title: "Classement", desc: "L'IA classe toutes vos données de la plus petite à la plus grande." },
              { step: "02", title: "Repérage", desc: "Elle repère le peloton de tête normal (la majorité au milieu)." },
              { step: "03", title: "Exclusion", desc: "Elle jette à la poubelle les valeurs extravagantes avant de calculer quoi que ce soit." }
            ].map((item, i) => (
              <div key={i} className="bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-xs font-black text-amber-500">ÉTAPE {item.step}</span>
                <h4 className="font-bold mt-1 mb-1">{item.title}</h4>
                <p className="text-xs text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* StandardScaler - Terre à Terre */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div {...fadeUp(0.2)} className="glass rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <Layers className="text-white" size={20} />
              </div>
              <h2 className="text-lg font-bold">On ne compare pas des choux et des carottes</h2>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Dans un fichier immobilier, vous avez la <strong>Surface en m² (ex: 80 000)</strong> et le <strong>Taux de criminalité (ex: 1.5)</strong>. 
              <br/><br/>
              Pour un ordinateur, 80 000 est tellement plus grand que 1.5 qu'il risque de penser que seule la surface compte. 
              Pour éviter ça, nous utilisons la <strong>Standardisation</strong> : l'outil convertit toutes ces données sur une échelle commune parfaite (autour de 0). Ainsi, l'IA juge chaque information sur un pied d'égalité, sans se faire avoir par le nombre de zéros.
            </p>
          </motion.div>

          <motion.div {...fadeUp(0.3)} className="glass rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-500/30">
                <Percent className="text-white" size={20} />
              </div>
              <h2 className="text-lg font-bold">Aller à l'essentiel (L'ACP)</h2>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Imaginez que dans vos données, vous ayez "La taille de la maison", "Le nombre de chambres" et "La surface du salon". Souvent, ces trois choses disent la même chose : "La maison est grande".
              <br/><br/>
              La technique de l'<strong>ACP (Analyse en Composantes Principales)</strong> permet de regrouper les informations qui racontent la même histoire pour simplifier le travail de l'IA, la rendant beaucoup plus rapide et intelligente.
            </p>
          </motion.div>
        </div>

        {/* Pipeline */}
        <motion.div {...fadeUp(0.4)} className="glass rounded-2xl p-8 border-l-4 border-l-indigo-500">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="text-indigo-400" size={20} />
            <h2 className="text-lg font-bold">Le trajet de vos données (En résumé)</h2>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            {["1. Collecte Brute", "2. Chasse aux Intrus", "3. Mise à l'Échelle (Équité)", "4. Simplification", "5. Prédiction & Résultat !"].map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="px-3 py-1.5 bg-indigo-500/10 text-indigo-400 rounded-lg font-medium border border-indigo-500/20">{step}</span>
                {i < 4 && <span className="text-slate-400">→</span>}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Lien vers le cours officiel */}
        <motion.div {...fadeUp(0.5)} className="mt-12 text-center">
          <button onClick={() => router.push('/course')} className="btn-primary py-4 px-8 text-lg inline-flex items-center gap-3">
            <BookOpen size={20} />
            Accéder au Programme Officiel (INF 232 EC2)
          </button>
        </motion.div>
      </div>
    </div>
  );
}
