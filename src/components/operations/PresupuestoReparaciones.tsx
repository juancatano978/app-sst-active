import React, { useState } from 'react';
import { usePlant } from '../../context/PlantContext';
import { SMMLV_PARAM } from '../../data/plantOpsStore';
import { 
  Banknote, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Sliders, 
  Send, 
  UserCheck, 
  Building,
  ArrowRight,
  FileText
} from 'lucide-react';

export const PresupuestoReparaciones: React.FC = () => {
  const { currentUser, incidents, selectedIncidentId, setSelectedIncidentId, updateWorkOrderStatus } = usePlant();

  const currentIncident = incidents.find(i => i.id === selectedIncidentId) || incidents[0];

  const [activeRole, setActiveRole] = useState<'sst' | 'gerencia'>(
    currentUser?.role === 'GERENCIA' ? 'gerencia' : 'sst'
  );
  const [costAmount, setCostAmount] = useState<number>(
    currentIncident?.workOrder?.cost ?? 850000
  );
  const [repairDescription, setRepairDescription] = useState<string>(
    currentIncident?.workOrder?.description ?? 'Reemplazo de guarda estructural y cambio de retenedor hidráulico'
  );

  const isAutonomous = costAmount <= SMMLV_PARAM;

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

  const handleSstAuthorize = () => {
    if (!currentIncident) return;
    updateWorkOrderStatus(
      currentIncident.id,
      'Aprobado Autónomo SST',
      currentUser ? `${currentUser.name} (${currentUser.roleLabel})` : 'Especialista SST'
    );
  };

  const handleEscalate = () => {
    if (!currentIncident) return;
    updateWorkOrderStatus(currentIncident.id, 'Escalado a Gerencia');
    setActiveRole('gerencia');
  };

  const handleManagerDecision = (decision: 'Aprobado Gerencia' | 'Rechazado') => {
    if (!currentIncident) return;
    updateWorkOrderStatus(
      currentIncident.id,
      decision,
      currentUser ? `${currentUser.name} (${currentUser.roleLabel})` : 'Dirección General'
    );
  };

  const workOrderStatus = currentIncident?.workOrder?.status || 'Pendiente SST';

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Banknote className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-emerald-400 tracking-wider">GESTIÓN PRESUPUESTAL Y COMPUERTA FINANCIERA</div>
            <div className="text-sm font-bold text-white">Límite de Aprobación Autónoma SST: 1 SMMLV ({formattedSmmlv})</div>
            <div className="text-xs text-slate-400">Autorización autónoma para reparaciones menores vs. derivación formal a Gerencia General</div>
          </div>
        </div>

        {/* Role Switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setActiveRole('sst')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeRole === 'sst' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Bandeja Encargado SST</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveRole('gerencia')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeRole === 'gerencia' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>Bandeja Gerencia General</span>
          </button>
        </div>
      </div>

      {/* Incident Picker */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Expediente a Cotizar:</span>
          <select
            value={currentIncident?.id}
            onChange={(e) => {
              setSelectedIncidentId(e.target.value);
              const target = incidents.find(i => i.id === e.target.value);
              if (target?.workOrder) {
                setCostAmount(target.workOrder.cost);
                setRepairDescription(target.workOrder.description);
              }
            }}
            className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs font-mono text-emerald-300 focus:outline-none"
          >
            {incidents.map(inc => (
              <option key={inc.id} value={inc.id}>
                {inc.id} — {inc.title.slice(0, 32)}...
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 font-mono">
          <span className="text-slate-400">Estado de Orden:</span>
          <span className={`px-2.5 py-0.5 rounded font-bold ${
            workOrderStatus.includes('Aprobado')
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : workOrderStatus === 'Rechazado'
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
          }`}>
            {workOrderStatus}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Financial Evaluation */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-emerald-400" />
                VALORACIÓN ECONÓMICA DE LA INTERVENCIÓN
              </span>
              <span className="font-mono text-xs text-sky-400">Tope Autónomo: {formattedSmmlv}</span>
            </div>

            {/* Cost Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Costo Cotizado de Reparación:</span>
                <span className="text-2xl font-mono font-black text-white">{formattedAmount}</span>
              </div>
              <input
                type="range"
                min="200000"
                max="8000000"
                step="50000"
                value={costAmount}
                onChange={(e) => setCostAmount(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>$200.000 COP</span>
                <span className="text-emerald-400 font-semibold">1 SMMLV: {formattedSmmlv}</span>
                <span>$8.000.000 COP</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-semibold">Detalle de la Reparación</label>
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
                  {isAutonomous ? 'APROBACIÓN AUTÓNOMA POR SST PERMITIDA' : 'REQUIERE APROBACIÓN DE GERENCIA'}
                </span>
                <span className="font-mono text-xs font-bold">
                  {isAutonomous ? 'Costo <= 1 SMMLV' : 'Costo > 1 SMMLV'}
                </span>
              </div>
              <p className="text-xs leading-relaxed">
                {isAutonomous
                  ? `El monto de ${formattedAmount} se encuentra dentro del tope de 1 SMMLV (${formattedSmmlv}). El Especialista SST puede firmar directamente para agilizar la intervención.`
                  : `El monto de ${formattedAmount} supera el límite de 1 SMMLV (${formattedSmmlv}). El sistema deriva la solicitud con cotización técnica a la bandeja gerencial del Empleador.`}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Roles Authorization */}
        <div className="lg:col-span-6 space-y-4">
          {activeRole === 'sst' ? (
            /* SST Officer View */
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  BANDEJA DEL ESPECIALISTA SST DE PLANTA
                </span>
                <span className="font-mono text-xs text-slate-400">Licencia SST Vigente</span>
              </div>

              {isAutonomous ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                    <div className="text-slate-400">Facultad de Gasto: <strong className="text-white">Gasto Autónomo Inmediato</strong></div>
                    <div className="text-slate-400">Fondo: <span className="font-mono text-sky-400">Mantenimiento Correctivo SST</span></div>
                    <div className="text-slate-400">Monto: <span className="font-mono text-emerald-400 font-bold">{formattedAmount}</span></div>
                  </div>

                  {workOrderStatus !== 'Aprobado Autónomo SST' ? (
                    <button
                      type="button"
                      onClick={handleSstAuthorize}
                      className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 cursor-pointer active:scale-[0.99] transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>FIRMAR Y AUTORIZAR DIRECTAMENTE (COSTO &lt;= 1 SMMLV)</span>
                    </button>
                  ) : (
                    <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 space-y-2 text-xs">
                      <div className="flex items-center gap-2 font-bold text-emerald-300">
                        <CheckCircle2 className="w-4 h-4" />
                        ORDEN DE TRABAJO APROBADA POR SST
                      </div>
                      <div>
                        Orden de trabajo autorizada por el Especialista SST. Los fondos quedan reservados y se notifica al equipo de mantenimiento para su ejecución en planta.
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-600/30 text-amber-200 text-xs space-y-2">
                    <div className="font-bold flex items-center gap-1.5 text-amber-300">
                      <AlertTriangle className="w-4 h-4" />
                      Monto Superior a 1 SMMLV
                    </div>
                    <p>
                      El costo cotizado supera la atribución autónoma de SST. La solicitud debe ser aprobada por Gerencia General.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleEscalate}
                    className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-900/30 cursor-pointer active:scale-[0.99] transition-all"
                  >
                    <Send className="w-4 h-4" />
                    <span>DERIVAR SOLICITUD A GERENCIA GENERAL</span>
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
                <span className="font-mono text-xs text-sky-400">Representante Legal</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Solicitado por:</span>
                  <span className="text-white font-medium">Especialista SST</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Monto Requerido:</span>
                  <span className="font-mono text-amber-400 font-bold text-sm">{formattedAmount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Concepto Técnico:</span>
                  <span className="text-slate-200">{repairDescription}</span>
                </div>
              </div>

              {workOrderStatus === 'Escalado a Gerencia' || workOrderStatus === 'Pendiente SST' ? (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => handleManagerDecision('Aprobado Gerencia')}
                    className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 cursor-pointer transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Aprobar Partida</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleManagerDecision('Rechazado')}
                    className="py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-900/30 cursor-pointer transition-all"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Rechazar</span>
                  </button>
                </div>
              ) : workOrderStatus === 'Aprobado Gerencia' ? (
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 space-y-2 text-xs">
                  <div className="flex items-center gap-2 font-bold text-emerald-300">
                    <CheckCircle2 className="w-4 h-4" />
                    PARTIDA PRESUPUESTAL APROBADA POR GERENCIA GENERAL
                  </div>
                  <div>
                    Aprobación con firma electrónica y sellado de tiempo. Se habilita la orden de compra y se notifica al taller para inicio de obras.
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-200 space-y-2 text-xs">
                  <div className="flex items-center gap-2 font-bold text-rose-300">
                    <XCircle className="w-4 h-4" />
                    SOLICITUD DEVUELTA POR GERENCIA
                  </div>
                  <div>
                    Expediente devuelto al área de SST para cotización con proveedores alternativos.
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
