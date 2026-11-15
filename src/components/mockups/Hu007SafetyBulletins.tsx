import React, { useState } from 'react';
import { usePlant } from '../../context/PlantContext';
import { BulletinCategory, SafetyBulletinItem } from '../../types/plantOps';
import { getSystemTimestamp } from '../../utils/dateUtils';
import {
  Megaphone,
  Radio,
  CheckCircle2,
  Clock,
  AlertOctagon,
  Fingerprint,
  Eye,
  PlusCircle,
  Search,
  ShieldCheck,
  BookOpen,
  Users,
  Trash2,
  Plus,
  Sparkles,
  ArrowRight,
  AlertTriangle,
  FileText
} from 'lucide-react';

const BULLETIN_CATEGORIES: BulletinCategory[] = [
  'Riesgo Mecánico',
  'Riesgo Eléctrico',
  'Riesgo Químico',
  'Trabajo en Alturas',
  'Emergencias',
  'Locativo y Ergonomía'
];

const SUGGESTED_CONTROLS = [
  'Candado Personal LOTO',
  'Guantes Anticorte Nivel 5',
  'Arnés Dieléctrico 4 Argollas',
  'Casco con Barbuquejo 3 Puntos',
  'Respirador Vapores Orgánicos',
  'Gafas de Seguridad',
  'Tapete Dieléctrico',
  'Pinzas Extractoras 40 cm',
  'Kit Antiderrames'
];

