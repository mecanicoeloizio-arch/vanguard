import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  Lock,
  X,
  Mail,
  KeyRound,
  User,
  ShieldCheck,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle2,
  Phone,
  HelpCircle,
  FileText,
  Building2,
  GraduationCap,
  Wrench,
  ArrowRight,
  Copy,
  Check,
  Sparkles,
  Zap,
} from 'lucide-react';

interface AuthModalProps {
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onSuccess }) => {
  const {
    showAuthModal,
    setShowAuthModal,
    login,
    registerUser,
    authTargetTab,
    setActiveNavTab,
    authError,
    clearAuthError,
    isLockedOut,
    lockoutRemainingSeconds,
    masterPassword,
  } = useApp();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot_password' | 'profiles'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedMaster, setCopiedMaster] = useState(false);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regCpf, setRegCpf] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('student');
  const [regError, setRegError] = useState<string | null>(null);

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  if (!showAuthModal) return null;

  const handleCopyMaster = () => {
    navigator.clipboard.writeText(masterPassword || 'ELOIZIO@MASTER2026');
    setCopiedMaster(true);
    setTimeout(() => setCopiedMaster(false), 2000);
  };

  const handleFillCredentials = (userEmail: string, userPass?: string, autoSubmit = false) => {
    clearAuthError();
    setEmail(userEmail);
    const passToUse = userPass || masterPassword || 'ELOIZIO@MASTER2026';
    setPassword(passToUse);
    setMode('login');

    if (autoSubmit) {
      setIsSubmitting(true);
      setTimeout(() => {
        const success = login(userEmail, passToUse);
        setIsSubmitting(false);
        if (success) {
          setShowAuthModal(false);
          setEmail('');
          setPassword('');
          if (authTargetTab) {
            setActiveNavTab(authTargetTab);
          }
          if (onSuccess) onSuccess();
        }
      }, 250);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAuthError();
    setIsSubmitting(true);

    setTimeout(() => {
      const success = login(email, password);
      setIsSubmitting(false);
      if (success) {
        setShowAuthModal(false);
        setEmail('');
        setPassword('');
        if (authTargetTab) {
          setActiveNavTab(authTargetTab);
        }
        if (onSuccess) onSuccess();
      }
    }, 250);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setRegError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (regPassword.length < 6) {
      setRegError('A senha deve conter no mínimo 6 caracteres.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError('As senhas digitadas não coincidem.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      registerUser({
        name: regName.trim(),
        email: regEmail.trim().toLowerCase(),
        role: regRole,
        password: regPassword,
        phone: regPhone.trim(),
        cpf: regCpf.trim(),
        avatar:
          regRole === 'student'
            ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
            : regRole === 'teacher'
            ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250'
            : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
        registrationNumber: `${regRole.slice(0, 3).toUpperCase()}-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'active',
      });

      setIsSubmitting(false);
      setShowAuthModal(false);
      if (authTargetTab) {
        setActiveNavTab(authTargetTab);
      } else {
        setActiveNavTab(regRole);
      }
      if (onSuccess) onSuccess();
    }, 350);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setForgotSubmitted(true);
  };

  const handleClose = () => {
    clearAuthError();
    setRegError(null);
    setShowAuthModal(false);
  };

  // Preset official profiles for quick and effortless testing / login
  const officialProfiles = [
    {
      id: 'ceo',
      name: 'Eloizio Silva (CEO Master)',
      role: 'admin',
      roleLabel: 'Diretoria Geral & Mecânica',
      email: 'mecanicoeloizio@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    },
    {
      id: 'sofia',
      name: 'Sofia Vanguard (Expert em Cursos)',
      role: 'admin',
      roleLabel: 'Expert Vanguard & Gestão',
      email: 'sofia@grupoeloizio.com.br',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
      badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300',
    },
    {
      id: 'teacher',
      name: 'Profa. Dra. Mariana Fernandes',
      role: 'teacher',
      roleLabel: 'Coordenação Docente',
      email: 'mariana.fernandes@grupoeloizio.com.br',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
      badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
    },
    {
      id: 'student',
      name: 'Lucas Silva Prado (Aluno)',
      role: 'student',
      roleLabel: 'Estudante Ativo',
      email: 'aluno@grupoeloizio.com.br',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-2.5 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-lg max-h-[92dvh] sm:max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 border border-slate-200 my-auto">
        {/* Header */}
        <div className="bg-linear-to-r from-slate-950 via-indigo-950 to-slate-900 text-white p-3.5 sm:p-5 flex items-center justify-between border-b border-indigo-900/50 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 flex items-center justify-center shadow-inner shrink-0">
              <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-300" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] uppercase font-black tracking-widest text-emerald-400 leading-tight">
                  Acesso Seguro • Grupo Eloizio
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse hidden xs:inline-block"></span>
              </div>
              <h3 className="text-sm sm:text-lg font-black leading-tight text-white truncate">
                Portal de Autenticação Oficial
              </h3>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 sm:p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer transition shrink-0 ml-2"
            title="Fechar Modal"
            aria-label="Fechar Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Master Password Announcement Bar (Directly answering user request #3) */}
        <div className="bg-linear-to-r from-amber-50 via-amber-100/60 to-indigo-50 border-b border-amber-200/80 px-3.5 sm:px-5 py-2.5 shrink-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-800 flex items-center justify-center shrink-0">
              <KeyRound className="w-3.5 h-3.5 text-amber-700" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-black uppercase text-amber-900 tracking-wider">
                Senha Master Definida:
              </div>
              <div className="flex items-center gap-2 font-mono font-black text-xs sm:text-sm text-indigo-950">
                <span className="select-all bg-white/80 px-1.5 py-0.5 rounded border border-amber-200">
                  {masterPassword || 'ELOIZIO@MASTER2026'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleCopyMaster}
              className="px-2 py-1 bg-white hover:bg-slate-50 border border-amber-300 text-amber-900 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer transition shadow-2xs"
              title="Copiar Senha Master"
            >
              {copiedMaster ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              <span>{copiedMaster ? 'Copiada!' : 'Copiar'}</span>
            </button>
            <button
              type="button"
              onClick={() => handleFillCredentials('mecanicoeloizio@gmail.com', masterPassword || 'ELOIZIO@MASTER2026', false)}
              className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[11px] font-black flex items-center gap-1 cursor-pointer transition shadow-2xs whitespace-nowrap"
            >
              <Zap className="w-3 h-3 text-amber-300" />
              <span>Preencher Master</span>
            </button>
          </div>
        </div>

        {/* Tab Selection (Fully Responsive, Horizontal Scroll on tiny screens) */}
        <div className="bg-slate-50 border-b border-slate-200 px-3 sm:px-6 flex gap-1 sm:gap-2 pt-2.5 shrink-0 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              clearAuthError();
            }}
            className={`py-2 px-3 sm:px-4 text-xs font-bold border-b-2 cursor-pointer transition-all whitespace-nowrap ${
              mode === 'login'
                ? 'border-indigo-600 text-indigo-700 bg-white rounded-t-xl shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Entrar na Conta
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              clearAuthError();
            }}
            className={`py-2 px-3 sm:px-4 text-xs font-bold border-b-2 cursor-pointer transition-all whitespace-nowrap ${
              mode === 'register'
                ? 'border-indigo-600 text-indigo-700 bg-white rounded-t-xl shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            + Criar Conta
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('profiles');
              clearAuthError();
            }}
            className={`py-2 px-3 sm:px-4 text-xs font-bold border-b-2 cursor-pointer transition-all whitespace-nowrap ${
              mode === 'profiles'
                ? 'border-indigo-600 text-indigo-700 bg-white rounded-t-xl shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            🔑 Perfis de Teste
          </button>
        </div>

        {/* Content Body (Scrollable, Responsive) */}
        <div className="p-3.5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {/* Lockout Warning Alert */}
          {(isLockedOut || lockoutRemainingSeconds > 0) && (
            <div className="p-3.5 sm:p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs flex items-start gap-3 animate-in fade-in">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-black text-rose-900">
                  Proteção Contra Força Bruta Ativada
                </strong>
                <p className="mt-0.5 leading-relaxed">
                  Acesso temporariamente suspenso por tentativas incorretas.
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-rose-200/60 font-mono font-black text-[11px] text-rose-900">
                    Aguarde: {lockoutRemainingSeconds}s
                  </span>
                  <button
                    type="button"
                    onClick={() => handleFillCredentials('mecanicoeloizio@gmail.com', masterPassword || 'ELOIZIO@MASTER2026', true)}
                    className="px-2.5 py-1 rounded-full bg-indigo-600 text-white font-black text-[11px] hover:bg-indigo-700 transition"
                  >
                    Desbloquear com Senha Master Agora
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 1. LOGIN TAB */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-3.5 sm:space-y-4">
              {authError && !isLockedOut && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  E-mail de Acesso
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    disabled={isLockedOut || isSubmitting}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu.email@exemplo.com"
                    className="w-full pl-9 pr-3 py-2.5 text-sm sm:text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden disabled:bg-slate-100 disabled:cursor-not-allowed transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Senha de Acesso
                  </label>
                  <button
                    type="button"
                    onClick={() => setMode('forgot_password')}
                    className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
                  >
                    Esqueceu sua senha?
                  </button>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    disabled={isLockedOut || isSubmitting}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite sua senha ou a Senha Master"
                    className="w-full pl-9 pr-10 py-2.5 text-sm sm:text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden disabled:bg-slate-100 disabled:cursor-not-allowed transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-2 text-slate-400 hover:text-slate-600 absolute right-1.5 top-1/2 -translate-y-1/2 cursor-pointer"
                    title={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Dica: Qualquer conta institucional aceita a Senha Master <strong>{masterPassword || 'ELOIZIO@MASTER2026'}</strong>.
                </p>
              </div>

              <div className="flex items-center justify-between text-xs pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Lembrar meu acesso</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLockedOut || isSubmitting}
                className="w-full py-3 min-h-[44px] bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white rounded-xl text-xs sm:text-sm font-black shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                {isSubmitting ? (
                  <span>Verificando Credenciais...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Entrar no Sistema</span>
                  </>
                )}
              </button>

              {/* Quick Profile Shortcuts directly on login tab */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Acesso Rápido com 1 Clique:
                  </span>
                  <button
                    type="button"
                    onClick={() => setMode('profiles')}
                    className="text-[11px] text-indigo-600 font-bold hover:underline"
                  >
                    Ver todos os perfis
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleFillCredentials('mecanicoeloizio@gmail.com', masterPassword || 'ELOIZIO@MASTER2026', true)}
                    className="p-2 bg-amber-50/80 hover:bg-amber-100/90 border border-amber-200 text-amber-950 rounded-xl text-left transition cursor-pointer flex items-center gap-2"
                  >
                    <span className="text-sm">👑</span>
                    <div className="min-w-0">
                      <div className="text-xs font-black truncate leading-tight">Eloizio (CEO)</div>
                      <div className="text-[10px] text-amber-800/80 truncate">Diretoria Master</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleFillCredentials('sofia@grupoeloizio.com.br', masterPassword || 'ELOIZIO@MASTER2026', true)}
                    className="p-2 bg-indigo-50/80 hover:bg-indigo-100/90 border border-indigo-200 text-indigo-950 rounded-xl text-left transition cursor-pointer flex items-center gap-2"
                  >
                    <span className="text-sm">✨</span>
                    <div className="min-w-0">
                      <div className="text-xs font-black truncate leading-tight">Sofia Vanguard</div>
                      <div className="text-[10px] text-indigo-800/80 truncate">Expert em Cursos</div>
                    </div>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* 2. REGISTER TAB (Fully Responsive) */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              {regError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{regError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nome Completo *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Seu nome completo"
                    className="w-full pl-9 pr-3 py-2 text-sm sm:text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    E-mail *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="seu.email@exemplo.com"
                      className="w-full pl-9 pr-3 py-2 text-sm sm:text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    WhatsApp / Celular
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="(21) 99999-9999"
                      className="w-full pl-9 pr-3 py-2 text-sm sm:text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Senha *
                  </label>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full px-3 py-2 text-sm sm:text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Confirmar Senha *
                  </label>
                  <input
                    type="password"
                    required
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Repita sua senha"
                    className="w-full px-3 py-2 text-sm sm:text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Perfil de Cadastro no Grupo Eloizio
                </label>
                <div className="grid grid-cols-1 xs:grid-cols-3 gap-2">
                  {[
                    { id: 'student', label: 'Aluno / Cursos', icon: GraduationCap },
                    { id: 'admin', label: 'Cliente / Empresa', icon: Building2 },
                    { id: 'teacher', label: 'Docente / Instrutor', icon: User },
                  ].map((r) => {
                    const Icon = r.icon;
                    return (
                      <button
                        type="button"
                        key={r.id}
                        onClick={() => setRegRole(r.id as any)}
                        className={`p-2 sm:p-2.5 rounded-xl text-xs font-bold border cursor-pointer transition-all flex xs:flex-col items-center gap-1.5 ${
                          regRole === r.id
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-2 ring-indigo-500/20 shadow-2xs'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0 text-indigo-600" />
                        <span className="text-[11px] font-bold leading-tight">{r.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 min-h-[44px] bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-black shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                {isSubmitting ? 'Registrando Conta...' : 'Finalizar Cadastro & Acessar'}
              </button>
            </form>
          )}

          {/* 3. PROFILES TAB (Quick Test Accounts & Master Password) */}
          {mode === 'profiles' && (
            <div className="space-y-3.5">
              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-2xl text-xs text-indigo-950 space-y-1">
                <div className="flex items-center gap-1.5 font-black text-indigo-900 text-sm">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>Contas e Credenciais Oficiais Pré-Configuradas</span>
                </div>
                <p className="leading-relaxed text-indigo-900/80">
                  Clique em <strong>"Entrar Direto"</strong> para testar qualquer área do portal sem precisar digitar senhas, ou use a Senha Master para login universal.
                </p>
              </div>

              <div className="space-y-2.5">
                {officialProfiles.map((p) => (
                  <div
                    key={p.id}
                    className="p-3 rounded-2xl border border-slate-200 hover:border-indigo-300 bg-slate-50/80 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={p.avatar}
                        alt={p.name}
                        className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-xs sm:text-sm text-slate-900 leading-tight">
                            {p.name}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${p.badgeColor}`}>
                            {p.roleLabel}
                          </span>
                        </div>
                        <div className="text-[11px] font-mono text-slate-500 truncate">{p.email}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-200">
                      <button
                        type="button"
                        onClick={() => handleFillCredentials(p.email, masterPassword || 'ELOIZIO@MASTER2026', false)}
                        className="px-2.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 transition cursor-pointer"
                      >
                        Preencher
                      </button>
                      <button
                        type="button"
                        onClick={() => handleFillCredentials(p.email, masterPassword || 'ELOIZIO@MASTER2026', true)}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black transition cursor-pointer shadow-xs whitespace-nowrap flex items-center gap-1"
                      >
                        <span>Entrar Direto</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. FORGOT PASSWORD TAB */}
          {mode === 'forgot_password' && (
            <div className="space-y-4">
              {forgotSubmitted ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-black text-emerald-950">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Instruções de Recuperação Enviadas!</span>
                  </div>
                  <p className="leading-relaxed">
                    Se o e-mail <strong>{forgotEmail}</strong> constar em nosso sistema, um link seguro com código de redefinição temporário foi enviado.
                  </p>
                  <p className="leading-relaxed text-[11px] text-emerald-800">
                    Lembre-se que você também pode acessar qualquer conta institucional utilizando a Senha Master oficial: <strong>{masterPassword || 'ELOIZIO@MASTER2026'}</strong>.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setForgotSubmitted(false);
                    }}
                    className="mt-3 px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold text-xs hover:bg-emerald-700 transition"
                  >
                    Voltar ao Login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Informe seu e-mail cadastrado para receber as instruções de recuperação e redefinição segura de senha.
                  </p>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Seu E-mail Cadastrado
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="email"
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="seu.email@exemplo.com"
                        className="w-full pl-9 pr-3 py-2.5 text-sm sm:text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black transition cursor-pointer"
                    >
                      Enviar Link de Redefinição
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Footer Security Badges */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] text-slate-400">
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Criptografia SHA-256</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-indigo-500" />
              <span>Anti-Brute Force</span>
            </div>
            <span>•</span>
            <span>Senha Master Ativa</span>
            <span>•</span>
            <span>LGPD Brasil</span>
          </div>
        </div>
      </div>
    </div>
  );
};
