
import React from 'react';
import { MOCK_NOTIFICATIONS } from '../constants';
import { GraduationCap, AlertCircle, BrainCircuit, Info, Check, X } from 'lucide-react';

export const NotificationCenter: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'GRADE': return <GraduationCap className="w-4 h-4 text-indigo-600" />;
      case 'OCCURRENCE': return <AlertCircle className="w-4 h-4 text-orange-600" />;
      case 'TUTORING': return <BrainCircuit className="w-4 h-4 text-emerald-600" />;
      default: return <Info className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <h3 className="font-bold text-slate-800">Notificações</h3>
        <div className="flex items-center gap-2">
          <button className="text-[10px] font-bold text-indigo-600 hover:underline uppercase tracking-wider">
            Marcar todas como lidas
          </button>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-md transition-colors text-slate-400">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="max-h-[400px] overflow-y-auto divide-y divide-slate-100">
        {MOCK_NOTIFICATIONS.length > 0 ? (
          MOCK_NOTIFICATIONS.map((notif) => (
            <div 
              key={notif.id} 
              className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer relative group ${!notif.read ? 'bg-indigo-50/30' : ''}`}
            >
              {!notif.read && (
                <div className="absolute top-4 left-0 w-1 h-10 bg-indigo-600 rounded-r-full"></div>
              )}
              <div className="flex gap-3">
                <div className={`mt-1 p-2 rounded-lg shrink-0 ${!notif.read ? 'bg-white' : 'bg-slate-100'}`}>
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 leading-tight mb-1">{notif.title}</p>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-2">{notif.message}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-medium text-slate-400 uppercase">{notif.date}</span>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity text-indigo-600">
                      <Check className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center">
            <p className="text-sm text-slate-400 italic">Nenhuma notificação por aqui.</p>
          </div>
        )}
      </div>
      
      <div className="p-3 border-t border-slate-100 text-center">
        <button className="text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors">
          VER TODAS AS NOTIFICAÇÕES
        </button>
      </div>
    </div>
  );
};
