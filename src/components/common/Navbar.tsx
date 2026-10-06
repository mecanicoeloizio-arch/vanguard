import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap,
  BookOpen,
  UserCheck,
  Building2,
  MessageSquare,
  Bell,
  HelpCircle,
  Wifi,
  WifiOff,
  Menu,
  X,
  Sparkles,
  ChevronDown,
  Calendar,
  FileText,
  LogIn,
  LogOut,
  Lock,
  ShieldCheck,
} from 'lucide-react';
import { NotificationPopover } from './NotificationPopover';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    switchUserRole,
    activeNavTab,
    setActiveNavTab,
    isOffline,
    notifications,
    setShowHelpDesk,
    setShowAuthModal,
    setAuthTargetTab,
    logout,
  } = useApp();

  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const roleLabels: Record<string, { label: string; color: string }> = {
    student: { label: 'Aluno', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    teacher: { label: 'Professor', color: 'bg-indigo-100 text-indigo-800 border-indigo-300' },
    admin: { label: 'Direção Geral', color: 'bg-amber-100 text-amber-900 border-amber-300' },
  };

  const navItems = [
    { id: 'showcase', label: 'Vitrine de Cursos', icon: BookOpen },
    { id: 'student', label: 'Área do Aluno', icon: GraduationCap, restricted: true },
    { id: 'teacher', label: 'Área do Professor', icon: UserCheck, restricted: true },
    { id: 'admin', label: 'Direção & Gestão', icon: Building2, restricted: true },
    { id: 'validator', label: 'Validar Certificado', icon: ShieldCheck },
    { id: 'chat', label: 'Chat Interno', icon: MessageSquare },
    { id: 'calendar', label: 'Calendário & Biblioteca', icon: Calendar },
    { id: 'manuals', label: 'Manuais & Docs', icon: FileText },
  ];

  const handleNavClick = (tabId: string) => {
    if (['student', 'teacher', 'admin'].includes(tabId)) {
      if (!currentUser) {
        setAuthTargetTab(tabId);
        setShowAuthModal(true);
        return;
      }
    }
    setActiveNavTab(tabId);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs no-print">
      {/* Offline Alert Bar */}
      {isOffline && (
        <div className="bg-amber-500 text-white text-xs font-semibold px-4 py-1 text-center flex items-center justify-center gap-2">
          <WifiOff className="w-3.5 h-3.5" />
          <span>Você está no modo offline. Todas as alterações serão salvas localmente e sincronizadas quando restabelecer a conexão.</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveNavTab('showcase')}
              className="flex items-center gap-2.5 group text-left cursor-pointer focus:outline-hidden"
            >
              <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-indigo-700 via-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-1">
                  Edu<span className="text-indigo-600">Vanguard</span>
                </span>
                <span className="text-[10px] tracking-wider uppercase font-semibold text-slate-400 block -mt-1">
                  Gestão & Cursos Online
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNavTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.id === 'student' && currentUser?.role === 'student' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  )}
                  {item.restricted && !currentUser && (
                    <Lock className="w-3 h-3 text-slate-300 ml-0.5" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & Role Switcher */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Online / Offline status badge */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
              {isOffline ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span className="text-amber-700">Offline</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  <span className="text-emerald-700 font-medium">Online</span>
                </>
              )}
            </div>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Notificações Push"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifMenu && (
                <NotificationPopover onClose={() => setShowNotifMenu(false)} />
              )}
            </div>

            {/* Helpdesk Support Button (Hidden on tiny screens to avoid overflow, available in drawer) */}
            <button
              onClick={() => setShowHelpDesk(true)}
              className="hidden sm:flex p-2 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
              title="Central de Ajuda & Suporte"
            >
              <HelpCircle className="w-5 h-5" />
            </button>

            {/* Authentication Button or User Role Dropdown */}
            {!currentUser ? (
              <button
                onClick={() => {
                  setAuthTargetTab(null);
                  setShowAuthModal(true);
                }}
                className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 cursor-pointer transition-all whitespace-nowrap"
              >
                <LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span className="hidden sm:inline">Entrar / Login</span>
                <span className="sm:hidden">Entrar</span>
              </button>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                  className="flex items-center gap-1.5 sm:gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer text-left"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-indigo-400"
                  />
                  <div className="hidden sm:block">
                    <div className="text-xs font-bold text-slate-800 leading-tight">
                      {currentUser.name.split(' ')[0]}
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium leading-none">
                      {roleLabels[currentUser.role]?.label}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Role / User Account Dropdown */}
                {showRoleDropdown && (
                  <div className="absolute right-0 mt-2 w-72 max-w-[90vw] bg-white rounded-2xl shadow-2xl border border-slate-200 py-3 z-50 animate-in fade-in slide-in-from-top-2">
                    {/* User Card */}
                    <div className="px-4 pb-3 border-b border-slate-100 flex items-center gap-3">
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-11 h-11 rounded-full object-cover ring-2 ring-indigo-500 shadow-xs"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-extrabold text-sm text-slate-900 truncate">
                          {currentUser.name}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">
                          {currentUser.email}
                        </div>
                        <div className="mt-1">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase border ${roleLabels[currentUser.role]?.color || 'bg-slate-100 text-slate-700'}`}>
                            {roleLabels[currentUser.role]?.label || currentUser.role}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Access to My Portal */}
                    <div className="p-2 space-y-1">
                      <button
                        onClick={() => {
                          if (currentUser.role === 'admin') setActiveNavTab('admin');
                          else if (currentUser.role === 'teacher') setActiveNavTab('teacher');
                          else setActiveNavTab('student');
                          setShowRoleDropdown(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors cursor-pointer text-left"
                      >
                        <Building2 className="w-4 h-4 text-indigo-600" />
                        <span>Acessar Meu Painel ({roleLabels[currentUser.role]?.label})</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveNavTab('validator');
                          setShowRoleDropdown(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer text-left"
                      >
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>Validar Certificados Digitais</span>
                      </button>

                      <button
                        onClick={() => {
                          setShowHelpDesk(true);
                          setShowRoleDropdown(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer text-left"
                      >
                        <HelpCircle className="w-4 h-4 text-slate-400" />
                        <span>Central de Suporte & Chamados</span>
                      </button>
                    </div>

                    {/* Logout Button */}
                    <div className="pt-2 border-t border-slate-100 px-2 mt-1">
                      <button
                        onClick={() => {
                          logout();
                          setShowRoleDropdown(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sair da Minha Conta (Logout)</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile / Tablet menu trigger (shown below xl) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
              aria-label="Abrir Menu de Navegação"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-indigo-600" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 bg-white/98 backdrop-blur-lg px-4 pt-3 pb-6 space-y-3 max-h-[calc(100vh-4rem)] overflow-y-auto shadow-2xl animate-in slide-in-from-top-3">
          {/* User Status Bar in Mobile Menu */}
          {currentUser ? (
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500 shrink-0"
                />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {currentUser.name}
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${roleLabels[currentUser.role]?.color || 'bg-slate-100 text-slate-700'}`}>
                    {roleLabels[currentUser.role]?.label || currentUser.role}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="px-2.5 py-1 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-200"
              >
                Sair
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setAuthTargetTab(null);
                setShowAuthModal(true);
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl bg-indigo-600 text-white font-bold text-sm shadow-md"
            >
              <LogIn className="w-4 h-4" />
              <span>Entrar / Cadastrar Conta</span>
            </button>
          )}

          {/* Navigation Items */}
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNavTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    handleNavClick(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-200'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.restricted && !currentUser && (
                    <Lock className="w-4 h-4 text-slate-400" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Mobile Support Link */}
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                setShowHelpDesk(true);
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 text-left"
            >
              <HelpCircle className="w-4 h-4 text-indigo-500" />
              <span>Central de Suporte & Chamados</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
