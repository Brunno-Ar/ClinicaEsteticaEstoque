"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Package,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/estoque", label: "Estoque", icon: Package },
  { href: "/dashboard/fichas", label: "Fichas", icon: FileText },
  { href: "/dashboard/configuracoes", label: "Configurações", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <div
      className={`${
        isCollapsed ? "w-20" : "w-64"
      } bg-slate-900 text-white h-screen flex flex-col fixed left-0 top-0 overflow-y-auto transition-all duration-300 z-20 shadow-xl`}
    >
      {/* Header with Toggle */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        {!isCollapsed && (
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent whitespace-nowrap">
              EstéticaStock
            </h1>
            <p className="text-[10px] text-slate-400 mt-0.5 uppercase tracking-wider">
              CLINIC
            </p>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors ml-auto"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="flex-1 p-2 space-y-2 mt-2">
        {menuItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              title={isCollapsed ? item.label : ""}
              className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-teal-600 text-white shadow-lg shadow-teal-900/20"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              } ${isCollapsed ? "justify-center" : ""}`}
            >
              <item.icon size={22} className="min-w-[22px]" />
              {!isCollapsed && (
                <span className="font-medium truncate">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-2 border-t border-slate-800 mb-2">
        <button
          onClick={handleLogout}
          title="Sair"
          className={`w-full flex items-center space-x-3 px-3 py-3 text-rose-400 hover:bg-slate-800 hover:text-rose-300 rounded-lg transition-colors ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <LogOut size={22} className="min-w-[22px]" />
          {!isCollapsed && <span>Sair</span>}
        </button>
      </div>
    </div>
  );
}
