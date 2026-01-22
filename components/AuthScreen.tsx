
import React, { useState } from 'react';
import { Wallet, Mail, Lock, ArrowRight, Github } from 'lucide-react';
import { UserProfile } from '../types';

interface AuthScreenProps {
  onLogin: (user: UserProfile) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: 'Usuário Teste', email: 'contato@exemplo.com' });

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-96 bg-indigo-600 clip-path-hero -z-10" />
      <style>{`.clip-path-hero { clip-path: ellipse(100% 55% at 50% 0%); }`}</style>
      
      <div className="max-w-md w-full">
        <div className="text-center mb-10 text-white">
          <div className="inline-flex bg-white/20 backdrop-blur-xl p-4 rounded-3xl mb-6 shadow-2xl">
            <Wallet size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-2">FinançasAI</h1>
          <p className="text-indigo-100 font-medium opacity-80">Gestão financeira de outro nível.</p>
        </div>

        <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-indigo-900/10 border border-slate-100 animate-in fade-in zoom-in duration-500">
          <h2 className="text-2xl font-black text-slate-800 mb-8">{isLogin ? 'Bem-vindo de volta' : 'Criar minha conta'}</h2>
          
          <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); onLogin(formData); }}>
            {!isLogin && (
               <div className="space-y-2">
                 <label className="text-xs font-black text-slate-400 uppercase ml-2">Nome Completo</label>
                 <div className="relative">
                   <input 
                    type="text" required 
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full pl-5 pr-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-slate-700" 
                    placeholder="Seu nome" 
                  />
                 </div>
               </div>
            )}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase ml-2">E-mail</label>
              <div className="relative">
                <input 
                  type="email" required 
                  value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-5 pr-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-slate-700" 
                  placeholder="seu@email.com" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase ml-2">Senha</label>
              <div className="relative">
                <input 
                  type="password" required 
                  className="w-full pl-5 pr-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-slate-700" 
                  placeholder="••••••••" 
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-black shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-3 active:scale-95 group">
              {isLogin ? 'Entrar' : 'Começar Agora'} <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
            <div className="relative flex justify-center text-xs uppercase font-black text-slate-300"><span className="bg-white px-4">Ou continuar com</span></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-3 border border-slate-100 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all">
              <img src="https://www.google.com/favicon.ico" className="w-4 h-4" /> Google
            </button>
            <button className="flex items-center justify-center gap-2 py-3 border border-slate-100 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all">
              <Github size={18} /> Github
            </button>
          </div>

          <p className="text-center mt-10 text-sm font-bold text-slate-400">
            {isLogin ? 'Não tem uma conta?' : 'Já possui conta?'} 
            <button onClick={() => setIsLogin(!isLogin)} className="text-indigo-600 ml-1 hover:underline font-black transition-all">
              {isLogin ? 'Cadastre-se' : 'Faça Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
