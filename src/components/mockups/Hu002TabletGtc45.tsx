import React, { useState, useMemo } from 'react';
import { 
  Camera, 
  AlertOctagon, 
  ShieldAlert, 
  Clock, 
  CheckCircle, 
  FileWarning, 
  Flame, 
  Sliders, 
  Info,
  Maximize2,
  RefreshCw,
  FileText
} from 'lucide-react';

export const Hu002TabletGtc45: React.FC = () => {
  // GTC 45 Parameters
  const [nd, setNd] = useState<number>(10); // 10, 6, 2, 0
  const [ne, setNe] = useState<number>(3);  // 4, 3, 2, 1
  const [nc, setNc] = useState<number>(100); // 100, 60, 25, 10

  const [hasPhotoEvidence, setHasPhotoEvidence] = useState<boolean>(true);
  const [isSuspensionEmitted, setIsSuspensionEmitted] = useState<boolean>(false);
  const [photoFilter, setPhotoFilter] = useState<'normal' | 'infrared'>('normal');

  // GTC 45 Math: NP = ND * NE; NR = NP * NC
  const np = useMemo(() => nd * ne, [nd, ne]);
  const nr = useMemo(() => np * nc, [np, nc]);

  // Risk Classification
  const riskAssessment = useMemo(() => {
    if (nr >= 600) {
      return {
        level: 'Nivel I (Crítico - No Aceptable)',
        color: 'text-rose-400',
        bg: 'bg-rose-500/10 border-rose-500/30',
        action: 'Situación crítica no mitigable en caliente. Detener faena y emitir orden inmediata de detención de máquinas.',
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

  const handleEmitSuspension = () => {
    setIsSuspensionEmitted(true);
  };

  const handlePresetCritical = () => {
    setNd(10);
    setNe(3);
    setNc(100);
    setIsSuspensionEmitted(false);
  };

  const handlePresetModerate = () => {
    setNd(2);
    setNe(2);
    setNc(25);
    setIsSuspensionEmitted(false);
  };

  return (
    <div className="space-y-6">
      {/* Tablet ATEX Status Header */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center font-bold">
            Ex
          </div>
          <div>
            <div className="font-bold text-slate-100 flex items-center gap-2">
              DISPOSITIVO MÓVIL HSEQ — ZONA INDUSTRIAL
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px]">CERTIFICADO ATEX</span>
            </div>
            <div className="text-slate-400">Supervisor: Carlos Mario Vélez · Expediente activo: <span className="font-mono text-sky-400">RAD-2026-088192</span></div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-800 text-slate-300 font-mono">
            <Clock className="w-3.5 h-3.5 text-sky-400" />
            <span>Plazo de Triaje: &lt;= 4 Horas</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePresetCritical}
              className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-medium hover:bg-rose-500/30 transition-colors"
            >
              Condición Crítica
            </button>
            <button
              type="button"
              onClick={handlePresetModerate}
              className="px-2.5 py-1 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30 font-medium hover:bg-sky-500/30 transition-colors"
            >
              Condición Moderada
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Photo Evidence */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-sky-400" />
                EVIDENCIA FOTOGRÁFICA EN SITIO
              </span>
              <span className="font-mono text-[10px] text-emerald-400">ARCHIVO PROCESADO</span>
            </div>

            {/* Photo Viewport Simulation */}
            <div className="relative rounded-lg overflow-hidden border border-slate-700 bg-slate-950 aspect-video flex flex-col items-center justify-center p-3 text-center">
              <div className="w-full h-full relative rounded flex flex-col justify-between p-3 bg-gradient-to-br from-slate-900 to-slate-950">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-mono">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    CAM-01 / HD
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 bg-black/60 px-2 py-0.5 rounded">
                    2026-10-28 14:32:05 UTC
                  </div>
                </div>

                <div className="my-auto flex flex-col items-center justify-center space-y-2">
                  <div className="p-3 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400">
                    <FileWarning className="w-8 h-8" />
                  </div>
                  <div className="text-xs font-semibold text-slate-200">
                    Fuga de aceite y ausencia de guarda mecánica en rodillo triturador
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Cuadrante Q-A1 · Nave Prensas y Troquelado
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 bg-black/40 px-2 py-1 rounded">
                  <span>Hash Inmutable: 8f3c7b21e0a...</span>
                  <span className="text-emerald-400">✓ Asociado al expediente</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Cámara industrial integrada</span>
              <button 
                type="button"
                onClick={() => setPhotoFilter(f => f === 'normal' ? 'infrared' : 'normal')}
                className="text-xs text-sky-400 hover:text-sky-300 font-medium"
              >
                {photoFilter === 'normal' ? 'Activar Visor Termográfico' : 'Volver a Color'}
              </button>
            </div>
          </div>

          {/* Critical Timer Bar if NR >= 600 */}
          {riskAssessment.isCritical && (
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-600/40 space-y-2 text-rose-200">
              <div className="flex items-center justify-between text-xs font-bold text-rose-300">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-rose-400 animate-spin" />
                  TEMPORIZADOR DE ATENCIÓN URGENTE EN SITIO
                </span>
                <span className="font-mono text-sm">03h : 42m : 18s restantes</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div className="bg-rose-500 h-2 rounded-full w-[15%]" />
              </div>
              <div className="text-[11px] text-rose-300">
                La inspección y contención primaria deben ejecutarse antes del vencimiento para evitar incidentes graves.
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Interactive GTC 45 Risk Calculator Engine */}
        <div className="lg:col-span-7 space-y-5">
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-sky-400" />
                  Evaluación de Riesgo GTC 45: NR = (ND × NE) × NC
                </h3>
                <div className="text-xs text-slate-400">Metodología técnica de identificación de peligros y valoración de riesgos</div>
              </div>

              <div className="text-right">
                <div className="text-xs text-slate-400">Nivel de Riesgo (NR)</div>
                <div className={`text-2xl font-black font-mono ${riskAssessment.color}`}>
                  {nr}
                </div>
              </div>
            </div>

            {/* Slider 1: ND (Nivel de Deficiencia) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200">
                  Nivel de Deficiencia (ND): <span className="font-mono text-sky-300">{nd}</span>
                </span>
                <span className="text-slate-400">
                  {nd === 10 ? 'Muy Alto (10): Peligros significativos detectados' : nd === 6 ? 'Alto (6): Peligros moderados sin control' : nd === 2 ? 'Medio (2): Peligros con medidas parciales' : 'Bajo (0): Medidas operativas'}
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
                    className={`py-2 px-1 text-xs rounded-lg border font-medium transition-all ${
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

            {/* Slider 2: NE (Nivel de Exposición) */}
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
                    className={`py-2 px-1 text-xs rounded-lg border font-medium transition-all ${
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

            {/* Calculated NP Callout */}
            <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
              <div className="text-slate-300">
                Nivel de Probabilidad: <span className="font-mono font-bold text-white">NP = ND ({nd}) × NE ({ne}) = {np}</span>
              </div>
              <div className="font-mono font-bold text-sky-400">
                {np >= 24 ? 'Muy Alto (40-24)' : np >= 10 ? 'Alto (20-10)' : np >= 6 ? 'Medio (8-6)' : 'Bajo (4-2)'}
              </div>
            </div>

            {/* Slider 3: NC (Nivel de Consecuencia) */}
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
                    className={`py-2 px-1 text-xs rounded-lg border font-medium transition-all ${
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

            {/* Interpretation Badge */}
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

            {/* Critical Trigger: Labor Suspension */}
            {riskAssessment.isCritical ? (
              <div className="pt-2 space-y-3">
                {!isSuspensionEmitted ? (
                  <button
                    type="button"
                    onClick={handleEmitSuspension}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-900/40 cursor-pointer active:scale-[0.99] transition-all"
                  >
                    <AlertOctagon className="w-5 h-5 animate-bounce" />
                    <span>EMITIR ORDEN INMEDIATA DE SUSPENSIÓN DE LABORES Y DETENCIÓN DE MÁQUINAS</span>
                  </button>
                ) : (
                  <div className="p-4 rounded-xl bg-red-950/60 border border-red-500 text-red-200 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-sm text-red-300">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      ORDEN DE DETENCIÓN DE MÁQUINAS EMITIDA CON FIRMA DIGITAL
                    </div>
                    <div className="text-xs text-red-200 leading-relaxed">
                      Orden #ORD-SUSP-2026-049 notificada inmediatamente a los tableros del operario, supervisor de planta y jefe de producción. Las máquinas de la línea permanecerán desenergizadas y bloqueadas (LOTO) hasta su subsanación técnica formal.
                    </div>
                    <div className="text-[11px] font-mono text-slate-400">
                      Hash criptográfico: 0x9a84f3...c82 · Sello digital registrado
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>Nivel de riesgo aceptable con controles operando. Se deriva automáticamente a orden de mantenimiento preventivo ordinario.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
