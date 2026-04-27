"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Moon, Sun, LayoutDashboard, BookOpen, BarChart2, ShieldAlert, LogOut } from "lucide-react";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    setRole(localStorage.getItem("role"));
  }, []);

  if (pathname === "/login") return null;

  const links = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/stats", label: "Statistiques", icon: BarChart2 },
    { href: "/methodology", label: "Méthodes", icon: BookOpen },
  ];

  if (role === "admin") {
    links.push({ href: "/admin", label: "Admin", icon: ShieldAlert });
  }

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/login");
  };

  return (
    <nav className="glass sticky top-0 z-50 px-8 py-3 mb-8 mx-4 sm:mx-8 mt-4 rounded-2xl flex justify-between items-center">
      <Link href="/" className="flex items-center gap-3 group">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-shadow">
          <span className="text-white font-black text-sm">OD</span>
        </div>
        <div>
          <span className="font-bold text-lg tracking-tight">OmniData</span>
          <span className="text-[10px] font-medium text-indigo-400 block -mt-1">HUB v2.0</span>
        </div>
      </Link>

      <div className="flex gap-1 items-center bg-slate-100/50 dark:bg-white/5 rounded-xl p-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition-all ${
                isActive
                  ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
                  : "text-slate-500 hover:text-foreground hover:bg-slate-200/50 dark:hover:bg-white/5"
              }`}
            >
              <Icon size={16} />
              <span className="hidden sm:inline">{link.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2.5 rounded-xl hover:bg-slate-200/80 dark:hover:bg-white/10 transition-all"
          aria-label="Toggle theme"
        >
          {mounted && theme === "dark" ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} />}
        </button>
        <button
          onClick={logout}
          className="p-2.5 rounded-xl hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-all"
          aria-label="Déconnexion"
          title="Se déconnecter"
        >
          <LogOut size={18} />
        </button>
      </div>
    </nav>
  );
}
