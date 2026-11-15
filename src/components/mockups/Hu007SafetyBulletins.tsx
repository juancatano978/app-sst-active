import React, { useState } from 'react';
import { usePlant } from '../../context/PlantContext';
import { 
  Megaphone, 
  Radio, 
  CheckCircle2, 
  Clock, 
  AlertOctagon, 
  Fingerprint, 
  Eye
} from 'lucide-react';

export const Hu007SafetyBulletins: React.FC = () => {
  const { currentUser } = usePlant();
  const canViewAnalytics = currentUser?.role === 'SUPERVISOR_HSEQ' || currentUser?.role === 'GERENCIA';

  const [activeView, setActiveView] = useState<'totem' | 'analytics'>('totem');
  const [hasTappedRfid, setHasTappedRfid] = useState<boolean>(false);
  const [confirmedCount, setConfirmedCount] = useState<number>(102);
  const totalWorkers = 120;

  const currentBulletin = {
    id: 'BOL-2026-048',
    title: 'LECCIÓN APRENDIDA: PROTOCOLO DE MANOS LIBRES EN PRENSAS HIDRÁULICAS',
    target: 'Cuadrilla Mecánica, Troquelado y Prensas (Clase V)',
    urgency: 'ALTA PRIORIDAD',
    publishedDate: '2026-10-28 07:00 AM',
    content: [
      '1. Bloqueo LOTO obligatorio: Nunca introduzca las manos o herramientas en el punto de operación sin colocar el candado y tarjeta de seguridad en el interruptor principal.',
      '2. Falla en cortina óptica: Si el haz infrarrojo parpadea o presenta retraso, suspenda inmediatamente la operación y reporte en el Tótem de vestieres.',
      '3. Uso estricto de pinzas extractoras de 40 cm para piezas atascadas en la matriz.'
    ]
  };

  const handleTapBadge = () => {
    if (!hasTappedRfid) {
      setHasTappedRfid(true);
      setConfirmedCount(prev => prev + 1);
    }
  };

  const coveragePercent = Math.round((confirmedCount / totalWorkers) * 100);
  const effectiveView = canViewAnalytics ? activeView : 'totem';

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
            <Megaphone className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-teal-400 tracking-wider">BOLETINES DE SEGURIDAD Y LECCIONES APRENDIDAS</div>
            <div className="text-sm font-bold text-white">Difusión Operativa en Kioscos con Acuse de Recibo Digital</div>
            <div className="text-xs text-slate-400">Confirmación por aproximación de carné RFID/NFC en cumplimiento de la Ley 1581 (sin huella dactilar)</div>
          </div>
        </div>

        {/* View Switcher (Analytics only for HSEQ / Gerencia) */}
        {canViewAnalytics && (
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setActiveView('totem')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                effectiveView === 'totem' ? 'bg-teal-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Pantalla del Tótem</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveView('analytics')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                effectiveView === 'analytics' ? 'bg-teal-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Panel de Cobertura HSEQ</span>
            </button>
          </div>
        )}
      </div>

      {effectiveView === 'totem' ? (
        /* Kiosk Screen View for Shift Workers */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Safety Bulletin Card */}
          <div className="lg:col-span-8 space-y-4">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    {currentBulletin.urgency}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{currentBulletin.id}</span>
                </div>
                <div className="text-xs text-slate-400 font-mono flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-sky-400" />
                  {currentBulletin.publishedDate}
                </div>
              </div>

              <h3 className="text-lg font-extrabold text-white leading-snug">
                {currentBulletin.title}
              </h3>

              <div className="text-xs text-teal-300 bg-teal-950/30 border border-teal-800/40 p-2.5 rounded-lg">
                <strong>Destinatarios:</strong> {currentBulletin.target}
              </div>

              {/* Core Safety Directives */}
              <div className="space-y-3 pt-2">
                {currentBulletin.content.map((point, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/90 text-sm text-slate-200 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-800 text-teal-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <p className="leading-relaxed">{point}</p>
                  </div>
                ))}
              </div>

              {/* Graphic Reminder */}
              <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-600/30 text-amber-200 text-xs flex items-center gap-3">
                <AlertOctagon className="w-5 h-5 text-amber-400 shrink-0" />
                <span>La prevención es un compromiso de todos. Ante cualquier duda en la operación de máquinas, consulte a su supervisor de área.</span>
              </div>
            </div>
          </div>

          {/* Right Column: RFID Reader & Acknowledgment Simulator */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-center">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Confirmación de Lectura Obligatoria
              </div>

              {/* RFID Tap Zone */}
              <div className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center justify-center space-y-3 ${
                hasTappedRfid
                  ? 'bg-emerald-950/30 border-emerald-500 text-emerald-200'
                  : 'bg-slate-950 border-dashed border-teal-500/50 hover:border-teal-400 text-slate-300'
              }`}>
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  hasTappedRfid ? 'bg-emerald-500/20 text-emerald-400' : 'bg-teal-500/10 text-teal-400 animate-pulse'
                }`}>
                  <Radio className="w-8 h-8" />
                </div>

                {!hasTappedRfid ? (
                  <>
                    <div className="text-sm font-bold text-white">APROXIME SU CARNÉ AL LECTOR RFID / NFC</div>
                    <div className="text-xs text-slate-400">
                      Toque para registrar su acuse de lectura con el carné #{currentUser?.carnet || '883921'}.
                    </div>
                    <button
                      type="button"
                      onClick={handleTapBadge}
                      className="w-full py-3 px-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg shadow-teal-500/20"
                    >
                      <Radio className="w-4 h-4" />
                      <span>Registrar Acuse con Carné</span>
                    </button>
                  </>
                ) : (
                  <>
                    <div className="text-sm font-bold text-emerald-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ACUSE DE LECTURA REGISTRADO
                    </div>
                    <div className="text-xs text-slate-300 font-mono">
                      Colaborador: {currentUser?.name || 'Juan Andrés Cataño S.'}<br />
                      Carné #{currentUser?.carnet || '883921'} · 2026-10-28 14:41:09 UTC
                    </div>
                    <div className="text-[11px] text-emerald-400/80 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/40">
                      ✓ Sello digital confirmado
                    </div>
                  </>
                )}
              </div>

              {/* Ley 1581 Privacy Compliance Box */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-left space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                  <Fingerprint className="w-4 h-4 text-rose-400" />
                  <span>Protección de Datos Sensibles</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  El sistema utiliza exclusivamente el carné de proximidad para verificar la lectura de comunicados preventivos, evitando la recolección de datos biométricos como huellas dactilares.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* HSEQ Analytics Console View */
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Eye className="w-5 h-5 text-teal-400" />
                Métricas de Cobertura en Tiempo Real
              </h4>
              <div className="text-xs text-slate-400">Boletín Activo: {currentBulletin.title}</div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="text-slate-400">Total Operarios en Turno: <strong className="text-white">{totalWorkers}</strong></span>
              <span className="text-teal-400">Confirmados: <strong>{confirmedCount}</strong></span>
            </div>
          </div>

          {/* Progress Bar & Gauges */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-300">Nivel de Asimilación y Lectura del Turno</span>
              <span className="font-mono text-teal-400 text-base">{coveragePercent}%</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-3.5 p-0.5 border border-slate-800">
              <div 
                className="bg-gradient-to-r from-teal-500 to-emerald-400 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${coveragePercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>Meta de la compañía: &gt;= 80%</span>
              <span>{totalWorkers - confirmedCount} operarios pendientes por confirmar</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-slate-500 font-semibold uppercase">Tótem Comedor Vestier #1</div>
              <div className="text-xl font-mono font-bold text-white">58 lecturas</div>
              <div className="text-emerald-400">96% cobertura en Sector A</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-slate-500 font-semibold uppercase">Tótem Pasillo Hornos #2</div>
              <div className="text-xl font-mono font-bold text-white">32 lecturas</div>
              <div className="text-amber-400">80% cobertura en Sector B</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-slate-500 font-semibold uppercase">Tótem Entrada Ensamble #3</div>
              <div className="text-xl font-mono font-bold text-white">{confirmedCount - 90} lecturas</div>
              <div className="text-sky-400">Lecturas en tiempo real</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
