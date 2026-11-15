import React, { useState } from 'react';
import { usePlant } from '../../context/PlantContext';
import { 
  Radio, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Wifi, 
  WifiOff, 
  AlertTriangle, 
  Zap, 
  Wrench, 
  Flame, 
  ArrowRight,
  ShieldCheck,
  EyeOff,
  Eye,
  Lock,
  Layers,
  HelpCircle
} from 'lucide-react';

interface TotemStationProps {
  onGoToTriaje?: (incidentId: string) => void;
}

export const TotemStation: React.FC<TotemStationProps> = ({ onGoToTriaje }) => {
  const { currentUser, quadrants, createIncident } = usePlant();

  // Authentication & Mode
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const operatorName = currentUser?.name || 'Juan Andrés Cataño S.';
  const operatorId = currentUser ? `CC ${currentUser.cedula} · Carné #${currentUser.carnet}` : 'CC 1.036.782.110';

  // Form Fields
  const [selectedQuadrantId, setSelectedQuadrantId] = useState<string>('Q-A1');
  const [selectedCategory, setSelectedCategory] = useState<'Locativo' | 'Mecánico' | 'Eléctrico' | 'Químico'>('Mecánico');
  const [reportType, setReportType] = useState<'condicion' | 'casi_accidente'>('condicion');
  const [title, setTitle] = useState<string>('Vibración anormal y desalineación en motor secundario');
  const [description, setDescription] = useState<string>('Se percibe traqueteo continuo en anclaje de bancada. Puede desprenderse si continúa operando a plena carga.');
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [createdTicket, setCreatedTicket] = useState<any>(null);

  const categories = [
    { id: 'Locativo' as const, name: 'Riesgo Locativo', icon: MapPin, desc: 'Pisos, desniveles, escaleras, pasillos' },
    { id: 'Mecánico' as const, name: 'Riesgo Mecánico', icon: Wrench, desc: 'Guardas, prensas, rodillos, poleas' },
    { id: 'Eléctrico' as const, name: 'Riesgo Eléctrico', icon: Zap, desc: 'Cables pelados, tableros, cortinas' },
    { id: 'Químico' as const, name: 'Riesgo Químico', icon: Flame, desc: 'Fugas, vapores, lubricantes, solventes' },
  ];

  const handleToggleAnonymous = () => {
    setIsAnonymous(prev => !prev);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetQ = quadrants.find(q => q.id === selectedQuadrantId);

    // If anonymous mode is active, do not send personal data:
    const reportedByDisplay = isAnonymous ? 'Buzón Confidencial (Anónimo)' : `${operatorName} (${operatorId})`;

    const newInc = createIncident({
      title: title || (reportType === 'casi_accidente' ? 'Casi-accidente reportado en planta' : 'Condición de riesgo reportada'),
      category: selectedCategory,
      quadrantId: selectedQuadrantId,
      quadrantName: targetQ?.name || 'Área de Planta',
      area: targetQ?.area || 'Sector General',
      supervisor: targetQ?.supervisor || 'Supervisor Asignado',
      reportedBy: reportedByDisplay,
      description: description || 'Novedad registrada desde terminal táctil de planta',
      isAnonymous: isAnonymous
    });

    setCreatedTicket({
      ...newInc,
      offlineBuffered: isOffline,
      maskedIdentity: isAnonymous
    });
  };

  const handleReset = () => {
    setCreatedTicket(null);
    setTitle('');
    setDescription('');
  };

  return (
    <div className="space-y-6">
      {/* Terminal Industrial Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800 text-sm">
        <div className="flex items-center gap-3">
          <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 animate-pulse" />
          <div>
            <div className="font-bold text-white flex items-center gap-2">
              <span>TERMINAL TÁCTIL INDUSTRIAL #04 — COMEDOR / VESTIERES</span>
              <span className="text-[10px] font-mono bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded border border-sky-500/30">
                PANTALLA ACTIVA
              </span>
            </div>
            <div className="text-xs text-slate-400">Captura express sin necesidad de usar celulares personales en línea de producción</div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <button 
            type="button"
            onClick={() => setIsOffline(!isOffline)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition-colors cursor-pointer ${
              isOffline 
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-200' 
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
            }`}
            title="Alternar contingencia local en caso de corte de red"
          >
            {isOffline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
            <span>{isOffline ? 'Modo Contingencia (Búfer SQLite)' : 'Red de Planta Conectada'}</span>
          </button>

          <div className="flex items-center gap-1 text-slate-400 font-mono">
            <Clock className="w-3.5 h-3.5 text-sky-400" />
            <span>Respuesta: &lt; 5s</span>
          </div>
        </div>
      </div>

      {!createdTicket ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card 1: Fast RFID Identification with Integrated Confidential Mode Switch */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
                  isAnonymous 
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-lg shadow-purple-950'
                    : 'bg-sky-500/15 text-sky-400 border-sky-500/30'
                }`}>
                  {isAnonymous ? <EyeOff className="w-6 h-6" /> : <Radio className="w-6 h-6 animate-pulse" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-slate-400">
                      Identificación en Kiosco:
                    </span>
                    {isAnonymous ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono">
                        MODO ANÓNIMO ACTIVO (DATOS PERSONALES SUPRIMIDOS)
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30 font-mono">
                        MODO IDENTIFICADO
                      </span>
                    )}
                  </div>

                  <div className="text-sm font-bold text-white mt-0.5">
                    {isAnonymous ? (
                      <span className="text-purple-300 font-mono">Identidad Oculta · Protección Ley 1581</span>
                    ) : (
                      <span>{operatorName} · Turno A</span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400">
                    {isAnonymous 
                      ? 'El sistema desconecta la cédula, IP y usuario. El reporte se registrará sin ningún dato vinculante a su persona.'
                      : `${operatorId} · Sector Metalmecánico Pesado`}
                  </div>
                </div>
              </div>

              {/* Big Interactive Confidential Mode Toggle */}
              <div className="flex items-center justify-between md:justify-end gap-3 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <div className="text-left">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Lock className={`w-3.5 h-3.5 ${isAnonymous ? 'text-purple-400' : 'text-slate-400'}`} />
                    <span>Modo Anónimo</span>
                  </div>
                  <div className="text-[10px] text-slate-400">Buzón Confidencial</div>
                </div>

                <button
                  type="button"
                  onClick={handleToggleAnonymous}
                  className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    isAnonymous ? 'bg-purple-600' : 'bg-slate-700'
                  }`}
                  aria-label="Alternar modo anónimo confidencial"
                >
                  <span
                    className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out flex items-center justify-center ${
                      isAnonymous ? 'translate-x-7' : 'translate-x-0'
                    }`}
                  >
                    {isAnonymous ? (
                      <EyeOff className="w-3.5 h-3.5 text-purple-600" />
                    ) : (
                      <Eye className="w-3.5 h-3.5 text-slate-700" />
                    )}
                  </span>
                </button>
              </div>
            </div>

            {/* In-depth privacy reassurance banner when active */}
            {isAnonymous && (
              <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/40 text-xs text-purple-200 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-bold text-white">Garantía de No Represalias (Cultura Justa): </span>
                  <span>
                    Su carné sirvió únicamente para encender la sesión táctil. Ninguna cédula ni registro quedará asociado en la base de datos (<code className="text-purple-300 font-mono">id_usuario = NULL</code>). Úselo con confianza para reportar casi-accidentes o fallas sin consecuencias personales.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Card 2: Report Classification (Condition vs Near-Miss) */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Tipo de Suceso a Notificar:</span>
              <span className="text-[11px] text-slate-500">Seleccione si hubo potencial de accidente</span>
            </label>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <button
                type="button"
                onClick={() => setReportType('condicion')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  reportType === 'condicion'
                    ? 'bg-sky-500/15 border-sky-400 text-white font-semibold'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="font-bold text-sm text-white">Condición Peligrosa / Riesgo Locativo</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Derrame, guarda suelta, cable expuesto, piso dañado</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setReportType('casi_accidente');
                  setIsAnonymous(true); // Suggest anonymous mode on near miss
                }}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  reportType === 'casi_accidente'
                    ? 'bg-purple-500/20 border-purple-400 text-white font-semibold shadow-md'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="font-bold text-sm text-white flex items-center gap-1.5">
                  <span>Casi-Accidente / Incidente sin Lesión</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/30 text-purple-300 font-mono">
                    Pirámide Frank Bird
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">Casi cae carga, resbalón sin lesión, frenado de emergencia</div>
              </button>
            </div>
          </div>

          {/* Card 3: Interactive Plant Map by Quadrants */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-sky-400" />
                1. Seleccione el Cuadrante o Nave Industrial
              </label>
              <span className="text-xs text-slate-400">1 toque en pantalla</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {quadrants.map((quadrant) => {
                const isSelected = selectedQuadrantId === quadrant.id;
                return (
                  <button
                    key={quadrant.id}
                    type="button"
                    onClick={() => setSelectedQuadrantId(quadrant.id)}
                    className={`p-3.5 rounded-xl text-left border transition-all text-sm relative overflow-hidden cursor-pointer ${
                      isSelected
                        ? isAnonymous 
                          ? 'bg-purple-500/15 border-purple-400 text-white shadow-lg shadow-purple-500/10 ring-1 ring-purple-400'
                          : 'bg-sky-500/15 border-sky-400 text-white shadow-lg shadow-sky-500/10 ring-1 ring-sky-400'
                        : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-sky-300">
                        {quadrant.id}
                      </span>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                        quadrant.riskClass === 'V' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        Riesgo {quadrant.riskClass}
                      </span>
                    </div>
                    <div className="font-semibold text-white truncate">{quadrant.name}</div>
                    <div className="text-xs text-slate-400 mt-1 flex items-center justify-between">
                      <span>Sup: {quadrant.supervisor.split(' ')[0]}</span>
                      {quadrant.activeHazards > 0 && (
                        <span className="text-amber-400 font-mono text-[11px] font-semibold">
                          {quadrant.activeHazards} activo(s)
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Card 4: Danger Category */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              2. Clasificación del Peligro
            </label>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`p-3.5 rounded-xl text-left border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-400 text-white shadow-lg shadow-amber-500/10 ring-1 ring-amber-400'
                        : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mb-2 ${isSelected ? 'text-amber-400' : 'text-slate-400'}`} />
                    <div className="font-semibold text-sm text-white">{cat.name}</div>
                    <div className="text-xs text-slate-400 mt-1">{cat.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Card 5: Quick Description */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-200">
              3. Título y Detalle de la Novedad
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-sm focus:border-sky-500 focus:outline-none placeholder:text-slate-500"
              placeholder="Ej: Fuga de aceite cerca de prensa, eslinga deshilachada en puente grúa..."
              required
            />

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-sm focus:border-sky-500 focus:outline-none placeholder:text-slate-500"
              placeholder="Describa brevemente la situación o condición observada..."
            />
          </div>

          {/* Submit Action — Manual p. 11: Naranja Seguridad (#FF8A00) + Marino (#0A2342) para guantes y rapidez */}
          <div className="pt-2">
            <button
              type="submit"
              className={`w-full min-h-[56px] py-4 px-6 rounded-xl font-display font-extrabold text-base sm:text-lg flex items-center justify-center gap-3 shadow-xl active:scale-[0.99] transition-all cursor-pointer uppercase tracking-wide ${
                isAnonymous 
                  ? 'bg-[#1F6FB5] hover:bg-[#2a82cf] text-white border-2 border-[#5FA8E8]'
                  : 'bg-[#FF8A00] hover:bg-[#ff9c24] text-[#0A2342]'
              }`}
            >
              <CheckCircle2 className="w-6 h-6" />
              <span>{isAnonymous ? 'ENVIAR REPORTE ANÓNIMO' : 'REPORTAR PELIGRO EN PLANTA'}</span>
              <ArrowRight className="w-6 h-6" />
            </button>
            <div className="text-center text-xs text-[#C9D1D9] mt-2">
              {isAnonymous 
                ? '✓ Tu identidad está protegida. No se almacena nombre ni documento.'
                : 'Se genera un radicado inmediato y se alerta al supervisor HSEQ en su Tablet'}
            </div>
          </div>
        </form>
      ) : (
        /* Result Confirmation — Verde Salud (#2ECC71) + redundancia visual per Manual p. 11 */
        <div className="p-6 rounded-2xl bg-[#0A2342] border-2 border-[#2ECC71] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#14508F]/60 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#2ECC71] text-[#0A2342] flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <div className="text-xs font-display font-bold text-[#2ECC71] tracking-wider uppercase">
                  {createdTicket.maskedIdentity ? 'Evento registrado en modo anónimo' : 'Reporte enviado. Gracias por cuidar a tu equipo.'}
                </div>
                <div className="text-2xl font-mono font-extrabold text-white">{createdTicket.id}</div>
                <div className="text-xs text-[#C9D1D9]">Fecha y hora de registro: {createdTicket.reportedAt}</div>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 text-sky-300 text-xs font-mono font-medium border border-sky-500/20">
                <Clock className="w-3.5 h-3.5" />
                <span>Tiempo de procesamiento: 2.4s</span>
              </div>
              {createdTicket.maskedIdentity ? (
                <div className="text-xs text-purple-400 mt-1 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Identidad Protegida · id_usuario = NULL · Ley 1581
                </div>
              ) : createdTicket.offlineBuffered ? (
                <div className="text-xs text-amber-400 mt-1 flex items-center gap-1">
                  <WifiOff className="w-3 h-3" />
                  Almacenado localmente · Se sincronizará automáticamente
                </div>
              ) : (
                <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                  <Wifi className="w-3 h-3" />
                  Sincronizado con Central y Notificado a Tablet HSEQ
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="text-xs text-slate-400 uppercase font-semibold">Ubicación Asignada</div>
              <div className="text-white font-medium">{createdTicket.quadrantName}</div>
              <div className="text-xs text-slate-300">Sector: {createdTicket.area}</div>
              <div className="text-xs text-slate-400">
                Supervisor HSEQ de Turno: <span className="text-sky-300 font-semibold">{createdTicket.supervisor}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="text-xs text-slate-400 uppercase font-semibold">Detalle de la Condición</div>
              <div className="text-white font-medium">{createdTicket.title}</div>
              <div className="text-xs text-slate-300 line-clamp-2">"{createdTicket.description}"</div>
              <div className="text-xs text-slate-400">
                Reportado por: <span className={createdTicket.maskedIdentity ? 'text-purple-300 font-semibold font-mono' : 'text-slate-200'}>{createdTicket.reportedBy}</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-sky-950/30 border border-sky-800/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-300">
              <span className="font-semibold text-white">Alerta Activa:</span> La novedad ha sido radicada formalmente. El supervisor asignado tiene el registro en su Tablet para inspección en sitio y calificación con matriz GTC 45.
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {onGoToTriaje && (
                <button
                  type="button"
                  onClick={() => onGoToTriaje(createdTicket.id)}
                  className="px-4 py-2 text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white rounded-lg transition-colors cursor-pointer"
                >
                  Abrir Triaje GTC 45 &rarr;
                </button>
              )}
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700 transition-colors cursor-pointer"
              >
                Nuevo Reporte
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
