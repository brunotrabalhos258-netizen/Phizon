
import React, { useState, useMemo, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Upload, 
  TrendingUp, 
  Wallet, 
  FileText,
  Target,
  User,
  LogOut,
  Calendar,
  Zap,
  RefreshCw,
  ChevronRight
} from 'lucide-react';
import { Transaction, AIInsight, UserProfile, FinancialGoal, FinancialHealthReport } from './types';
import { extractTransactionsFromFiles, getFinancialHealthReport } from './services/geminiService';
import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import FileUploader from './components/FileUploader';
import GoalsManager from './components/GoalsManager';
import AuthScreen from './components/AuthScreen';
import ProfileSettings from './components/ProfileSettings';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuth, setIsAuth] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<FinancialGoal[]>([
    { id: '1', name: 'Reserva de Emergência', targetAmount: 15000, currentAmount: 4200 },
    { id: '2', name: 'Viagem Japão', targetAmount: 25000, currentAmount: 1200 }
  ]);
  const [healthReport, setHealthReport] = useState<FinancialHealthReport | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions' | 'goals' | 'profile'>('dashboard');
  
  // Date range management with shortcuts
  const [dateRange, setDateRange] = useState<{start: string, end: string}>({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [activePeriod, setActivePeriod] = useState<string>('Este Mês');

  const setPeriod = (label: string, days: number | 'month') => {
    setActivePeriod(label);
    const now = new Date();
    let start: Date;
    
    if (days === 'month') {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
    } else {
      start = new Date();
      start.setDate(now.getDate() - days);
    }
    
    setDateRange({
      start: start.toISOString().split('T')[0],
      end: now.toISOString().split('T')[0]
    });
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const tDate = new Date(t.date);
      const start = new Date(dateRange.start);
      start.setHours(0, 0, 0, 0);
      const end = new Date(dateRange.end);
      end.setHours(23, 59, 59, 999);
      return tDate >= start && tDate <= end;
    });
  }, [transactions, dateRange]);

  const handleFileUpload = async (files: File[]) => {
    setIsProcessing(true);
    try {
      const newTransactions = await extractTransactionsFromFiles(files);
      const merged = [...transactions, ...newTransactions].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setTransactions(merged);
      
      const report = await getFinancialHealthReport(merged);
      setHealthReport(report);
    } catch (error) {
      console.error("Erro ao processar arquivos:", error);
      alert("Houve um erro ao processar seus arquivos.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSyncBank = () => {
    alert("Iniciando protocolo Open Finance... Buscando dados de instituições brasileiras (Mock)");
    setTimeout(() => {
      alert("Sincronização concluída com sucesso!");
    }, 2000);
  };

  if (!isAuth) {
    return <AuthScreen onLogin={(u) => { setUser(u); setIsAuth(true); }} />;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f8fafc]">
      {/* Sidebar */}
      <aside className="w-full md:w-80 bg-white border-r border-slate-200 p-8 flex flex-col gap-10 h-screen sticky top-0 overflow-y-auto z-20">
        <div className="flex items-center gap-4 mb-2">
          <div className="bg-indigo-600 p-3 rounded-[1.25rem] shadow-2xl shadow-indigo-200 text-white">
            <Wallet size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tighter">FinançasAI</h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] -mt-1">Advisor Inteligente</p>
          </div>
        </div>

        <div className="space-y-8 flex-1">
          <nav className="flex flex-col gap-2">
            {[
              { id: 'dashboard', label: 'Visão Geral', icon: LayoutDashboard },
              { id: 'transactions', label: 'Transações', icon: FileText },
              { id: 'goals', label: 'Meus Objetivos', icon: Target },
              { id: 'profile', label: 'Configurações', icon: User },
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`flex items-center justify-between px-5 py-4 rounded-[1.25rem] transition-all duration-300 group ${activeTab === item.id ? 'bg-indigo-600 text-white font-black shadow-xl translate-x-1' : 'text-slate-500 hover:bg-slate-50 font-bold'}`}
              >
                <div className="flex items-center gap-4">
                  <item.icon size={20} className={activeTab === item.id ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'} />
                  <span className="text-sm">{item.label}</span>
                </div>
                {activeTab === item.id && <ChevronRight size={16} className="text-indigo-300" />}
              </button>
            ))}
          </nav>

          <div className="p-6 bg-slate-900 rounded-[2.5rem] relative overflow-hidden group shadow-xl shadow-slate-200">
            <Zap className="absolute -right-4 -bottom-4 w-28 h-28 text-indigo-500 opacity-20 rotate-12 group-hover:rotate-0 transition-transform duration-700" />
            <div className="relative z-10">
              <h4 className="text-sm font-black text-white mb-2 tracking-tight">Open Finance</h4>
              <p className="text-[11px] text-slate-400 mb-5 font-medium leading-relaxed">Conecte sua conta bancária e tenha análise em tempo real.</p>
              <button 
                onClick={handleSyncBank}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw size={12} /> Sincronizar Agora
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100">
           <div className="flex items-center gap-4 px-2 mb-6">
             <div className="relative group cursor-pointer" onClick={() => setActiveTab('profile')}>
               <img 
                 src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=6366f1&color=fff`} 
                 className="w-12 h-12 rounded-2xl border-2 border-slate-50 shadow-md group-hover:scale-105 transition-transform" 
               />
               <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
             </div>
             <div className="flex-1 min-w-0">
               <p className="text-sm font-black text-slate-900 truncate">{user?.name}</p>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">{user?.email}</p>
             </div>
           </div>
           <button 
            onClick={() => setIsAuth(false)}
            className="w-full flex items-center gap-3 px-5 py-3 text-sm text-rose-500 hover:bg-rose-50 rounded-2xl transition-all font-black group"
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" /> Sair do Sistema
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-[#f8fafc] relative overflow-y-auto h-screen scroll-smooth">
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-2xl border-b border-slate-200 px-10 py-6 flex flex-col xl:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center xl:items-start gap-1 w-full xl:w-auto">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {activeTab === 'dashboard' ? 'Overview' : activeTab === 'transactions' ? 'Transações' : activeTab === 'goals' ? 'Meus Objetivos' : 'Configurações'}
            </h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Dashboard Financeiro</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 bg-slate-100 p-1.5 rounded-3xl w-full xl:w-auto overflow-hidden">
            {[
              { label: 'Este Mês', days: 'month' },
              { label: '30 Dias', days: 30 },
              { label: '60 Dias', days: 60 },
              { label: '90 Dias', days: 90 },
            ].map(btn => (
              <button 
                key={btn.label}
                className={`whitespace-nowrap px-5 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all ${activePeriod === btn.label ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                onClick={() => setPeriod(btn.label, btn.days as any)}
              >
                {btn.label}
              </button>
            ))}
            
            <div className="flex items-center gap-2 ml-4 px-4 py-2 bg-white/50 rounded-2xl border border-slate-200/50">
              <Calendar size={14} className="text-slate-400" />
              <div className="flex items-center gap-2">
                <input 
                  type="date" 
                  value={dateRange.start} 
                  onChange={e => { setDateRange(prev => ({ ...prev, start: e.target.value })); setActivePeriod('Custom'); }}
                  className="bg-transparent border-none text-[10px] font-black text-slate-600 focus:ring-0 p-0 cursor-pointer uppercase tracking-tighter" 
                />
                <span className="text-slate-300 font-bold">→</span>
                <input 
                  type="date" 
                  value={dateRange.end} 
                  onChange={e => { setDateRange(prev => ({ ...prev, end: e.target.value })); setActivePeriod('Custom'); }}
                  className="bg-transparent border-none text-[10px] font-black text-slate-600 focus:ring-0 p-0 cursor-pointer uppercase tracking-tighter" 
                />
              </div>
            </div>
          </div>
        </header>

        <div className="p-6 md:p-12 max-w-screen-2xl mx-auto space-y-12">
          {transactions.length === 0 && !isProcessing && activeTab !== 'profile' ? (
            <div className="mt-20">
              <FileUploader onUpload={handleFileUpload} />
            </div>
          ) : (
            <>
              {isProcessing && (
                <div className="flex flex-col items-center justify-center p-24 bg-white rounded-[4rem] border-4 border-dashed border-indigo-100 animate-pulse shadow-2xl shadow-indigo-50">
                  <div className="relative mb-8">
                    <div className="w-24 h-24 border-8 border-slate-50 border-t-indigo-600 rounded-full animate-spin"></div>
                    <Zap className="absolute inset-0 m-auto text-indigo-600" size={32} />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight">Processamento Neural</h3>
                  <p className="text-slate-400 font-bold uppercase tracking-[0.2em] mt-3 text-center">
                    Extraindo inteligência dos seus extratos...
                  </p>
                </div>
              )}

              {activeTab === 'dashboard' && <Dashboard transactions={filteredTransactions} report={healthReport} />}
              {activeTab === 'transactions' && <TransactionList transactions={filteredTransactions} />}
              {activeTab === 'goals' && <GoalsManager goals={goals} setGoals={setGoals} />}
              {activeTab === 'profile' && <ProfileSettings user={user!} setUser={setUser} />}

              {/* Float Upload Action */}
              <div className="fixed bottom-12 right-12 z-40 group">
                <div className="absolute -inset-4 bg-indigo-600/20 rounded-full blur-2xl group-hover:bg-indigo-600/30 transition-all scale-75 group-hover:scale-100" />
                <label className="flex items-center gap-4 bg-slate-900 hover:bg-black text-white px-8 py-5 rounded-[2rem] shadow-2xl cursor-pointer transition-all hover:scale-105 active:scale-95 group relative border border-white/10">
                  <Upload size={22} className="group-hover:bounce transition-all" />
                  <div className="flex flex-col">
                    <span className="font-black text-xs tracking-widest uppercase">Adicionar Extrato</span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em]">IA Analysis Active</span>
                  </div>
                  <input type="file" multiple className="hidden" onChange={(e) => e.target.files && handleFileUpload(Array.from(e.target.files))} />
                </label>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
