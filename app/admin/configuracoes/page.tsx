"use client";

import { useTheme } from "@/components/providers/theme-provider";
import { Switch } from "@/components/ui/switch";
import { Sun, Moon } from "lucide-react";

export default function AdminSettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Configurações
        </h1>
        <p className="text-muted-foreground">
          Gerencie as configurações globais do painel administrativo.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-card-foreground mb-4">
          Configurações Globais SaaS
        </h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-background rounded-full border border-border">
                {theme === "dark" ? (
                  <Moon size={20} className="text-primary" />
                ) : (
                  <Sun size={20} className="text-primary" />
                )}
              </div>
              <div>
                <p className="font-medium text-foreground">Tema do Sistema</p>
                <p className="text-sm text-muted-foreground">
                  Alternar entre modo claro e escuro
                </p>
              </div>
            </div>

            <Switch
              checked={theme === "dark"}
              onCheckedChange={(checked) =>
                setTheme(checked ? "dark" : "light")
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
