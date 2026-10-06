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
  } = useApp();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot_password'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAuthError();
    setIsSubmitting(true);

    // Artificial short delay for realistic security feedback
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
    }, 300);
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
    }, 400);
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

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-lg max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 border border-slate-200 my-auto">
        {/* Header */}
        <div className="bg-linear-to-r from-slate-950 via-indigo-950 to-slate-900 text-white p-4 sm:p-6 flex items-center justify-between border-b border-indigo-900/50 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 flex items-center justify-center shadow-inner shrink-0">
              <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-black tracking-widest text-emerald-400">
                  Modo Produção • Acesso Seguro
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <h3 className="text-base sm:text-lg font-black leading-tight text-white">
                Grupo Eloizio — Portal Oficial
              </h3>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer transition shrink-0"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-6 flex gap-2 pt-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              clearAuthError();
            }}
            className={`py-2.5 px-4 text-xs font-bold border-b-2 cursor-pointer transition-all ${
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
            className={`py-2.5 px-4 text-xs font-bold border-b-2 cursor-pointer transition-all ${
              mode === 'register'
                ? 'border-indigo-600 text-indigo-700 bg-white rounded-t-xl shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            + Criar Nova Conta
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {/* Lockout Warning Alert */}
          {(isLockedOut || lockoutRemainingSeconds > 0) && (
            <div className="mb-4 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs flex items-start gap-3 animate-in fade-in">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-black text-rose-900">
                  Proteção Contra Força Bruta Ativada
                </strong>
                <p className="mt-0.5 leading-relaxed">
                  Por segurança, o acesso foi temporariamente suspenso após 5 tentativas incorretas.
                </p>
                <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-200/60 font-mono font-black text-[11px] text-rose-900">
                  <span>Aguarde: {lockoutRemainingSeconds}s para tentar novamente</span>
                </div>
              </div>
            </div>
          )}

          {/* 1. LOGIN TAB */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {authError && !isLockedOut && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  E-mail de Acesso
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    disabled={isLockedOut || isSubmitting}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu.email@exemplo.com"
                    className="w-full pl-10 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden disabled:bg-slate-100 disabled:cursor-not-allowed transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Senha
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
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    disabled={isLockedOut || isSubmitting}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite sua senha de acesso"
                    className="w-full pl-10 pr-10 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden disabled:bg-slate-100 disabled:cursor-not-allowed transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 text-slate-400 hover:text-slate-600 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Lembrar meu acesso neste dispositivo</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLockedOut || isSubmitting}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white rounded-xl text-xs font-black shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
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
            </form>
          )}

          {/* 2. REGISTER TAB */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
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
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Seu nome completo"
                    className="w-full pl-10 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    E-mail *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="seu.email@exemplo.com"
                      className="w-full pl-10 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    WhatsApp / Celular
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="(21) 99999-9999"
                      className="w-full pl-10 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
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
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Perfil de Cadastro no Grupo Eloizio
                </label>
                <div className="grid grid-cols-3 gap-2">
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
                        className={`p-2.5 rounded-xl text-xs font-bold border cursor-pointer transition-all flex flex-col items-center gap-1 ${
                          regRole === r.id
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-2 ring-indigo-500/20 shadow-2xs'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-[11px]">{r.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                {isSubmitting ? 'Registrando Conta...' : 'Finalizar Cadastro & Acessar'}
              </button>
            </form>
          )}

          {/* 3. FORGOT PASSWORD TAB */}
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
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="seu.email@exemplo.com"
                        className="w-full pl-10 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
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
          <div className="pt-4 mt-6 border-t border-slate-100 flex flex-wrap items-center justify-center gap-3 text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Criptografia SHA-256</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-indigo-500" />
              <span>Proteção Anti-Brute Force</span>
            </div>
            <span>•</span>
            <span>Conforme LGPD</span>
          </div>
        </div>
      </div>
    </div>
  );
};
