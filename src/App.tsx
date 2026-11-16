import React, { useState, useEffect } from 'react';
import { PlantProvider, usePlant } from './context/PlantContext';
import { Header } from './components/Header';
import { DeviceFrame } from './components/DeviceFrame';
import { DashboardOverview } from './components/DashboardOverview';
import { LoginScreen } from './components/LoginScreen';
import { ModuleId } from './types/plantOps';

// Refined Connected Operations Modules
import { TotemStation } from './components/operations/TotemStation';
import { TriajeGtc45 } from './components/operations/TriajeGtc45';
import { BuzonConfidencial } from './components/operations/BuzonConfidencial';
import { ControlAlturasEPP } from './components/operations/ControlAlturasEPP';
import { PresupuestoReparaciones } from './components/operations/PresupuestoReparaciones';
import { GoogleSheetsDatabase } from './components/operations/GoogleSheetsDatabase';

// Regulatory & Communication Modules
import { Hu004LegalNotification } from './components/mockups/Hu004LegalNotification';
import { Hu006PlannedInspection } from './components/mockups/Hu006PlannedInspection';
import { Hu007SafetyBulletins } from './components/mockups/Hu007SafetyBulletins';

import { 
  Monitor, 
  Tablet, 
  FileText, 
  HardHat, 
  ClipboardCheck, 
  Megaphone, 
  Banknote,
  Database,
  LayoutDashboard,
  ArrowLeft,
  BellRing,
  ArrowRight,
  CheckCheck,
  X,
  EyeOff
} from 'lucide-react';

