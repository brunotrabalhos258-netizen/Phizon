
import React, { useRef } from 'react';
import { Upload, FileText, CheckCircle } from 'lucide-react';

interface FileUploaderProps {
  onUpload: (files: File[]) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUpload(Array.from(e.target.files));
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div 
        onClick={() => fileInputRef.current?.click()}
        className="group relative flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-300 rounded-[2rem] bg-white hover:border-emerald-400 hover:bg-emerald-50/30 transition-all cursor-pointer overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center mb-6 text-emerald-600 group-hover:scale-110 group-hover:rotate-3 transition-transform">
          <Upload size={32} />
        </div>

        <h3 className="text-2xl font-bold text-slate-800 mb-2">Comece por aqui</h3>
        <p className="text-slate-500 text-center max-w-sm mb-8">
          Arraste ou selecione seus extratos bancários em PDF, CSV, TXT ou Excel para uma análise completa.
        </p>

        <div className="flex flex-wrap justify-center gap-4 text-xs font-medium uppercase tracking-wider text-slate-400">
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-full"><FileText size={12}/> PDF</span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-full"><FileText size={12}/> CSV</span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-full"><FileText size={12}/> XLSX</span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-full"><FileText size={12}/> TXT</span>
        </div>

        <input 
          ref={fileInputRef}
          type="file" 
          multiple 
          accept=".pdf,.csv,.txt,.xlsx,.xls" 
          className="hidden" 
          onChange={handleFileChange} 
        />
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: <CheckCircle className="text-emerald-500"/>, title: "100% Automático", desc: "A IA categoriza tudo para você." },
          { icon: <CheckCircle className="text-emerald-500"/>, title: "Insights Reais", desc: "Entenda onde seu dinheiro está indo." },
          { icon: <CheckCircle className="text-emerald-500"/>, title: "Totalmente Seguro", desc: "Seus dados são processados localmente." }
        ].map((item, idx) => (
          <div key={idx} className="flex gap-3 items-start p-4 bg-white/50 rounded-xl border border-slate-100">
            <div className="mt-1">{item.icon}</div>
            <div>
              <h4 className="font-semibold text-slate-800 text-sm">{item.title}</h4>
              <p className="text-xs text-slate-500">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileUploader;
