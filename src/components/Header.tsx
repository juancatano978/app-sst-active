import React, { useState } from 'react';
import { usePlant } from '../context/PlantContext';
import { ModuleId } from '../types/plantOps';
import { BrandLogo } from './BrandLogo';
import {
  LayoutDashboard,
  Monitor,
  Tablet,
  HardHat,
  ClipboardCheck,
  Banknote,
  LogOut,
  CreditCard,
  Bell,
  CheckCheck,
  ArrowRight,
  EyeOff
} from 'lucide-react';

interface HeaderProps {
  activeModule: string;
  onSelectModule: (module: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeModule,
  onSelectModule
}) => {
  const {
    currentUser,
    logout,
    supervisorNotifications,
    markNotificationRead,
    markAllNotificationsRead,
    setSelectedIncidentId
  } = usePlant();
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);

  const allowed: ModuleId[] = currentUser?.allowedModules || ['dashboard'];
  const isSupervisor = currentUser?.role === 'SUPERVISOR_HSEQ';
  const unreadCount = supervisorNotifications.filter(n => !n.read).length;

  const navItems: { id: ModuleId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Panel General', icon: LayoutDashboard },
    { id: 'totem', label: 'Tótem de Planta', icon: Monitor },
    { id: 'triaje', label: 'Triaje GTC 45', icon: Tablet },
    { id: 'alturas', label: 'Control de Alturas', icon: HardHat },
    { id: 'inspecciones', label: 'Inspecciones', icon: ClipboardCheck },
    { id: 'presupuesto', label: 'Presupuesto', icon: Banknote }
  ];

  const visibleNavItems = navItems.filter(item => allowed.includes(item.id)).slice(0, 5);

  const handleOpenIncidentFromBell = (incidentId: string, notifId: string) => {
    markNotificationRead(notifId);
    setSelectedIncidentId(incidentId);
    setNotifMenuOpen(false);
    onSelectModule('triaje');
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0A2342]/95 backdrop-blur-md border-b border-[#14508F]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-20">
          {/* Zone 1: Official Brand Logo */}
          <div
            onClick={() => onSelectModule('dashboard')}
            className="flex items-center gap-3 shrink-0 cursor-pointer"
          >
            <BrandLogo size="sm" />
            <span className="hidden xl:inline-block text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#14508F]/50 text-[#C9D1D9] border border-[#1F6FB5]/40">
              {currentUser?.roleLabel || 'Planta Industrial'}
            </span>
          </div>

          {/* Zone 2: Role-Filtered Navigation Links */}
          <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-[#C9D1D9]">
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeModule === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectModule(item.id)}
                  className={`transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer py-1 border-b-2 ${
                    isActive
                      ? 'text-white font-bold border-[#FF8A00]'
                      : 'border-transparent hover:text-white hover:border-[#1F6FB5]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#FF8A00]' : 'text-[#5FA8E8]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Supervisor Notifications Bell, User Badge, Primary Action & Logout */}
          <div className="flex items-center gap-2.5 shrink-0">
            {isSupervisor && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setNotifMenuOpen(prev => !prev)}
                  className={`relative p-2.5 rounded-xl border transition-colors cursor-pointer ${
                    unreadCount > 0
                      ? 'bg-[#FF8A00]/15 border-[#FF8A00] text-[#FF8A00]'
                      : 'bg-[#061529] border-[#14508F]/70 text-[#C9D1D9] hover:text-white'
                  }`}
                  title="Notificaciones de reportes del Tótem"
                >
                  <Bell className={`w-4 h-4 ${unreadCount > 0 ? 'animate-pulse' : ''}`} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#E63946] text-white text-[10px] font-mono font-bold flex items-center justify-center shadow">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {notifMenuOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#0A2342] border border-[#1F6FB5] shadow-2xl z-50 overflow-hidden">
                    <div className="px-4 py-3 bg-[#061529] border-b border-[#14508F]/70 flex items-center justify-between">
                      <span className="text-xs font-display font-bold text-white">
                        Alertas del Tótem ({unreadCount} sin leer)
                      </span>
                      {unreadCount > 0 && (
                        <button
                          type="button"
                          onClick={markAllNotificationsRead}
                          className="text-[11px] text-[#5FA8E8] hover:text-white flex items-center gap-1 cursor-pointer"
                        >
                          <CheckCheck className="w-3.5 h-3.5" />
                          <span>Marcar leídas</span>
                        </button>
                      )}
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-[#14508F]/40">
                      {supervisorNotifications.length === 0 ? (
                        <div className="p-4 text-xs text-[#C9D1D9] text-center">
                          No hay reportes nuevos desde el Tótem en este turno.
                        </div>
                      ) : (
                        supervisorNotifications.map((notif) => (
                          <div
                            key={notif.id}
                            className={`p-3.5 space-y-1.5 text-xs ${
                              notif.read ? 'bg-[#0A2342] opacity-75' : 'bg-[#14508F]/25'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-mono font-bold text-[#FF8A00]">
                                {notif.incidentId}
                              </span>
                              <span className="text-[10px] font-mono text-[#C9D1D9]">
                                {notif.reportedAt}
                              </span>
                            </div>
                            <div className="font-semibold text-white leading-snug">
                              {notif.title}
                            </div>
                            <div className="text-[11px] text-[#C9D1D9] flex flex-wrap items-center gap-1.5">
                              <span>{notif.quadrantName}</span>
                              <span>·</span>
                              <span className="text-[#5FA8E8]">{notif.category}</span>
                              {notif.isAnonymous && (
                                <span className="inline-flex items-center gap-1 text-[#5FA8E8] font-mono">
                                  · <EyeOff className="w-3 h-3" /> Anónimo
                                </span>
                              )}
                            </div>
                            <div className="pt-1 flex items-center justify-between">
                              <span className="text-[10px] text-[#C9D1D9]/80 truncate max-w-[175px]">
                                {notif.reportedBy}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleOpenIncidentFromBell(notif.incidentId, notif.id)}
                                className="px-2.5 py-1 rounded-lg bg-[#FF8A00] hover:bg-[#ff9c24] text-[#0A2342] font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                              >
                                <span>Ir a Triaje</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {currentUser && (
              <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#061529] border border-[#14508F]/70 text-xs">
                <CreditCard className="w-4 h-4 text-[#5FA8E8] shrink-0" />
                <div className="leading-tight">
                  <div className="font-bold text-white truncate max-w-[155px]">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] font-mono text-[#C9D1D9]">
                    Carné #{currentUser.carnet} · {currentUser.roleLabel}
                  </div>
                </div>
              </div>
            )}

            {allowed.includes('totem') && (
              <button
                type="button"
                onClick={() => onSelectModule('totem')}
                className="hidden md:flex px-4 py-2 text-xs font-display font-extrabold text-[#0A2342] bg-[#FF8A00] hover:bg-[#ff9c24] rounded-lg shadow-md transition-all items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer uppercase tracking-wide"
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Abrir Tótem</span>
              </button>
            )}

            <button
              type="button"
              onClick={logout}
              title="Cerrar sesión y cambiar carné"
              className="px-3 py-2 text-xs font-semibold text-[#C9D1D9] hover:text-white bg-[#061529] hover:bg-[#14508F]/40 border border-[#14508F]/70 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 text-[#FF8A00]" />
              <span>Cambiar Carné</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

