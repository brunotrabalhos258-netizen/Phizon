
import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { 
  ArrowUpCircle, 
  ArrowDownCircle, 
  TrendingUp, 
  Wallet,
  ShieldCheck,
  AlertTriangle,
  Lightbulb,
  ArrowRight
} from 'lucide-react';
import { Transaction, FinancialHealthReport } from '../types';

interface DashboardProps {
  transactions: Transaction[];
  report: FinancialHealthReport | null;
}

interface DailyData {
  date: string;
  income: number;
  expense: number;
}

const Dashboard: React.FC<DashboardProps> = ({ transactions, report }) => {
  const summary = useMemo(() => {
    const totalIncome = transactions.filter(t => t.type === 'INCOME').reduce((acc, t) => acc + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'EXPENSE').reduce((acc, t) => acc + t.amount, 0);
    
    const categoriesMap = transactions.filter(t => t.type === 'EXPENSE').reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

    const pieData = Object.entries(categoriesMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    const dailyMap = transactions.reduce((acc, t) => {
      const dateStr = t.date;
      if (!acc[dateStr]) acc[dateStr] = { date: dateStr, income: 0, expense: 0 };
      if (t.type === 'INCOME') acc[dateStr].income += t.amount;
      else acc[dateStr].expense += t.amount;
      return acc;
    }, {} as Record<string, DailyData>);

    const timelineData = (Object.values(dailyMap) as DailyData[]).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return { totalIncome, totalExpenses, balance: totalIncome - totalExpenses, pieData, timelineData };
  }, [transactions]);

  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];
  const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* Financial Advisor Actionable Section */}
      {report && (
        <div className="bg-slate-900 rounded-[3.5rem] p-10 md:p-14 text-white relative overflow-hidden group shadow-2xl shadow-indigo-200">
          <div className="absolute top-0 right-0 w-[40%] h-full bg-indigo-600/10 -skew-x-12 translate-x-12 group-hover:translate-x-6 transition-transform duration-1000" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            <div className="lg:col-span-8 space-y-8">
              <div className="inline-flex items-center gap-2 bg-indigo-500/20 px-4 py-2 rounded-2xl border border-indigo-400/20 text-indigo-400 text-xs font-black uppercase tracking-[0.2em]">
                <ShieldCheck size={16} /> Relatório de Saúde Financeira
              </div>
              
              <div>
                <h3 className="text-4xl md:text-5xl font-black mb-6 leading-tight">Advisor Inteligente</h3>
                <p className="text-xl text-slate-400 leading-relaxed font-medium max-w-2xl">
                  {report.summary}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/5 backdrop-blur-md p-6 rounded-[2rem] border border-white/10">
                   <h5 className="text-indigo-400 font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                     <TrendingUp size={14} /> Destaques Positivos
                   </h5>
                   <ul className="space-y-3">
                     {report.strengths.map((s, i) => (
                       <li key={i} className="flex items-start gap-3 text-sm font-bold text-slate-300">
                         <div className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                         {s}
                       </li>
                     ))}
                   </ul>
                </div>
                <div className="bg-white/5 backdrop-blur-md p-6 rounded-[2rem] border border-white/10">
                   <h5 className="text-rose-400 font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                     <AlertTriangle size={14} /> Pontos de Atenção
                   </h5>
                   <ul className="space-y-3">
                     {report.weaknesses.map((w, i) => (
                       <li key={i} className="flex items-start gap-3 text-sm font-bold text-slate-300">
                         <div className="mt-1 w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0" />
                         {w}
                       </li>
                     ))}
                   </ul>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col items-center justify-center space-y-10">
               <div className="relative group/score cursor-default">
                  <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-3xl group-hover/score:blur-[60px] transition-all" />
                  <div className="w-64 h-64 rounded-full border-[12px] border-white/5 flex flex-col items-center justify-center relative bg-slate-900 shadow-2xl">
                    <svg className="w-full h-full absolute -rotate-90">
                      <circle cx="128" cy="128" r="114" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                      <circle 
                        cx="128" cy="128" r="114" fill="transparent" 
                        stroke={report.score > 70 ? '#10b981' : report.score > 40 ? '#f59e0b' : '#ef4444'} 
                        strokeWidth="12" 
                        strokeDasharray={2 * Math.PI * 114}
                        strokeDashoffset={2 * Math.PI * 114 * (1 - report.score / 100)}
                        strokeLinecap="round"
                        className="transition-all duration-[2000ms] ease-out shadow-lg shadow-white"
                      />
                    </svg>
                    <span className="text-7xl font-black tracking-tighter">{report.score}</span>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-2">Health Score</span>
                  </div>
               </div>

               <div className="w-full space-y-4">
                  <h5 className="text-center text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Ações Recomendadas</h5>
                  {report.recommendations.map((rec, i) => (
                    <button key={i} className="w-full bg-white/5 hover:bg-white/10 p-4 rounded-2xl border border-white/5 flex items-center justify-between group/rec transition-all">
                      <span className="text-sm font-bold text-slate-300">{rec}</span>
                      <ArrowRight size={16} className="text-indigo-500 group-hover/rec:translate-x-1 transition-transform" />
                    </button>
                  ))}
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Core Metrics Grid - High Focus */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {[
          { label: 'Entradas Totais', value: summary.totalIncome, icon: ArrowUpCircle, color: 'emerald', bg: 'bg-emerald-500', trend: 'Rendimentos' },
          { label: 'Saídas Totais', value: summary.totalExpenses, icon: ArrowDownCircle, color: 'rose', bg: 'bg-rose-500', trend: 'Gastos' },
          { label: 'Saldo de Período', value: summary.balance, icon: Wallet, color: 'indigo', bg: 'bg-indigo-600', trend: 'Disponível' }
        ].map((item, i) => (
          <div key={i} className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm hover:shadow-2xl transition-all hover:-translate-y-2 group">
            <div className="flex justify-between items-start mb-10">
              <div className={`${item.bg} p-4 rounded-3xl shadow-xl shadow-indigo-100 text-white group-hover:rotate-12 transition-all`}>
                <item.icon size={32} />
              </div>
              <div className="text-right">
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full bg-slate-50 ${item.color === 'emerald' ? 'text-emerald-500' : item.color === 'rose' ? 'text-rose-500' : 'text-indigo-500'}`}>
                  {item.trend}
                </span>
              </div>
            </div>
            <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] mb-2">{item.label}</p>
            <h3 className="text-4xl font-black text-slate-900 tracking-tight">{formatCurrency(item.value)}</h3>
            <div className="mt-6 h-1 w-full bg-slate-50 rounded-full overflow-hidden">
               <div className={`h-full ${item.bg} opacity-20`} style={{ width: '65%' }} />
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-white p-12 rounded-[3.5rem] border border-slate-200 shadow-sm">
           <div className="flex justify-between items-center mb-12">
              <div>
                <h4 className="text-2xl font-black text-slate-900">Histórico de Fluxo</h4>
                <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-1">Evolução diária</p>
              </div>
              <div className="flex gap-6">
                <div className="flex items-center gap-2 text-xs font-black text-indigo-600 uppercase tracking-widest"><div className="w-2.5 h-2.5 rounded-full bg-indigo-600 shadow-sm" /> Ganhos</div>
                <div className="flex items-center gap-2 text-xs font-black text-rose-500 uppercase tracking-widest"><div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm" /> Gastos</div>
              </div>
           </div>
           <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={summary.timelineData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#cbd5e1', fontSize: 10, fontWeight: 800}} 
                    tickFormatter={v => new Date(v).toLocaleDateString('pt-BR', {day: '2-digit', month: 'short'})} 
                  />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 30px 60px -12px rgba(0,0,0,0.2)', padding: '16px'}} 
                    formatter={v => formatCurrency(v as number)} 
                  />
                  <Area type="monotone" dataKey="income" stroke="#4f46e5" strokeWidth={5} fillOpacity={1} fill="url(#colorInc)" />
                  <Area type="monotone" dataKey="expense" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorExp)" strokeDasharray="6 6" />
                </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        <div className="bg-white p-12 rounded-[3.5rem] border border-slate-200 shadow-sm flex flex-col">
          <div className="mb-12 text-center lg:text-left">
            <h4 className="text-2xl font-black text-slate-900">Categorias</h4>
            <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-1">Ranking de despesas</p>
          </div>
          <div className="flex-1 flex flex-col justify-center gap-12">
            <div className="h-[250px] relative">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Top Gasto</p>
                    <p className="text-xl font-black text-slate-800">{summary.pieData[0]?.name || '-'}</p>
                 </div>
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={summary.pieData} 
                    innerRadius={80} 
                    outerRadius={110} 
                    paddingAngle={10} 
                    dataKey="value"
                    stroke="none"
                  >
                    {summary.pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={v => formatCurrency(v as number)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-6">
              {summary.pieData.slice(0, 5).map((item, i) => (
                <div key={i} className="flex justify-between items-center group cursor-default">
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-sm font-black text-slate-600 group-hover:text-indigo-600 transition-colors uppercase tracking-wider">{item.name}</span>
                  </div>
                  <span className="text-xs font-black text-slate-400 tabular-nums">{formatCurrency(item.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
