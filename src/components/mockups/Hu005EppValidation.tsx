import React, { useState } from 'react';
import { 
  HardHat, 
  ShieldCheck, 
  ShieldX, 
  Barcode, 
  UserCheck, 
  ArrowRight
} from 'lucide-react';

interface Worker {
  id: string;
  name: string;
  cedula: string;
  cargo: string;
  certStatus: 'ACTIVO' | 'VENCIDO' | 'PROXIMO_VENCER';
  certExpDate: string;
  daysRemaining: number;
  certNumber: string;
  trainingCenter: string;
}

const WORKERS_CATALOG: Worker[] = [
  {
    id: 'W-01',
    name: 'Juan Andrés Cataño Suárez',
    cedula: '1.036.782.110',
    cargo: 'Técnico de Mantenimiento Mecánico',
    certStatus: 'ACTIVO',
    certExpDate: '2027-04-18',
    daysRemaining: 540,
    certNumber: 'RES4272-SENA-2024-88419',
    trainingCenter: 'SENA Centro Metalmecánico'
  },
  {
    id: 'W-02',
    name: 'Pedro Luis Restrepo Zapata',
    cedula: '71.289.441',
    cargo: 'Operario de Montaje Estructural',
    certStatus: 'VENCIDO',
    certExpDate: '2026-08-15',
    daysRemaining: -71,
    certNumber: 'RES4272-COL-2023-11029',
    trainingCenter: 'Centro de Formación ARL Sura'
  },
  {
    id: 'W-03',
    name: 'Camilo Andrés Rúa Gil',
    cedula: '1.017.654.332',
    cargo: 'Instalador de Líneas Eléctricas',
    certStatus: 'PROXIMO_VENCER',
    certExpDate: '2026-11-12',
    daysRemaining: 15,
    certNumber: 'RES4272-SENA-2024-33291',
    trainingCenter: 'SENA Centro de la Construcción'
  }
];

