import React, { useState } from 'react';
import { usePlant } from '../../context/PlantContext';
import { 
  HardHat, 
  ShieldCheck, 
  ShieldX, 
  Barcode, 
  UserCheck, 
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const ControlAlturasEPP: React.FC = () => {
  const { workers, assignEPPToWorker } = usePlant();

  const [selectedWorkerId, setSelectedWorkerId] = useState<string>('W-01');
  const [selectedEppId, setSelectedEppId] = useState<string>('ARN-01');
  const [actionFeedback, setActionFeedback] = useState<{
    success: boolean;
    message: string;
    serial?: string;
  } | null>(null);

  const currentWorker = workers.find(w => w.id === selectedWorkerId) || workers[0];

  const serializedCatalog = [
    { id: 'ARN-01', name: 'Arnés Multipropósito Dieléctrico de 4 Argollas', serial: 'SER-ARN-2026-0941', category: 'Categoría III (Trabajo en Alturas)', inspectionDue: '2026-12-01' },
    { id: 'ESL-02', name: 'Eslinga Doble en Y con Absorbedor de Choque', serial: 'SER-ESL-2026-1188', category: 'Categoría III (Detención de Caídas)', inspectionDue: '2026-12-01' },
    { id: 'LVV-03', name: 'Línea de Vida Vertical con Freno Arrestador', serial: 'SER-LVV-2026-4412', category: 'Categoría III (Líneas de Vida)', inspectionDue: '2026-11-15' },
    { id: 'CAS-04', name: 'Casco de Seguridad con Barbuquejo de 3 Puntos', serial: 'SER-CAS-2026-5510', category: 'Categoría II (Protección Craneal)', inspectionDue: '2027-01-10' }
  ];

  const selectedItem = serializedCatalog.find(i => i.id === selectedEppId) || serializedCatalog[0];

  const handleDispatchGear = () => {
    if (currentWorker.certStatus === 'VENCIDO') {
      setActionFeedback({
        success: false,
        message: `Entrega bloqueada: ${currentWorker.name} tiene el curso de trabajo en alturas VENCIDO desde el ${currentWorker.certExpDate}. Se prohíbe el despacho de equipos de Categoría III bajo la Resolución 4272.`
      });
      return;
    }

    const assigned = assignEPPToWorker(currentWorker.id, {
      name: selectedItem.name,
      serial: selectedItem.serial
    });

    if (assigned) {
      setActionFeedback({
        success: true,
        message: `Equipo ${selectedItem.name} asignado formalmente a ${currentWorker.name}. Queda registrado en su hoja de vida técnica de dotación.`,
        serial: selectedItem.serial
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <HardHat className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-amber-400 tracking-wider">GESTIÓN DE ALMACÉN TÉCNICO Y TRABAJO EN ALTURAS</div>
            <div className="text-sm font-bold text-white">Validación de Certificación de Alturas y Despacho Serializado de Equipos</div>
            <div className="text-xs text-slate-400">Verificación estricta de vigencia del curso bajo la Resolución 4272 de 2021</div>
          </div>
        </div>

        {/* Quick filter by status */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Selección rápida:</span>
          <button
            type="button"
            onClick={() => { setSelectedWorkerId('W-01'); setActionFeedback(null); }}
            className={`px-2.5 py-1 rounded-lg border font-medium cursor-pointer transition-colors ${
              selectedWorkerId === 'W-01' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            Trabajador Apto
          </button>
          <button
            type="button"
            onClick={() => { setSelectedWorkerId('W-02'); setActionFeedback(null); }}
            className={`px-2.5 py-1 rounded-lg border font-medium cursor-pointer transition-colors ${
              selectedWorkerId === 'W-02' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            Trabajador Vencido
          </button>
          <button
            type="button"
            onClick={() => { setSelectedWorkerId('W-03'); setActionFeedback(null); }}
            className={`px-2.5 py-1 rounded-lg border font-medium cursor-pointer transition-colors ${
              selectedWorkerId === 'W-03' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            Por Vencer (18d)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Worker Selector & Profile */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-sky-400" />
                1. PERSONAL SOLICITANTE DE EQUIPOS
              </span>
              <span className="text-[10px] font-mono text-slate-400">{workers.length} OPERARIOS ACTIVOS</span>
            </div>

            {/* Workers List */}
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {workers.map((worker) => {
                const isSelected = selectedWorkerId === worker.id;
                return (
                  <button
                    key={worker.id}
                    type="button"
                    onClick={() => { setSelectedWorkerId(worker.id); setActionFeedback(null); }}
                    className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-sky-500/15 border-sky-400 text-white shadow-md ring-1 ring-sky-400'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-sm text-white">{worker.name}</div>
                      <div className="text-xs text-slate-400">{worker.cargo} · CC {worker.cedula}</div>
                    </div>

                    <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-md border ${
                      worker.certStatus === 'ACTIVO'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : worker.certStatus === 'VENCIDO'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    }`}>
                      {worker.certStatus === 'ACTIVO' ? 'ACTIVO' : worker.certStatus === 'VENCIDO' ? 'VENCIDO' : 'POR VENCER'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active Worker Profile */}
            {currentWorker && (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Certificación de Alturas:</span>
                  <span className="font-mono text-white font-semibold">{currentWorker.certNumber}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Entidad de Capacitación:</span>
                  <span className="text-slate-200">{currentWorker.trainingCenter}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Fecha de Expiración del Curso:</span>
                  <span className="font-mono font-bold text-white">{currentWorker.certExpDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Condición Operativa:</span>
                  <span className={`font-bold ${
                    currentWorker.certStatus === 'ACTIVO' ? 'text-emerald-400' : currentWorker.certStatus === 'VENCIDO' ? 'text-rose-400' : 'text-amber-400'
                  }`}>
                    {currentWorker.certStatus === 'ACTIVO' 
                      ? 'APTO PARA LABORES EN ALTURAS' 
                      : currentWorker.certStatus === 'VENCIDO' 
                      ? 'BLOQUEADO — CURSO EXPIRADO' 
                      : 'ALERTA PREVENTIVA — RENOVAR PRONTO'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Serialized EPP Catalog & Dispatching */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Barcode className="w-4 h-4 text-amber-400" />
                2. INVENTARIO SERIALIZADO DE EQUIPOS
              </span>
              <span className="text-[10px] font-mono text-emerald-400">DISPONIBLE EN PAÑOL</span>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-400">Seleccione el equipo crítico a entregar:</label>
              <div className="space-y-2">
                {serializedCatalog.map((item) => {
                  const isSelected = selectedEppId === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => { setSelectedEppId(item.id); setActionFeedback(null); }}
                      className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-400 text-white shadow-md'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm text-white">{item.name}</span>
                        <span className="font-mono text-xs text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                          {item.serial}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-400 mt-1">
                        <span>{item.category}</span>
                        <span>Próx. Inspección: {item.inspectionDue}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dispatch Action */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleDispatchGear}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-900/30 cursor-pointer active:scale-[0.99] transition-all"
              >
                <span>VALIDAR APTITUD Y AUTORIZAR DESPACHO</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Feedback Message */}
            {actionFeedback && (
              <div className={`p-4 rounded-xl border space-y-1.5 ${
                actionFeedback.success 
                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200' 
                  : 'bg-rose-950/70 border-rose-500 text-rose-200'
              }`}>
                <div className="flex items-center gap-2 font-bold text-sm">
                  {actionFeedback.success ? (
                    <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                  ) : (
                    <ShieldX className="w-5 h-5 text-rose-400 shrink-0" />
                  )}
                  <span>{actionFeedback.success ? 'DESPACHO COMPLETADO EXITOSAMENTE' : 'DESPACHO BLOQUEADO POR SEGURIDAD'}</span>
                </div>
                <p className="text-xs leading-relaxed">{actionFeedback.message}</p>
                {actionFeedback.serial && (
                  <div className="text-[11px] font-mono text-emerald-300 bg-emerald-900/40 p-2 rounded">
                    ✓ Serial vinculado: {actionFeedback.serial} · Registrado en bitácora de pañol
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Currently Assigned Gear to Worker */}
      {currentWorker && (
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span>EQUIPOS ACTUALMENTE ASIGNADOS A {currentWorker.name.toUpperCase()} ({currentWorker.assignedGear.length})</span>
            <span className="font-mono text-slate-400">CC {currentWorker.cedula}</span>
          </div>

          {currentWorker.assignedGear.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {currentWorker.assignedGear.map((gear) => (
                <div key={gear.id} className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1 font-mono">
                  <div className="text-white font-sans font-semibold">{gear.name}</div>
                  <div className="text-amber-400 font-bold">Serial: {gear.serial}</div>
                  <div className="text-slate-400 text-[11px] font-sans flex items-center justify-between pt-1 border-t border-slate-800/80">
                    <span>Entregado: {gear.assignedAt}</span>
                    <span className="text-sky-300">Inspección: {gear.inspectionDue}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-slate-500 py-2">
              No tiene equipos de trabajo en alturas registrados a la fecha.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
