import React, { useState, useMemo } from 'react';
import { usePlant } from '../../context/PlantContext';
import { 
  Camera, 
  AlertOctagon, 
  ShieldAlert, 
  Clock, 
  CheckCircle, 
  FileWarning, 
  Sliders, 
  RefreshCw,
  Send,
  Building,
  CheckCircle2,
  HardDrive
} from 'lucide-react';
import { getSystemTimestamp } from '../../utils/dateUtils';

interface TriajeGtc45Props {
  onGoToPresupuesto?: () => void;
}

export const TriajeGtc45: React.FC<TriajeGtc45Props> = ({ onGoToPresupuesto }) => {
  const { incidents, selectedIncidentId, setSelectedIncidentId, updateGtc45Evaluation } = usePlant();

  const currentIncident = incidents.find(i => i.id === selectedIncidentId) || incidents[0];

  // GTC 45 Values
  const [nd, setNd] = useState<number>(currentIncident?.gtc45Evaluation?.nd ?? 10);
  const [ne, setNe] = useState<number>(currentIncident?.gtc45Evaluation?.ne ?? 3);
  const [nc, setNc] = useState<number>(currentIncident?.gtc45Evaluation?.nc ?? 100);

  const [hasPhoto, setHasPhoto] = useState<boolean>(true);
  const [isPhotoProcessing, setIsPhotoProcessing] = useState<boolean>(false);
  const [photoFilter, setPhotoFilter] = useState<'normal' | 'infrared'>('normal');
  const [evaluatorNotes, setEvaluatorNotes] = useState<string>(
    'Verificado en sitio: guarda mecánica de protección desprendida con exposición directa a atrapamiento de extremidades.'
  );

  // GTC 45 Math: NP = ND * NE; NR = NP * NC
  const np = useMemo(() => nd * ne, [nd, ne]);
  const nr = useMemo(() => np * nc, [np, nc]);

  // Assessment interpretation
  const riskAssessment = useMemo(() => {
    if (nr >= 600) {
      return {
        level: 'Nivel I (Crítico - No Aceptable)',
        color: 'text-rose-400',
        bg: 'bg-rose-500/10 border-rose-500/30',
        action: 'Situación crítica no mitigable en caliente. Detener labor de inmediato y emitir orden formal de detención de máquinas.',
        isCritical: true
      };
    } else if (nr >= 150) {
      return {
        level: 'Nivel II (Alto - Corregir y Adoptar Medidas)',
        color: 'text-amber-400',
        bg: 'bg-amber-500/10 border-amber-500/30',
        action: 'Adoptar medidas de control en plazo prioritario. Mantenimiento correctivo programado sin detención general.',
        isCritical: false
      };
    } else if (nr >= 40) {
      return {
        level: 'Nivel III (Medio - Mejorar Controles)',
        color: 'text-sky-400',
        bg: 'bg-sky-500/10 border-sky-500/30',
        action: 'Intervención con controles administrativos, rotulación y chequeos de rutina.',
        isCritical: false
      };
    } else {
      return {
        level: 'Nivel IV (Bajo - Riesgo Aceptable)',
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10 border-emerald-500/30',
        action: 'Riesgo aceptable con controles existentes operando con normalidad.',
        isCritical: false
      };
    }
  }, [nr]);

  const handleApplyEvaluation = () => {
    if (!currentIncident) return;

    const evaluatedAt = getSystemTimestamp();

    const isSuspended = riskAssessment.isCritical;
    const suspensionData = isSuspended ? {
      orderId: `ORD-SUSP-2026-${Math.floor(100 + Math.random() * 900)}`,
      issuedAt: evaluatedAt,
      digitalSignature: `SHA256:0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
      machineStopped: `${currentIncident.quadrantName} / Equipo crítico`
    } : undefined;

    updateGtc45Evaluation(currentIncident.id, {
      nd,
      ne,
      np,
      nc,
      nr,
      level: riskAssessment.level,
      evaluatedAt,
      evaluator: 'Carlos Mario Vélez (HSEQ Certificado)',
      suspensionOrder: suspensionData
    });
  };

  const handleCaptureNewPhoto = () => {
    setIsPhotoProcessing(true);
    setTimeout(() => {
      setIsPhotoProcessing(false);
      setHasPhoto(true);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Tablet Status Header */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center font-bold text-sm">
            Ex
          </div>
          <div>
            <div className="font-bold text-slate-100 flex items-center gap-2">
              <span>TABLET INDUSTRIAL ATEX / IP68 — SUPERVISIÓN HSEQ</span>
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px]">
                ZONA 1/21 SEGURA
              </span>
            </div>
            <div className="text-slate-400">
              Inspector: Carlos Mario Vélez · Base local sincronizada: <span className="font-mono text-emerald-400">SQLiteOfflineCache.db</span>
            </div>
          </div>
        </div>

        {/* Incident Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Reporte:</span>
          <select
            value={currentIncident?.id}
            onChange={(e) => {
              setSelectedIncidentId(e.target.value);
              const target = incidents.find(i => i.id === e.target.value);
              if (target?.gtc45Evaluation) {
                setNd(target.gtc45Evaluation.nd);
                setNe(target.gtc45Evaluation.ne);
                setNc(target.gtc45Evaluation.nc);
              }
            }}
            className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs font-mono text-sky-300 focus:outline-none focus:border-sky-500"
          >
            {incidents.map(inc => (
              <option key={inc.id} value={inc.id}>
                {inc.id} — {inc.title.slice(0, 36)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Incident Metadata Banner */}
      {currentIncident && (
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div>
            <div className="text-[11px] font-mono text-slate-400">
              Ubicación: <strong className="text-white">{currentIncident.quadrantName}</strong> ({currentIncident.area})
            </div>
            <div className="text-sm font-bold text-white mt-0.5">{currentIncident.title}</div>
            <div className="text-slate-400 mt-1 line-clamp-1">{currentIncident.description}</div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right font-mono">
              <div className="text-[10px] text-slate-400">Estado Actual:</div>
              <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                currentIncident.status === 'Suspendido'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : currentIncident.status === 'En Triaje'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
              }`}>
                {currentIncident.status}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Photo Evidence Viewport */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-sky-400" />
                EVIDENCIA FOTOGRÁFICA EN SITIO
              </span>
              <span className="font-mono text-[10px] text-emerald-400">WEBP COMPRIMIDO</span>
            </div>

            {/* Photo Viewport */}
            <div className={`relative rounded-xl overflow-hidden border border-slate-700 bg-slate-950 aspect-video flex flex-col items-center justify-center p-3 text-center transition-all ${
              photoFilter === 'infrared' ? 'filter saturate-150 contrast-125' : ''
            }`}>
              <div className="w-full h-full relative rounded-lg flex flex-col justify-between p-3 bg-gradient-to-br from-slate-900 to-slate-950">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-mono">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    CAM-ATEX #01
                  </div>
                  <div className="text-[10px] font-mono text-slate-300 bg-black/70 px-2 py-0.5 rounded">
                    {currentIncident?.reportedAt || '2026-10-28 08:32 UTC'}
                  </div>
                </div>

                <div className="my-auto flex flex-col items-center justify-center space-y-2">
                  <div className="p-3.5 rounded-full bg-rose-500/15 border border-rose-500/40 text-rose-400 shadow-lg shadow-rose-950">
                    <FileWarning className="w-8 h-8" />
                  </div>
                  <div className="text-xs font-semibold text-slate-200 max-w-xs">
                    {currentIncident?.title || 'Fuga y desprendimiento de guarda mecánica en máquina #4'}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {currentIncident?.quadrantName} · Sector A
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 bg-black/50 px-2.5 py-1 rounded">
                  <span>SHA256: 8f3c7b21e0a...</span>
                  <span className="text-emerald-400 font-medium">✓ Sello de Inspección</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={handleCaptureNewPhoto}
                className="text-xs text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isPhotoProcessing ? 'animate-spin' : ''}`} />
                <span>Capturar Nueva Toma</span>
              </button>

              <button 
                type="button"
                onClick={() => setPhotoFilter(f => f === 'normal' ? 'infrared' : 'normal')}
                className="text-xs text-slate-300 hover:text-white font-medium cursor-pointer"
              >
                {photoFilter === 'normal' ? 'Visor Térmico' : 'Modo Color'}
              </button>
            </div>
          </div>

          {/* Critical Timer Bar if NR >= 600 */}
          {riskAssessment.isCritical && (
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-600/40 space-y-2 text-rose-200">
              <div className="flex items-center justify-between text-xs font-bold text-rose-300">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-rose-400 animate-spin" />
                  TIEMPO LÍMITE DE ATENCIÓN URGENTE
                </span>
                <span className="font-mono text-sm">03h : 22m restantes</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div className="bg-rose-500 h-2 rounded-full w-[24%]" />
              </div>
              <div className="text-[11px] text-rose-300">
                La inspección y contención primaria en sitio deben completarse antes de vencer el plazo de 4 horas hábiles.
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Calculator Engine GTC 45 */}
        <div className="lg:col-span-7 space-y-5">
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-sky-400" />
                  Valoración de Riesgo: NR = (ND × NE) × NC
                </h3>
                <div className="text-xs text-slate-400">Metodología técnica de la Guía Técnica Colombiana GTC 45</div>
              </div>

              <div className="text-right">
                <div className="text-xs text-slate-400">Nivel de Riesgo (NR)</div>
                <div className={`text-2xl font-black font-mono ${riskAssessment.color}`}>
                  {nr}
                </div>
              </div>
            </div>

            {/* Slider 1: ND */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200">
                  Nivel de Deficiencia (ND): <span className="font-mono text-sky-300">{nd}</span>
                </span>
                <span className="text-slate-400">
                  {nd === 10 ? 'Muy Alto (10): Peligros significativos detectados' : nd === 6 ? 'Alto (6): Peligros moderados sin control' : nd === 2 ? 'Medio (2): Medidas parciales' : 'Bajo (0): Medidas operativas'}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { val: 10, label: 'Muy Alto (10)' },
                  { val: 6, label: 'Alto (6)' },
                  { val: 2, label: 'Medio (2)' },
                  { val: 0, label: 'Bajo (0)' }
                ].map(item => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => setNd(item.val)}
                    className={`py-2 px-1 text-xs rounded-lg border font-medium transition-all cursor-pointer ${
                      nd === item.val
                        ? 'bg-sky-500/20 border-sky-400 text-sky-200 font-bold'
                        : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Slider 2: NE */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200">
                  Nivel de Exposición (NE): <span className="font-mono text-sky-300">{ne}</span>
                </span>
                <span className="text-slate-400">
                  {ne === 4 ? 'Continua (4): Varias veces durante la jornada' : ne === 3 ? 'Frecuente (3): Una vez al día por periodos' : ne === 2 ? 'Ocasional (2): Alguna vez en la semana' : 'Esporádica (1): Irregular'}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { val: 4, label: 'Continua (4)' },
                  { val: 3, label: 'Frecuente (3)' },
                  { val: 2, label: 'Ocasional (2)' },
                  { val: 1, label: 'Esporádica (1)' }
                ].map(item => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => setNe(item.val)}
                    className={`py-2 px-1 text-xs rounded-lg border font-medium transition-all cursor-pointer ${
                      ne === item.val
                        ? 'bg-sky-500/20 border-sky-400 text-sky-200 font-bold'
                        : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Calculated NP */}
            <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
              <div className="text-slate-300">
                Nivel de Probabilidad: <span className="font-mono font-bold text-white">NP = ND ({nd}) × NE ({ne}) = {np}</span>
              </div>
              <div className="font-mono font-bold text-sky-400">
                {np >= 24 ? 'Muy Alto (40-24)' : np >= 10 ? 'Alto (20-10)' : np >= 6 ? 'Medio (8-6)' : 'Bajo (4-2)'}
              </div>
            </div>

            {/* Slider 3: NC */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200">
                  Nivel de Consecuencia (NC): <span className="font-mono text-sky-300">{nc}</span>
                </span>
                <span className="text-slate-400">
                  {nc === 100 ? 'Mortal / Catastrófico (100)' : nc === 60 ? 'Muy Grave / Incapacidad Permanente (60)' : nc === 25 ? 'Grave / Incapacidad Temporal (25)' : 'Leve / Sin Incapacidad (10)'}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { val: 100, label: 'Mortal (100)' },
                  { val: 60, label: 'Muy Grave (60)' },
                  { val: 25, label: 'Grave (25)' },
                  { val: 10, label: 'Leve (10)' }
                ].map(item => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => setNc(item.val)}
                    className={`py-2 px-1 text-xs rounded-lg border font-medium transition-all cursor-pointer ${
                      nc === item.val
                        ? 'bg-sky-500/20 border-sky-400 text-sky-200 font-bold'
                        : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Evaluation Result Box */}
            <div className={`p-4 rounded-xl border ${riskAssessment.bg} space-y-1`}>
              <div className="flex items-center justify-between">
                <span className={`text-sm font-extrabold ${riskAssessment.color}`}>
                  {riskAssessment.level}
                </span>
                <span className="font-mono text-xs text-slate-300">
                  Cálculo: {np} × {nc} = <strong className="text-white">{nr}</strong>
                </span>
              </div>
              <p className="text-xs text-slate-300">{riskAssessment.action}</p>
            </div>

            {/* Actions: Save Assessment & Suspension Order */}
            <div className="pt-2 space-y-3">
              {riskAssessment.isCritical ? (
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={handleApplyEvaluation}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-900/40 cursor-pointer active:scale-[0.99] transition-all"
                  >
                    <AlertOctagon className="w-5 h-5 animate-bounce" />
                    <span>APLICAR TRIAJE Y EMITIR ORDEN DE DETENCIÓN DE MÁQUINAS</span>
                  </button>

                  {currentIncident?.gtc45Evaluation?.suspensionOrder && (
                    <div className="p-4 rounded-xl bg-red-950/70 border border-red-500 text-red-200 space-y-2">
                      <div className="flex items-center gap-2 font-bold text-sm text-red-300">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        ORDEN DE DETENCIÓN {currentIncident.gtc45Evaluation.suspensionOrder.orderId} ACTIVA
                      </div>
                      <div className="text-xs text-red-200 leading-relaxed">
                        Las máquinas asociadas en {currentIncident.quadrantName} han quedado bloqueadas formalmente en el sistema. Se ha notificado al jefe de planta y se ha generado una orden de reparación para cotización presupuestal.
                      </div>
                      {onGoToPresupuesto && (
                        <button
                          type="button"
                          onClick={onGoToPresupuesto}
                          className="mt-2 px-3 py-1.5 rounded-lg bg-red-800 hover:bg-red-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <Building className="w-3.5 h-3.5" />
                          <span>Ver Orden de Presupuesto Asociada &rarr;</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleApplyEvaluation}
                  className="w-full py-3.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>REGISTRAR EVALUACIÓN Y CONTINUAR LABORES</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