export const Hu005EppValidation: React.FC = () => {
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>('W-01');
  const [selectedEpp, setSelectedEpp] = useState<string>('ARN-01');
  const [validationAttempted, setValidationAttempted] = useState<boolean>(false);
  const [assignedLog, setAssignedLog] = useState<any[]>([
    {
      worker: 'Carlos Alberto Muñoz',
      cedula: '98.541.220',
      epp: 'Arnés Multipropósito Dieléctrico de 4 Argollas',
      serial: 'SER-ARN-2026-0820',
      timestamp: '07:15 AM',
      status: 'AUTORIZADO',
      res4272: 'RES4272-SENA-2024-11044'
    }
  ]);

  const currentWorker = WORKERS_CATALOG.find(w => w.id === selectedWorkerId)!;

  const serializedEppList = [
    { id: 'ARN-01', name: 'Arnés Multipropósito Dieléctrico de 4 Argollas', serial: 'SER-ARN-2026-0941', category: 'Categoría III (Trabajo en Alturas)', inspectionDate: '2026-10-01' },
    { id: 'ESL-02', name: 'Eslinga Doble en "Y" con Absorbedor de Choque', serial: 'SER-ESL-2026-1188', category: 'Categoría III (Detención de Caídas)', inspectionDate: '2026-10-01' },
    { id: 'LVV-03', name: 'Línea de Vida Vertical con Freno Arrestador', serial: 'SER-LVV-2026-4412', category: 'Categoría III (Líneas de Vida)', inspectionDate: '2026-09-20' },
  ];

  const currentEppItem = serializedEppList.find(e => e.id === selectedEpp)!;

  const handleValidateAssignment = () => {
    setValidationAttempted(true);
    if (currentWorker.certStatus === 'ACTIVO' || currentWorker.certStatus === 'PROXIMO_VENCER') {
      const newEntry = {
        worker: currentWorker.name,
        cedula: currentWorker.cedula,
        epp: currentEppItem.name,
        serial: currentEppItem.serial,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'AUTORIZADO',
        res4272: currentWorker.certNumber
      };
      setAssignedLog(prev => [newEntry, ...prev]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner - Res. 4272 */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <HardHat className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-amber-400 tracking-wider">CONTROL DE ALMACÉN TÉCNICO Y TRABAJO EN ALTURAS</div>
            <div className="text-sm font-bold text-white">Validación de Certificación de Alturas y Entrega de Equipos Categoría III</div>
            <div className="text-xs text-slate-400">Verificación estricta de vigencia del curso bajo la Resolución 4272 de 2021</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => { setSelectedWorkerId('W-01'); setValidationAttempted(false); }}
            className={`px-2.5 py-1 text-xs rounded-lg border font-medium transition-colors ${
              selectedWorkerId === 'W-01' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            Trabajador Apto
          </button>
          <button
            type="button"
            onClick={() => { setSelectedWorkerId('W-02'); setValidationAttempted(false); }}
            className={`px-2.5 py-1 text-xs rounded-lg border font-medium transition-colors ${
              selectedWorkerId === 'W-02' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            Trabajador Vencido
          </button>
          <button
            type="button"
            onClick={() => { setSelectedWorkerId('W-03'); setValidationAttempted(false); }}
            className={`px-2.5 py-1 text-xs rounded-lg border font-medium transition-colors ${
              selectedWorkerId === 'W-03' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            Alerta Vencimiento Próximo
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Worker Certificate Verification */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-sky-400" />
                1. IDENTIFICACIÓN DEL TRABAJADOR SOLICITANTE
              </span>
              <span className="text-[10px] font-mono text-slate-400">BASE DE DATOS ACTIVA</span>
            </div>

            {/* Worker Selector */}
            <div className="space-y-2">
              <label className="text-xs text-slate-400">Seleccione el trabajador:</label>
              <div className="space-y-2">
                {WORKERS_CATALOG.map((worker) => {
                  const isSelected = selectedWorkerId === worker.id;
                  return (
                    <button
                      key={worker.id}
                      type="button"
                      onClick={() => { setSelectedWorkerId(worker.id); setValidationAttempted(false); }}
                      className={`w-full p-3 rounded-lg border text-left transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-sky-500/15 border-sky-400 text-white shadow-md'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-sm text-white">{worker.name}</div>
                        <div className="text-xs text-slate-400">{worker.cargo} · CC {worker.cedula}</div>
                      </div>

                      <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-md ${
                        worker.certStatus === 'ACTIVO'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : worker.certStatus === 'VENCIDO'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {worker.certStatus === 'ACTIVO' ? 'ACTIVO' : worker.certStatus === 'VENCIDO' ? 'VENCIDO' : 'POR VENCER'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Current Worker Profile Data Card */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Número de Certificación:</span>
                <span className="font-mono text-white font-semibold">{currentWorker.certNumber}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Centro de Entrenamiento Avalado:</span>
                <span className="text-slate-200">{currentWorker.trainingCenter}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Fecha de Expiración del Curso:</span>
                <span className="font-mono font-bold text-white">{currentWorker.certExpDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Estado de Aptitud en Alturas:</span>
                <span className={`font-bold ${
                  currentWorker.certStatus === 'ACTIVO' ? 'text-emerald-400' : currentWorker.certStatus === 'VENCIDO' ? 'text-rose-400' : 'text-amber-400'
                }`}>
                  {currentWorker.certStatus === 'ACTIVO' 
                    ? 'APTO PARA LABORES EN ALTURAS' 
                    : currentWorker.certStatus === 'VENCIDO' 
                    ? 'NO APTO — CERTIFICACIÓN VENCIDA' 
                    : 'ALERTA PREVENTIVA — RENOVAR EN 18 DÍAS'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Serialized EPP Selection & Dispatch Gate */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Barcode className="w-4 h-4 text-amber-400" />
                2. INVENTARIO SERIALIZADO DE EQUIPOS DE PROTECCIÓN
              </span>
              <span className="text-[10px] font-mono text-emerald-400">DISPONIBLE</span>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-400">Seleccione el equipo a despachar:</label>
              <div className="space-y-2">
                {serializedEppList.map((epp) => {
                  const isSelected = selectedEpp === epp.id;
                  return (
                    <button
                      key={epp.id}
                      type="button"
                      onClick={() => { setSelectedEpp(epp.id); setValidationAttempted(false); }}
                      className={`w-full p-3 rounded-lg border text-left transition-all ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-400 text-white'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm text-white">{epp.name}</span>
                        <span className="font-mono text-xs text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                          {epp.serial}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-400 mt-1">
                        <span>{epp.category}</span>
                        <span>Última inspección: {epp.inspectionDate}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Validation Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleValidateAssignment}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-900/30 cursor-pointer active:scale-[0.99] transition-all"
              >
                <span>VALIDAR APTITUD Y AUTORIZAR ENTREGA</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Operational Results */}
            {validationAttempted && (
              <div className="pt-2">
                {currentWorker.certStatus === 'VENCIDO' ? (
                  <div className="p-4 rounded-xl bg-rose-950/70 border border-rose-500 text-rose-200 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-sm text-rose-300">
                      <ShieldX className="w-5 h-5 text-rose-400 shrink-0" />
                      ENTREGA BLOQUEADA AUTOMÁTICAMENTE
                    </div>
                    <p className="text-xs leading-relaxed text-rose-200">
                      El trabajador <strong className="text-white">{currentWorker.name}</strong> tiene su curso de alturas vencido desde el {currentWorker.certExpDate}. El sistema impide la entrega de equipos de protección contra caídas hasta que se cargue la renovación de la certificación.
                    </p>
                    <div className="text-[11px] font-mono text-rose-300 bg-rose-900/40 p-2 rounded">
                      ✓ Notificación automática enviada a la coordinación de capacitación de la empresa.
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-500 text-emerald-200 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-sm text-emerald-300">
                      <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                      ENTREGA AUTORIZADA Y ASIGNACIÓN COMPLETADA
                    </div>
                    <p className="text-xs leading-relaxed text-emerald-200">
                      Certificación vigente verificada. Se asigna formalmente el equipo <strong className="text-white">{currentEppItem.name}</strong> con número de serie <strong className="font-mono text-emerald-300">{currentEppItem.serial}</strong> a la hoja de vida de <strong className="text-white">{currentWorker.name}</strong>.
                    </p>
                    <div className="text-[11px] font-mono text-emerald-300 bg-emerald-900/40 p-2 rounded">
                      ✓ Registro inmutable guardado en la bitácora del pañol
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      {assignedLog.length > 0 && (
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Bitácora de Asignaciones y Control de Equipos
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-500">
                <tr>
                  <th className="py-2">Hora</th>
                  <th>Trabajador</th>
                  <th>Cédula</th>
                  <th>Equipo Despachado</th>
                  <th>Serial Asignado</th>
                  <th>Certificación Res. 4272</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                {assignedLog.map((log, idx) => (
                  <tr key={idx}>
                    <td className="py-2 text-slate-400">{log.timestamp}</td>
                    <td className="font-sans font-medium text-white">{log.worker}</td>
                    <td>{log.cedula}</td>
                    <td className="font-sans">{log.epp}</td>
                    <td className="text-amber-400">{log.serial}</td>
                    <td className="text-sky-400">{log.res4272}</td>
                    <td className="text-emerald-400 font-semibold">{log.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
