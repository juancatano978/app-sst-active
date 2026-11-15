import React, { useState } from 'react';
import { PLANT_QUADRANTS } from '../../data/userStoriesData';
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
  ShieldCheck, 
  ArrowRight,
  QrCode
} from 'lucide-react';

export const Hu001TotemExpress: React.FC = () => {
  const [rfidScanned, setRfidScanned] = useState<boolean>(true);
  const [selectedQuadrant, setSelectedQuadrant] = useState<string>('Q-A1');
  const [selectedCategory, setSelectedCategory] = useState<string>('Locativo');
  const [description, setDescription] = useState<string>('Derrame de aceite lubricante cerca de prensa hidráulica #4');
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [ticketData, setTicketData] = useState<any>(null);

  const categories = [
    { id: 'Locativo', name: 'Riesgo Locativo', icon: MapPin, desc: 'Pisos, desniveles, escaleras, techos' },
    { id: 'Mecánico', name: 'Riesgo Mecánico', icon: Wrench, desc: 'Guardas sueltas, rodillos, prensas' },
    { id: 'Eléctrico', name: 'Riesgo Eléctrico', icon: Zap, desc: 'Cables pelados, tableros energizados' },
    { id: 'Químico', name: 'Riesgo Químico', icon: Flame, desc: 'Fugas, vapores, almacenamiento reactivo' },
  ];

  const handleSimulateScan = () => {
    setRfidScanned(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const radNumber = `SST-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setTicketData({
      radicado: radNumber,
      timestamp: `2026-10-28T${timeStr}:00Z`,
      displayDate: `${timeStr} · 28/10/2026`,
      quadrant: PLANT_QUADRANTS.find(q => q.id === selectedQuadrant)?.name,
      area: PLANT_QUADRANTS.find(q => q.id === selectedQuadrant)?.area,
      supervisor: PLANT_QUADRANTS.find(q => q.id === selectedQuadrant)?.supervisor,
      category: selectedCategory,
      description: description || 'Condición de riesgo reportada en línea de producción',
      offlineBuffered: isOffline,
      operator: 'Juan Andrés Cataño S. (Operario Turno A)',
      operatorId: 'CC 1.036.782.110'
    });
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setTicketData(null);
  };

  return (
    <div className="space-y-6">
      {/* Kiosk Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800 text-sm">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <div>
            <span className="font-semibold text-white">TÓTEM INDUSTRIAL #04 — COMEDOR PRINCIPAL</span>
            <div className="text-xs text-slate-400">Gabinete de Acero Inoxidable IK10 · Sellado IP65 · Pantalla Táctil Industrial 21.5"</div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <button 
            type="button"
            onClick={() => setIsOffline(!isOffline)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors ${
              isOffline 
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' 
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
            }`}
          >
            {isOffline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
            <span>{isOffline ? 'Modo Local (Búfer SQLite)' : 'Conectado a Red de Planta'}</span>
          </button>

          <div className="flex items-center gap-1 text-slate-400 font-mono">
            <Clock className="w-3.5 h-3.5 text-sky-400" />
            <span>Respuesta en Sitio: &lt; 5s</span>
          </div>
        </div>
      </div>

      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: RFID Fast Authentication Banner */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                <Radio className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="text-xs font-semibold text-sky-400 tracking-wider">AUTENTICACIÓN RÁPIDA POR CARNÉ RFID / NFC</div>
                <div className="text-sm font-bold text-white">
                  {rfidScanned ? 'Carné Detectado: Juan Andrés Cataño S. (Línea Metalmecánica)' : 'Aproxime su carné al lector del kiosco'}
                </div>
                <div className="text-xs text-slate-400">Identificación sin necesidad de ingresar contraseñas ni usar teléfonos celulares</div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSimulateScan}
              className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-colors"
            >
              Re-escanear Carné
            </button>
          </div>

          {/* Step 2: Interactive Plant Map by Quadrants */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                1. Seleccione el Sector o Cuadrante de la Planta
              </label>
              <span className="text-xs text-slate-400">Toque directo en pantalla</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {PLANT_QUADRANTS.map((quadrant) => {
                const isSelected = selectedQuadrant === quadrant.id;
                return (
                  <button
                    key={quadrant.id}
                    type="button"
                    onClick={() => setSelectedQuadrant(quadrant.id)}
                    className={`p-3.5 rounded-xl text-left border transition-all text-sm relative overflow-hidden ${
                      isSelected
                        ? 'bg-sky-500/15 border-sky-400 text-white shadow-lg shadow-sky-500/10 ring-1 ring-sky-400'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-sky-300">
                        {quadrant.id}
                      </span>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                        quadrant.riskClass === 'V' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        Clase de Riesgo {quadrant.riskClass}
                      </span>
                    </div>
                    <div className="font-semibold text-white truncate">{quadrant.name}</div>
                    <div className="text-xs text-slate-400 mt-1">Supervisor asignado: {quadrant.supervisor}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Danger Category Selection */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              2. Clasificación del Peligro Observado
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
                    className={`p-3.5 rounded-xl text-left border transition-all ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-400 text-white shadow-lg shadow-amber-500/10 ring-1 ring-amber-400'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/60'
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

          {/* Step 4: Quick Description */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-200 flex items-center justify-between">
              <span>3. Descripción de la Novedad</span>
              <span className="text-xs text-slate-400 font-mono">Notificación obligatoria dentro de 24 horas</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 placeholder:text-slate-500"
              placeholder="Describa brevemente la condición de riesgo detectada..."
            />
          </div>

          {/* Submit Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-base flex items-center justify-center gap-3 shadow-xl shadow-sky-600/20 active:scale-[0.99] transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>RADICAR NOVEDAD EN SITIO</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <div className="text-center text-xs text-slate-400 mt-2">
              Genera inmediatamente un radicado inmutable y envía alerta sonora a la Tablet del Supervisor HSEQ
            </div>
          </div>
        </form>
      ) : (
        /* Result: Inmutable Ticket & Dispatch Confirmation */
        <div className="p-6 rounded-2xl bg-slate-900 border border-emerald-500/30 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-bold text-emerald-400 tracking-wider">RADICADO INMUTABLE GENERADO EXITOSAMENTE</div>
                <div className="text-2xl font-mono font-extrabold text-white">{ticketData.radicado}</div>
                <div className="text-xs text-slate-400">Estampa de tiempo: {ticketData.displayDate} (UTC)</div>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 text-sky-300 text-xs font-mono font-medium border border-sky-500/20">
                <Clock className="w-3.5 h-3.5" />
                <span>Tiempo de procesamiento: 3.2s</span>
              </div>
              {ticketData.offlineBuffered ? (
                <div className="text-xs text-amber-400 mt-1 flex items-center gap-1">
                  <WifiOff className="w-3 h-3" />
                  Almacenado en Búfer Local · Sincronizará automáticamente al restablecerse la red
                </div>
              ) : (
                <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                  <Wifi className="w-3 h-3" />
                  Sincronizado con la Central y Despachado a la Tablet HSEQ
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="text-xs text-slate-400 uppercase font-semibold">Ubicación y Cuadrante</div>
              <div className="text-white font-medium">{ticketData.quadrant}</div>
              <div className="text-xs text-slate-300">Sector: {ticketData.area}</div>
              <div className="text-xs text-slate-400">Supervisor Responsable: <span className="text-sky-300">{ticketData.supervisor}</span></div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="text-xs text-slate-400 uppercase font-semibold">Detalle del Reporte</div>
              <div className="text-white font-medium">{ticketData.category}</div>
              <div className="text-xs text-slate-300 line-clamp-2">"{ticketData.description}"</div>
              <div className="text-xs text-slate-400">Reportado por: {ticketData.operator}</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-sky-950/30 border border-sky-800/40 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <QrCode className="w-8 h-8 text-sky-400 shrink-0" />
              <div className="text-xs text-slate-300">
                <span className="font-semibold text-white">Alerta Despachada:</span> Notificación enviada al supervisor en campo para triaje con matriz de riesgos GTC 45 e inspección con evidencia fotográfica.
              </div>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700 transition-colors whitespace-nowrap cursor-pointer"
            >
              Registrar Nueva Novedad
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
