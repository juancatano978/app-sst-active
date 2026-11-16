import React from 'react';
import { usePlant } from '../context/PlantContext';
import { ModuleId } from '../types/plantOps';
import { 
  Monitor, 
  Tablet, 
  ShieldAlert, 
  FileText, 
  HardHat, 
  ClipboardCheck, 
  Megaphone, 
  Banknote, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  TrendingDown,
  Activity,
  Users,
  AlertOctagon,
  Wrench,
  Radio,
  CreditCard,
  Database
} from 'lucide-react';

interface DashboardOverviewProps {
  onSelectModule: (module: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ onSelectModule }) => {
  const { currentUser, quadrants, incidents, workers, linkedSpreadsheetId, pendingSheetChanges } = usePlant();
  const allowedModules = currentUser?.allowedModules || ['dashboard'];

  const totalIncidents = incidents.length;
  const criticalCount = incidents.filter(i => i.status === 'Suspendido' || (i.gtc45Evaluation && i.gtc45Evaluation.nr >= 600)).length;
  const activeWorkersCount = workers.filter(w => w.certStatus === 'ACTIVO').length;

  const modules = [
    {
      id: 'totem',
      name: 'Tótem Industrial de Planta',
      channel: 'Kiosco Fijo con Buzón Confidencial',
      desc: 'Punto táctil de captura express con carné RFID/NFC en < 5s. Incluye interruptor de Modo Anónimo para suprimir datos del empleado.',
      icon: Monitor,
      color: 'sky',
      badge: 'Terminal Fijo',
      stat: 'Activo en Comedor'
    },
    {
      id: 'triaje',
      name: 'Triaje Técnico y Matriz GTC 45',
      channel: 'Tablet Ruguerizada ATEX / IP68',
      desc: 'Inspección fotográfica en sitio, algoritmo GTC 45 (ND × NE × NC) y emisión formal de orden de suspensión de labores.',
      icon: Tablet,
      color: 'amber',
      badge: 'Supervisión en Campo',
      stat: `${criticalCount} riesgo(s) crítico(s)`
    },
    {
      id: 'totem_anonimo',
      name: 'Buzón Confidencial (En Tótem)',
      channel: 'Modo Anónimo Integrado en Tótem',
      desc: 'Permite al empleado activar el Modo Anónimo en el Tótem para reportar casi-accidentes sin enviar cédula ni nombre (Ley 1581).',
      icon: ShieldAlert,
      color: 'purple',
      badge: 'Confidencial en Tótem',
      stat: '591 reportes acumulados'
    },
    {
      id: 'legal',
      name: 'Gestión Legal y FURAT',
      channel: 'Consola Central SST',
      desc: 'Control estricto de plazos legales (2 días hábiles FURAT / 24h COPASST) bajo el Decreto 1072 de 2015.',
      icon: FileText,
      color: 'rose',
      badge: 'Cumplimiento Legal',
      stat: 'Plazos al día'
    },
    {
      id: 'alturas',
      name: 'Almacén Técnico y Trabajo en Alturas',
      channel: 'Módulo de Pañol de Planta',
      desc: 'Validación en tiempo real del certificado bajo la Res. 4272. Bloqueo automático de arneses para personal vencido.',
      icon: HardHat,
      color: 'amber',
      badge: 'Resolución 4272',
      stat: `${activeWorkersCount} operarios aptos`
    },
    {
      id: 'inspecciones',
      name: 'Inspecciones Planeadas Locativas',
      channel: 'Consola Central + Tablet',
      desc: 'Recorridos mensuales obligatorios por cuadrante, órdenes directas a taller y actas oficiales en PDF.',
      icon: ClipboardCheck,
      color: 'indigo',
      badge: 'Rondas Mensuales',
      stat: 'Nave Prensas en curso'
    },
    {
      id: 'boletines',
      name: 'Boletines y Lecciones Aprendidas',
      channel: 'Difusión Digital en Pantallas',
      desc: 'Comunicados de seguridad con acuse de lectura digital por aproximación de carné RFID/NFC (sin huella dactilar).',
      icon: Megaphone,
      color: 'teal',
      badge: 'Difusión de Turno',
      stat: '87% de lectura turno A'
    },
    {
      id: 'presupuesto',
      name: 'Presupuesto y Órdenes de Mantenimiento',
      channel: 'Consola SST y Gerencial',
      desc: 'Compuerta presupuestal de 1 SMMLV: autorización autónoma del Encargado SST vs visto bueno de Gerencia General.',
      icon: Banknote,
      color: 'emerald',
      badge: 'Compuerta 1 SMMLV',
      stat: 'Límite $1.423.500 COP'
    },
    {
      id: 'database',
      name: 'Base de Datos (Google Sheets)',
      channel: 'Motor Relacional 6 Tablas + KPI',
      desc: 'Esquema relacional PK/FK en Google Sheets con fórmulas nativas, auditoría de integridad referencial y sincronización bidireccional.',
      icon: Database,
      color: 'sky',
      badge: 'Google Sheets DB',
      stat: linkedSpreadsheetId
        ? pendingSheetChanges > 0
          ? `${pendingSheetChanges} cambio(s) pendiente(s)`
          : 'Hoja vinculada y al día'
        : 'Sin hoja vinculada'
    }
  ];

  const visibleModules = modules.filter((mod) => {
    const targetModule: ModuleId = mod.id === 'totem_anonimo' ? 'totem' : (mod.id as ModuleId);
    return allowedModules.includes(targetModule);
  });

  return (
    <div className="space-y-6">
      {/* Active User Profile Session Banner */}
      {currentUser && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0A2342] border border-[#14508F]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#1F6FB5]/25 border border-[#5FA8E8]/40 flex items-center justify-center text-[#5FA8E8] shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm sm:text-base font-display font-bold text-white">{currentUser.name}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FF8A00] text-[#0A2342]">
                  {currentUser.roleLabel}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#061529] text-[#C9D1D9] border border-[#14508F]/60">
                  Carné #{currentUser.carnet}
                </span>
              </div>
              <div className="text-xs text-[#C9D1D9] mt-0.5">
                {currentUser.cargo} · {currentUser.area} · {currentUser.turno}
              </div>
            </div>
          </div>

          <div className="text-xs font-mono text-[#C9D1D9] bg-[#061529] px-3.5 py-2 rounded-xl border border-[#14508F]/70 shrink-0">
            Permisos activos: <strong className="text-[#2ECC71]">{visibleModules.length}</strong> funcionalidades habilitadas
          </div>
        </div>
      )}

      {/* Live Plant Security Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#0A2342] border border-[#14508F]/60 space-y-1">
          <div className="flex items-center justify-between text-xs text-[#C9D1D9] font-medium">
            <span>Días Sin Accidentes Incapacitantes</span>
            <ShieldCheck className="w-4 h-4 text-[#2ECC71]" />
          </div>
          <div className="text-2xl font-display font-extrabold text-white">142 Días</div>
          <div className="text-[11px] text-[#2ECC71] font-semibold">Meta de Planta: Cero Daño</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0A2342] border border-[#14508F]/60 space-y-1">
          <div className="flex items-center justify-between text-xs text-[#C9D1D9] font-medium">
            <span>Novedades Activas en Planta</span>
            <AlertTriangle className="w-4 h-4 text-[#FF8A00]" />
          </div>
          <div className="text-2xl font-display font-extrabold text-[#FF8A00]">{totalIncidents} Registros</div>
          <div className="text-[11px] text-[#C9D1D9] font-medium">{criticalCount} con suspensión de labor</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0A2342] border border-[#14508F]/60 space-y-1">
          <div className="flex items-center justify-between text-xs text-[#C9D1D9] font-medium">
            <span>Personal Apto para Alturas</span>
            <Users className="w-4 h-4 text-[#5FA8E8]" />
          </div>
          <div className="text-2xl font-display font-extrabold text-white">{activeWorkersCount} / {workers.length}</div>
          <div className="text-[11px] text-[#5FA8E8] font-medium">Verificado Res. 4272/2021</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0A2342] border border-[#14508F]/60 space-y-1">
          <div className="flex items-center justify-between text-xs text-[#C9D1D9] font-medium">
            <span>Inspecciones Planeadas (Mes)</span>
            <Activity className="w-4 h-4 text-[#2ECC71]" />
          </div>
          <div className="text-2xl font-display font-extrabold text-white">92%</div>
          <div className="text-[11px] text-[#2ECC71] font-semibold">Recorridos al día</div>
        </div>
      </div>

      {/* Critical Alerts Banner (Rojo Emergencia #E63946 per Manual p. 09) */}
      {criticalCount > 0 && (
        <div className="p-4 rounded-2xl bg-[#E63946]/15 border border-[#E63946]/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E63946] text-white flex items-center justify-center shrink-0">
              <AlertOctagon className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-display font-bold text-[#ff8b94] uppercase tracking-wider">
                Alerta Operativa Activa: Orden de Suspensión de Labores Emitida
              </div>
              <div className="text-sm font-semibold text-white">
                Prensa Troqueladora #4 detenida por guarda mecánica desprendida (Nivel I Crítico GTC 45)
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {allowedModules.includes('triaje') && (
              <button
                type="button"
                onClick={() => onSelectModule('triaje')}
                className="px-4 py-2 rounded-lg bg-[#E63946] hover:bg-[#f04b57] text-white font-display font-bold text-xs transition-colors cursor-pointer"
              >
                Ver Triaje HSEQ
              </button>
            )}
            {allowedModules.includes('presupuesto') && (
              <button
                type="button"
                onClick={() => onSelectModule('presupuesto')}
                className="px-3.5 py-2 rounded-lg bg-[#0A2342] hover:bg-[#14508F] text-white border border-[#1F6FB5]/60 font-semibold text-xs transition-colors cursor-pointer"
              >
                Ver Cotización
              </button>
            )}
          </div>
        </div>
      )}

      {/* Operational Modules Navigation */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-display font-bold text-white">Módulos Habilitados para su Perfil</h2>
            <div className="text-xs text-[#C9D1D9]">
              Canales operativos autorizados para el carné #{currentUser?.carnet} ({currentUser?.roleLabel})
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {visibleModules.map((mod) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.id}
                onClick={() => onSelectModule(mod.id === 'totem_anonimo' ? 'totem' : mod.id)}
                className="p-5 rounded-2xl bg-[#0A2342] border border-[#14508F]/60 hover:border-[#FF8A00] hover:bg-[#0D2B50] transition-all flex flex-col justify-between group cursor-pointer shadow-lg"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#14508F]/40 border border-[#1F6FB5]/50 flex items-center justify-center text-[#5FA8E8] group-hover:bg-[#FF8A00] group-hover:text-[#0A2342] group-hover:border-[#FF8A00] transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#061529] text-[#C9D1D9] border border-[#14508F]/60">
                      {mod.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-display font-bold text-white group-hover:text-[#FF8A00] transition-colors">
                      {mod.name}
                    </h3>
                    <div className="text-[11px] font-mono text-[#5FA8E8] mt-0.5">
                      {mod.channel}
                    </div>
                  </div>

                  <p className="text-xs text-[#C9D1D9] line-clamp-3 leading-relaxed">
                    {mod.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#14508F]/40 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-mono text-[#C9D1D9]/80">{mod.stat}</span>
                  <div className="flex items-center gap-1 font-bold text-[#FF8A00]">
                    <span>Ingresar</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Real-time Sector Status Map */}
      <div className="p-5 rounded-2xl bg-[#0A2342] border border-[#14508F]/60 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm sm:text-base font-display font-bold text-white">Monitoreo de Cuadrantes y Naves Industriales</h3>
            <div className="text-xs text-[#C9D1D9]">Estado de condiciones locativas y supervisores HSEQ de turno</div>
          </div>
          {allowedModules.includes('totem') && (
            <button
              type="button"
              onClick={() => onSelectModule('totem')}
              className="text-xs text-[#FF8A00] hover:text-[#ff9c24] font-bold cursor-pointer"
            >
              Abrir Tótem de Planta &rarr;
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quadrants.map((q) => (
            <div key={q.id} className="p-3.5 rounded-xl bg-[#061529] border border-[#14508F]/50 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-[#5FA8E8]">{q.id}</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                  q.riskClass === 'V' ? 'bg-[#E63946] text-white' : 'bg-[#FF8A00] text-[#0A2342]'
                }`}>
                  Riesgo {q.riskClass}
                </span>
              </div>
              <div className="font-semibold text-white truncate">{q.name}</div>
              <div className="text-[11px] text-[#C9D1D9] truncate">{q.supervisor}</div>
              <div className="text-[10px] pt-1 border-t border-[#14508F]/40 flex items-center justify-between">
                {q.criticalConditions > 0 ? (
                  <span className="text-[#E63946] font-bold">Parada de máquina</span>
                ) : q.activeHazards > 0 ? (
                  <span className="text-[#FF8A00] font-semibold">{q.activeHazards} novedades</span>
                ) : (
                  <span className="text-[#2ECC71] font-semibold">✓ Operando</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Plant Incidents Feed */}
      <div className="p-5 rounded-2xl bg-[#0A2342] border border-[#14508F]/60 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm sm:text-base font-display font-bold text-white">Últimas Novedades y Reportes Radicados</h3>
            <div className="text-xs text-[#C9D1D9]">Bitácora en tiempo real alimentada desde Tótems de vestieres y Buzón Confidencial</div>
          </div>
          {allowedModules.includes('triaje') && (
            <button
              type="button"
              onClick={() => onSelectModule('triaje')}
              className="text-xs text-[#FF8A00] hover:text-[#ff9c24] font-bold cursor-pointer"
            >
              Evaluar en Tablet &rarr;
            </button>
          )}
        </div>

        <div className="divide-y divide-[#14508F]/40 text-xs">
          {incidents.slice(0, 4).map((inc) => (
            <div key={inc.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[#5FA8E8]">{inc.id}</span>
                  <span className="text-[#1F6FB5]">·</span>
                  <span className="text-[#C9D1D9] font-medium">{inc.quadrantName}</span>
                  <span className="text-[#1F6FB5]">·</span>
                  <span className="text-[#C9D1D9]/80 font-mono text-[11px]">{inc.reportedAt}</span>
                </div>
                <div className="text-white font-medium">{inc.title}</div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                  inc.status === 'Suspendido'
                    ? 'bg-[#E63946] text-white'
                    : inc.status === 'En Triaje'
                    ? 'bg-[#FF8A00] text-[#0A2342]'
                    : 'bg-[#2ECC71] text-[#0A2342]'
                }`}>
                  {inc.status}
                </span>

                {allowedModules.includes('triaje') && (
                  <button
                    type="button"
                    onClick={() => onSelectModule('triaje')}
                    className="px-2.5 py-1 rounded bg-[#14508F]/50 hover:bg-[#1F6FB5] text-white border border-[#1F6FB5]/50 text-[11px] font-medium transition-colors cursor-pointer"
                  >
                    Inspeccionar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
