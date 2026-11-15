import React, { useState, useRef } from 'react';
import { usePlant } from '../../context/PlantContext';
import { SYSTEM_BASE_DATE_STR, getSystemTimestamp } from '../../utils/dateUtils';
import { generateAndDownloadInspectionActaPdf } from '../../utils/inspectionPdfTemplate';
import { BrandLogo } from '../BrandLogo';
import {
  ClipboardCheck,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  PenTool,
  Download,
  Wrench,
  ArrowRight,
  Tablet,
  Laptop,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  MapPin,
  BookOpen,
  Camera,
  CheckSquare,
  Square,
  ShieldAlert,
  Clock,
  RotateCcw,
  Eye,
  EyeOff,
  FileCheck2
} from 'lucide-react';

interface SubCheckCriterion {
  id: string;
  label: string;
  checked: boolean;
}

interface CheckItem {
  id: number;
  text: string;
  category: string;
  referenceNorm: string;
  locationDetail: string;
  acceptanceCriteria: string;
  subChecks: SubCheckCriterion[];
  status: 'CUMPLE' | 'FALLA' | 'PENDIENTE';
  severityLevel: 'Crítico' | 'Mayor' | 'Menor';
  responsibleArea: string;
  dueDate: string;
  evidenceCaptured: boolean;
  descriptionNote: string;
  correctiveAction?: string;
  maintenanceTicketId?: string;
}

