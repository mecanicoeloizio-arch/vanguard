import React from 'react';
import { GraduationCap, ShieldCheck, Lock, Smartphone, Wifi } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-sm">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-lg font-black text-white">
                Edu<span className="text-indigo-400">Vanguard</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Plataforma de Gestão Acadêmica Integrada & Cursos 100% Online. Automatização de processos pedagógicos, financeiros e emissão de credenciais oficiais.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Módulos do Sistema</h4>
            <ul className="space-y-1.5 text-xs">
              <li><span className="hover:text-white transition-colors cursor-pointer">Vitrine de Cursos Online</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Portal do Aluno & Boletim</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Diário de Classe & Notas</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Secretaria Digital Mercado Pago</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Conector ERP Acadêmico</span></li>
            </ul>
          </div>

          {/* Compliance & Security */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Segurança & Conformidade</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Certificado ICP-Brasil & MEC</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Lock className="w-4 h-4 text-indigo-400" />
                <span>Criptografia SHA-256 & LGPD</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Smartphone className="w-4 h-4 text-blue-400" />
                <span>PWA & Suporte Mobile Offline</span>
              </div>
            </div>
          </div>

          {/* Mercado Pago Badge */}
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-white">Mercado Pago Integrado</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30">
                Gateway Ativo
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Pagamentos de taxas de documentos e matrículas processados via PIX instantâneo, Cartão de Crédito e Boleto.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 2026 Grupo Eloizio — Cursos 100% Online, Assessoria Contábil & Oficina Mecânica. Todos os direitos reservados.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Termos de Uso</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Política de Privacidade & LGPD</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Validação de Documentos</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
