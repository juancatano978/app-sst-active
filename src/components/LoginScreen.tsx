import React, { useState } from 'react';
import { usePlant } from '../context/PlantContext';
import { ModuleId, PlantUserProfile } from '../types/plantOps';
import { SYSTEM_BASE_DATE_STR } from '../utils/dateUtils';
import { BrandLogo } from './BrandLogo';
import {
  Radio,
  CreditCard,
  ArrowRight,
  AlertCircle,
  Lock,
  HardHat,
  Tablet,
  Building2,
  Wrench,
  CheckCircle2,
  Calendar
} from 'lucide-react';

const MODULE_LABELS: Record<ModuleId, string> = {
  dashboard: 'Panel General',
  totem: 'Tótem y Buzón Anónimo',
  triaje: 'Triaje GTC 45',
  alturas: 'Alturas y EPP',
  inspecciones: 'Inspecciones',
  legal: 'Legal y FURAT',
  boletines: 'Boletines RFID',
  presupuesto: 'Presupuesto / SMMLV'
};

export const LoginScreen: React.FC = () => {
  const { availableUsers, loginWithCarnet } = usePlant();
  const [carnetInput, setCarnetInput] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [scanningId, setScanningId] = useState<string | null>(null);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const res = loginWithCarnet(carnetInput);
    if (!res.success) {
      setErrorMsg(res.error || 'Carné no reconocido');
    }
  };

  const handleQuickBadgeTap = (user: PlantUserProfile) => {
    setErrorMsg(null);
    setCarnetInput(user.carnet);
    setScanningId(user.id);
    setTimeout(() => {
      loginWithCarnet(user.carnet);
      setScanningId(null);
    }, 280);
  };

  const getRoleTheme = (role: PlantUserProfile['role']) => {
    switch (role) {
      case 'OPERARIO':
        return {
          icon: Wrench,
          badgeClass: 'bg-[#FF8A00] text-[#0A2342] border-[#FF8A00]',
          iconBg: 'bg-[#1F6FB5]/20 text-[#5FA8E8] border-[#1F6FB5]/50',
          hoverBorder: 'hover:border-[#FF8A00]'
        };
      case 'SUPERVISOR_HSEQ':
        return {
          icon: Tablet,
          badgeClass: 'bg-[#1F6FB5] text-white border-[#5FA8E8]/50',
          iconBg: 'bg-[#FF8A00]/15 text-[#FF8A00] border-[#FF8A00]/40',
          hoverBorder: 'hover:border-[#5FA8E8]'
        };
      case 'ALMACENISTA':
        return {
          icon: HardHat,
          badgeClass: 'bg-[#2ECC71] text-[#0A2342] border-[#2ECC71]',
          iconBg: 'bg-[#2ECC71]/15 text-[#2ECC71] border-[#2ECC71]/40',
          hoverBorder: 'hover:border-[#2ECC71]'
        };
      case 'GERENCIA':
        return {
          icon: Building2,
          badgeClass: 'bg-[#14508F] text-white border-[#5FA8E8]/40',
          iconBg: 'bg-[#14508F]/30 text-[#C9D1D9] border-[#5FA8E8]/40',
          hoverBorder: 'hover:border-[#5FA8E8]'
        };
    }
  };

  return (
    <div className="min-h-screen bg-[#061529] text-white flex flex-col justify-between font-sans selection:bg-[#FF8A00]/30">
      {/* Top Industrial Security Header */}
      <header className="border-b border-[#14508F]/50 bg-[#0A2342] backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BrandLogo size="md" />
            <span className="hidden md:inline-block text-[11px] font-mono uppercase px-2.5 py-1 rounded-lg bg-[#14508F]/40 text-[#C9D1D9] border border-[#1F6FB5]/40">
              Control de Acceso Industrial
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-[#C9D1D9]">
            <span className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#061529] border border-[#14508F]/60">
              <Calendar className="w-3.5 h-3.5 text-[#5FA8E8]" />
              <span>Fecha Sistema: {SYSTEM_BASE_DATE_STR}</span>
            </span>
            <span className="flex items-center gap-1.5 text-[#2ECC71] font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#2ECC71] animate-pulse" />
              <span>Lector RFID Activo</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Login Gate */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Column: Badge Input & RFID Reader Terminal */}
          <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-[#0A2342] border border-[#14508F]/70 shadow-2xl space-y-6">
            <div className="space-y-5">
              <div className="space-y-2.5">
                <div className="w-12 h-1.5 rounded-full bg-[#FF8A00]" />
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#14508F]/40 border border-[#1F6FB5]/50 text-[#5FA8E8] text-[11px] font-mono font-bold uppercase tracking-wider">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Ingreso por Carné Corporativo</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
                  Autenticación de Planta
                </h1>
                <p className="text-sm text-[#C9D1D9] leading-relaxed">
                  Ingrese el número de su carné o aproxímelo al lector RFID. El sistema habilitará los módulos autorizados para su perfil.
                </p>
              </div>

              {/* RFID Reader Visual Zone */}
              <div className="p-4 rounded-2xl bg-[#061529] border border-[#1F6FB5]/40 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#1F6FB5]/20 border border-[#5FA8E8]/40 flex items-center justify-center text-[#5FA8E8] shrink-0">
                  <Radio className="w-6 h-6 animate-pulse" />
                </div>
                <div className="space-y-0.5">
                  <div className="text-xs font-display font-bold text-white">Sensor MIFARE ISO-14443 Activo</div>
                  <div className="text-[11px] text-[#C9D1D9] font-mono">
                    Esperando lectura de carné o digitación manual
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleManualSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="carnet-input" className="text-xs font-bold text-[#C9D1D9] flex items-center justify-between">
                    <span>Número de Carné o Cédula</span>
                    <span className="text-[10px] font-mono text-[#5FA8E8]">883921 · 401120 · 502310 · 100001</span>
                  </label>
                  <div className="relative">
                    <CreditCard className="w-4 h-4 text-[#5FA8E8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="carnet-input"
                      type="text"
                      value={carnetInput}
                      onChange={(e) => {
                        setCarnetInput(e.target.value);
                        if (errorMsg) setErrorMsg(null);
                      }}
                      placeholder="Digite su código de carné (ej. 883921)"
                      autoFocus
                      className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-[#061529] border border-[#1F6FB5]/60 text-sm font-mono text-white placeholder:text-[#C9D1D9]/40 focus:outline-none focus:border-[#FF8A00] focus:ring-1 focus:ring-[#FF8A00]/40 transition-all"
                    />
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-3 rounded-xl bg-[#E63946]/15 border border-[#E63946]/60 text-xs text-white flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-[#E63946] shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Naranja Seguridad (#FF8A00) + Marino (#0A2342) per WCAG 2.1 Manual de Marca p. 09 */}
                <button
                  type="submit"
                  className="w-full py-4 px-5 rounded-xl bg-[#FF8A00] hover:bg-[#ff9c24] text-[#0A2342] font-display font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer uppercase tracking-wide"
                >
                  <span>Validar Carné e Ingresar</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            </div>

            {/* Ley 1581 Notice */}
            <div className="pt-4 border-t border-[#14508F]/50 text-[11px] text-[#C9D1D9] leading-relaxed flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#2ECC71] shrink-0 mt-0.5" />
              <span>
                Cumplimiento Ley 1581 de 2012: el acceso utiliza únicamente su identificador de carné corporativo sin captura ni almacenamiento de datos biométricos.
              </span>
            </div>
          </div>

          {/* Right Column: Corporate Badge Directory / Quick Tap Profiles */}
          <div className="lg:col-span-7 p-6 sm:p-7 rounded-3xl bg-[#0A2342]/85 border border-[#14508F]/60 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#14508F]/50 pb-4">
              <div>
                <h2 className="text-base sm:text-lg font-display font-bold text-white">
                  Perfiles Habilitados en Turno (Lectura Rápida de Carné)
                </h2>
                <p className="text-xs text-[#C9D1D9] mt-0.5">
                  Seleccione un carné corporativo para simular el ingreso y visualizar las funcionalidades asignadas a ese rol
                </p>
              </div>
              <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg bg-[#061529] border border-[#1F6FB5]/50 text-[#5FA8E8]">
                4 Perfiles Activos
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {availableUsers.map((user) => {
                const theme = getRoleTheme(user.role);
                const RoleIcon = theme.icon;
                const isScanning = scanningId === user.id;

                return (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => handleQuickBadgeTap(user)}
                    className={`text-left p-4 rounded-2xl bg-[#061529] border-2 transition-all flex flex-col justify-between space-y-3 cursor-pointer group ${
                      isScanning
                        ? 'border-[#FF8A00] ring-2 ring-[#FF8A00]/30 scale-[0.99]'
                        : `border-[#14508F]/50 ${theme.hoverBorder} hover:bg-[#0A2342]`
                    }`}
                  >
                    <div className="space-y-3 w-full">
                      {/* Top row: Role icon + Carné number */}
                      <div className="flex items-center justify-between gap-2">
                        <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${theme.iconBg}`}>
                          <RoleIcon className="w-4 h-4" />
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] font-mono text-[#C9D1D9]/70 uppercase">Carné RFID</div>
                          <div className="text-xs font-mono font-black text-white bg-[#0A2342] px-2.5 py-0.5 rounded border border-[#1F6FB5]/50">
                            #{user.carnet}
                          </div>
                        </div>
                      </div>

                      {/* Name & Cargo */}
                      <div>
                        <span className={`inline-block text-[10px] font-mono font-bold px-2 py-0.5 rounded border mb-1.5 ${theme.badgeClass}`}>
                          {user.roleLabel}
                        </span>
                        <div className="text-sm font-display font-bold text-white group-hover:text-[#FF8A00] transition-colors">
                          {user.name}
                        </div>
                        <div className="text-xs text-[#C9D1D9]">
                          {user.cargo}
                        </div>
                        <div className="text-[10px] font-mono text-[#C9D1D9]/70 mt-0.5">
                          C.C. {user.cedula} · {user.area}
                        </div>
                      </div>

                      {/* Allowed Modules */}
                      <div className="pt-2 border-t border-[#14508F]/40 space-y-1.5">
                        <div className="text-[10px] font-semibold text-[#5FA8E8] uppercase tracking-wider">
                          Módulos Habilitados ({user.allowedModules.length}):
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {user.allowedModules.map((modId) => (
                            <span
                              key={modId}
                              className="text-[10px] px-1.5 py-0.5 rounded bg-[#0A2342] text-[#C9D1D9] border border-[#14508F]/60"
                            >
                              {MODULE_LABELS[modId]}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="w-full pt-2 flex items-center justify-between text-xs font-bold text-[#FF8A00]">
                      <span>{isScanning ? 'Leyendo carné...' : 'Aproximar e ingresar'}</span>
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#14508F]/40 bg-[#0A2342] py-4 text-xs text-[#C9D1D9]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-medium">SST-ACTIVE — Prevención Digital e Inteligencia Laboral Industrial</span>
          <span className="text-[#5FA8E8] font-mono text-[11px]">
            Decreto 1072/2015 · Res. 4272/2021 · GTC 45 · Ley 1581/2012
          </span>
        </div>
      </footer>
    </div>
  );
};
