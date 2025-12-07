import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { InventoryTable } from './components/InventoryTable';
import { SaaSAdmin } from './components/SaaSAdmin';
import { Assistant } from './components/Assistant';
import { Auth } from './components/Auth';
import { UserRole, Product, Tenant } from './types';
import { Layers, Moon, Sun, X, Save, Plus, Loader2 } from 'lucide-react';
import { api } from './services/api'; // Importando a nova camada de serviço

export default function App() {
  // Theme State
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  // Layout State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<Tenant | null>(null);
  
  // App State - Loading Data
  const [isLoading, setIsLoading] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [userRole, setUserRole] = useState<UserRole>(UserRole.CLINIC_ADMIN);
  
  // Data State (Inicializado vazio, populado via useEffect)
  const [products, setProducts] = useState<Product[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'batches' | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // DATA FETCHING (Simulation of Next.js Client Component Fetching)
  useEffect(() => {
    if (isAuthenticated) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          // Em Next.js, isso poderia ser substituido por React Server Components ou SWR/React Query
          const [productsData, tenantsData] = await Promise.all([
            api.products.list(),
            api.tenants.list()
          ]);
          setProducts(productsData);
          setTenants(tenantsData);
        } catch (error) {
          console.error("Failed to fetch data", error);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchData();
    }
  }, [isAuthenticated]);

  // Handlers for Opening Modals
  const handleAddProduct = () => {
    setSelectedProduct(null);
    setModalType('add');
    setModalOpen(true);
  };

  const handleEditProduct = (p: Product) => {
    setSelectedProduct(p);
    setModalType('edit');
    setModalOpen(true);
  };

  const handleManageBatches = (p: Product) => {
    setSelectedProduct(p);
    setModalType('batches');
    setModalOpen(true);
  };

  // Logic to close modal
  const closeModal = () => {
    setModalOpen(false);
    setModalType(null);
    setSelectedProduct(null);
  };

  // Mock Form Submit Handler - Updated to use API simulation
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate API Call
    if (modalType === 'add') {
      await api.products.create({} as Product); // Mock implementation
      alert("Produto salvo com sucesso! (Simulado)");
    }
    
    closeModal();
  };

  // Theme Handler
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Auth Handlers
  const handleLogin = (user: Tenant, role: UserRole) => {
    setCurrentUser(user);
    setUserRole(role);
    setIsAuthenticated(true);
    
    if (role === UserRole.SUPER_ADMIN) {
      setCurrentView('saas_dashboard');
    } else {
      setCurrentView('dashboard');
    }
  };

  const handleRegister = (newTenant: Tenant) => {
    const tenantWithPlan = { ...newTenant, plan: 'PRO' as const };
    setTenants(prev => [...prev, tenantWithPlan]);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setUserRole(UserRole.CLINIC_ADMIN);
    setProducts([]); // Clear data on logout
  };

  // SaaS Admin Handlers
  const handleApproveTenant = async (id: string) => {
    // Optimistic Update
    setTenants(prev => prev.map(t => t.id === id ? { ...t, status: 'ACTIVE' } : t));
    await api.tenants.updateStatus(id, 'ACTIVE');
  };

  const handleRejectTenant = async (id: string) => {
    if (window.confirm('Tem certeza que deseja rejeitar e remover esta solicitação?')) {
      setTenants(prev => prev.filter(t => t.id !== id));
      // await api.tenants.delete(id);
    }
  };

  // Apply Theme Class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // --- RENDER MODAL CONTENT ---
  const renderModalContent = () => {
    if (!modalType) return null;

    if (modalType === 'batches' && selectedProduct) {
      return (
        <div className="space-y-4">
           <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
             <h4 className="font-semibold text-slate-800 dark:text-white mb-2">Lotes Atuais: {selectedProduct.name}</h4>
             {selectedProduct.batches.length === 0 ? (
               <p className="text-sm text-slate-500">Nenhum lote registrado.</p>
             ) : (
               <ul className="space-y-2">
                 {selectedProduct.batches.map(b => (
                   <li key={b.id} className="flex justify-between text-sm border-b border-slate-200 dark:border-slate-600 pb-2 last:border-0">
                     <span className="text-slate-700 dark:text-slate-300">#{b.batchNumber} - Val: {b.expiryDate}</span>
                     <span className="font-bold text-slate-900 dark:text-white">{b.quantity} un</span>
                   </li>
                 ))}
               </ul>
             )}
           </div>
           <button className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg flex items-center justify-center space-x-2 transition-colors">
              <Plus size={18} />
              <span>Adicionar Novo Lote</span>
           </button>
        </div>
      );
    }

    // Add or Edit Product Form
    return (
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nome do Produto</label>
          <input 
            type="text" 
            defaultValue={selectedProduct?.name || ''} 
            className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
            placeholder="Ex: Toxina Botulínica"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">SKU</label>
            <input 
              type="text" 
              defaultValue={selectedProduct?.sku || ''} 
              className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Categoria</label>
            <select className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none">
              <option>Toxinas</option>
              <option>Preenchedores</option>
              <option>Bioestimuladores</option>
              <option>Descartáveis</option>
            </select>
          </div>
        </div>
        <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Descrição</label>
            <textarea 
              defaultValue={selectedProduct?.description || ''} 
              className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none h-24"
            ></textarea>
        </div>
        <div className="flex justify-end pt-2">
           <button type="submit" className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium flex items-center transition-colors">
             <Save size={18} className="mr-2" />
             Salvar Produto
           </button>
        </div>
      </form>
    );
  };

  // --- LOADING SCREEN ---
  // Apenas renderiza se estiver autenticado e carregando
  // Se não estiver autenticado, Auth screen lida com isso.
  if (isAuthenticated && isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-100 dark:bg-slate-900">
         <div className="flex flex-col items-center animate-pulse">
            <Loader2 size={48} className="text-teal-600 animate-spin mb-4" />
            <p className="text-slate-600 dark:text-slate-400 font-medium">Conectando ao banco de dados...</p>
         </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Note: In a real app with api.tenants.list(), we might need to pass tenants 
    // to Auth component differently or fetch them inside Auth if needed for login validation.
    // For now, passing the empty state or mock is fine for the logic flow.
    return (
      <Auth 
        tenants={api.tenants.list().then(t => t) as any} // Temporary cast for compatibility
        onLogin={handleLogin} 
        onRegister={handleRegister} 
        theme={theme}
        toggleTheme={toggleTheme}
      />
    );
  }

  return (
    <div className={`flex h-screen bg-slate-100 dark:bg-slate-900 font-sans transition-colors duration-300`}>
      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        role={userRole}
        onLogout={handleLogout}
        isCollapsed={isSidebarCollapsed}
        toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      
      {/* Main Content: Adjusted margin based on sidebar state */}
      <main className={`flex-1 p-8 overflow-y-auto relative transition-all duration-300 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              {currentView === 'dashboard' ? 'Dashboard da Clínica' : 
               currentView === 'inventory' ? 'Gerenciamento de Estoque' :
               currentView === 'saas_dashboard' ? 'SaaS Master Dashboard' :
               currentView === 'tenants' ? 'Gestão de Clínicas' : 
               currentView === 'settings' || currentView === 'saas_settings' ? 'Configurações' : 'Painel'}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Bem-vindo ao sistema EstéticaStock.
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
             <div className="flex items-center space-x-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-full shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                  userRole === UserRole.SUPER_ADMIN ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300' : 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300'
                }`}>
                  {userRole === UserRole.CLINIC_ADMIN ? 'D' : 'A'}
                </div>
                <div className="text-sm hidden sm:block">
                  <p className="font-semibold text-slate-700 dark:text-slate-200">
                    {currentUser?.name || 'Usuário'}
                  </p>
                </div>
             </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="animate-fade-in">
          {userRole === UserRole.CLINIC_ADMIN && (
            <>
              {currentView === 'dashboard' && <Dashboard products={products} />}
              {currentView === 'inventory' && (
                <InventoryTable 
                  products={products}
                  onAddProduct={handleAddProduct}
                  onEditProduct={handleEditProduct}
                  onManageBatches={handleManageBatches}
                />
              )}
              {currentView === 'treatments' && (
                <div className="flex flex-col items-center justify-center h-96 text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 border-dashed">
                  <Layers size={48} className="mb-4 text-slate-300 dark:text-slate-600" />
                  <p>Módulo de Fichas Técnicas em desenvolvimento.</p>
                </div>
              )}
               {currentView === 'settings' && (
                <div className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors">
                  <h3 className="text-lg font-bold mb-6 text-slate-800 dark:text-slate-100">Configurações da Clínica</h3>
                  
                  {/* Theme Selector inside Settings */}
                  <div className="mb-8">
                    <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Aparência</h4>
                    <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-white dark:bg-slate-800 rounded-full shadow-sm text-slate-700 dark:text-slate-300">
                          {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                        </div>
                        <div>
                          <p className="font-medium text-slate-800 dark:text-slate-200">Tema do Sistema</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Alternar entre modo claro e escuro</p>
                        </div>
                      </div>
                      <button 
                        onClick={toggleTheme}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${theme === 'dark' ? 'bg-teal-600' : 'bg-slate-200'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                    <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Conta</h4>
                    <p className="text-slate-500 dark:text-slate-400">Gerencie usuários, notificações e dados da empresa aqui (Em breve).</p>
                  </div>
                </div>
              )}
            </>
          )}

          {userRole === UserRole.SUPER_ADMIN && (
             <>
               {(currentView === 'saas_dashboard' || currentView === 'tenants') && (
                 <SaaSAdmin 
                  view={currentView as 'saas_dashboard' | 'tenants'}
                  tenants={tenants} 
                  onApprove={handleApproveTenant}
                  onReject={handleRejectTenant}
                 />
               )}
                {currentView === 'saas_settings' && (
                <div className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors">
                  <h3 className="text-lg font-bold mb-6 text-slate-800 dark:text-slate-100">Configurações Globais SaaS</h3>
                   {/* Theme Selector inside SaaS Settings */}
                   <div className="mb-8">
                    <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Aparência</h4>
                    <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-white dark:bg-slate-800 rounded-full shadow-sm text-slate-700 dark:text-slate-300">
                          {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                        </div>
                        <div>
                          <p className="font-medium text-slate-800 dark:text-slate-200">Tema do Sistema</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Alternar entre modo claro e escuro</p>
                        </div>
                      </div>
                      <button 
                        onClick={toggleTheme}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${theme === 'dark' ? 'bg-teal-600' : 'bg-slate-200'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
             </>
          )}
        </div>
      </main>

      {/* GLOBAL MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden transform transition-all scale-100">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                {modalType === 'add' ? 'Adicionar Novo Produto' : 
                 modalType === 'edit' ? 'Editar Produto' : 
                 'Gerenciar Lotes'}
              </h3>
              <button onClick={closeModal} className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              {renderModalContent()}
            </div>
          </div>
        </div>
      )}

      {/* AI Assistant - Only for Clinic Admins */}
      {userRole === UserRole.CLINIC_ADMIN && <Assistant inventory={products} />}
    </div>
  );
}