export const Hu006PlannedInspection: React.FC = () => {
  const { currentUser, completeInspection } = usePlant();
  const [deviceMode, setDeviceMode] = useState<'tablet' | 'web'>('tablet');
  const [expandedItemId, setExpandedItemId] = useState<number | null>(1);
  const signatureCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [signatureDataUrl, setSignatureDataUrl] = useState<string>('');
  const [signatureError, setSignatureError] = useState<string>('');
  const [signedTimestamp, setSignedTimestamp] = useState<string>('');
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [pdfDownloadedToast, setPdfDownloadedToast] = useState(false);
  const [showPdfTemplatePreview, setShowPdfTemplatePreview] = useState(false);

  const [checklist, setChecklist] = useState<CheckItem[]>([
    {
      id: 1,
      text: 'Pasillos y zonas peatonales libres de obstáculos y derrames de aceite',
      category: 'Orden y Limpieza',
      referenceNorm: 'Res. 2400/1979 Art. 14 · NTC 1461',
      locationDetail: 'Corredor Principal Nave Prensas (Tramo P-01 a P-06)',
      acceptanceCriteria: 'Ancho libre >= 1.20 m, 0 derrames activos, demarcación continua >= 90% visible e iluminación >= 150 lux.',
      subChecks: [
        { id: '1a', label: 'Franja amarilla de demarcación peatonal (mín. 10 cm) visible y continua', checked: true },
        { id: '1b', label: 'Ancho libre >= 1.20 m sin estibas, montacargas ni material en tránsito', checked: true },
        { id: '1c', label: 'Piso seco y antideslizante libre de aceites, taladrina o viruta metálica', checked: true },
        { id: '1d', label: 'Iluminación operativa >= 150 lux y espejos convexos limpios en cruces', checked: true }
      ],
      status: 'CUMPLE',
      severityLevel: 'Menor',
      responsibleArea: 'Producción Turno A',
      dueDate: '2026-10-28',
      evidenceCaptured: true,
      descriptionNote: 'Pasillo demarcado con franja amarilla de 10 cm en buen estado, ancho libre de 1.45 m medido en campo, sin estibas mal posicionadas ni presencia de lubricante.'
    },
    {
      id: 2,
      text: 'Guardas de seguridad mecánicas en prensas y poleas debidamente ancladas',
      category: 'Seguridad Mecánica',
      referenceNorm: 'Res. 2400/1979 Art. 267 · ISO 12100 / ISO 13857',
      locationDetail: 'Prensa Troqueladora #2 — Costado Derecho (Zona Rodillo)',
      acceptanceCriteria: 'Resguardo fijo/móvil anclado sin juego mecánico, micro-switch de enclavamiento operativo y 0 puentes eléctricos.',
      subChecks: [
        { id: '2a', label: 'Anclaje firme con tornillería completa sin fisuras ni deformación en bisagras', checked: false },
        { id: '2b', label: 'Enclavamiento eléctrico (micro-switch / interbloqueo) operativo sin puentes', checked: false },
        { id: '2c', label: 'Distancia de seguridad al punto de atrapamiento conforme a ISO 13857', checked: true },
        { id: '2d', label: 'Parada de emergencia tipo hongo accesible y señalizada en puesto de mando', checked: true }
      ],
      status: 'FALLA',
      severityLevel: 'Crítico',
      responsibleArea: 'Mantenimiento Mecánico',
      dueDate: '2026-10-29',
      evidenceCaptured: true,
      descriptionNote: 'Prensa #2 presenta guarda lateral desprendida por fractura en la bisagra de soporte. El enclavamiento eléctrico fue puenteado indebidamente.',
      correctiveAction: 'Reparación inmediata de bisagra, reinstalación de micro-switch LOTO y prohibición de encendido hasta verificación técnica.',
      maintenanceTicketId: 'MNT-2026-0208'
    },
    {
      id: 3,
      text: 'Rutas de evacuación y puertas de emergencia despejadas y con barra antipánico',
      category: 'Evacuación y Emergencias',
      referenceNorm: 'Res. 0312/2019 · NSR-10 Título J / NFPA 101',
      locationDetail: 'Salida de Emergencia #02 — Costado Sur hacia Patio de Maniobras',
      acceptanceCriteria: 'Apertura inmediata <= 15 N de fuerza en barra antipánico, 0 candados/obstrucciones en 2 m y luminaria de emergencia activa.',
      subChecks: [
        { id: '3a', label: 'Puerta abre hacia el exterior en un solo movimiento mediante barra antipánico', checked: true },
        { id: '3b', label: 'Cero candados, cadenas ni obstáculos a 2 metros internos y externos', checked: true },
        { id: '3c', label: 'Señalización fotoluminiscente y luminaria de emergencia con batería cargada', checked: true },
        { id: '3d', label: 'Mapa de evacuación legible y ruta libre hasta el Punto de Encuentro #1', checked: true }
      ],
      status: 'CUMPLE',
      severityLevel: 'Mayor',
      responsibleArea: 'Brigada de Emergencias / HSEQ',
      dueDate: '2026-10-28',
      evidenceCaptured: false,
      descriptionNote: 'Puerta de salida hacia patio de maniobras abre suavemente al toque de la barra antipánico. Señalización fotoluminiscente y prueba de batería verificadas.'
    },
    {
      id: 4,
      text: 'Extintores multipropósito ABC presurizados, vigentes y accesibles',
      category: 'Protección Contra Incendios',
      referenceNorm: 'NTC 2885 · NFPA 10 · Res. 2400/1979 Art. 220',
      locationDetail: 'Estación Contraincendios E-04 y E-05 (Columna B3 Nave Prensas)',
      acceptanceCriteria: 'Manómetro en zona verde, recarga anual vigente, pasador con sello plástico y acceso libre en radio de 1.0 m.',
      subChecks: [
        { id: '4a', label: 'Manómetro de presión en zona verde (150–195 psi) y pasador con precinto', checked: true },
        { id: '4b', label: 'Fecha de recarga anual y prueba hidrostática vigentes en etiqueta', checked: true },
        { id: '4c', label: 'Altura de instalación <= 1.50 m desde manija y despeje libre de 1.0 m', checked: true },
        { id: '4d', label: 'Manguera, boquilla y cilindro libres de corrosión, golpes o bloqueo', checked: true }
      ],
      status: 'CUMPLE',
      severityLevel: 'Mayor',
      responsibleArea: 'Brigada Contraincendios',
      dueDate: '2026-10-28',
      evidenceCaptured: true,
      descriptionNote: 'Manómetros en zona verde (150 psi). Tarjeta de inspección mensual firmada por brigada. Recarga vigente hasta mayo de 2027.'
    },
    {
      id: 5,
      text: 'Tableros eléctricos señalizados con riesgo de arco y cerrados con candado LOTO',
      category: 'Riesgo Eléctrico',
      referenceNorm: 'RETIE Art. 13 · NFPA 70E · OSHA 1910.147 (LOTO)',
      locationDetail: 'Subestación Secundaria — Tablero Distribución T-04 (440V)',
      acceptanceCriteria: 'Puerta cerrada con bloqueo, panel cubre-bornes intacto, rotulación de circuitos, etiqueta de arco eléctrico y tapete dieléctrico.',
      subChecks: [
        { id: '5a', label: 'Puerta cerrada con llave/candado y tapa acrílica cubre-bornes instalada', checked: false },
        { id: '5b', label: 'Señalización visible de tensión nominal (440V) y advertencia de arco eléctrico', checked: true },
        { id: '5c', label: 'Breakers rotulados por circuito y barraje de puesta a tierra firme', checked: true },
        { id: '5d', label: 'Despeje frontal >= 1.0 m y tapete dieléctrico certificado en buen estado', checked: false }
      ],
      status: 'FALLA',
      severityLevel: 'Crítico',
      responsibleArea: 'Mantenimiento Eléctrico',
      dueDate: '2026-10-29',
      evidenceCaptured: true,
      descriptionNote: 'Tablero T-04 sin tapa acrílica cubre-bornes interior, dejando conductores de 440V al alcance de contacto accidental. Tapete dieléctrico desplazado.',
      correctiveAction: 'Colocación de panel protector de policarbonato, candado de bloqueo físico, reposición de tapete dieléctrico y etiqueta de arco eléctrico.',
      maintenanceTicketId: 'MNT-2026-0508'
    }
  ]);

  const [isActaGenerated, setIsActaGenerated] = useState<boolean>(false);

  const handleStatusChange = (id: number, newStatus: 'CUMPLE' | 'FALLA') => {
    setChecklist(prev => prev.map(item => {
      if (item.id === id) {
        let defaultDesc = item.descriptionNote;
        let defaultCorrective = item.correctiveAction;
        let defaultTicket = item.maintenanceTicketId;

        if (newStatus === 'CUMPLE') {
          if (!defaultDesc || defaultDesc.includes('presenta') || defaultDesc.includes('sin tapa')) {
            defaultDesc = 'Condición inspeccionada en sitio: cumple con todos los sub-criterios técnicos y normativos verificados.';
          }
          defaultCorrective = undefined;
          defaultTicket = undefined;
        } else if (newStatus === 'FALLA') {
          if (!defaultDesc || defaultDesc.includes('cumple')) {
            defaultDesc = 'No conformidad detectada: se observa desviación operativa en los parámetros de verificación en campo.';
          }
          defaultCorrective = defaultCorrective || 'Generación de ticket de mantenimiento correctivo prioritario en taller.';
          defaultTicket = `MNT-2026-0${item.id}08`;
        }

        return {
          ...item,
          status: newStatus,
          descriptionNote: defaultDesc,
          correctiveAction: defaultCorrective,
          maintenanceTicketId: defaultTicket
        };
      }
      return item;
    }));

    setExpandedItemId(id);
  };

  const handleToggleSubCheck = (itemId: number, subId: string) => {
    setChecklist(prev => prev.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          subChecks: item.subChecks.map(sc =>
            sc.id === subId ? { ...sc, checked: !sc.checked } : sc
          )
        };
      }
      return item;
    }));
  };

  const handleUpdateField = <K extends keyof CheckItem>(id: number, field: K, value: CheckItem[K]) => {
    setChecklist(prev => prev.map(item => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const getCanvasCoords = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const handleSignaturePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    e.currentTarget.setPointerCapture(e.pointerId);
    const { x, y } = getCanvasCoords(e);

    ctx.strokeStyle = '#0A2342';
    ctx.fillStyle = '#0A2342';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Trazo inicial puntual para clics cortos o inicio de firma
    ctx.beginPath();
    ctx.arc(x, y, 1.4, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x, y);

    setIsDrawing(true);
    setHasSignature(true);
    setSignatureError('');
  };

  const handleSignaturePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCanvasCoords(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const finishSignatureStroke = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = signatureCanvasRef.current;
    if (canvas) {
      setSignatureDataUrl(canvas.toDataURL('image/png'));
    }
  };

  const handleClearSignature = () => {
    const canvas = signatureCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
    setIsDrawing(false);
    setHasSignature(false);
    setSignatureDataUrl('');
    setSignatureError('');
  };

  const handleFinalizeAndSign = () => {
    const canvas = signatureCanvasRef.current;
    const capturedPng = canvas ? canvas.toDataURL('image/png') : signatureDataUrl;

    if (!hasSignature || !capturedPng) {
      setSignatureError('Por favor trace su firma manuscrita con el mouse dentro del recuadro antes de consolidar el acta.');
      return;
    }

    setSignatureDataUrl(capturedPng);
    setSignatureError('');
    setSignedTimestamp(getSystemTimestamp());
    setPdfDownloadedToast(false);

    const scorePercent = Math.round((compliantCount / checklist.length) * 100);
    completeInspection('INSP-2026-10-A', scorePercent, failuresCount);
    setIsActaGenerated(true);
  };

  const handleDownloadActaPdf = async () => {
    setIsDownloadingPdf(true);
    try {
      await generateAndDownloadInspectionActaPdf({
        actaCode: 'ACTA-INSP-2026-10-A',
        roundCode: 'INSP-2026-10-A',
        roundTitle: 'Inspección Mensual Locativa — Nave Prensas (Sector A)',
        inspectionDate: SYSTEM_BASE_DATE_STR,
        signedTimestamp: signedTimestamp || getSystemTimestamp(),
        inspectorName: currentUser?.name || 'Carlos Mario Vélez',
        inspectorRole: currentUser?.cargo || 'Supervisor HSEQ',
        inspectorBadge: currentUser?.carnet || '401120',
        signatureDataUrl,
        items: checklist
      });
      setPdfDownloadedToast(true);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handleReopenForEdit = () => {
    setIsActaGenerated(false);
    setShowPdfTemplatePreview(false);
    setPdfDownloadedToast(false);
    setHasSignature(false);
    setSignatureDataUrl('');
  };

  const failuresCount = checklist.filter(c => c.status === 'FALLA').length;
  const compliantCount = checklist.filter(c => c.status === 'CUMPLE').length;
  const totalSubChecksPassed = checklist.reduce(
    (acc, item) => acc + item.subChecks.filter(s => s.checked).length,
    0
  );
  const totalSubChecks = checklist.reduce((acc, item) => acc + item.subChecks.length, 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-4 rounded-xl bg-[#0A2342] border border-[#14508F]/70 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1F6FB5]/25 border border-[#5FA8E8]/40 flex items-center justify-center text-[#5FA8E8]">
            <ClipboardCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-display font-bold text-[#5FA8E8] tracking-wider">
              INSPECCIONES PLANEADAS DE SEGURIDAD Y CONDICIONES LOCATIVAS
            </div>
            <div className="text-sm font-display font-bold text-white">
              Ronda Detallada con Lista de Sub-Criterios, Norma Técnica y Evidencia por Punto
            </div>
            <div className="text-xs text-[#C9D1D9]">
              Verificación punto por punto con criterios de aceptación, ubicación exacta y plan de acción correctivo
            </div>
          </div>
        </div>

        {/* Device Mode Switcher */}
        <div className="flex items-center gap-1 bg-[#061529] p-1 rounded-xl border border-[#14508F]/70 text-xs">
          <button
            type="button"
            onClick={() => setDeviceMode('tablet')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              deviceMode === 'tablet'
                ? 'bg-[#1F6FB5] text-white font-semibold'
                : 'text-[#C9D1D9] hover:text-white'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span>Tablet (Recorrido en Planta)</span>
          </button>
          <button
            type="button"
            onClick={() => setDeviceMode('web')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              deviceMode === 'web'
                ? 'bg-[#1F6FB5] text-white font-semibold'
                : 'text-[#C9D1D9] hover:text-white'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            <span>Consola Central (Cronograma)</span>
          </button>
        </div>
      </div>

      {deviceMode === 'tablet' ? (
        /* Tablet Execution View */
        <div className="space-y-6">
          {/* Active Run Metadata */}
          <div className="p-4 rounded-xl bg-[#0A2342] border border-[#14508F]/70 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="space-y-0.5">
              <div>
                <span className="text-[#C9D1D9]">Ronda en Curso:</span>
                <span className="text-white font-bold ml-1.5">Inspección Mensual Locativa — Nave Prensas (Sector A)</span>
                <span className="font-mono text-[#5FA8E8] ml-2">#INSP-2026-10-A</span>
              </div>
              <div className="text-[11px] font-mono text-[#C9D1D9]/80">
                Fecha de Ronda: {SYSTEM_BASE_DATE_STR} · Sub-criterios verificados: <strong className="text-white">{totalSubChecksPassed}/{totalSubChecks}</strong>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-[#C9D1D9]">
                Inspector HSEQ: <strong className="text-white">{currentUser?.name || 'Carlos Mario Vélez'}</strong>
              </span>
              <div className="flex items-center gap-2 font-mono">
                <span className="px-2 py-0.5 rounded bg-[#2ECC71] text-[#0A2342] font-bold">
                  {compliantCount} Conformidades
                </span>
                <span className="px-2 py-0.5 rounded bg-[#E63946] text-white font-bold">
                  {failuresCount} No Conformidades
                </span>
              </div>
            </div>
          </div>

          {/* Inspection Items List */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h4 className="text-sm font-display font-bold text-white flex items-center gap-2">
                  <span>Lista de Verificación Detallada por Punto</span>
                  <span className="text-xs font-mono text-[#5FA8E8]">({checklist.length} puntos · {totalSubChecks} ítems a revisar)</span>
                </h4>
                <div className="text-xs text-[#C9D1D9]">
                  Despliegue cada punto para revisar su norma aplicable, criterio de aceptación y lista específica de verificación
                </div>
              </div>

              <div className="text-xs">
                {failuresCount > 0 ? (
                  <span className="text-[#FF8A00] font-semibold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {failuresCount} hallazgo(s) requieren orden de trabajo
                  </span>
                ) : (
                  <span className="text-[#2ECC71] font-semibold">100% de conformidad</span>
                )}
              </div>
            </div>

            <div className="space-y-3">
              {checklist.map((item) => {
                const isExpanded = expandedItemId === item.id;
                const subPassed = item.subChecks.filter(s => s.checked).length;

                return (
                  <div
                    key={item.id}
                    className={`rounded-2xl border transition-all overflow-hidden ${
                      item.status === 'FALLA'
                        ? 'bg-[#E63946]/10 border-[#E63946]/60 shadow-sm'
                        : 'bg-[#0A2342] border-[#14508F]/70'
                    }`}
                  >
                    {/* Item Main Bar */}
                    <div className="p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                      <div
                        onClick={() => setExpandedItemId(isExpanded ? null : item.id)}
                        className="space-y-1.5 cursor-pointer flex-1"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs text-[#0A2342] bg-[#5FA8E8] px-2 py-0.5 rounded font-bold">
                            Punto #{item.id}
                          </span>
                          <span className="text-xs text-[#C9D1D9] font-semibold">{item.category}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#061529] text-[#5FA8E8] border border-[#14508F]/60">
                            {item.referenceNorm}
                          </span>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                            item.status === 'FALLA'
                              ? 'bg-[#E63946] text-white'
                              : 'bg-[#2ECC71] text-[#0A2342]'
                          }`}>
                            {item.status === 'FALLA' ? 'NO CONFORME' : 'CONFORME'}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#061529] text-[#C9D1D9] border border-[#14508F]/50">
                            {subPassed}/{item.subChecks.length} sub-puntos OK
                          </span>
                        </div>

                        <div className="text-sm font-display font-bold text-white">{item.text}</div>

                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#C9D1D9]">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#FF8A00]" />
                            {item.locationDetail}
                          </span>
                          <span>·</span>
                          <span className="font-mono text-[#5FA8E8]">
                            Resp: {item.responsibleArea}
                          </span>
                          {item.evidenceCaptured && (
                            <>
                              <span>·</span>
                              <span className="text-[#2ECC71] flex items-center gap-1 font-mono">
                                <Camera className="w-3 h-3" />
                                Foto ATEX adjunta
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Selectors and Detail Toggle */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleStatusChange(item.id, 'CUMPLE')}
                          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            item.status === 'CUMPLE'
                              ? 'bg-[#2ECC71] text-[#0A2342] shadow-md'
                              : 'bg-[#061529] text-[#C9D1D9] border border-[#14508F]/60 hover:text-white'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Conforme</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStatusChange(item.id, 'FALLA')}
                          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            item.status === 'FALLA'
                              ? 'bg-[#E63946] text-white shadow-md'
                              : 'bg-[#061529] text-[#C9D1D9] border border-[#14508F]/60 hover:text-white'
                          }`}
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>No Conforme</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setExpandedItemId(isExpanded ? null : item.id)}
                          className="px-2.5 py-2 rounded-xl bg-[#14508F]/50 text-white hover:bg-[#1F6FB5] transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold"
                          title="Desplegar detalles a revisar"
                        >
                          <span className="hidden sm:inline">{isExpanded ? 'Ocultar' : 'Revisar Detalles'}</span>
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Expanded Technical Inspection Panel */}
                    {isExpanded && (
                      <div className="px-4 pb-5 pt-3 border-t border-[#14508F]/60 bg-[#061529]/90 space-y-4 text-xs">
                        {/* Technical Context & Acceptance Criteria */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="p-3 rounded-xl bg-[#0A2342] border border-[#14508F]/60 space-y-1">
                            <div className="text-[11px] font-bold text-[#5FA8E8] flex items-center gap-1.5 uppercase tracking-wider">
                              <BookOpen className="w-3.5 h-3.5" />
                              <span>Criterio Técnico de Aceptación ({item.referenceNorm})</span>
                            </div>
                            <p className="text-[#C9D1D9] leading-relaxed">{item.acceptanceCriteria}</p>
                          </div>

                          <div className="p-3 rounded-xl bg-[#0A2342] border border-[#14508F]/60 space-y-2">
                            <label className="text-[11px] font-bold text-[#FF8A00] flex items-center gap-1.5 uppercase tracking-wider">
                              <MapPin className="w-3.5 h-3.5" />
                              <span>Punto / Equipo Exacto Inspeccionado</span>
                            </label>
                            <input
                              type="text"
                              value={item.locationDetail}
                              onChange={(e) => handleUpdateField(item.id, 'locationDetail', e.target.value)}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-[#061529] border border-[#14508F]/70 text-xs text-white focus:outline-none focus:border-[#FF8A00]"
                            />
                          </div>
                        </div>

                        {/* Granular Sub-Checks Checklist */}
                        <div className="p-3.5 rounded-xl bg-[#0A2342]/70 border border-[#14508F]/60 space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="font-display font-bold text-white flex items-center gap-1.5">
                              <ClipboardCheck className="w-4 h-4 text-[#FF8A00]" />
                              <span>Elementos Específicos a Revisar en este Punto:</span>
                            </span>
                            <span className="font-mono text-[11px] text-[#5FA8E8]">
                              {subPassed} de {item.subChecks.length} verificados
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {item.subChecks.map((sc) => (
                              <button
                                key={sc.id}
                                type="button"
                                onClick={() => handleToggleSubCheck(item.id, sc.id)}
                                className={`p-2.5 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                                  sc.checked
                                    ? 'bg-[#2ECC71]/10 border-[#2ECC71]/40 text-white'
                                    : 'bg-[#E63946]/10 border-[#E63946]/40 text-[#C9D1D9]'
                                }`}
                              >
                                {sc.checked ? (
                                  <CheckSquare className="w-4 h-4 text-[#2ECC71] shrink-0 mt-0.5" />
                                ) : (
                                  <Square className="w-4 h-4 text-[#E63946] shrink-0 mt-0.5" />
                                )}
                                <span className="leading-snug">{sc.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Metadata & Evidence Controls */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="space-y-1">
                            <label className="text-[11px] font-semibold text-[#C9D1D9] flex items-center gap-1">
                              <ShieldAlert className="w-3.5 h-3.5 text-[#FF8A00]" />
                              <span>Criticidad del Punto</span>
                            </label>
                            <select
                              value={item.severityLevel}
                              onChange={(e) =>
                                handleUpdateField(item.id, 'severityLevel', e.target.value as CheckItem['severityLevel'])
                              }
                              className="w-full px-2.5 py-2 rounded-lg bg-[#0A2342] border border-[#14508F]/70 text-xs text-white focus:outline-none focus:border-[#FF8A00]"
                            >
                              <option value="Crítico">Crítico (Parada / Bloqueo)</option>
                              <option value="Mayor">Mayor (Plazo 24–48h)</option>
                              <option value="Menor">Menor (Preventivo)</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] font-semibold text-[#C9D1D9] flex items-center gap-1">
                              <Wrench className="w-3.5 h-3.5 text-[#5FA8E8]" />
                              <span>Área Responsable</span>
                            </label>
                            <input
                              type="text"
                              value={item.responsibleArea}
                              onChange={(e) => handleUpdateField(item.id, 'responsibleArea', e.target.value)}
                              className="w-full px-2.5 py-2 rounded-lg bg-[#0A2342] border border-[#14508F]/70 text-xs text-white focus:outline-none focus:border-[#FF8A00]"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] font-semibold text-[#C9D1D9] flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-[#5FA8E8]" />
                              <span>Evidencia Fotográfica ATEX</span>
                            </label>
                            <button
                              type="button"
                              onClick={() => handleUpdateField(item.id, 'evidenceCaptured', !item.evidenceCaptured)}
                              className={`w-full px-3 py-2 rounded-lg border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                                item.evidenceCaptured
                                  ? 'bg-[#2ECC71]/15 border-[#2ECC71]/50 text-[#2ECC71]'
                                  : 'bg-[#0A2342] border-[#14508F]/70 text-[#C9D1D9] hover:text-white'
                              }`}
                            >
                              <Camera className="w-3.5 h-3.5" />
                              <span>
                                {item.evidenceCaptured
                                  ? `Foto Sellada (${SYSTEM_BASE_DATE_STR})`
                                  : 'Capturar Evidencia CAM-ATEX'}
                              </span>
                            </button>
                          </div>
                        </div>

                        {/* Inspector Narrative Description */}
                        <div className="space-y-1">
                          <label className="font-semibold flex items-center justify-between text-[#C9D1D9]">
                            <span className="flex items-center gap-1.5">
                              <MessageSquare className={`w-3.5 h-3.5 ${item.status === 'FALLA' ? 'text-[#E63946]' : 'text-[#2ECC71]'}`} />
                              <span>
                                Descripción Detallada de la {item.status === 'FALLA' ? 'No Conformidad (Hallazgo en Sitio)' : 'Conformidad Verificada'}:
                              </span>
                            </span>
                            <span className="text-[11px] text-[#5FA8E8] font-mono">Campo editable del inspector</span>
                          </label>
                          <textarea
                            value={item.descriptionNote}
                            onChange={(e) => handleUpdateField(item.id, 'descriptionNote', e.target.value)}
                            rows={2}
                            className={`w-full px-3 py-2 rounded-xl text-xs focus:outline-none transition-all ${
                              item.status === 'FALLA'
                                ? 'bg-[#E63946]/10 border border-[#E63946]/60 text-white focus:border-[#E63946] placeholder:text-white/40'
                                : 'bg-[#0A2342] border border-[#14508F]/70 text-white focus:border-[#FF8A00] placeholder:text-[#C9D1D9]/40'
                            }`}
                            placeholder={
                              item.status === 'FALLA'
                                ? 'Describa exactamente qué falla locativa o de seguridad observó, partes afectadas, medidas de desvío...'
                                : 'Detalle cómo se constató la conformidad (mediciones tomadas, inspección visual, registros al día)...'
                            }
                          />
                        </div>

                        {/* If Non-Compliant: Corrective Action, Due Date and Ticket Tag */}
                        {item.status === 'FALLA' && (
                          <div className="p-3.5 rounded-xl bg-[#E63946]/15 border border-[#E63946]/50 space-y-2.5">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <label className="font-bold text-white flex items-center gap-1.5">
                                <Wrench className="w-3.5 h-3.5 text-[#FF8A00]" />
                                <span>Plan de Acción / Medida Correctiva Inmediata:</span>
                              </label>

                              <div className="flex items-center gap-2">
                                <span className="font-mono text-[10px] text-[#C9D1D9] bg-[#061529] px-2 py-0.5 rounded border border-[#14508F]/60">
                                  Plazo cierre: {item.dueDate}
                                </span>
                                {item.maintenanceTicketId && (
                                  <span className="font-mono text-[10px] text-[#0A2342] bg-[#FF8A00] px-2 py-0.5 rounded font-bold whitespace-nowrap">
                                    Orden Generada: {item.maintenanceTicketId}
                                  </span>
                                )}
                              </div>
                            </div>

                            <input
                              type="text"
                              value={item.correctiveAction || ''}
                              onChange={(e) => handleUpdateField(item.id, 'correctiveAction', e.target.value)}
                              className="w-full px-3 py-2 rounded-lg bg-[#061529] border border-[#E63946]/50 text-xs text-white focus:outline-none focus:border-[#FF8A00] placeholder:text-white/40"
                              placeholder="Ej: Reemplazo de guarda, enclavamiento micro-switch, solicitud a taller de mantenimiento..."
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Closure, Digital Signature & Official Act */}
          <div className="p-5 rounded-xl bg-[#0A2342] border border-[#14508F]/70 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h4 className="text-sm font-display font-bold text-white flex items-center gap-2">
                  <PenTool className="w-4 h-4 text-[#FF8A00]" />
                  Cierre de Ronda y Firma Digital del Acta
                </h4>
                <div className="text-xs text-[#C9D1D9]">
                  Consolida todas las descripciones, sub-criterios ({totalSubChecksPassed}/{totalSubChecks}) y hallazgos en el acta oficial PDF
                </div>
              </div>
              <span
                className={`text-[11px] font-mono px-2.5 py-1 rounded font-bold ${
                  isActaGenerated
                    ? 'bg-[#2ECC71] text-[#0A2342]'
                    : hasSignature
                    ? 'bg-[#5FA8E8] text-[#0A2342]'
                    : 'bg-[#061529] text-[#C9D1D9] border border-[#14508F]/70'
                }`}
              >
                {isActaGenerated
                  ? 'ACTA SELLADA'
                  : hasSignature
                  ? 'FIRMA CAPTURADA'
                  : 'PENDIENTE DE FIRMA'}
              </span>
            </div>

            {!isActaGenerated ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[#061529] border border-[#1F6FB5]/60 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="text-xs text-white font-semibold flex items-center gap-1.5">
                        <PenTool className="w-3.5 h-3.5 text-[#5FA8E8]" />
                        <span>Panel Interactivo de Firma Manuscrita (Mouse / Táctil)</span>
                      </div>
                      <div className="text-[11px] text-[#C9D1D9] font-mono">
                        Inspector: {currentUser?.name || 'Carlos Mario Vélez'} · Carné #{currentUser?.carnet || '401120'} · Fecha: {SYSTEM_BASE_DATE_STR}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleClearSignature}
                      className="px-3 py-1.5 rounded-lg bg-[#0A2342] hover:bg-[#14508F] border border-[#1F6FB5]/60 text-xs text-[#C9D1D9] hover:text-white font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Limpiar Firma</span>
                    </button>
                  </div>

                  {/* Real Interactive Signature Canvas */}
                  <div className="relative rounded-xl bg-white border-2 border-dashed border-[#1F6FB5] overflow-hidden shadow-inner">
                    <canvas
                      ref={signatureCanvasRef}
                      width={640}
                      height={180}
                      onPointerDown={handleSignaturePointerDown}
                      onPointerMove={handleSignaturePointerMove}
                      onPointerUp={finishSignatureStroke}
                      onPointerLeave={finishSignatureStroke}
                      onPointerCancel={finishSignatureStroke}
                      className="w-full h-40 touch-none cursor-crosshair block relative z-10"
                    />

                    {/* Baseline guide and helper watermark */}
                    <div className="pointer-events-none absolute inset-x-8 bottom-7 border-b border-[#C9D1D9]" />
                    <div className="pointer-events-none absolute bottom-2 inset-x-0 text-center text-[10px] font-mono text-[#5B6770]">
                      Firma del Inspector HSEQ ({currentUser?.name || 'Carlos Mario Vélez'})
                    </div>

                    {!hasSignature && (
                      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-[#5B6770]/70 px-4 text-center">
                        <PenTool className="w-5 h-5 mb-1 text-[#1F6FB5]/60" />
                        <span className="text-xs font-medium">
                          Mantenga presionado el clic del mouse y dibuje su firma aquí
                        </span>
                      </div>
                    )}
                  </div>

                  {signatureError && (
                    <div className="p-2.5 rounded-lg bg-[#E63946]/15 border border-[#E63946]/60 text-xs text-[#E63946] font-semibold flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>{signatureError}</span>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleFinalizeAndSign}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#FF8A00] hover:bg-[#ff9c24] text-[#0A2342] font-display font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer active:scale-[0.99] transition-all uppercase tracking-wide"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>CONSOLIDAR ACTA OFICIAL CON DETALLES Y FIRMAR</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[#2ECC71]/10 border border-[#2ECC71]/60 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-[#2ECC71] font-display font-bold text-sm">
                      <CheckCircle2 className="w-5 h-5" />
                      ACTA DE INSPECCIÓN OFICIAL GENERADA Y ARCHIVADA
                    </div>
                    <span className="font-mono text-xs text-[#C9D1D9]">Conservación 20 Años</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-[1fr_240px] gap-4 items-center">
                    <div className="space-y-2 text-xs text-[#C9D1D9] leading-relaxed">
                      <p>
                        Acta sellada <strong className="font-mono text-white">#ACTA-INSP-2026-10-A.pdf</strong>. Incluye los {totalSubChecks} sub-criterios revisados, referencias normativas, observaciones específicas de cada punto ({compliantCount} conformes y {failuresCount} con plan de acción correctivo) y la firma manuscrita autenticada.
                      </p>
                      <div className="font-mono text-[11px] text-[#5FA8E8]">
                        Estampa horaria ATEX: {signedTimestamp} · Inspector: {currentUser?.name || 'Carlos Mario Vélez'}
                      </div>
                    </div>

                    {/* Captured Signature Thumbnail */}
                    <div className="p-2.5 rounded-xl bg-white border border-[#C9D1D9] text-center space-y-1">
                      {signatureDataUrl && (
                        <img
                          src={signatureDataUrl}
                          alt="Firma digital del inspector"
                          className="h-14 w-full object-contain mx-auto"
                        />
                      )}
                      <div className="border-t border-[#C9D1D9] pt-1 text-[10px] font-mono text-[#0A2342] font-bold">
                        {currentUser?.name || 'Carlos Mario Vélez'} · #{currentUser?.carnet || '401120'}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#2ECC71]/30 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs text-[#FF8A00] font-semibold">
                      {failuresCount} ticket(s) de mantenimiento notificados a cuadrilla técnica
                    </span>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={handleReopenForEdit}
                        className="px-3 py-2 rounded-lg bg-[#061529] hover:bg-[#0A2342] border border-[#14508F]/70 text-[#C9D1D9] hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Nueva Firma</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowPdfTemplatePreview(prev => !prev)}
                        className="px-3 py-2 rounded-lg bg-[#0A2342] hover:bg-[#14508F] border border-[#5FA8E8]/50 text-[#5FA8E8] hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        {showPdfTemplatePreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        <span>{showPdfTemplatePreview ? 'Ocultar Plantilla PDF' : 'Ver Plantilla Interna PDF'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleDownloadActaPdf}
                        disabled={isDownloadingPdf}
                        className="px-4 py-2 rounded-lg bg-[#1F6FB5] hover:bg-[#2a82cf] disabled:opacity-60 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{isDownloadingPdf ? 'Generando PDF...' : 'Descargar Acta Completa PDF'}</span>
                      </button>
                    </div>
                  </div>

                  {pdfDownloadedToast && (
                    <div className="p-2.5 rounded-lg bg-[#2ECC71]/20 border border-[#2ECC71]/60 text-xs text-[#2ECC71] font-semibold flex items-center gap-2">
                      <FileCheck2 className="w-4 h-4 shrink-0" />
                      <span>Archivo ACTA-INSP-2026-10-A.pdf generado y descargado correctamente con su firma digital y detalle completo.</span>
                    </div>
                  )}
                </div>

                {/* Visual Internal PDF Template Preview */}
                {showPdfTemplatePreview && (
                  <div className="p-6 rounded-xl bg-white text-[#2B3036] border border-[#C9D1D9] shadow-2xl space-y-5">
                    {/* PDF Header */}
                    <div className="border border-[#C9D1D9] rounded-lg overflow-hidden">
                      <div className="p-3 bg-white flex flex-wrap items-center justify-between gap-3 border-b border-[#C9D1D9]">
                        <BrandLogo size="sm" />
                        <div className="text-[11px] font-mono text-right text-[#0A2342] leading-tight">
                          <div className="font-bold">CÓDIGO: ACTA-INSP-2026-10-A</div>
                          <div>RONDA: #INSP-2026-10-A</div>
                          <div>FECHA: {SYSTEM_BASE_DATE_STR} · RETENCIÓN: 20 AÑOS</div>
                        </div>
                      </div>
                      <div className="bg-[#0A2342] px-4 py-2 text-white font-display font-bold text-xs tracking-wide border-b-4 border-[#FF8A00]">
                        ACTA OFICIAL DE INSPECCIÓN PLANEADA DE SEGURIDAD Y CONDICIONES LOCATIVAS
                      </div>
                    </div>

                    {/* PDF General Data */}
                    <div className="p-3 rounded-lg bg-[#F5F8FC] border border-[#C9D1D9] grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="font-bold text-[#0A2342]">Ronda / Área: </span>
                        <span>Inspección Mensual Locativa — Nave Prensas (Sector A)</span>
                      </div>
                      <div>
                        <span className="font-bold text-[#0A2342]">Inspector HSEQ: </span>
                        <span>{currentUser?.name || 'Carlos Mario Vélez'} ({currentUser?.cargo || 'Supervisor HSEQ'} · #{currentUser?.carnet || '401120'})</span>
                      </div>
                    </div>

                    {/* PDF KPI Strip */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div className="p-2.5 rounded border border-[#C9D1D9] border-l-4 border-l-[#1F6FB5]">
                        <div className="text-[10px] font-bold text-[#5B6770]">PUNTOS EVALUADOS</div>
                        <div className="text-base font-display font-bold text-[#0A2342]">{checklist.length}</div>
                      </div>
                      <div className="p-2.5 rounded border border-[#C9D1D9] border-l-4 border-l-[#2ECC71]">
                        <div className="text-[10px] font-bold text-[#5B6770]">CONFORMIDADES</div>
                        <div className="text-base font-display font-bold text-[#0A2342]">{compliantCount}</div>
                      </div>
                      <div className="p-2.5 rounded border border-[#C9D1D9] border-l-4 border-l-[#E63946]">
                        <div className="text-[10px] font-bold text-[#5B6770]">NO CONFORMIDADES</div>
                        <div className="text-base font-display font-bold text-[#0A2342]">{failuresCount}</div>
                      </div>
                      <div className="p-2.5 rounded border border-[#C9D1D9] border-l-4 border-l-[#FF8A00]">
                        <div className="text-[10px] font-bold text-[#5B6770]">SUB-CRITERIOS OK</div>
                        <div className="text-base font-display font-bold text-[#0A2342]">{totalSubChecksPassed}/{totalSubChecks}</div>
                      </div>
                    </div>

                    {/* PDF Points Summary */}
                    <div className="space-y-2.5">
                      {checklist.map((pt) => (
                        <div
                          key={pt.id}
                          className={`p-3 rounded-lg border text-xs space-y-1.5 ${
                            pt.status === 'FALLA' ? 'border-[#E63946] bg-[#FFF7F7]' : 'border-[#C9D1D9] bg-white'
                          }`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="font-bold text-[#0A2342]">
                              PUNTO #{pt.id} · {pt.category} ({pt.referenceNorm})
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                                pt.status === 'FALLA'
                                  ? 'bg-[#E63946] text-white'
                                  : 'bg-[#2ECC71] text-[#0A2342]'
                              }`}
                            >
                              {pt.status === 'FALLA' ? 'NO CONFORME' : 'CONFORME'}
                            </span>
                          </div>
                          <div className="font-semibold text-[#2B3036]">{pt.text}</div>
                          <div className="text-[11px] text-[#5B6770]">
                            Ubicación: {pt.locationDetail} · Responsable: {pt.responsibleArea} · Criticidad: {pt.severityLevel}
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 pt-1">
                            {pt.subChecks.map((sc) => (
                              <div key={sc.id} className="flex items-start gap-1.5 text-[11px]">
                                <span
                                  className={`font-mono font-bold ${
                                    sc.checked ? 'text-[#2ECC71]' : 'text-[#E63946]'
                                  }`}
                                >
                                  {sc.checked ? '[OK]' : '[X]'}
                                </span>
                                <span>{sc.label}</span>
                              </div>
                            ))}
                          </div>
                          <div className="text-[11px] pt-1">
                            <strong className="text-[#0A2342]">Observación: </strong>
                            {pt.descriptionNote}
                          </div>
                          {pt.status === 'FALLA' && pt.correctiveAction && (
                            <div className="p-2 rounded bg-[#E63946]/10 border border-[#E63946]/40 text-[11px] text-[#0A2342]">
                              <strong className="text-[#E63946]">Plan de Acción ({pt.maintenanceTicketId} · Plazo {pt.dueDate}): </strong>
                              {pt.correctiveAction}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* PDF Footer Signature Block */}
                    <div className="p-4 rounded-lg bg-[#F5F8FC] border border-[#0A2342] grid grid-cols-1 sm:grid-cols-[1fr_240px] gap-4 items-center text-xs">
                      <div className="space-y-1 text-[11px] text-[#2B3036]">
                        <div className="font-bold text-[#0A2342]">CIERRE LEGAL Y AUTENTICACIÓN DIGITAL</div>
                        <p>
                          Documento autenticado electrónicamente conforme al Decreto 1072 de 2015 y Resolución 0312 de 2019.
                        </p>
                        <div className="font-mono text-[10px] text-[#0A2342]">
                          Estampa: {signedTimestamp} · Sello: SST-ACT-INSP202610A-{currentUser?.carnet || '401120'}
                        </div>
                      </div>
                      <div className="p-2 rounded bg-white border border-[#C9D1D9] text-center">
                        {signatureDataUrl && (
                          <img
                            src={signatureDataUrl}
                            alt="Firma en plantilla PDF"
                            className="h-14 w-full object-contain mx-auto"
                          />
                        )}
                        <div className="border-t border-[#0A2342] mt-1 pt-1 text-[10px] font-bold text-[#0A2342]">
                          {currentUser?.name || 'Carlos Mario Vélez'} · #{currentUser?.carnet || '401120'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Web Console Scheduler View */
        <div className="p-5 rounded-xl bg-[#0A2342] border border-[#14508F]/70 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-display font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#5FA8E8]" />
                Cronograma de Inspecciones Locativas Periódicas
              </h4>
              <div className="text-xs text-[#C9D1D9]">Planificación mensual obligatoria para todas las áreas operativas de planta</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            {[
              { mes: 'Mes Actual', area: 'Nave Prensas y Troquelado', fecha: '2026-10-28', status: 'En Ejecución en Campo', color: 'text-[#0A2342] bg-[#5FA8E8]' },
              { mes: 'Próximo Recorrido', area: 'Hornos y Tratamiento Térmico', fecha: '2026-11-12', status: 'Programada (en 15 días)', color: 'text-[#0A2342] bg-[#FF8A00]' },
              { mes: 'Siguiente Ciclo', area: 'Almacén Químico y Solventes', fecha: '2026-12-10', status: 'Programada (en 43 días)', color: 'text-[#C9D1D9] bg-[#14508F]/60' },
            ].map((sched, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-[#061529] border border-[#14508F]/60 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-display font-bold text-white">{sched.mes}</span>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${sched.color}`}>{sched.status}</span>
                </div>
                <div className="text-[#C9D1D9]">{sched.area}</div>
                <div className="text-[#5FA8E8] font-mono text-[11px]">Fecha programada: {sched.fecha}</div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-lg bg-[#061529] border border-[#14508F]/60 text-xs text-[#C9D1D9]">
            ✓ Cada inspección completada guarda el registro inmutable de sub-criterios verificados, evidencias fotográficas y observaciones por punto, permitiendo auditar la trazabilidad ante el Ministerio del Trabajo o la ARL.
          </div>
        </div>
      )}
    </div>
  );
};
