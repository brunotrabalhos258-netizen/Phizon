
import React from 'react';
import { Target, Plus, MoreHorizontal, TrendingUp } from 'lucide-react';
import { FinancialGoal } from '../types';

interface GoalsManagerProps {
  goals: FinancialGoal[];
  setGoals: React.Dispatch<React.SetStateAction<FinancialGoal[]>>;
}

const GoalsManager: React.FC<GoalsManagerProps> = ({ goals, setGoals }) => {
  const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-800">Seus Objetivos</h2>
          <p className="text-slate-400 font-medium">Transformando economia em realidade.</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-lg shadow-indigo-100 transition-all active:scale-95">
          <Plus size={18} /> Novo Objetivo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {goals.map((goal) => {
          const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
          return (
            <div key={goal.id} className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm relative group overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="text-slate-400 cursor-pointer" />
              </div>
              <div className="flex items-center gap-5 mb-10">
                <div className="bg-indigo-50 p-4 rounded-3xl text-indigo-600">
                  <Target size={28} />
                </div>
                <div>
                  <h4 className="text-xl font-black text-slate-800">{goal.name}</h4>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Faltam {formatCurrency(goal.targetAmount - goal.currentAmount)}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-4xl font-black text-slate-800">{progress.toFixed(0)}<span className="text-xl text-slate-300 ml-1">%</span></span>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Total Acumulado</p>
                    <p className="text-lg font-black text-indigo-600">{formatCurrency(goal.currentAmount)}</p>
                  </div>
                </div>
                
                <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-indigo-700 transition-all duration-1000 ease-out rounded-full shadow-lg" 
                    style={{ width: `${progress}%` }} 
                  />
                </div>

                <div className="flex justify-between text-[10px] font-black text-slate-300 uppercase tracking-widest pt-2">
                  <span>Início</span>
                  <span>Meta: {formatCurrency(goal.targetAmount)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Actionable card */}
      <div className="bg-slate-900 rounded-[3rem] p-12 text-white flex flex-col md:flex-row items-center gap-10">
        <div className="bg-indigo-600/20 p-6 rounded-full border border-indigo-500/30">
          <TrendingUp size={48} className="text-indigo-400" />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-2xl font-black mb-2">Acelere seus resultados</h3>
          <p className="text-slate-400 leading-relaxed font-medium">Se você investir R$ 500 a mais por mês, você atingirá seu objetivo de "Reserva de Emergência" 3 meses antes do planejado.</p>
        </div>
        <button className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black hover:bg-slate-100 transition-colors whitespace-nowrap">
          Otimizar Metas
        </button>
      </div>
    </div>
  );
};

export default GoalsManager;
