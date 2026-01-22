
import React, { useState, useMemo } from 'react';
import { Search, Filter, ArrowUpCircle, ArrowDownCircle, Tag, CheckCircle2, Clock } from 'lucide-react';
import { Transaction } from '../types';

interface TransactionListProps {
  transactions: Transaction[];
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('');

  const categories = useMemo(() => {
    const cats = new Set(transactions.map(t => t.category));
    return ['all', ...Array.from(cats)];
  }, [transactions]);

  const filtered = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
      const matchesTag = tagFilter === '' || t.tags?.some(tag => tag.toLowerCase().includes(tagFilter.toLowerCase()));
      return matchesSearch && matchesCategory && matchesStatus && matchesTag;
    });
  }, [transactions, searchTerm, categoryFilter, statusFilter, tagFilter]);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="flex flex-col h-full bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
      {/* Header & Advanced Filters */}
      <div className="p-8 border-b border-slate-100 bg-slate-50/30">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="relative col-span-1 lg:col-span-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por descrição..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none text-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <select 
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium appearance-none"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">Todas Categorias</option>
              {categories.filter(c => c !== 'all').map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="relative">
            <CheckCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <select 
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium appearance-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Todos Status</option>
              <option value="PAID">Pago</option>
              <option value="PENDING">Pendente</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Filtrar por tag..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-xs font-medium"
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
            />
          </div>
          <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">
            {filtered.length} transações encontradas
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
              <th className="px-8 py-4">Data</th>
              <th className="px-8 py-4">Descrição & Tags</th>
              <th className="px-8 py-4">Categoria</th>
              <th className="px-8 py-4">Status</th>
              <th className="px-8 py-4 text-right">Valor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((t) => (
              <tr key={t.id} className="hover:bg-indigo-50/30 transition-colors group">
                <td className="px-8 py-6">
                  <span className="text-sm text-slate-500 font-bold">
                    {new Date(t.date).toLocaleDateString('pt-BR')}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-lg ${t.type === 'INCOME' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                        {t.type === 'INCOME' ? <ArrowUpCircle size={16} /> : <ArrowDownCircle size={16} />}
                      </div>
                      <span className="text-sm font-black text-slate-800 group-hover:text-indigo-600 transition-colors">{t.description}</span>
                    </div>
                    {t.tags && t.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 ml-9">
                        {t.tags.map(tag => (
                          <span key={tag} className="px-2 py-0.5 bg-slate-100 text-slate-400 text-[9px] font-black rounded uppercase tracking-wider group-hover:bg-indigo-100 group-hover:text-indigo-400 transition-colors">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-bold bg-slate-100 text-slate-500">
                    {t.category}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <div className={`flex items-center gap-1.5 text-xs font-black uppercase tracking-widest ${t.status === 'PAID' ? 'text-emerald-500' : 'text-amber-500'}`}>
                    {t.status === 'PAID' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                    {t.status === 'PAID' ? 'Pago' : 'Pendente'}
                  </div>
                </td>
                <td className={`px-8 py-6 text-right font-black text-base ${t.type === 'INCOME' ? 'text-emerald-600' : 'text-slate-900'}`}>
                  {t.type === 'INCOME' ? '+' : '-'} {formatCurrency(t.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filtered.length === 0 && (
          <div className="py-24 text-center">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="text-slate-300" size={32} />
            </div>
            <h4 className="text-xl font-black text-slate-800">Nenhum resultado</h4>
            <p className="text-slate-400 font-medium max-w-xs mx-auto mt-2">Tente ajustar seus filtros para encontrar o que procura.</p>
            <button 
              onClick={() => { setCategoryFilter('all'); setStatusFilter('all'); setSearchTerm(''); setTagFilter(''); }}
              className="mt-6 text-indigo-600 font-black text-sm hover:underline"
            >
              Limpar todos os filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionList;