function AppContent() {
  const {
    currentUser,
    supervisorNotifications,
    markNotificationRead,
    markAllNotificationsRead,
    setSelectedIncidentId
  } = usePlant();
  const [activeModule, setActiveModule] = useState<string>('dashboard');

  useEffect(() => {
    if (!currentUser) {
      setActiveModule('dashboard');
    } else if (!currentUser.allowedModules.includes(activeModule as ModuleId)) {
      setActiveModule('dashboard');
    }
  }, [currentUser, activeModule]);

  if (!currentUser) {
    return <LoginScreen />;
  }

  const allowed = currentUser.allowedModules;
  const isSupervisor = currentUser.role === 'SUPERVISOR_HSEQ';
  const unreadSupervisorNotifications = isSupervisor
    ? supervisorNotifications.filter(n => !n.read)
    : [];

  const moduleMeta: Record<string, {
    title: string;
    subtitle: string;
    channel: 'Tótem Fijo IK10/IP65' | 'Tablet ATEX IP68' | 'Consola Web / PC' | 'Consola Gerencial';
  }> = {
    totem: {
      title: 'Tótem Industrial de Planta — Terminal de Captura Express',
      subtitle: 'Captura táctil en menos de 5 segundos autenticada por carné RFID/NFC. Sin celulares personales en planta.',
      channel: 'Tótem Fijo IK10/IP65'
    },
    triaje: {
      title: 'Evaluación Técnica de Riesgos — Matriz GTC 45 en Sitio',
      subtitle: 'Inspección fotográfica en sitio con Tablet ATEX, cálculo de probabilidad/consecuencia y orden de suspensión de labores.',
      channel: 'Tablet ATEX IP68'
    },
    buzon: {
      title: 'Buzón Confidencial y Seguro de Casi-Accidentes',
      subtitle: 'Canal anónimo con supresión de identidad para capturar fallas preventivas bajo la pirámide de Frank Bird.',
      channel: 'Tótem Fijo IK10/IP65'
    },
    legal: {
      title: 'Gestión Legal Regulatoria — ARL, EPS y COPASST',
      subtitle: 'Control de plazos legales (2 días hábiles FURAT / 24h COPASST) bajo el Decreto 1072 de 2015.',
      channel: 'Consola Web / PC'
    },
    alturas: {
      title: 'Almacén Técnico y Trabajo en Alturas',
      subtitle: 'Validación en tiempo real de certificación bajo la Res. 4272/2021 y despacho serializado de equipos de Categoría III.',
      channel: 'Consola Web / PC'
    },
    inspecciones: {
      title: 'Inspecciones Planeadas y Recorridos Locativos',
      subtitle: 'Lista de verificación mensual por cuadrantes, tickets automáticos a mantenimiento y actas oficiales en PDF.',
      channel: 'Consola Web / PC'
    },
    boletines: {
      title: 'Boletines de Seguridad y Lecciones Aprendidas',
      subtitle: 'Difusión de alertas operativas con acuse de lectura digital por aproximación de carné RFID/NFC.',
      channel: 'Tótem Fijo IK10/IP65'
    },
    presupuesto: {
      title: 'Gestión Presupuestal y Compuerta Financiera de Reparaciones',
      subtitle: 'Límite de aprobación autónoma de 1 SMMLV ($1.423.500 COP) para SST y derivación a Gerencia General.',
      channel: 'Consola Gerencial'
    },
    database: {
      title: 'Base de Datos Relacional en Google Sheets',
      subtitle: 'Motor multi-tabla (PK/FK) con fórmulas nativas KPI, auditoría de integridad referencial y sincronización bidireccional.',
      channel: 'Consola Web / PC'
    }
  };

  const navTabs: { id: ModuleId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Panel General', icon: LayoutDashboard },
    { id: 'totem', label: 'Tótem (Express / Anónimo)', icon: Monitor },
    { id: 'triaje', label: 'Triaje GTC 45', icon: Tablet },
    { id: 'alturas', label: 'Alturas y EPP', icon: HardHat },
    { id: 'inspecciones', label: 'Inspecciones', icon: ClipboardCheck },
    { id: 'legal', label: 'Legal y FURAT', icon: FileText },
    { id: 'boletines', label: 'Boletines', icon: Megaphone },
    { id: 'presupuesto', label: 'Presupuesto', icon: Banknote },
    { id: 'database', label: 'Base de Datos (Sheets)', icon: Database }
  ];

  const visibleTabs = navTabs.filter(tab => allowed.includes(tab.id));
  const safeActiveModule = allowed.includes(activeModule as ModuleId) ? activeModule : 'dashboard';
  const currentMeta = moduleMeta[safeActiveModule];

  const renderActiveModule = () => {
    switch (safeActiveModule) {
      case 'totem': 
        return <TotemStation onGoToTriaje={allowed.includes('triaje') ? () => setActiveModule('triaje') : undefined} />;
      case 'triaje': 
        return <TriajeGtc45 onGoToPresupuesto={allowed.includes('presupuesto') ? () => setActiveModule('presupuesto') : undefined} />;
      case 'buzon': 
        return <BuzonConfidencial />;
      case 'legal': 
        return <Hu004LegalNotification />;
      case 'alturas': 
        return <ControlAlturasEPP />;
      case 'inspecciones': 
        return <Hu006PlannedInspection />;
      case 'boletines': 
        return <Hu007SafetyBulletins />;
      case 'presupuesto': 
        return <PresupuestoReparaciones />;
      case 'database':
        return <GoogleSheetsDatabase />;
      default: 
        return <DashboardOverview onSelectModule={setActiveModule} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#061529] text-white flex flex-col font-sans">
      {/* Top Header */}
      <Header
        activeModule={safeActiveModule}
        onSelectModule={setActiveModule}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Role-Filtered Navigation Tabs Bar */}
        <div className="border-b border-[#14508F]/50 pb-3 flex items-center justify-between gap-4 overflow-x-auto">
          <div className="flex items-center gap-1.5 shrink-0">
            {visibleTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = safeActiveModule === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveModule(tab.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap border ${
                    isActive
                      ? 'bg-[#1F6FB5] text-white border-[#5FA8E8]/60 shadow-sm'
                      : 'bg-transparent text-[#C9D1D9] border-transparent hover:text-white hover:bg-[#0A2342]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#FF8A00]' : 'text-[#5FA8E8]'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Supervisor Login Notification Banner for New Totem Reports */}
        {isSupervisor && unreadSupervisorNotifications.length > 0 && (
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0A2342] border-2 border-[#FF8A00] shadow-2xl space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#14508F]/60 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FF8A00] text-[#0A2342] flex items-center justify-center shrink-0">
                  <BellRing className="w-5 h-5 animate-bounce" />
                </div>
                <div>
                  <div className="text-xs font-mono font-bold text-[#FF8A00] uppercase tracking-wider">
                    Notificación de Ingreso · Alerta en Tiempo Real del Tótem
                  </div>
                  <div className="text-sm sm:text-base font-display font-bold text-white">
                    Tienes {unreadSupervisorNotifications.length} nuevo(s) reporte(s) de riesgo pendiente(s) por revisar
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={markAllNotificationsRead}
                className="px-3 py-1.5 rounded-lg bg-[#061529] hover:bg-[#14508F]/50 border border-[#14508F]/70 text-xs text-[#C9D1D9] hover:text-white font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5 text-[#2ECC71]" />
                <span>Marcar todas leídas</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {unreadSupervisorNotifications.map((notif) => (
                <div
                  key={notif.id}
                  className="p-3.5 rounded-xl bg-[#061529] border border-[#1F6FB5]/70 flex flex-col md:flex-row md:items-center justify-between gap-3"
                >
                  <div className="space-y-1 text-xs">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-[#E63946] text-white font-mono text-[10px] font-bold">
                        NUEVO REPORTE
                      </span>
                      <span className="font-mono font-bold text-[#FF8A00]">{notif.incidentId}</span>
                      <span className="text-[#5FA8E8] font-semibold">{notif.category}</span>
                      <span className="text-[#C9D1D9]">· {notif.quadrantName} ({notif.area})</span>
                      <span className="font-mono text-[#C9D1D9]/80">· {notif.reportedAt}</span>
                    </div>
                    <div className="text-sm font-display font-bold text-white">{notif.title}</div>
                    {notif.description && (
                      <div className="text-xs text-[#C9D1D9] line-clamp-2">"{notif.description}"</div>
                    )}
                    <div className="text-[11px] text-[#5FA8E8] flex items-center gap-1.5">
                      {notif.isAnonymous ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>Reportado vía Buzón Confidencial (Anónimo)</span>
                        </>
                      ) : (
                        <span>Reportado por: {notif.reportedBy}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedIncidentId(notif.incidentId);
                        markNotificationRead(notif.id);
                        setActiveModule('triaje');
                      }}
                      className="px-3.5 py-2 rounded-xl bg-[#FF8A00] hover:bg-[#ff9c24] text-[#0A2342] font-display font-extrabold text-xs flex items-center gap-1.5 shadow cursor-pointer transition-colors"
                    >
                      <span>Evaluar en Triaje GTC 45</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => markNotificationRead(notif.id)}
                      title="Descartar notificación"
                      className="p-2 rounded-xl bg-[#0A2342] hover:bg-[#14508F]/60 border border-[#14508F]/70 text-[#C9D1D9] hover:text-white cursor-pointer transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Module Subtitle */}
        {safeActiveModule !== 'dashboard' && currentMeta && (
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-[#0A2342] border border-[#14508F]/70">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#C9D1D9]">
                <button
                  type="button"
                  onClick={() => setActiveModule('dashboard')}
                  className="hover:text-[#FF8A00] flex items-center gap-1 cursor-pointer font-semibold transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Volver al Panel General</span>
                </button>
                <span className="text-[#1F6FB5]">/</span>
                <span className="text-[#5FA8E8] font-bold">{currentMeta.channel}</span>
              </div>
              <h1 className="text-base sm:text-xl font-display font-bold text-white mt-1.5">
                {currentMeta.title}
              </h1>
              <p className="text-xs text-[#C9D1D9] mt-0.5">
                {currentMeta.subtitle}
              </p>
            </div>
          </div>
        )}

        {/* Active Module Renderer */}
        {safeActiveModule === 'dashboard' ? (
          <DashboardOverview onSelectModule={setActiveModule} />
        ) : (
          <DeviceFrame channel={currentMeta?.channel || 'Consola Web / PC'}>
            {renderActiveModule()}
          </DeviceFrame>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-[#14508F]/40 bg-[#0A2342] py-6 text-xs text-[#C9D1D9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="font-medium">
            <strong className="font-display text-white">SST-ACTIVE</strong> — Prevención Digital e Inteligencia Laboral Industrial.
          </div>
          <div className="flex flex-wrap items-center gap-3 text-[#5FA8E8] font-mono text-[11px]">
            <span>Decreto 1072 de 2015</span>
            <span>·</span>
            <span>Resolución 4272 de 2021</span>
            <span>·</span>
            <span>GTC 45</span>
            <span>·</span>
            <span>Ley 1581 de 2012</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <PlantProvider>
      <AppContent />
    </PlantProvider>
  );
}
