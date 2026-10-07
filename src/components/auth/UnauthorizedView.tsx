import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, Lock, ArrowRight, UserCheck, GraduationCap } from 'lucide-react';

interface UnauthorizedViewProps {
  requiredRole: 'student' | 'teacher' | 'admin';
  title: string;
}

export const UnauthorizedView: React.FC<UnauthorizedViewProps> = ({ requiredRole, title }) => {
  const { currentUser, setShowAuthModal, setActiveNavTab, setAuthTargetTab } = useApp();

  const handleOpenLogin = () => {
    setAuthTargetTab(requiredRole);
    setShowAuthModal(true);
  };

  const roleNames: Record<string, string> = {
    student: 'Aluno',
    teacher: 'Professor / Corpo Docente',
    admin: 'Direção Geral & Coordenação',
  };

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-4 py-8 sm:py-16 text-center">
      <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-10 border border-slate-200 shadow-xl space-y-5 sm:space-y-6">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-xs">
          <ShieldAlert className="w-8 h-8 sm:w-10 sm:h-10" />
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full text-[10px] sm:text-xs font-black uppercase bg-amber-100 text-amber-800 border border-amber-300 inline-block">
            Acesso Restrito & Autorização Necessária
          </span>
          <h2 className="text-xl sm:text-3xl font-black text-slate-900 leading-tight">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
            {!currentUser ? (
              'Você está navegando como visitante. Para acessar este ambiente restrito, faça login com sua conta institucional ou utilize a Senha Master.'
            ) : (
              <>
                Seu perfil atual é <strong>{roleNames[currentUser.role]}</strong>, porém esta área é exclusiva para <strong>{roleNames[requiredRole]}</strong>.
              </>
            )}
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3">
          <button
            onClick={handleOpenLogin}
            className="w-full sm:w-auto px-5 sm:px-6 py-3 min-h-[44px] bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl sm:rounded-2xl text-xs sm:text-sm font-black shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Lock className="w-4 h-4" />
            {!currentUser ? 'Fazer Login / Senha Master' : 'Alternar Perfil / Entrar como ' + roleNames[requiredRole]}
          </button>

          <button
            onClick={() => setActiveNavTab('showcase')}
            className="w-full sm:w-auto px-5 sm:px-6 py-3 min-h-[44px] border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold cursor-pointer transition-all"
          >
            Voltar para a Vitrine de Cursos
          </button>
        </div>
      </div>
    </div>
  );
};