export const Hu007SafetyBulletins: React.FC = () => {
  const { currentUser, bulletins, recordBulletinRead, createBulletin } = usePlant();
  const canCreateBulletin =
    currentUser?.role === 'SUPERVISOR_HSEQ' ||
    currentUser?.role === 'GERENCIA' ||
    currentUser?.role === 'ALMACENISTA';
  const canViewAnalytics =
    currentUser?.role === 'SUPERVISOR_HSEQ' || currentUser?.role === 'GERENCIA';

  const [activeView, setActiveView] = useState<'totem' | 'create' | 'analytics'>('totem');
  const [selectedBulletinId, setSelectedBulletinId] = useState<string>(
    bulletins[0]?.id || 'BOL-2026-048'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState<'TODOS' | SafetyBulletinItem['urgency']>('TODOS');
  const [publishedBanner, setPublishedBanner] = useState<string>('');
  const [ackTimestamps, setAckTimestamps] = useState<Record<string, string>>({});

  // Create Bulletin Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<BulletinCategory>('Riesgo Mecánico');
  const [urgency, setUrgency] = useState<SafetyBulletinItem['urgency']>('ALTA PRIORIDAD');
  const [targetAudience, setTargetAudience] = useState('');
  const [totalAudience, setTotalAudience] = useState<number>(80);
  const [summary, setSummary] = useState('');
  const [legalBasis, setLegalBasis] = useState('Decreto 1072 de 2015 · Res. 2400/1979');
  const [steps, setSteps] = useState<string[]>(['', '']);
  const [selectedControls, setSelectedControls] = useState<string[]>(['Gafas de Seguridad']);
  const [customControl, setCustomControl] = useState('');
  const [formError, setFormError] = useState('');

  const effectiveView =
    activeView === 'create' && !canCreateBulletin
      ? 'totem'
      : activeView === 'analytics' && !canViewAnalytics
      ? 'totem'
      : activeView;

  const filteredBulletins = bulletins.filter((b) => {
    const matchesUrgency = urgencyFilter === 'TODOS' || b.urgency === urgencyFilter;
    const q = searchQuery.trim().toLowerCase();
    const matchesQuery =
      !q ||
      b.title.toLowerCase().includes(q) ||
      b.category.toLowerCase().includes(q) ||
      b.targetAudience.toLowerCase().includes(q) ||
      b.id.toLowerCase().includes(q);
    return matchesUrgency && matchesQuery;
  });

  const selectedBulletin =
    bulletins.find((b) => b.id === selectedBulletinId) || filteredBulletins[0] || bulletins[0];

  const userBadge = currentUser?.carnet || '883921';
  const isSelectedAcknowledged = selectedBulletin
    ? selectedBulletin.acknowledgedByCarnets.includes(userBadge)
    : false;

  const pendingForUserCount = bulletins.filter(
    (b) => !b.acknowledgedByCarnets.includes(userBadge)
  ).length;

  const handleTapBadge = (bulletinId: string) => {
    recordBulletinRead(bulletinId, userBadge);
    setAckTimestamps((prev) => ({
      ...prev,
      [bulletinId]: getSystemTimestamp()
    }));
  };

  const applyTemplate = (preset: 'loto' | 'alturas' | 'quimico') => {
    setFormError('');
    if (preset === 'loto') {
      setTitle('Bloqueo Seguro LOTO en Intervenciones de Mantenimiento Correctivo');
      setCategory('Riesgo Mecánico');
      setUrgency('ALTA PRIORIDAD');
      setTargetAudience('Mantenimiento Mecánico y Operarios de Prensas — Sector A');
      setTotalAudience(65);
      setSummary(
        'Alerta preventiva tras identificar intentos de ajuste rápido sin desenergizar tableros. Toda intervención dentro de zonas de atrapamiento exige bloqueo individual con candado y prueba de energía cero.'
      );
      setLegalBasis('OSHA 1910.147 · Res. 2400/1979 Art. 267');
      setSteps([
        'Detenga la máquina desde el panel de control y corte la alimentación principal en el seccionador.',
        'Coloque su candado personal y tarjeta de identificación LOTO antes de abrir guardas.',
        'Ejecute prueba de arranque (verificación de energía cero) y libere presión neumática/hidráulica residual.'
      ]);
      setSelectedControls(['Candado Personal LOTO', 'Guantes Anticorte Nivel 5', 'Gafas de Seguridad']);
    } else if (preset === 'alturas') {
      setTitle('Verificación Obligatoria de Puntos de Anclaje y Permiso en Cubiertas');
      setCategory('Trabajo en Alturas');
      setUrgency('ALTA PRIORIDAD');
      setTargetAudience('Contratistas, Montajes y Almacén EPP — Planta General');
      setTotalAudience(45);
      setSummary(
        'Lineamiento previo a labores de mantenimiento en techos y cerchas por encima de 2.0 metros. Se prohíbe anclarse a tuberías eléctricas, ductos de ventilación o barandas no certificadas.'
      );
      setLegalBasis('Resolución 4272 de 2021 · ANSI Z359.1');
      setSteps([
        'Solicite el Permiso de Trabajo en Alturas firmado por el coordinador autorizado antes de ascender.',
        'Valide certificado vigente en el pañol e inspeccione argollas y costuras del arnés.',
        'Utilice únicamente líneas de vida y puntos de anclaje certificados >= 5.000 lb (22.2 kN).'
      ]);
      setSelectedControls([
        'Arnés Dieléctrico 4 Argollas',
        'Casco con Barbuquejo 3 Puntos',
        'Gafas de Seguridad'
      ]);
    } else {
      setTitle('Protocolo de Actuación Ante Derrames Menores de Solventes en Planta');
      setCategory('Riesgo Químico');
      setUrgency('PREVENTIVO');
      setTargetAudience('Almacén Químico, Pinturas y Brigada de Emergencias');
      setTotalAudience(55);
      setSummary(
        'Guía práctica de contención rápida con material absorbente inerte para evitar filtraciones a desagües pluviales o acumulación de vapores inflamables.'
      );
      setLegalBasis('Decreto 1496/2018 (SGA) · NFPA 30');
      setSteps([
        'Aísle el área con conos y elimine cualquier fuente de chispa o equipo eléctrico cercano.',
        'Use respirador de vapores orgánicos, guantes de nitrilo y gafas antisalpicaduras antes de contener el líquido.',
        'Rodee el derrame con cordones absorbentes del kit antiderrames y deposite el residuo en bolsa roja rotulada.'
      ]);
      setSelectedControls(['Respirador Vapores Orgánicos', 'Kit Antiderrames', 'Gafas de Seguridad']);
    }
  };

  const handleToggleControl = (ctrl: string) => {
    setSelectedControls((prev) =>
      prev.includes(ctrl) ? prev.filter((c) => c !== ctrl) : [...prev, ctrl]
    );
  };

  const handleAddCustomControl = () => {
    const cleaned = customControl.trim();
    if (!cleaned) return;
    if (!selectedControls.includes(cleaned)) {
      setSelectedControls((prev) => [...prev, cleaned]);
    }
    setCustomControl('');
  };

  const handleStepChange = (index: number, value: string) => {
    setSteps((prev) => prev.map((s, idx) => (idx === index ? value : s)));
  };

  const handleAddStep = () => {
    setSteps((prev) => [...prev, '']);
  };

  const handleRemoveStep = (index: number) => {
    if (steps.length <= 1) return;
    setSteps((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handlePublishBulletin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSteps = steps.map((s) => s.trim()).filter(Boolean);

    if (!title.trim() || !targetAudience.trim() || !summary.trim()) {
      setFormError('Complete el título, la cuadrilla destinataria y el resumen del contexto preventivo.');
      return;
    }
    if (cleanSteps.length === 0) {
      setFormError('Agregue al menos una directriz operativa obligatoria para los trabajadores.');
      return;
    }

    const created = createBulletin({
      title,
      category,
      urgency,
      targetAudience,
      summary,
      legalBasis,
      requiredControls: selectedControls,
      totalAudience,
      content: cleanSteps
    });

    setSelectedBulletinId(created.id);
    setPublishedBanner(
      `Boletín ${created.id} publicado con éxito y visible inmediatamente en todos los tótems de planta.`
    );
    setActiveView('totem');
    setUrgencyFilter('TODOS');
    setSearchQuery('');

    // Reset form
    setTitle('');
    setTargetAudience('');
    setSummary('');
    setSteps(['', '']);
    setFormError('');
  };

  const getUrgencyBadgeClass = (level: SafetyBulletinItem['urgency']) => {
    if (level === 'ALTA PRIORIDAD') {
      return 'bg-[#E63946] text-white';
    }
    if (level === 'PREVENTIVO') {
      return 'bg-[#FF8A00] text-[#0A2342]';
    }
    return 'bg-[#5FA8E8] text-[#0A2342]';
  };

  // Global analytics metrics
  const totalReadsAll = bulletins.reduce((acc, b) => acc + b.readsCount, 0);
  const totalAudienceAll = bulletins.reduce((acc, b) => acc + b.totalAudience, 0);
  const globalCoveragePercent =
    totalAudienceAll > 0 ? Math.round((totalReadsAll / totalAudienceAll) * 100) : 0;
  const bulletinsMeetingGoal = bulletins.filter(
    (b) => Math.round((b.readsCount / b.totalAudience) * 100) >= 80
  ).length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-4 rounded-xl bg-[#0A2342] border border-[#14508F]/70 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1F6FB5]/25 border border-[#5FA8E8]/40 flex items-center justify-center text-[#FF8A00]">
            <Megaphone className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-display font-bold text-[#5FA8E8] tracking-wider">
              BOLETINES DE SEGURIDAD Y LECCIONES APRENDIDAS
            </div>
            <div className="text-sm font-display font-bold text-white">
              Centro de Difusión Operativa, Creación de Alertas y Acuse por Carné
            </div>
            <div className="text-xs text-[#C9D1D9]">
              {bulletins.length} boletines activos · {pendingForUserCount} pendiente(s) por confirmar con carné #{userBadge} (Ley 1581 sin huella dactilar)
            </div>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex flex-wrap items-center gap-1 bg-[#061529] p-1 rounded-xl border border-[#14508F]/70 text-xs">
          <button
            type="button"
            onClick={() => setActiveView('totem')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              effectiveView === 'totem'
                ? 'bg-[#1F6FB5] text-white font-semibold'
                : 'text-[#C9D1D9] hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Cartelera ({bulletins.length})</span>
          </button>

          {canCreateBulletin && (
            <button
              type="button"
              onClick={() => {
                setPublishedBanner('');
                setActiveView('create');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                effectiveView === 'create'
                  ? 'bg-[#FF8A00] text-[#0A2342] font-bold'
                  : 'text-[#FF8A00] hover:bg-[#FF8A00]/15 font-semibold'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Crear Boletín</span>
            </button>
          )}

          {canViewAnalytics && (
            <button
              type="button"
              onClick={() => setActiveView('analytics')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                effectiveView === 'analytics'
                  ? 'bg-[#1F6FB5] text-white font-semibold'
                  : 'text-[#C9D1D9] hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Cobertura HSEQ</span>
            </button>
          )}
        </div>
      </div>

      {/* Published Confirmation Toast */}
      {publishedBanner && (
        <div className="p-3.5 rounded-xl bg-[#2ECC71]/15 border border-[#2ECC71]/60 text-xs text-[#2ECC71] font-semibold flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{publishedBanner}</span>
          </div>
          <button
            type="button"
            onClick={() => setPublishedBanner('')}
            className="text-[#C9D1D9] hover:text-white text-[11px] underline cursor-pointer"
          >
            Cerrar aviso
          </button>
        </div>
      )}

      {/* VIEW 1: CARTELERA DE BOLETINES Y LECTURA */}
      {effectiveView === 'totem' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Bulletin Directory + Filters */}
          <div className="lg:col-span-4 space-y-3">
            <div className="p-3.5 rounded-2xl bg-[#0A2342] border border-[#14508F]/70 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-display font-bold text-white uppercase tracking-wider">
                  Boletines Publicados
                </span>
                {canCreateBulletin && (
                  <button
                    type="button"
                    onClick={() => setActiveView('create')}
                    className="text-[11px] font-bold text-[#0A2342] bg-[#FF8A00] hover:bg-[#ff9c24] px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Nuevo</span>
                  </button>
                )}
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#5FA8E8] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por tema, código o sector..."
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#061529] border border-[#14508F]/70 text-xs text-white placeholder:text-[#C9D1D9]/50 focus:outline-none focus:border-[#FF8A00]"
                />
              </div>

              {/* Urgency Filter Buttons */}
              <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                {(['TODOS', 'ALTA PRIORIDAD', 'PREVENTIVO', 'INFORMATIVO'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setUrgencyFilter(lvl)}
                    className={`px-2 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer truncate ${
                      urgencyFilter === lvl
                        ? 'bg-[#1F6FB5] text-white'
                        : 'bg-[#061529] text-[#C9D1D9] border border-[#14508F]/50 hover:text-white'
                    }`}
                  >
                    {lvl === 'TODOS' ? `Todos (${bulletins.length})` : lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* List of Bulletins */}
            <div className="space-y-2.5 max-h-[540px] overflow-y-auto pr-1">
              {filteredBulletins.length === 0 ? (
                <div className="p-4 rounded-xl bg-[#0A2342] border border-[#14508F]/60 text-xs text-[#C9D1D9] text-center">
                  No se encontraron boletines con ese filtro.
                </div>
              ) : (
                filteredBulletins.map((b) => {
                  const isActive = selectedBulletin?.id === b.id;
                  const isAck = b.acknowledgedByCarnets.includes(userBadge);
                  const pct = Math.round((b.readsCount / b.totalAudience) * 100);

                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setSelectedBulletinId(b.id)}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                        isActive
                          ? 'bg-[#14508F]/35 border-[#FF8A00] shadow-md'
                          : 'bg-[#0A2342] border-[#14508F]/60 hover:border-[#5FA8E8]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${getUrgencyBadgeClass(
                            b.urgency
                          )}`}
                        >
                          {b.urgency}
                        </span>
                        <span className="text-[10px] font-mono text-[#5FA8E8]">{b.id}</span>
                      </div>

                      <div className="text-xs font-display font-bold text-white leading-snug line-clamp-2">
                        {b.title}
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-[#C9D1D9] font-mono">
                        <span>{b.category}</span>
                        <span>{b.publishedAt.split(' ')[0]}</span>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-[#14508F]/40 text-[10px]">
                        <span className="font-mono text-[#5FA8E8]">
                          Lectura: {b.readsCount}/{b.totalAudience} ({pct}%)
                        </span>
                        {isAck ? (
                          <span className="text-[#2ECC71] font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Leído
                          </span>
                        ) : (
                          <span className="text-[#FF8A00] font-bold">Pendiente</span>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Detailed Reader + RFID Acknowledgment */}
          <div className="lg:col-span-8 space-y-4">
            {selectedBulletin && (
              <div className="p-6 rounded-2xl bg-[#0A2342] border border-[#14508F]/70 space-y-5 shadow-xl">
                {/* Bulletin Header Meta */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#14508F]/60 pb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`font-mono text-xs font-bold px-2.5 py-0.5 rounded ${getUrgencyBadgeClass(
                        selectedBulletin.urgency
                      )}`}
                    >
                      {selectedBulletin.urgency}
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#061529] text-[#5FA8E8] border border-[#14508F]/60">
                      {selectedBulletin.category}
                    </span>
                    <span className="text-xs font-mono text-[#C9D1D9]">{selectedBulletin.id}</span>
                  </div>
                  <div className="text-xs text-[#C9D1D9] font-mono flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#5FA8E8]" />
                    <span>Publicado: {selectedBulletin.publishedAt}</span>
                  </div>
                </div>

                {/* Title & Audience */}
                <div className="space-y-2.5">
                  <h3 className="text-lg font-display font-extrabold text-white leading-snug">
                    {selectedBulletin.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#C9D1D9]">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#FF8A00]" />
                      <strong className="text-white">Dirigido a:</strong> {selectedBulletin.targetAudience}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-[#5FA8E8]">
                    Emitido por: {selectedBulletin.author}
                  </div>
                </div>

                {/* Context / Why it matters */}
                <div className="p-4 rounded-xl bg-[#061529] border-l-4 border-[#FF8A00] border border-[#14508F]/60 space-y-1.5">
                  <div className="text-xs font-display font-bold text-[#FF8A00] flex items-center gap-1.5 uppercase tracking-wider">
                    <AlertOctagon className="w-4 h-4" />
                    <span>Contexto Preventivo y Motivo de la Alerta</span>
                  </div>
                  <p className="text-xs text-[#C9D1D9] leading-relaxed">{selectedBulletin.summary}</p>
                </div>

                {/* Numbered Safety Directives */}
                <div className="space-y-2.5">
                  <div className="text-xs font-display font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#2ECC71]" />
                    <span>Directrices Obligatorias en Puesto de Trabajo</span>
                  </div>
                  {selectedBulletin.content.map((point, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-[#061529] border border-[#14508F]/60 text-xs sm:text-sm text-white flex items-start gap-3"
                    >
                      <span className="w-6 h-6 rounded-full bg-[#1F6FB5] text-white font-display font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="leading-relaxed text-[#C9D1D9]">{point}</p>
                    </div>
                  ))}
                </div>

                {/* Required EPP Controls + Legal Reference */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-[#061529] border border-[#14508F]/60 space-y-2">
                    <div className="text-[11px] font-display font-bold text-[#5FA8E8] uppercase tracking-wider">
                      EPP y Controles Críticos Exigidos
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedBulletin.requiredControls.map((ctrl, i) => (
                        <span
                          key={i}
                          className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-[#14508F]/40 border border-[#5FA8E8]/40 text-white"
                        >
                          ✓ {ctrl}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#061529] border border-[#14508F]/60 space-y-1.5">
                    <div className="text-[11px] font-display font-bold text-[#5FA8E8] uppercase tracking-wider flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Marco Normativo Aplicable</span>
                    </div>
                    <p className="text-xs font-mono text-[#C9D1D9]">{selectedBulletin.legalBasis}</p>
                  </div>
                </div>

                {/* RFID Confirmation Strip */}
                <div
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col sm:flex-row items-center justify-between gap-4 ${
                    isSelectedAcknowledged
                      ? 'bg-[#2ECC71]/10 border-[#2ECC71]/60'
                      : 'bg-[#061529] border-dashed border-[#FF8A00]/70'
                  }`}
                >
                  <div className="flex items-center gap-3 text-left">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                        isSelectedAcknowledged
                          ? 'bg-[#2ECC71] text-[#0A2342]'
                          : 'bg-[#FF8A00]/20 text-[#FF8A00]'
                      }`}
                    >
                      {isSelectedAcknowledged ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : (
                        <Radio className="w-6 h-6 animate-pulse" />
                      )}
                    </div>

                    <div className="space-y-0.5">
                      {isSelectedAcknowledged ? (
                        <>
                          <div className="text-xs font-display font-bold text-[#2ECC71]">
                            ACUSE DE LECTURA CONFIRMADO CON CARNÉ #{userBadge}
                          </div>
                          <div className="text-[11px] text-[#C9D1D9] font-mono">
                            {currentUser?.name || 'Colaborador'} · Sello digital:{' '}
                            {ackTimestamps[selectedBulletin.id] || selectedBulletin.publishedAt}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="text-xs font-display font-bold text-white">
                            CONFIRMACIÓN DE LECTURA OBLIGATORIA (RFID / NFC)
                          </div>
                          <div className="text-[11px] text-[#C9D1D9]">
                            Aproxime o registre su carné #{userBadge} para certificar que leyó y comprendió este boletín.
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {!isSelectedAcknowledged ? (
                    <button
                      type="button"
                      onClick={() => handleTapBadge(selectedBulletin.id)}
                      className="px-4 py-2.5 rounded-xl bg-[#FF8A00] hover:bg-[#ff9c24] text-[#0A2342] font-display font-extrabold text-xs flex items-center gap-2 shadow-lg cursor-pointer shrink-0 transition-all"
                    >
                      <Radio className="w-4 h-4" />
                      <span>Confirmar Lectura (#{userBadge})</span>
                    </button>
                  ) : (
                    <span className="px-3 py-1.5 rounded-lg bg-[#2ECC71] text-[#0A2342] font-mono font-bold text-[11px] shrink-0">
                      Cobertura: {selectedBulletin.readsCount}/{selectedBulletin.totalAudience}
                    </span>
                  )}
                </div>

                {/* Ley 1581 Privacy Note */}
                <div className="flex items-center gap-2 text-[11px] text-[#C9D1D9]/80 pt-1">
                  <Fingerprint className="w-4 h-4 text-[#5FA8E8] shrink-0" />
                  <span>
                    Cumplimiento Ley 1581 de 2012: el registro de acuse se realiza únicamente mediante código de carné corporativo sin captura biométrica.
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: CREAR Y PUBLICAR NUEVO BOLETÍN */}
      {effectiveView === 'create' && canCreateBulletin && (
        <form
          onSubmit={handlePublishBulletin}
          className="p-6 rounded-2xl bg-[#0A2342] border border-[#14508F]/70 space-y-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#14508F]/60 pb-4">
            <div>
              <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-[#FF8A00]" />
                <span>Redactar y Publicar Nuevo Boletín de Seguridad</span>
              </h3>
              <div className="text-xs text-[#C9D1D9]">
                Al publicar, el comunicado aparecerá al instante en la cartelera de los tótems de planta para acuse de lectura.
              </div>
            </div>

            {/* Quick Templates */}
            <div className="flex flex-wrap items-center gap-2 text-[11px]">
              <span className="text-[#5FA8E8] font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Plantillas rápidas:
              </span>
              <button
                type="button"
                onClick={() => applyTemplate('loto')}
                className="px-2.5 py-1 rounded-lg bg-[#061529] hover:bg-[#14508F] border border-[#1F6FB5]/60 text-white cursor-pointer transition-colors"
              >
                Alerta LOTO
              </button>
              <button
                type="button"
                onClick={() => applyTemplate('alturas')}
                className="px-2.5 py-1 rounded-lg bg-[#061529] hover:bg-[#14508F] border border-[#1F6FB5]/60 text-white cursor-pointer transition-colors"
              >
                Alturas Res. 4272
              </button>
              <button
                type="button"
                onClick={() => applyTemplate('quimico')}
                className="px-2.5 py-1 rounded-lg bg-[#061529] hover:bg-[#14508F] border border-[#1F6FB5]/60 text-white cursor-pointer transition-colors"
              >
                Derrame Químico
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="md:col-span-2 space-y-1.5">
              <label className="font-bold text-white block">
                Título del Boletín o Lección Aprendida *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: Protocolo de Desenergización LOTO en Prensa Troqueladora #2"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#061529] border border-[#14508F]/70 text-white placeholder:text-[#C9D1D9]/40 focus:outline-none focus:border-[#FF8A00]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-white block">Categoría de Riesgo</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as BulletinCategory)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#061529] border border-[#14508F]/70 text-white focus:outline-none focus:border-[#FF8A00]"
              >
                {BULLETIN_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-white block">Nivel de Urgencia</label>
              <div className="grid grid-cols-3 gap-2">
                {(['ALTA PRIORIDAD', 'PREVENTIVO', 'INFORMATIVO'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setUrgency(lvl)}
                    className={`py-2 px-2 rounded-xl font-bold text-[11px] border transition-all cursor-pointer ${
                      urgency === lvl
                        ? `${getUrgencyBadgeClass(lvl)} border-white/40 shadow`
                        : 'bg-[#061529] text-[#C9D1D9] border-[#14508F]/60 hover:text-white'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-white block">Área / Cuadrilla Destinataria *</label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="Ej: Operarios Sector A y Mantenimiento Mecánico"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#061529] border border-[#14508F]/70 text-white placeholder:text-[#C9D1D9]/40 focus:outline-none focus:border-[#FF8A00]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="font-bold text-white block">Personal Objetivo</label>
                <input
                  type="number"
                  min={1}
                  max={500}
                  value={totalAudience}
                  onChange={(e) => setTotalAudience(Number(e.target.value) || 1)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#061529] border border-[#14508F]/70 text-white font-mono focus:outline-none focus:border-[#FF8A00]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-white block">Norma / Sustento</label>
                <input
                  type="text"
                  value={legalBasis}
                  onChange={(e) => setLegalBasis(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#061529] border border-[#14508F]/70 text-white focus:outline-none focus:border-[#FF8A00]"
                />
              </div>
            </div>

            <div className="md:col-span-2 space-y-1.5">
              <label className="font-bold text-white block">
                Contexto Preventivo / ¿Qué ocurrió o por qué se emite? *
              </label>
              <textarea
                rows={3}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Explique brevemente el hallazgo, casi-accidente o riesgo identificado en planta que motiva este boletín..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#061529] border border-[#14508F]/70 text-white placeholder:text-[#C9D1D9]/40 focus:outline-none focus:border-[#FF8A00]"
              />
            </div>
          </div>

          {/* Dynamic Mandatory Steps Builder */}
          <div className="p-4 rounded-xl bg-[#061529] border border-[#14508F]/60 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-display font-bold text-white">
                Directrices Operativas Obligatorias (Pasos a cumplir en planta) *
              </span>
              <button
                type="button"
                onClick={handleAddStep}
                className="px-2.5 py-1 rounded-lg bg-[#1F6FB5] hover:bg-[#2a82cf] text-white font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Agregar Paso</span>
              </button>
            </div>

            <div className="space-y-2">
              {steps.map((stepVal, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#14508F] text-white font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={stepVal}
                    onChange={(e) => handleStepChange(idx, e.target.value)}
                    placeholder={`Describa la instrucción obligatoria #${idx + 1}...`}
                    className="flex-1 px-3 py-2 rounded-lg bg-[#0A2342] border border-[#14508F]/70 text-white placeholder:text-[#C9D1D9]/40 focus:outline-none focus:border-[#FF8A00]"
                  />
                  {steps.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveStep(idx)}
                      className="p-2 rounded-lg text-[#E63946] hover:bg-[#E63946]/15 cursor-pointer"
                      title="Eliminar paso"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* EPP & Controls Picker */}
          <div className="p-4 rounded-xl bg-[#061529] border border-[#14508F]/60 space-y-3 text-xs">
            <div className="font-display font-bold text-white">
              EPP y Controles Críticos Exigidos
            </div>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_CONTROLS.map((ctrl) => {
                const active = selectedControls.includes(ctrl);
                return (
                  <button
                    key={ctrl}
                    type="button"
                    onClick={() => handleToggleControl(ctrl)}
                    className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold transition-colors cursor-pointer ${
                      active
                        ? 'bg-[#2ECC71] text-[#0A2342] border-[#2ECC71]'
                        : 'bg-[#0A2342] text-[#C9D1D9] border-[#14508F]/60 hover:text-white'
                    }`}
                  >
                    {active ? '✓ ' : '+ '}
                    {ctrl}
                  </button>
                );
              })}
              {selectedControls
                .filter((c) => !SUGGESTED_CONTROLS.includes(c))
                .map((custom) => (
                  <button
                    key={custom}
                    type="button"
                    onClick={() => handleToggleControl(custom)}
                    className="px-2.5 py-1.5 rounded-lg bg-[#2ECC71] text-[#0A2342] text-[11px] font-semibold cursor-pointer"
                  >
                    ✓ {custom}
                  </button>
                ))}
            </div>

            <div className="flex gap-2 max-w-md">
              <input
                type="text"
                value={customControl}
                onChange={(e) => setCustomControl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomControl();
                  }
                }}
                placeholder="Otro control o EPP específico..."
                className="flex-1 px-3 py-1.5 rounded-lg bg-[#0A2342] border border-[#14508F]/70 text-white text-xs focus:outline-none focus:border-[#FF8A00]"
              />
              <button
                type="button"
                onClick={handleAddCustomControl}
                className="px-3 py-1.5 rounded-lg bg-[#14508F] hover:bg-[#1F6FB5] text-white font-semibold cursor-pointer"
              >
                Añadir
              </button>
            </div>
          </div>

          {formError && (
            <div className="p-3 rounded-xl bg-[#E63946]/15 border border-[#E63946]/60 text-xs text-[#E63946] font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setActiveView('totem')}
              className="px-4 py-2.5 rounded-xl bg-[#061529] border border-[#14508F]/70 text-xs font-semibold text-[#C9D1D9] hover:text-white cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-3 rounded-xl bg-[#FF8A00] hover:bg-[#ff9c24] text-[#0A2342] font-display font-extrabold text-xs uppercase tracking-wide flex items-center gap-2 shadow-lg cursor-pointer"
            >
              <Megaphone className="w-4 h-4" />
              <span>Publicar Boletín en Tótems de Planta</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* VIEW 3: PANEL DE COBERTURA HSEQ */}
      {effectiveView === 'analytics' && canViewAnalytics && (
        <div className="space-y-5">
          {/* Global KPI Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[#0A2342] border border-[#14508F]/70 space-y-1">
              <div className="text-[11px] font-mono text-[#5FA8E8] uppercase">Cobertura Global de Lectura</div>
              <div className="text-2xl font-display font-extrabold text-[#2ECC71]">{globalCoveragePercent}%</div>
              <div className="text-xs text-[#C9D1D9]">
                {totalReadsAll} de {totalAudienceAll} acuses confirmados
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0A2342] border border-[#14508F]/70 space-y-1">
              <div className="text-[11px] font-mono text-[#5FA8E8] uppercase">Boletines en Meta (&gt;= 80%)</div>
              <div className="text-2xl font-display font-extrabold text-white">
                {bulletinsMeetingGoal} / {bulletins.length}
              </div>
              <div className="text-xs text-[#C9D1D9]">Seguimiento Decreto 1072 / Estándares Mínimos</div>
            </div>

            <div className="p-4 rounded-xl bg-[#0A2342] border border-[#14508F]/70 flex items-center justify-between gap-3">
              <div>
                <div className="text-[11px] font-mono text-[#FF8A00] uppercase">Acción Rápida</div>
                <div className="text-xs text-[#C9D1D9] mt-1">
                  ¿Nuevo riesgo o hallazgo de inspección?
                </div>
              </div>
              {canCreateBulletin && (
                <button
                  type="button"
                  onClick={() => setActiveView('create')}
                  className="px-3 py-2 rounded-xl bg-[#FF8A00] hover:bg-[#ff9c24] text-[#0A2342] font-display font-bold text-xs shrink-0 cursor-pointer"
                >
                  + Crear
                </button>
              )}
            </div>
          </div>

          {/* Per-Bulletin Coverage Table/Cards */}
          <div className="p-5 rounded-2xl bg-[#0A2342] border border-[#14508F]/70 space-y-4">
            <div className="flex items-center justify-between border-b border-[#14508F]/60 pb-3">
              <h4 className="text-sm font-display font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#5FA8E8]" />
                <span>Desglose de Asimilación y Lectura por Boletín</span>
              </h4>
              <span className="text-xs font-mono text-[#5FA8E8]">Meta corporativa: &gt;= 80%</span>
            </div>

            <div className="space-y-3">
              {bulletins.map((b) => {
                const pct = Math.round((b.readsCount / b.totalAudience) * 100);
                const onTarget = pct >= 80;

                return (
                  <div
                    key={b.id}
                    className="p-4 rounded-xl bg-[#061529] border border-[#14508F]/60 space-y-2.5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${getUrgencyBadgeClass(
                            b.urgency
                          )}`}
                        >
                          {b.urgency}
                        </span>
                        <span className="text-xs font-mono text-[#5FA8E8]">{b.id}</span>
                        <span className="text-xs font-display font-bold text-white">{b.title}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedBulletinId(b.id);
                          setActiveView('totem');
                        }}
                        className="text-[11px] text-[#5FA8E8] hover:text-white underline cursor-pointer"
                      >
                        Abrir en cartelera
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#C9D1D9]">
                      <span>Público: {b.targetAudience}</span>
                      <span className="font-mono">
                        <strong className={onTarget ? 'text-[#2ECC71]' : 'text-[#FF8A00]'}>
                          {pct}%
                        </strong>{' '}
                        ({b.readsCount}/{b.totalAudience} confirmados ·{' '}
                        {b.totalAudience - b.readsCount} pendientes)
                      </span>
                    </div>

                    <div className="w-full bg-[#0A2342] rounded-full h-2.5 p-0.5 border border-[#14508F]/60">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-500 ${
                          onTarget ? 'bg-[#2ECC71]' : 'bg-[#FF8A00]'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
