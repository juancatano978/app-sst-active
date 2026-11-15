import React, { useState } from 'react';
import { 
  FileText, 
  Send, 
  Clock, 
  Users, 
  CheckCircle2, 
  Building2, 
  Lock, 
  Download
} from 'lucide-react';

export const Hu004LegalNotification: React.FC = () => {
  const [isDispatchedARL, setIsDispatchedARL] = useState<boolean>(false);
  const [isDispatchedCOPASST, setIsDispatchedCOPASST] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'furat' | 'copasst'>('overview');

  // Pre-filled FURAT state
  const furatData = {
    empresa: 'SST-Active Industrial S.A.S.',
    nit: '900.582.119-4',
    arl: 'ARL SURA',
    eps: 'EPS Sanitas',
    trabajador: 'Jorge Enrique Morales Restrepo',
    cedula: '1.020.450.812',
    cargo: 'Operario de Prensa Troqueladora #3',
    fechaAccidente: '2026-10-28 06:45 AM',
    lugar: 'Nave Prensas - Cuadrante Q-A1',
    tipoLesion: 'Fractura cerrada no desplazada falange distal dedo índice derecho',
    mecanismo: 'Atrapamiento en rodillo alimentador por resguardo descalibrado',
    diasIncapacidadEstimados: '20 días'
  };

  const handleTransmitARL = () => {
    setIsDispatchedARL(true);
  };

  const handleAlertCOPASST = () => {
    setIsDispatchedCOPASST(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Legal Regs */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-red-400 tracking-wider">GESTIÓN LEGAL Y NOTIFICACIÓN REGULATORIA</div>
            <div className="text-sm font-bold text-white">Reporte Oficial de Accidentes de Trabajo (ARL, EPS y COPASST)</div>
            <div className="text-xs text-slate-400">Control estricto de plazos legales según el Decreto 1072 de 2015 y la Resolución 2013 de 1986</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-800 text-slate-300 font-mono text-xs">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Conexión Segura con Entidades</span>
          </div>
        </div>
      </div>

      {/* 2 Mandatory Legal Timers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Timer 1: ARL / EPS (2 business days) */}
        <div className={`p-4 rounded-xl border transition-all ${
          isDispatchedARL 
            ? 'bg-emerald-950/20 border-emerald-500/30' 
            : 'bg-slate-900 border-amber-500/40'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-400" />
              PLAZO LEGAL DE REPORTE A ARL / EPS
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
              MÁXIMO 2 DÍAS HÁBILES
            </span>
          </div>

          <div className="text-lg font-mono font-bold text-white">
            {isDispatchedARL ? 'NOTIFICADO Y RADICADO EXITOSAMENTE' : '38h : 14m : 22s restantes'}
          </div>

          <p className="text-xs text-slate-400 mt-1">
            Obligación patronal de radicación del FURAT dentro de los 2 días hábiles siguientes al evento laboral.
          </p>

          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-slate-300 font-medium">Entidades: {furatData.arl} y {furatData.eps}</span>
            {!isDispatchedARL ? (
              <button
                type="button"
                onClick={handleTransmitARL}
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                Transmitir Formato FURAT
              </button>
            ) : (
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Radicado ante ARL #2026-90812
              </span>
            )}
          </div>
        </div>

        {/* Timer 2: COPASST (<= 24h) */}
        <div className={`p-4 rounded-xl border transition-all ${
          isDispatchedCOPASST 
            ? 'bg-emerald-950/20 border-emerald-500/30' 
            : 'bg-slate-900 border-rose-500/40'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-rose-400" />
              ALERTA INMEDIATA AL COMITÉ COPASST
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">
              PLAZO &lt;= 24 HORAS
            </span>
          </div>

          <div className="text-lg font-mono font-bold text-white">
            {isDispatchedCOPASST ? 'COMITÉ PARITARIO NOTIFICADO' : '11h : 05m : 49s restantes'}
          </div>

          <p className="text-xs text-slate-400 mt-1">
            Notificación obligatoria a los integrantes del comité para iniciar el equipo investigador del accidente.
          </p>

          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-slate-300 font-medium">8 integrantes asignados</span>
            {!isDispatchedCOPASST ? (
              <button
                type="button"
                onClick={handleAlertCOPASST}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Users className="w-3.5 h-3.5" />
                Enviar Notificación Inmediata
              </button>
            ) : (
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Notificación Enviada (App / Correo)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'overview' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' : 'text-slate-400 hover:text-white'
          }`}
        >
          Resumen del Caso
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('furat')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'furat' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' : 'text-slate-400 hover:text-white'
          }`}
        >
          Formato FURAT Diligenciado
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('copasst')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'copasst' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' : 'text-slate-400 hover:text-white'
          }`}
        >
          Integrantes del COPASST Convocados
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white">Expediente de Accidente de Trabajo #AT-2026-004</h4>
            <span className="text-xs font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
              Clasificación: Accidente con Lesión Incapacitante
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-500 font-semibold uppercase">Trabajador Afectado</span>
              <div className="text-white font-bold">{furatData.trabajador}</div>
              <div className="text-slate-400 font-mono">CC {furatData.cedula}</div>
              <div className="text-slate-400">{furatData.cargo}</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-500 font-semibold uppercase">Lugar y Fecha del Suceso</span>
              <div className="text-white font-bold">{furatData.lugar}</div>
              <div className="text-slate-400 font-mono">{furatData.fechaAccidente}</div>
              <div className="text-slate-400">Atención inicial: Enfermería de planta</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-500 font-semibold uppercase">Diagnóstico Inicial</span>
              <div className="text-white font-bold">{furatData.tipoLesion}</div>
              <div className="text-slate-400">Mecanismo: {furatData.mecanismo}</div>
              <div className="text-amber-400 font-semibold">Incapacidad: {furatData.diasIncapacidadEstimados}</div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs text-slate-300">
            <span className="font-semibold text-white">Conservación Documental:</span> Este expediente queda resguardado en el historial de la compañía para dar cumplimiento a la retención obligatoria de 20 años exigida por la normatividad de seguridad y salud en el trabajo.
          </div>
        </div>
      )}

      {/* Tab 2: Pre-filled FURAT Form Preview */}
      {activeTab === 'furat' && (
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-sky-400" />
                Formato Único de Reporte de Accidente de Trabajo (FURAT)
              </h4>
              <div className="text-xs text-slate-400">Diligenciado de manera automática con los datos consolidados del triaje en sitio</div>
            </div>

            <button
              type="button"
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Descargar Formato Oficial PDF
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4 text-xs">
            <div className="border-b border-slate-800 pb-3">
              <div className="font-bold text-sky-300 uppercase tracking-wider mb-2">I. Datos Generales de la Empresa Empleadora</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-slate-300">
                <div><span className="text-slate-500">Razón Social:</span> {furatData.empresa}</div>
                <div><span className="text-slate-500">NIT:</span> {furatData.nit}</div>
                <div><span className="text-slate-500">ARL:</span> {furatData.arl}</div>
                <div><span className="text-slate-500">Clase de Riesgo:</span> Clase V (Manufactura Pesada)</div>
              </div>
            </div>

            <div className="border-b border-slate-800 pb-3">
              <div className="font-bold text-sky-300 uppercase tracking-wider mb-2">II. Información del Trabajador</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-slate-300">
                <div><span className="text-slate-500">Nombre Completo:</span> {furatData.trabajador}</div>
                <div><span className="text-slate-500">Documento:</span> {furatData.cedula}</div>
                <div><span className="text-slate-500">EPS:</span> {furatData.eps}</div>
                <div><span className="text-slate-500">Cargo:</span> {furatData.cargo}</div>
              </div>
            </div>

            <div>
              <div className="font-bold text-sky-300 uppercase tracking-wider mb-2">III. Descripción del Accidente</div>
              <p className="text-slate-300 bg-slate-900 p-3 rounded-lg border border-slate-800">
                El trabajador se encontraba alimentando lámina metálica en la prensa troqueladora #3 cuando el dispositivo sensor de barrera óptica presentó un retardo de parada, permitiendo el contacto mecánico. Fue atendido por brigadistas y remitido a centro hospitalario.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: COPASST notification list */}
      {activeTab === 'copasst' && (
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-rose-400" />
                Comité Paritario de Seguridad y Salud en el Trabajo (COPASST)
              </h4>
              <div className="text-xs text-slate-400">Estado de notificación y acuse de recibo de los miembros del comité</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {[
              { name: 'Dra. Marcela Aguirre', rol: 'Presidenta COPASST (Representante Empresa)', estado: isDispatchedCOPASST ? 'Notificada (Recibido)' : 'Pendiente' },
              { name: 'Andrés Felipe Gómez', rol: 'Secretario COPASST (Representante Trabajadores)', estado: isDispatchedCOPASST ? 'Notificada (Recibido)' : 'Pendiente' },
              { name: 'Carlos Mario Vélez', rol: 'Supervisor HSEQ del Sector', estado: isDispatchedCOPASST ? 'Notificada (Recibido)' : 'Pendiente' },
              { name: 'Sandra Milena Henao', rol: 'Vocal Principal (Representante Trabajadores)', estado: isDispatchedCOPASST ? 'Notificada (Recibido)' : 'Pendiente' },
            ].map((member, i) => (
              <div key={i} className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-white font-semibold">{member.name}</div>
                  <div className="text-slate-400 text-[11px]">{member.rol}</div>
                </div>
                <span className={`text-[11px] font-mono font-medium px-2 py-0.5 rounded ${
                  isDispatchedCOPASST ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                }`}>
                  {member.estado}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
