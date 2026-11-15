import React from 'react';
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
  CreditCard
} from 'lucide-react';

interface HeaderProps {
  activeModule: string;
  onSelectModule: (module: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeModule,
  onSelectModule
}) => {
  const { currentUser, logout } = usePlant();
  const allowed: ModuleId[] = currentUser?.allowedModules || ['dashboard'];

  const navItems: { id: ModuleId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Panel General', icon: LayoutDashboard },
    { id: 'totem', label: 'Tótem de Planta', icon: Monitor },
    { id: 'triaje', label: 'Triaje GTC 45', icon: Tablet },
    { id: 'alturas', label: 'Control de Alturas', icon: HardHat },
    { id: 'inspecciones', label: 'Inspecciones', icon: ClipboardCheck },
    { id: 'presupuesto', label: 'Presupuesto', icon: Banknote }
  ];

  const visibleNavItems = navItems.filter(item => allowed.includes(item.id)).slice(0, 5);

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

          {/* Zone 3: User Badge, Primary Action & Logout */}
          <div className="flex items-center gap-2.5 shrink-0">
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
