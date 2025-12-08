"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  CheckCircle,
  ShieldCheck,
  TrendingUp,
  Clock,
  Zap,
  BarChart3,
  BrainCircuit,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";

export const LandingPage = () => {
  const router = useRouter();

  const handleEnterSystem = () => {
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-background font-sans text-foreground transition-colors duration-300">
      {/* --- NAV BAR --- */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border transition-colors">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
              <Sparkles size={20} />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-teal-400 dark:to-emerald-400">
              EstéticaStock
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-muted-foreground">
            <a
              href="#features"
              className="hover:text-primary transition-colors"
            >
              Funcionalidades
            </a>
            <a
              href="#benefits"
              className="hover:text-primary transition-colors"
            >
              Benefícios
            </a>
            <a href="#pricing" className="hover:text-primary transition-colors">
              Planos
            </a>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <button
              onClick={handleEnterSystem}
              className="text-muted-foreground hover:text-primary font-medium text-sm transition-colors hidden sm:block"
            >
              Fazer Login
            </button>
            <button
              onClick={handleEnterSystem}
              className="bg-foreground text-background px-5 py-2.5 rounded-full font-semibold text-sm hover:opacity-90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Começar Agora
            </button>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 relative overflow-hidden">
        {/* Decorative Blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-teal-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-accent/50 border border-accent rounded-full text-primary text-xs font-bold uppercase tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span>Novo: Assistente de Estoque com IA</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.1]">
              O fim do prejuízo com <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-500">
                produtos vencidos.
              </span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Sistema de gestão especializado em clínicas de estética. Controle
              lotes de toxinas e preenchedores, receba alertas de validade e use
              IA para otimizar suas compras.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                onClick={handleEnterSystem}
                className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold text-lg shadow-xl shadow-teal-500/30 transition-all transform hover:-translate-y-1 flex items-center justify-center"
              >
                Testar Grátis por 7 dias
                <ArrowRight className="ml-2" />
              </button>
              <button className="w-full sm:w-auto px-8 py-4 bg-card text-card-foreground border border-border rounded-xl font-bold text-lg hover:bg-accent transition-all flex items-center justify-center">
                Ver Demonstração
              </button>
            </div>

            <div className="pt-4 flex items-center justify-center lg:justify-start space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center">
                <CheckCircle size={16} className="text-primary mr-2" /> Sem
                cartão de crédito
              </div>
              <div className="flex items-center">
                <CheckCircle size={16} className="text-primary mr-2" />{" "}
                Cancelamento grátis
              </div>
            </div>
          </div>

          {/* Abstract Dashboard Mockup */}
          <div className="relative lg:h-[600px] flex items-center justify-center perspective-1000">
            <div className="relative w-full max-w-lg bg-card rounded-2xl shadow-2xl border border-border p-4 transform rotate-y-12 rotate-x-6 hover:rotate-0 transition-all duration-700 ease-out cursor-default">
              {/* Fake UI Header */}
              <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                </div>
                <div className="h-2 w-20 bg-muted rounded-full"></div>
              </div>
              {/* Fake UI Body */}
              <div className="space-y-4">
                <div className="flex space-x-4">
                  <div className="flex-1 bg-accent/20 p-4 rounded-xl border border-accent">
                    <div className="h-8 w-8 bg-accent rounded-lg mb-2"></div>
                    <div className="h-4 w-12 bg-muted rounded mb-1"></div>
                    <div className="h-6 w-20 bg-muted-foreground/20 rounded"></div>
                  </div>
                  <div className="flex-1 bg-muted/30 p-4 rounded-xl">
                    <div className="h-8 w-8 bg-muted rounded-lg mb-2"></div>
                    <div className="h-4 w-12 bg-muted rounded mb-1"></div>
                    <div className="h-6 w-20 bg-muted-foreground/20 rounded"></div>
                  </div>
                </div>
                {/* Fake Chart */}
                <div className="bg-muted/30 p-4 rounded-xl h-32 flex items-end justify-between px-6 pb-2 space-x-2">
                  <div className="w-full bg-teal-400/80 rounded-t h-[40%]"></div>
                  <div className="w-full bg-teal-300/80 rounded-t h-[70%]"></div>
                  <div className="w-full bg-primary rounded-t h-[50%]"></div>
                  <div className="w-full bg-teal-400/80 rounded-t h-[90%]"></div>
                </div>
                {/* Fake List */}
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 border border-border rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded bg-muted"></div>
                        <div className="space-y-1">
                          <div className="h-3 w-24 bg-muted rounded"></div>
                          <div className="h-2 w-16 bg-muted/50 rounded"></div>
                        </div>
                      </div>
                      <div className="h-6 w-16 bg-emerald-500/20 rounded-full"></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -right-8 top-20 bg-card p-4 rounded-xl shadow-xl border border-border animate-bounce delay-700">
                <div className="flex items-center space-x-3">
                  <div className="bg-rose-100 dark:bg-rose-900/30 p-2 rounded-full text-rose-600">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold uppercase">
                      Alerta
                    </p>
                    <p className="text-sm font-bold text-foreground">
                      Lote Vencendo!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- FEATURES SECTION --- */}
      <section
        id="features"
        className="py-24 bg-secondary/30 transition-colors"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-bold text-primary uppercase tracking-wider mb-2">
              Funcionalidades
            </h2>
            <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Tudo o que sua clínica precisa para crescer
            </h3>
            <p className="text-muted-foreground">
              Substitua planilhas complexas por um sistema intuitivo e poderoso,
              desenhado especificamente para a realidade da estética.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<ShieldCheck size={32} />}
              title="Rastreabilidade de Lotes"
              description="Saiba exatamente qual lote foi usado em cada paciente. Controle fornecedores, datas de entrada e validade com precisão cirúrgica."
            />
            <FeatureCard
              icon={<BrainCircuit size={32} />}
              title="Inteligência Artificial"
              description="Nossa IA analisa seu estoque e sugere compras baseadas no consumo real, evitando excessos ou faltas de produtos caros."
            />
            <FeatureCard
              icon={<TrendingUp size={32} />}
              title="Gestão Financeira"
              description="Visualize o valor parado em estoque em tempo real. Identifique produtos com baixa saída e melhore seu fluxo de caixa."
            />
            <FeatureCard
              icon={<Clock size={32} />}
              title="Alertas de Validade"
              description="Receba notificações automáticas 60, 30 e 7 dias antes do vencimento de toxinas e preenchedores. Nunca mais jogue dinheiro fora."
            />
            <FeatureCard
              icon={<BarChart3 size={32} />}
              title="Relatórios Completos"
              description="Gráficos intuitivos de distribuição de estoque por categoria, curva ABC e histórico de movimentações."
            />
            <FeatureCard
              icon={<Zap size={32} />}
              title="Fácil de Usar"
              description="Interface limpa e moderna. Treine sua recepção ou gerentes em menos de 15 minutos."
            />
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto bg-card border border-border rounded-3xl p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
          {/* Background Effects */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              Pronto para profissionalizar sua gestão?
            </h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
              Junte-se a mais de 500 clínicas que já economizaram milhares de
              reais evitando desperdícios.
            </p>
            <button
              onClick={handleEnterSystem}
              className="px-10 py-5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white rounded-full font-bold text-xl shadow-lg transform hover:scale-105 transition-all"
            >
              Criar Conta Gratuita
            </button>
            <p className="mt-6 text-sm text-muted-foreground">
              Setup instantâneo • Sem fidelidade
            </p>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-background border-t border-border pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white">
                  <Sparkles size={16} />
                </div>
                <span className="text-lg font-bold text-foreground">
                  EstéticaStock
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                O sistema definitivo para gestão de estoque em clínicas de alta
                performance.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-foreground mb-4">Produto</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary">
                    Funcionalidades
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Integrações
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Preços
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Roadmap
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-foreground mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary">
                    Sobre nós
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Carreiras
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Contato
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary">
                    Privacidade
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Termos de Uso
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © 2024 EstéticaStock SaaS. Todos os direitos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              {/* Social Icons Placeholder */}
              <div className="w-6 h-6 bg-muted rounded-full hover:bg-primary transition-colors cursor-pointer"></div>
              <div className="w-6 h-6 bg-muted rounded-full hover:bg-primary transition-colors cursor-pointer"></div>
              <div className="w-6 h-6 bg-muted rounded-full hover:bg-primary transition-colors cursor-pointer"></div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="p-8 rounded-2xl bg-card border border-border hover:shadow-xl hover:border-primary transition-all group">
    <div className="w-14 h-14 bg-accent/50 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-foreground mb-3">{title}</h3>
    <p className="text-muted-foreground leading-relaxed">{description}</p>
  </div>
);
