import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  CheckCheck,
  Calendar,
  Award,
  CreditCard,
  AlertCircle,
  X,
} from 'lucide-react';

interface NotificationPopoverProps {
  onClose: () => void;
}

export const NotificationPopover: React.FC<NotificationPopoverProps> = ({ onClose }) => {
  const { notifications, markNotificationAsRead, setActiveNavTab } = useApp();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'grade':
        return <Award className="w-4 h-4 text-emerald-600" />;
      case 'schedule':
        return <Calendar className="w-4 h-4 text-amber-600" />;
      case 'payment':
        return <CreditCard className="w-4 h-4 text-blue-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-indigo-600" />;
    }
  };

  const handleRequestPushPermission = async () => {
    if ('Notification' in window) {
      const perm = await Notification.requestPermission();
      if (perm === 'granted') {
        new Notification('EduVanguard', {
          body: 'Notificações push em tempo real ativadas com sucesso!',
        });
      }
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
      <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-indigo-600" />
          <span className="font-bold text-slate-800 text-sm">Notificações Push</span>
          <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full font-bold">
            {notifications.length}
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 p-1 rounded-md cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 p-1">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-slate-400 text-xs">
            Nenhuma notificação no momento.
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => {
                markNotificationAsRead(notif.id);
                if (notif.category === 'schedule') setActiveNavTab('student');
                if (notif.category === 'grade') setActiveNavTab('student');
              }}
              className={`p-3 rounded-xl transition-all cursor-pointer flex gap-3 ${
                notif.read ? 'bg-white hover:bg-slate-50 opacity-75' : 'bg-indigo-50/50 hover:bg-indigo-50 border-l-4 border-indigo-500'
              }`}
            >
              <div className="mt-0.5 p-2 rounded-lg bg-white border border-slate-100 shadow-2xs shrink-0 h-fit">
                {getCategoryIcon(notif.category)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    {notif.title}
                  </h4>
                  <span className="text-[10px] text-slate-400 shrink-0">
                    {notif.timestamp}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">
                  {notif.message}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
        <button
          onClick={handleRequestPushPermission}
          className="text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
        >
          🔔 Ativar Push no Navegador
        </button>
        <button
          onClick={() => notifications.forEach((n) => markNotificationAsRead(n.id))}
          className="text-slate-500 hover:text-slate-700 flex items-center gap-1 cursor-pointer"
        >
          <CheckCheck className="w-3.5 h-3.5" />
          Marcar lidas
        </button>
      </div>
    </div>
  );
};
