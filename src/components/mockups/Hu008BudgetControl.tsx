import React, { useState } from 'react';
import { SMMLV_PARAM } from '../../data/userStoriesData';
import { 
  Banknote, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Sliders, 
  Send, 
  UserCheck, 
  Building,
  ArrowRight
} from 'lucide-react';

export const Hu008BudgetControl: React.FC = () => {
  const [costAmount, setCostAmount] = useState<number>(850000); // in COP
  const [activeRole, setActiveRole] = useState<'sst' | 'gerencia'>('sst');
  const [sstSigned, setSstSigned] = useState<boolean>(false);
  const [gerenciaDecision, setGerenciaDecision] = useState<'approved' | 'rejected' | null>(null);
  const [repairDescription, setRepairDescription] = useState<string>(
    'Reemplazo de interruptor final de carrera y sellos hidráulicos de prensa #4'
  );

  const isAutonomous = costAmount <= SMMLV_PARAM;

  const handlePresetMinor = () => {
    setCostAmount(720000);
    setRepairDescription('Instalación de rodapié y barandilla antideslizante en escalera de vestier');
    setSstSigned(false);
    setGerenciaDecision(null);
  };

  const handlePresetMajor = () => {
    setCostAmount(3950000);
    setRepairDescription('Reemplazo integral de motor trifásico y variador de frecuencia de ventilador de tiro forzado');
    setSstSigned(false);
    setGerenciaDecision(null);
  };

  const handleSstAuthorize = () => {
    setSstSigned(true);
  };

  const handleEscalateToManager = () => {
    setActiveRole('gerencia');
  };

  const handleManagerDecision = (decision: 'approved' | 'rejected') => {
    setGerenciaDecision(decision);
  };

  const formattedAmount = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(costAmount);

  const formattedSmmlv = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(SMMLV_PARAM);

  return (
    <div className="space-y-6">
      {/* Header Banner - 1 SMMLV Financial Gate */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Banknote className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-emerald-400 tracking-wider">GESTIÓN DE PRESUPUESTO Y COMPUERTA FINANCIERA</div>
            <div className="text-sm font-bold text-white">Límite de Aprobación Autónoma SST de 1 SMMLV ({formattedSmmlv})</div>
            <div className="text-xs text-slate-400">Autorización directa de reparaciones menores vs. derivación formal a Gerencia General</div>
          </div>
        </div>

        {/* Role Switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setActiveRole('sst')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
              activeRole === 'sst' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Bandeja Encargado SST</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveRole('gerencia')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
              activeRole === 'gerencia' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>Bandeja Gerencia General</span>
          </button>
        </div>
      </div>

      {/* Preset Quick Selectors */}
      <div className="flex flex-wrap items-center gap-3 text-xs">
        <span className="text-slate-400 font-semibold">Cargar Ejemplo de Cotización:</span>
        <button
          type="button"
          onClick={handlePresetMinor}
          className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 font-medium transition-colors"
        >
          Reparación Menor (&lt;= 1 SMMLV: $720.000 COP)
        </button>
        <button
          type="button"
          onClick={handlePresetMajor}
          className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 font-medium transition-colors"
        >
          Reparación Mayor (&gt; 1 SMMLV: $3.950.000 COP)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Cost Evaluation & Parametric Gate */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-emerald-400" />
                VALORACIÓN ECONÓMICA DE LA REPARACIÓN
              </span>
              <span className="font-mono text-xs text-sky-400">1 SMMLV Vigente: {formattedSmmlv}</span>
            </div>

            {/* Cost Input & Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Costo Estimado de la Orden:</span>
                <span className="text-xl font-mono font-black text-white">{formattedAmount}</span>
              </div>
              <input
                type="range"
                min="200000"
                max="8000000"
                step="50000"
                value={costAmount}
                onChange={(e) => {
                  setCostAmount(Number(e.target.value));
                  setSstSigned(false);
                  setGerenciaDecision(null);
                }}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>$200.000 COP</span>
                <span className="text-emerald-400 font-semibold">Límite Autónomo: {formattedSmmlv}</span>
                <span>$8.000.000 COP</span>
              </div>
            </div>

            {/* Repair detail */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-semibold">Descripción del Trabajo Locativo</label>
              <textarea
                value={repairDescription}
                onChange={(e) => setRepairDescription(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Automated Rule Determination */}
            <div className={`p-4 rounded-xl border transition-all ${
              isAutonomous 
                ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200' 
                : 'bg-amber-950/20 border-amber-500/40 text-amber-200'
            }`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold tracking-wider uppercase">
                  {isAutonomous ? 'APROBACIÓN AUTÓNOMA POR SST' : 'REQUIERE AUTORIZACIÓN GERENCIAL'}
                </span>
                <span className="font-mono text-xs font-bold">
                  {isAutonomous ? 'Costo <= 1 SMMLV' : 'Costo > 1 SMMLV'}
                </span>
              </div>
              <p className="text-xs leading-relaxed">
                {isAutonomous
                  ? `El monto de ${formattedAmount} se encuentra dentro del cupo autónomo de 1 SMMLV (${formattedSmmlv}). El Encargado de SST tiene facultades directas para firmar y aprobar la orden de trabajo de manera ágil sin detener la intervención.`
                  : `El monto de ${formattedAmount} supera el tope autónomo de 1 SMMLV (${formattedSmmlv}). El sistema deriva la solicitud a la consola gerencial del Empleador para revisión de presupuesto y visto bueno.`}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Authorization Workflow & Digital Signature */}
        <div className="lg:col-span-6 space-y-4">
          {activeRole === 'sst' ? (
            /* SST Officer View */
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  BANDEJA DEL ENCARGADO DE SEGURIDAD Y SALUD EN EL TRABAJO
                </span>
                <span className="font-mono text-xs text-slate-400">Licencia SST Vigente</span>
              </div>

              {isAutonomous ? (
                /* Autonomous Approval Flow */
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                    <div className="text-slate-400">Facultad: <strong className="text-white">Gasto Autónomo Inmediato</strong></div>
                    <div className="text-slate-400">Cuenta contable: <span className="font-mono text-sky-400">Fondo de Mantenimiento Correctivo SST</span></div>
                    <div className="text-slate-400">Monto a autorizar: <span className="font-mono text-emerald-400 font-bold">{formattedAmount}</span></div>
                  </div>

                  {!sstSigned ? (
                    <button
                      type="button"
                      onClick={handleSstAuthorize}
                      className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 cursor-pointer active:scale-[0.99] transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>FIRMAR Y AUTORIZAR ORDEN DE REPARACIÓN</span>
                    </button>
                  ) : (
                    <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 space-y-2 text-xs">
                      <div className="flex items-center gap-2 font-bold text-emerald-300">
                        <CheckCircle2 className="w-4 h-4" />
                        ORDEN DE REPARACIÓN APROBADA
                      </div>
                      <div>
                        Orden de trabajo #OT-SST-2026-881 autorizada con firma digital del Especialista SST. Los recursos quedan asignados y el proveedor técnico ha sido notificado para la intervención en sitio.
                      </div>
                      <div className="font-mono text-[11px] text-slate-400">
                        Sello digital UTC registrado
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Exceeded Limit Escalate Button */
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-600/30 text-amber-200 text-xs space-y-2">
                    <div className="font-bold flex items-center gap-1.5 text-amber-300">
                      <AlertTriangle className="w-4 h-4" />
                      Monto Superior a 1 SMMLV
                    </div>
                    <p>
                      El costo cotizado supera el límite de autorización autónoma del Encargado SST. Se traslada el requerimiento a Gerencia General para aprobación presupuestal.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleEscalateToManager}
                    className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-900/30 cursor-pointer active:scale-[0.99] transition-all"
                  >
                    <Send className="w-4 h-4" />
                    <span>ENVIAR SOLICITUD A GERENCIA GENERAL</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* General Manager View */
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-sky-400" />
                  BANDEJA DE AUTORIZACIÓN GERENCIAL
                </span>
                <span className="font-mono text-xs text-sky-400">Dirección General</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Solicitado por:</span>
                  <span className="text-white font-medium">Especialista SST de Planta</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Presupuesto Requerido:</span>
                  <span className="font-mono text-amber-400 font-bold text-sm">{formattedAmount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Concepto:</span>
                  <span className="text-slate-200">{repairDescription}</span>
                </div>
              </div>

              {gerenciaDecision === null ? (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => handleManagerDecision('approved')}
                    className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 cursor-pointer transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Aprobar Partida Presupuestal</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleManagerDecision('rejected')}
                    className="py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-900/30 cursor-pointer transition-all"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Rechazar Cotización</span>
                  </button>
                </div>
              ) : gerenciaDecision === 'approved' ? (
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 space-y-2 text-xs">
                  <div className="flex items-center gap-2 font-bold text-emerald-300">
                    <CheckCircle2 className="w-4 h-4" />
                    PARTIDA PRESUPUESTAL APROBADA POR GERENCIA
                  </div>
                  <div>
                    Aprobación con firma electrónica y registro contable formal. Se genera la orden de compra y se habilita la ejecución inmediata del mantenimiento.
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-200 space-y-2 text-xs">
                  <div className="flex items-center gap-2 font-bold text-rose-300">
                    <XCircle className="w-4 h-4" />
                    SOLICITUD DEVUELTA POR GERENCIA
                  </div>
                  <div>
                    Expediente devuelto al área de SST para contrastar con cotizaciones de mantenimiento alternativas.
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
