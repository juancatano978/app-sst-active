import React, { useState } from 'react';
import { 
  EyeOff, 
  Eye, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  Layers, 
  ArrowRight
} from 'lucide-react';

export const Hu003AnonymousReport: React.FC = () => {
  const [isAnonymous, setIsAnonymous] = useState<boolean>(true);
  const [selectedArea, setSelectedArea] = useState<string>('Bodega Principal');
  const [incidentType, setIncidentType] = useState<string>('Casi caída de carga suspendida');
  const [incidentDetail, setIncidentDetail] = useState<string>(
    'Estiba con bobinas de acero osciló a 3 metros sobre el pasillo peatonal al romperse una de las eslingas de sujeción. No hubo lesionados pero los operarios tuvieron que correr.'
  );
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [nearMissCount, setNearMissCount] = useState<number>(589);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNearMissCount(prev => prev + 1);
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner - Ley 1581 Habeas Data */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-purple-400 tracking-wider">BUZÓN CONFIDENCIAL DE CASI-ACCIDENTES</div>
            <div className="text-sm font-bold text-white">Canal de Reporte Seguro para Operarios y Personal de Planta</div>
            <div className="text-xs text-slate-400">Garantía de confidencialidad bajo la Ley Estatutaria de Protección de Datos (Ley 1581)</div>
          </div>
        </div>

        {/* Big Interactive Toggle Switch */}
        <div className="flex items-center gap-3 bg-slate-950 p-2 rounded-xl border border-slate-800">
          <span className="text-xs font-semibold text-slate-300">
            {isAnonymous ? 'Modo Anónimo Activado' : 'Reporte Identificado'}
          </span>
          <button
            type="button"
            onClick={() => setIsAnonymous(!isAnonymous)}
            className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              isAnonymous ? 'bg-purple-600' : 'bg-slate-700'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out flex items-center justify-center ${
                isAnonymous ? 'translate-x-7' : 'translate-x-0'
              }`}
            >
              {isAnonymous ? <EyeOff className="w-3.5 h-3.5 text-purple-600" /> : <Eye className="w-3.5 h-3.5 text-slate-700" />}
            </span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form & Identity Decoupler Inspector */}
        <div className="lg:col-span-7 space-y-5">
          {/* Identity Decoupling Inspector */}
          <div className={`p-4 rounded-xl border transition-all ${
            isAnonymous 
              ? 'bg-purple-950/20 border-purple-500/40' 
              : 'bg-slate-900 border-slate-800'
          }`}>
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="font-bold flex items-center gap-1.5 text-slate-200">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                PROTECCIÓN ACTIVA DE PRIVACIDAD
              </span>
              <span className={`font-mono text-[10px] px-2 py-0.5 rounded ${
                isAnonymous ? 'bg-purple-500/20 text-purple-300' : 'bg-slate-800 text-slate-400'
              }`}>
                {isAnonymous ? 'CIFRADO ACTIVO' : 'MODO TRAZABLE'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              <div className="p-2 rounded bg-slate-950/80 border border-slate-800/80">
                <div className="text-[10px] text-slate-500">IDENTIFICACIÓN</div>
                <div className={`font-semibold ${isAnonymous ? 'text-purple-400' : 'text-slate-200'}`}>
                  {isAnonymous ? 'SUPRIMIDA' : '1.036.782.110'}
                </div>
              </div>

              <div className="p-2 rounded bg-slate-950/80 border border-slate-800/80">
                <div className="text-[10px] text-slate-500">ID DE USUARIO</div>
                <div className={`font-semibold ${isAnonymous ? 'text-purple-400' : 'text-slate-200'}`}>
                  {isAnonymous ? 'NULL' : 'usr_883921'}
                </div>
              </div>

              <div className="p-2 rounded bg-slate-950/80 border border-slate-800/80">
                <div className="text-[10px] text-slate-500">DIRECCIÓN DE RED</div>
                <div className={`font-semibold ${isAnonymous ? 'text-purple-400' : 'text-slate-200'}`}>
                  {isAnonymous ? 'ENMASCARADA' : '10.0.4.18'}
                </div>
              </div>

              <div className="p-2 rounded bg-slate-950/80 border border-slate-800/80">
                <div className="text-[10px] text-slate-500">TOKEN DE SEGURIDAD</div>
                <div className="text-slate-300 truncate">
                  {isAnonymous ? 'tok_aes256_9b..' : 'N/A'}
                </div>
              </div>
            </div>
            {isAnonymous && (
              <p className="text-[11px] text-purple-300/80 mt-2">
                ✓ Conforme a la política de protección de datos, no se almacena ningún dato vinculante a la persona. La gerencia recibe la información de manera consolidada por área.
              </p>
            )}
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="text-sm font-bold text-white">Registro de Casi-Accidente o Incidente sin Lesión</div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Ubicación del Suceso</label>
                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-purple-500"
                >
                  <option value="Bodega Principal">Bodega Principal y Almacén de Carga</option>
                  <option value="Muelle de Despacho">Muelle de Despacho y Montacargas</option>
                  <option value="Nave de Prensas">Nave de Prensas y Línea de Troquel</option>
                  <option value="Silos y Tanques">Silos y Tanques de Almacenamiento</option>
                  <option value="Taller de Mantenimiento">Taller Mecánico Central</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Tipo de Incidente</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    'Casi caída de carga suspendida',
                    'Frenado de emergencia montacargas',
                    'Escape fugaz de vapor o gas',
                    'Resbalón por aceite sin caída'
                  ].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setIncidentType(type)}
                      className={`p-2.5 rounded-lg border text-left transition-all ${
                        incidentType === type
                          ? 'bg-purple-500/20 border-purple-500 text-white font-semibold'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Detalle de lo Ocurrido</label>
                <textarea
                  value={incidentDetail}
                  onChange={(e) => setIncidentDetail(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-purple-500 placeholder:text-slate-600"
                  placeholder="Explique la situación observada para que el equipo pueda corregir la condición de riesgo..."
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-900/30 cursor-pointer active:scale-[0.99] transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>REGISTRAR EN MODO {isAnonymous ? 'ANÓNIMO PROTEGIDO' : 'IDENTIFICADO'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <div className="p-6 rounded-xl bg-slate-900 border border-purple-500/30 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-bold text-purple-400">CASI-ACCIDENTE REGISTRADO CON ÉXITO</div>
                  <div className="text-lg font-bold text-white">Radicado Inmutable Cifrado</div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono space-y-1 text-slate-300">
                <div>Registro ingresado al sistema de control preventivo:</div>
                <div className="text-purple-400">Sector: {selectedArea} · Categoría: {incidentType} · Identidad: Confidencial</div>
              </div>

              <p className="text-xs text-slate-400">
                Su reporte permite al equipo de mantenimiento y al comité de seguridad corregir la condición locativa antes de que ocurra una lesión física, protegiendo a todos los compañeros de planta.
              </p>

              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700 transition-colors"
              >
                Registrar Otro Reporte
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Frank Bird Iceberg Visualizer */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
                <Layers className="w-4 h-4" />
                PIRÁMIDE PREVENTIVA DE FRANK BIRD
              </div>
              <span className="text-[10px] font-mono text-slate-400">BALANCE MENSUAL</span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              La metodología de control de pérdidas de Frank Bird demuestra que por cada 1 accidente grave ocurren 600 casi-accidentes. Visibilizarlos a tiempo previene incidentes mayores.
            </p>

            {/* Iceberg Graphic Layers */}
            <div className="space-y-2 pt-2">
              <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-800/80 text-rose-200 flex items-center justify-between text-xs">
                <span className="font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  1 Accidente Fatal / Muerte
                </span>
                <span className="font-mono font-bold text-rose-400">0 Registrados (Meta Cero)</span>
              </div>

              <div className="p-2.5 rounded-lg bg-amber-950/60 border border-amber-800/80 text-amber-200 flex items-center justify-between text-xs">
                <span className="font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  10 Lesiones Graves Incapacitantes
                </span>
                <span className="font-mono font-bold text-amber-400">1 en seguimiento</span>
              </div>

              <div className="p-2.5 rounded-lg bg-sky-950/60 border border-sky-800/80 text-sky-200 flex items-center justify-between text-xs">
                <span className="font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-500" />
                  30 Lesiones Leves (Primeros Auxilios)
                </span>
                <span className="font-mono font-bold text-sky-400">4 atendidas</span>
              </div>

              <div className="p-3 rounded-lg bg-purple-950/80 border-2 border-purple-500 text-purple-100 flex items-center justify-between text-xs shadow-lg shadow-purple-950">
                <div>
                  <div className="font-extrabold flex items-center gap-1.5 text-white">
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                    600 Casi-Accidentes / Incidentes sin Lesión
                  </div>
                  <div className="text-[10px] text-purple-300">Base preventiva alimentada por el Buzón Confidencial</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-black text-lg text-purple-200">{nearMissCount} / 600</div>
                  <div className="text-[10px] text-purple-300 font-semibold">+1 recién reportado</div>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <div className="font-semibold text-slate-300">Impacto del Canal Seguro:</div>
              <div>• Mayor reporte temprano de condiciones locativas peligrosas.</div>
              <div>• Intervención técnica preventiva antes de generar paradas de línea o daños físicos.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
