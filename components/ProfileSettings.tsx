
import React, { useState } from 'react';
import { Camera, Shield, Bell, CreditCard, ChevronRight, Save } from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileSettingsProps {
  user: UserProfile;
  setUser: (u: UserProfile) => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ user, setUser }) => {
  const [tempUser, setTempUser] = useState(user);

  const handleSave = () => {
    setUser(tempUser);
    alert("Perfil atualizado com sucesso!");
  };

  const handlePhotoUpload = () => {
    // Simulated upload
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setTempUser({...tempUser, avatar: reader.result as string});
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="h-40 bg-gradient-to-r from-indigo-500 to-indigo-700 relative">
          <button 
            onClick={handleSave}
            className="absolute top-6 right-6 bg-white/20 backdrop-blur-md text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-white hover:text-indigo-600 transition-all"
          >
            <Save size={18} /> Salvar
          </button>
        </div>
        
        <div className="px-10 pb-10">
          <div className="relative -mt-16 mb-8 flex items-end gap-6">
            <div className="relative group">
              <img 
                src={tempUser.avatar || `https://ui-avatars.com/api/?name=${tempUser.name}&size=128&background=6366f1&color=fff`} 
                className="w-32 h-32 rounded-[2.5rem] border-4 border-white shadow-xl object-cover" 
              />
              <button 
                onClick={handlePhotoUpload}
                className="absolute inset-0 bg-black/40 rounded-[2.5rem] flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Camera size={24} />
              </button>
            </div>
            <div className="mb-4">
              <h3 className="text-2xl font-black text-slate-800">{tempUser.name}</h3>
              <p className="text-sm font-bold text-slate-400">Plano Premium • Ativo desde 2024</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase ml-2">Nome Público</label>
              <input 
                type="text" 
                value={tempUser.name} 
                onChange={e => setTempUser({...tempUser, name: e.target.value})}
                className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-700" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase ml-2">E-mail</label>
              <input 
                type="email" 
                value={tempUser.email} 
                onChange={e => setTempUser({...tempUser, email: e.target.value})}
                className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-700" 
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm divide-y divide-slate-50 overflow-hidden">
        {[
          { icon: Shield, label: 'Privacidade e Segurança', desc: 'Gerencie sua senha e autenticação em duas etapas.' },
          { icon: Bell, label: 'Notificações', desc: 'Configure avisos de gastos e lembretes de faturas.' },
          { icon: CreditCard, label: 'Assinatura', desc: 'Veja seu histórico de faturas e altere o plano.' }
        ].map((item, i) => (
          <button key={i} className="w-full flex items-center justify-between p-10 hover:bg-slate-50 transition-colors group text-left">
            <div className="flex items-center gap-6">
              <div className="bg-indigo-50 p-4 rounded-3xl text-indigo-600 group-hover:scale-110 transition-transform">
                <item.icon size={24} />
              </div>
              <div>
                <h4 className="text-lg font-black text-slate-800">{item.label}</h4>
                <p className="text-sm font-medium text-slate-400">{item.desc}</p>
              </div>
            </div>
            <ChevronRight size={24} className="text-slate-200 group-hover:text-indigo-400 transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProfileSettings;
