import React, { useState, useEffect } from 'react';
import { Tenant, UserRole } from '../types';
import { Eye, EyeOff, Building2, User, Mail, Lock, Sparkles, ArrowRight, Sun, Moon } from 'lucide-react';
import { MOCK_TENANTS } from '../constants'; // Fallback sync data for login check

interface AuthProps {
  tenants: Tenant[] | Promise<Tenant[]>; // Accept promise or array
  onLogin: (tenant: Tenant, role: UserRole) => void;
  onRegister: (newTenant: Tenant) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const Auth: React.FC<AuthProps> = ({ tenants, onLogin, onRegister, theme, toggleTheme }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loadedTenants, setLoadedTenants] = useState<Tenant[]>([]);

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [clinicName, setClinicName] = useState('');

  // Handle Promise-based tenants prop
  useEffect(() => {
    if (tenants instanceof Promise) {
        tenants.then(setLoadedTenants).catch(() => setLoadedTenants(MOCK_TENANTS));
    } else if (Array.isArray(tenants)) {
        setLoadedTenants(tenants);
    } else {
        // Fallback if prop is weird (during re-renders)
        setLoadedTenants(MOCK_TENANTS);
    }
  }, [tenants]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Use loadedTenants instead of prop directly
    const user = loadedTenants.find(t => t.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      setError('Usuário não encontrado.');
      return;
    }

    if (user.password !== password) {
      setError('Senha incorreta.');
      return;
    }

    if (user.status === 'PENDING') {
      setError('Sua conta ainda está em análise. Aguarde a aprovação do administrador.');
      return;
    }

    if (user.status === 'SUSPENDED') {
      setError('Esta conta foi suspensa. Entre em contato com o suporte.');
      return;
    }

    // Check if it's the specific SaaS Admin user
    const role = user.email === 'admin@saas.com' ? UserRole.SUPER_ADMIN : UserRole.CLINIC_ADMIN;
    onLogin(user, role);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Simple validation
    if (!name || !clinicName || !email || !password) {
      setError('Todos os campos são obrigatórios.');
      return;
    }

    if (loadedTenants.some(t => t.email.toLowerCase() === email.toLowerCase())) {
      setError('Este email já está cadastrado.');
      return;
    }

    const newTenant: Tenant = {
      id: `t-${Date.now()}`,
      name: clinicName,
      ownerName: name,
      email: email,
      password: password,
      plan: 'PRO', // Default single plan
      status: 'PENDING', // Default status waiting for approval
      joinedDate: new Date().toISOString().split('T')[0]
    };

    onRegister(newTenant);
    setSuccess('Cadastro realizado com sucesso! Sua conta está aguardando aprovação do administrador.');
    setIsLogin(true); // Switch to login view to show the message
    // Clear form
    setName('');
    setClinicName('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative transition-colors duration-300">
       {/* Theme Selector - Top Right */}
       <button 
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all shadow-lg z-50"
        title="Alternar Tema"
      >
        {theme === 'dark' ? <Moon size={24} /> : <Sun size={24} />}
      </button>

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-teal-500/10 blur-3xl"></div>
        <div className="absolute bottom-[0%] right-[0%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-3xl"></div>
      </div>

      <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative z-10 animate-fade-in-up transition-colors duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <Sparkles className="text-white w-8 h-8" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">EstéticaStock SaaS</h1>
          <p className="text-teal-100 text-sm">
            {isLogin ? 'Gerencie sua clínica com inteligência.' : 'Junte-se às melhores clínicas.'}
          </p>
        </div>

        {/* Form Body */}
        <div className="p-8">
          {error && (
            <div className="mb-6 p-3 bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-sm rounded-lg flex items-start">
               <span className="mr-2">⚠️</span> {error}
            </div>
          )}
          {success && (
             <div className="mb-6 p-3 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-sm rounded-lg flex items-start">
               <span className="mr-2">✅</span> {success}
            </div>
          )}

          <form onSubmit={isLogin ? handleLoginSubmit : handleRegisterSubmit} className="space-y-4">
            
            {!isLogin && (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Nome do Responsável</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                    <input 
                      type="text" 
                      placeholder="Dr. João Silva"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white dark:focus:bg-slate-900 transition-all text-slate-900 dark:text-white placeholder-slate-400"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Nome da Clínica</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                    <input 
                      type="text" 
                      placeholder="Clínica Estética..."
                      value={clinicName}
                      onChange={e => setClinicName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white dark:focus:bg-slate-900 transition-all text-slate-900 dark:text-white placeholder-slate-400"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Email Corporativo</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                <input 
                  type="email" 
                  placeholder="contato@clinica.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white dark:focus:bg-slate-900 transition-all text-slate-900 dark:text-white placeholder-slate-400"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white dark:focus:bg-slate-900 transition-all text-slate-900 dark:text-white placeholder-slate-400"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-teal-500/30 transition-all active:scale-95 flex items-center justify-center space-x-2"
            >
              <span>{isLogin ? 'Entrar no Sistema' : 'Solicitar Acesso'}</span>
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              {isLogin ? 'Não tem uma conta?' : 'Já possui cadastro?'}
              <button 
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setSuccess('');
                }}
                className="ml-2 text-teal-600 dark:text-teal-400 font-semibold hover:text-teal-700 dark:hover:text-teal-300 hover:underline"
              >
                {isLogin ? 'Cadastre sua clínica' : 'Fazer Login'}
              </button>
            </p>
          </div>
        </div>
        
        {/* Footer info */}
         <div className="bg-slate-50 dark:bg-slate-800 p-4 text-center border-t border-slate-100 dark:border-slate-700">
           <p className="text-xs text-slate-400">© 2024 EstéticaStock SaaS. Todos os direitos reservados.</p>
         </div>
      </div>
    </div>
  );
};