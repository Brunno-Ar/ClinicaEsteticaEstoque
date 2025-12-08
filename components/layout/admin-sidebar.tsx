"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Building2,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";

const menuItems = [
  { href: "/admin", label: "Visão Geral", icon: LayoutDashboard },
  { href: "/admin/clinicas", label: "Clínicas", icon: Building2 },
  { href: "/admin/configuracoes", label: "Configurações", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Fechar sidebar mobile ao navegar
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  const sidebarWidth = isCollapsed ? "w-20" : "w-64";

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-30 p-2.5 bg-slate-900 text-white rounded-lg shadow-lg hover:bg-slate-800 transition-colors"
        aria-label="Abrir menu"
      >
        <Menu size={22} />
      </button>

      {/* Overlay for Mobile */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed left-0 top-0 h-screen z-50
          bg-slate-900 text-white 
          flex flex-col
          shadow-xl
          transition-all duration-300 ease-in-out
          
          ${sidebarWidth}
          
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between min-h-[72px]">
          {!isCollapsed && (
            <div className="overflow-hidden">
              <h1 className="text-lg font-bold bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent whitespace-nowrap">
                EstéticaStock
              </h1>
              <p className="text-[10px] text-slate-400 mt-0.5 uppercase tracking-wider">
                SAAS ADMIN
              </p>
            </div>
          )}

          {/* Botão Fechar (Mobile) */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            aria-label="Fechar menu"
          >
            <X size={20} />
          </button>

          {/* Botão Colapsar (Desktop) */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors items-center justify-center"
            aria-label={isCollapsed ? "Expandir menu" : "Colapsar menu"}
          >
            {isCollapsed ? (
              <ChevronRight size={20} />
            ) : (
              <ChevronLeft size={20} />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                title={isCollapsed ? item.label : undefined}
                className={`
                  flex items-center gap-3 px-3 py-3 rounded-lg transition-all
                  ${
                    isActive
                      ? "bg-teal-600 text-white shadow-lg shadow-teal-900/30"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }
                  ${isCollapsed ? "justify-center" : ""}
                `}
              >
                <item.icon size={22} className="shrink-0" />
                {!isCollapsed && (
                  <span className="font-medium truncate">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-slate-800">
          <button
            onClick={handleLogout}
            title={isCollapsed ? "Sair" : undefined}
            className={`
              w-full flex items-center gap-3 px-3 py-3 
              text-rose-400 hover:bg-slate-800 hover:text-rose-300 
              rounded-lg transition-colors
              ${isCollapsed ? "justify-center" : ""}
            `}
          >
            <LogOut size={22} className="shrink-0" />
            {!isCollapsed && <span className="font-medium">Sair</span>}
          </button>
        </div>
      </aside>

      {/* Spacer para empurrar conteúdo no desktop */}
      <div
        className={`hidden md:block shrink-0 transition-all duration-300 ${sidebarWidth}`}
      />
    </>
  );
}
