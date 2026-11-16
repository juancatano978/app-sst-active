import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { usePlant } from '../../context/PlantContext';
import {
  initGoogleAuth,
  signInWithGoogleSheets,
  getSheetsAccessToken,
  signOutGoogleSheets
} from '../../services/googleSheetsAuth';
import {
  SST_SHEET_SCHEMAS,
  SheetTableName,
  SpreadsheetMetadata,
  extractSpreadsheetId,
  inspectSpreadsheetMetadata,
  createSstDatabaseSpreadsheet,
  syncAllTablesToSheets,
  pullDatabaseFromSheets
} from '../../services/googleSheetsDb';
import {
  Database,
  Table2,
  RefreshCw,
  UploadCloud,
  DownloadCloud,
  PlusCircle,
  Link2,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  KeyRound,
  Search,
  ShieldCheck,
  LogOut,
  X,
  Sparkles,
  Layers
} from 'lucide-react';

interface ConfirmDialogState {
  open: boolean;
  actionType: 'push' | 'pull' | 'create' | null;
  title: string;
  description: string;
  details: string[];
  confirmLabel: string;
}

export const GoogleSheetsDatabase: React.FC = () => {
  const {
    quadrants,
    incidents,
    workers,
    inspections,
    bulletins,
    supervisorNotifications,
    linkedSpreadsheetId,
    setLinkedSpreadsheetId,
    pendingSheetChanges,
    lastSheetSyncAt,
    markSheetSynced,
    hydrateDatabaseFromSheets
  } = usePlant();

  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [needsAuth, setNeedsAuth] = useState<boolean>(true);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);

  const [sheetInput, setSheetInput] = useState<string>(linkedSpreadsheetId || '');
  const [newDbTitle, setNewDbTitle] = useState<string>(
    'SST-Active — Base de Datos Industrial (2026)'
  );
  const [metadata, setMetadata] = useState<SpreadsheetMetadata | null>(null);
  const [liveKpis, setLiveKpis] = useState<
    Array<{ indicador: string; valor: string; referencia: string; meta: string }>
  >([]);

  const [selectedTable, setSelectedTable] = useState<SheetTableName>('Incidentes_y_Triaje');
  const [tableSearch, setTableSearch] = useState<string>('');
  const [isBusy, setIsBusy] = useState<boolean>(false);
  const [statusBanner, setStatusBanner] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    open: false,
    actionType: null,
    title: '',
    description: '',
    details: [],
    confirmLabel: 'Confirmar'
  });

  useEffect(() => {
    const unsubscribe = initGoogleAuth(
      (user) => {
        setGoogleUser(user);
        setNeedsAuth(false);
      },
      (user) => {
        setGoogleUser(user);
        setNeedsAuth(true);
      }
    );
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (linkedSpreadsheetId && !needsAuth && getSheetsAccessToken() && !metadata) {
      inspectSpreadsheetMetadata(getSheetsAccessToken()!, linkedSpreadsheetId)
        .then((meta) => setMetadata(meta))
        .catch(() => {
          // Wait for explicit user action if metadata check fails
        });
    }
  }, [linkedSpreadsheetId, needsAuth, metadata]);

  const handleGoogleSignIn = async () => {
    setIsAuthenticating(true);
    setStatusBanner(null);
    try {
      const res = await signInWithGoogleSheets();
      setGoogleUser(res.user);
      setNeedsAuth(false);
      setStatusBanner({
        type: 'success',
        message: `Conectado con Google como ${res.user.email || res.user.displayName}. Ya puedes crear o sincronizar tu hoja de cálculo.`
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'No se pudo completar el inicio de sesión con Google.';
      setStatusBanner({ type: 'error', message: msg });
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleGoogleSignOut = async () => {
    await signOutGoogleSheets();
    setGoogleUser(null);
    setNeedsAuth(true);
    setMetadata(null);
    setStatusBanner({
      type: 'info',
      message: 'Sesión de Google Sheets desconectada de la memoria del navegador.'
    });
  };

  const requireValidToken = (): string | null => {
    const token = getSheetsAccessToken();
    if (!token || needsAuth) {
      setNeedsAuth(true);
      setStatusBanner({
        type: 'error',
        message: 'Tu sesión de Google Sheets expiró o no está iniciada. Pulsa "Sign in with Google" para continuar.'
      });
      return null;
    }
    return token;
  };

  const handleConnectExistingSheet = async () => {
    const token = requireValidToken();
    if (!token) return;
    const cleanId = extractSpreadsheetId(sheetInput);
    if (!cleanId) {
      setStatusBanner({
        type: 'error',
        message: 'Pegue la URL completa o el ID válido del documento de Google Sheets.'
      });
      return;
    }

    setIsBusy(true);
    setStatusBanner(null);
    try {
      const meta = await inspectSpreadsheetMetadata(token, cleanId);
      setMetadata(meta);
      setLinkedSpreadsheetId(meta.spreadsheetId);
      setSheetInput(meta.spreadsheetId);
      setStatusBanner({
        type: 'success',
        message: `Hoja "${meta.title}" inspeccionada (${meta.sheets.length} pestañas detectadas).`
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'No se pudo leer la hoja de cálculo.';
      if (msg === 'AUTH_EXPIRED') {
        setNeedsAuth(true);
        setStatusBanner({ type: 'error', message: 'La sesión expiró. Vuelve a iniciar sesión con Google.' });
      } else {
        setStatusBanner({ type: 'error', message: msg });
      }
    } finally {
      setIsBusy(false);
    }
  };

  const openPushConfirm = () => {
    const targetId = metadata?.spreadsheetId || extractSpreadsheetId(sheetInput);
    if (!targetId) {
      setStatusBanner({
        type: 'error',
        message: 'Primero crea una base de datos nueva o conecta un ID/URL de Google Sheets.'
      });
      return;
    }

    const totalRows =
      incidents.length +
      workers.length +
      inspections.length +
      bulletins.length +
      supervisorNotifications.length +
      9;

    setConfirmDialog({
      open: true,
      actionType: 'push',
      title: '¿Confirmar escritura y sincronización en Google Sheets?',
      description: `Se sobrescribirán y actualizarán las 6 pestañas del documento "${
        metadata?.title || targetId
      }" con el estado actual de SST-Active.`,
      details: [
        `Incidentes_y_Triaje: ${incidents.length} fila(s)`,
        `Trabajadores_EPP: ${workers.length} fila(s)`,
        `Inspecciones_Planeadas: ${inspections.length} fila(s)`,
        `Boletines_SST: ${bulletins.length} fila(s) + fórmulas de cobertura`,
        `Notificaciones_Supervisor: ${supervisorNotifications.length} fila(s)`,
        `Tablero_KPI_Formulas: 9 indicadores calculados (${totalRows} registros en total)`
      ],
      confirmLabel: 'Confirmar y Sincronizar Sheets'
    });
  };

  const openPullConfirm = () => {
    const targetId = metadata?.spreadsheetId || extractSpreadsheetId(sheetInput);
    if (!targetId) {
      setStatusBanner({
        type: 'error',
        message: 'Primero conecta un documento de Google Sheets.'
      });
      return;
    }

    setConfirmDialog({
      open: true,
      actionType: 'pull',
      title: '¿Confirmar importación de datos desde Google Sheets?',
      description: `Se leerán las tablas de "${
        metadata?.title || targetId
      }" y se reemplazarán los registros locales en sesión con los datos guardados en la hoja de cálculo.`,
      details: [
        'Se consultarán dinámicamente las pestañas existentes en el archivo.',
        'Los cambios locales no sincronizados serán reemplazados por la versión de Google Sheets.',
        'Se actualizarán los KPIs en tiempo real.'
      ],
      confirmLabel: 'Confirmar Carga desde Sheets'
    });
  };

  const openCreateConfirm = () => {
    if (!requireValidToken()) return;
    setConfirmDialog({
      open: true,
      actionType: 'create',
      title: '¿Crear nueva base de datos relacional en tu Google Drive / Sheets?',
      description: `Se creará el archivo "${newDbTitle.trim() || 'SST-Active — Base de Datos Industrial (2026)'}" en tu cuenta de Google con 6 pestañas estructuradas, encabezados congelados y fórmulas KPI.`,
      details: [
        'Se poblarán inmediatamente todas las tablas con los registros actuales de planta.',
        'Las tablas incluirán claves primarias, claves foráneas y formato corporativo SST-Active.'
      ],
      confirmLabel: 'Crear Base de Datos en Sheets'
    });
  };

  const executeConfirmedAction = async () => {
    const action = confirmDialog.actionType;
    setConfirmDialog((prev) => ({ ...prev, open: false }));

    const token = requireValidToken();
    if (!token || !action) return;

    const snapshot = {
      incidents,
      workers,
      inspections,
      bulletins,
      notifications: supervisorNotifications
    };

    setIsBusy(true);
    setStatusBanner(null);

    try {
      if (action === 'create') {
        const res = await createSstDatabaseSpreadsheet(
          token,
          snapshot,
          newDbTitle.trim() || 'SST-Active — Base de Datos Industrial (2026)'
        );
        setMetadata(res.metadata);
        setLinkedSpreadsheetId(res.metadata.spreadsheetId);
        setSheetInput(res.metadata.spreadsheetId);
        markSheetSynced();
        setStatusBanner({
          type: 'success',
          message: `Base de datos creada en Google Sheets ("${res.metadata.title}") con ${res.totalRowsSynced} filas sincronizadas.`
        });
      } else if (action === 'push') {
        const targetId = metadata?.spreadsheetId || extractSpreadsheetId(sheetInput);
        const res = await syncAllTablesToSheets(token, targetId, snapshot);
        setMetadata(res.metadata);
        setLinkedSpreadsheetId(res.metadata.spreadsheetId);
        markSheetSynced();
        setStatusBanner({
          type: 'success',
          message: `Sincronización completada: ${res.totalRowsSynced} registros y fórmulas actualizados en "${res.metadata.title}".`
        });
      } else if (action === 'pull') {
        const targetId = metadata?.spreadsheetId || extractSpreadsheetId(sheetInput);
        const pulled = await pullDatabaseFromSheets(token, targetId);
        setMetadata(pulled.metadata);
        setLinkedSpreadsheetId(pulled.metadata.spreadsheetId);
        hydrateDatabaseFromSheets(pulled.snapshot);
        setLiveKpis(pulled.kpis);
        setStatusBanner({
          type: 'success',
          message: `Datos hidratados desde "${pulled.metadata.title}". Tablas y KPIs actualizados desde Google Sheets.`
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al operar con Google Sheets.';
      if (msg === 'AUTH_EXPIRED') {
        setNeedsAuth(true);
        setStatusBanner({
          type: 'error',
          message: 'Tu sesión de Google expiró. Inicia sesión nuevamente para ejecutar la operación.'
        });
      } else {
        setStatusBanner({ type: 'error', message: msg });
      }
    } finally {
      setIsBusy(false);
    }
  };

  // Referential Integrity Audit across tables
  const validQuadrants = new Set(quadrants.map((q) => q.id));
  const validIncidentIds = new Set(incidents.map((i) => i.id));
  const orphanIncidents = incidents.filter((i) => !validQuadrants.has(i.quadrantId)).length;
  const orphanNotifications = supervisorNotifications.filter(
    (n) => !validIncidentIds.has(n.incidentId)
  ).length;
  const missingTabsInSheet = metadata
    ? SST_SHEET_SCHEMAS.filter((s) => !metadata.sheets.some((t) => t.title === s.name)).map(
        (s) => s.name
      )
    : [];

  // Build local live rows for selected table preview
  const getPreviewRowsForTable = (): { columns: string[]; rows: string[][] } => {
    switch (selectedTable) {
      case 'Incidentes_y_Triaje':
        return {
          columns: ['ID (PK)', 'Título', 'Categoría', 'Cuadrante (FK)', 'Estado', 'NR GTC45', 'Orden / Costo'],
          rows: incidents.map((i) => [
            i.id,
            i.title,
            i.category,
            i.quadrantId,
            i.status,
            i.gtc45Evaluation ? `${i.gtc45Evaluation.nr}` : 'Sin triaje',
            i.workOrder ? `${i.workOrder.id} ($${i.workOrder.cost.toLocaleString('es-CO')})` : '—'
          ])
        };
      case 'Trabajadores_EPP':
        return {
          columns: ['ID (PK)', 'Cédula', 'Trabajador', 'Cargo', 'Cert. Alturas', 'Vencimiento', 'Equipos'],
          rows: workers.map((w) => [
            w.id,
            w.cedula,
            w.name,
            w.cargo,
            w.certStatus,
            w.certExpDate,
            `${w.assignedGear.length} asignado(s)`
          ])
        };
      case 'Inspecciones_Planeadas':
        return {
          columns: ['ID (PK)', 'Área', 'Cuadrante (FK)', 'Fecha', 'Inspector', 'Estado', 'Puntaje / Hallazgos'],
          rows: inspections.map((ins) => [
            ins.id,
            ins.area,
            ins.quadrantId,
            ins.scheduledDate,
            ins.inspector,
            ins.status,
            `${ins.score}% (${ins.findingsCount} hall.)`
          ])
        };
      case 'Boletines_SST':
        return {
          columns: ['ID (PK)', 'Título', 'Categoría', 'Urgencia', 'Lecturas', 'Meta', 'Fórmula Cobertura'],
          rows: bulletins.map((b, idx) => [
            b.id,
            b.title,
            b.category,
            b.urgency,
            `${b.readsCount}`,
            `${b.totalAudience}`,
            `=IF(I${idx + 2}>0,H${idx + 2}/I${idx + 2},0) (${Math.round(
              (b.readsCount / b.totalAudience) * 100
            )}%)`
          ])
        };
      case 'Notificaciones_Supervisor':
        return {
          columns: ['ID (PK)', 'Radicado (FK)', 'Título', 'Categoría', 'Reportante', 'Hora', 'Estado'],
          rows: supervisorNotifications.map((n) => [
            n.id,
            n.incidentId,
            n.title,
            n.category,
            n.isAnonymous ? 'Anónimo' : n.reportedBy,
            n.reportedAt,
            n.read ? 'LEIDA' : 'PENDIENTE'
          ])
        };
      case 'Tablero_KPI_Formulas': {
        const rowsToShow =
          liveKpis.length > 0
            ? liveKpis.map((k) => [k.indicador, k.valor, k.referencia, k.meta])
            : [
                ['Total Incidentes Reportados', '=COUNTA(Incidentes_y_Triaje!A2:A)', 'Incidentes_y_Triaje', `${incidents.length} actual`],
                ['Equipos en Suspensión Crítica', '=COUNTIF(Incidentes_y_Triaje!J2:J,"Suspendido")', 'Incidentes_y_Triaje', '0 Tolerancia'],
                ['Reportes Confidenciales Anónimos', '=COUNTIF(Incidentes_y_Triaje!K2:K,"SI")', 'Incidentes_y_Triaje', 'Cultura Justa'],
                ['Inversión Total en Órdenes (COP)', '=SUM(Incidentes_y_Triaje!T2:T)', 'Incidentes_y_Triaje', 'Control > 1 SMMLV'],
                ['Personal Apto para Alturas', '=COUNTIF(Trabajadores_EPP!F2:F,"ACTIVO")', 'Trabajadores_EPP', 'Res. 4272/2021'],
                ['Cobertura Promedio Boletines', '=AVERAGE(Boletines_SST!J2:J)', 'Boletines_SST', '>= 80%']
              ];
        return {
          columns: ['Indicador (PK)', 'Fórmula / Valor en Sheets', 'Tabla Origen', 'Meta SST'],
          rows: rowsToShow
        };
      }
    }
  };

  const previewData = getPreviewRowsForTable();
  const q = tableSearch.trim().toLowerCase();
  const filteredRows = q
    ? previewData.rows.filter((row) => row.some((cell) => cell.toLowerCase().includes(q)))
    : previewData.rows;

  const activeSchemaMeta = SST_SHEET_SCHEMAS.find((s) => s.name === selectedTable);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-[#0A2342] border border-[#14508F]/70 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#2ECC71]/15 border border-[#2ECC71]/50 flex items-center justify-center text-[#2ECC71] shrink-0">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-display font-bold text-[#2ECC71] tracking-wider uppercase">
              Motor Relacional Google Sheets API v4
            </div>
            <div className="text-base font-display font-bold text-white">
              Base de Datos Multitabla SST-Active (6 Hojas + Fórmulas KPI + Claves PK/FK)
            </div>
            <div className="text-xs text-[#C9D1D9]">
              {metadata
                ? `Conectado a "${metadata.title}" · ${metadata.sheets.length} pestañas`
                : 'Conecta tu cuenta de Google para crear o sincronizar tu hoja de cálculo como base de datos'}
              {lastSheetSyncAt ? ` · Última sincronización: ${lastSheetSyncAt}` : ''}
            </div>
          </div>
        </div>

        {/* Auth Status / Official Sign in with Google Button */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {needsAuth ? (
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isAuthenticating}
              className="gsi-material-button bg-white hover:bg-[#F5F8FC] text-[#1F1F1F] border border-[#747775] rounded-lg px-4 py-2.5 text-xs font-semibold flex items-center gap-2.5 shadow-md transition-colors cursor-pointer disabled:opacity-60"
            >
              <span className="w-4 h-4 shrink-0 block">
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="block w-full h-full">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  <path fill="none" d="M0 0h48v48H0z" />
                </svg>
              </span>
              <span>{isAuthenticating ? 'Conectando...' : 'Sign in with Google'}</span>
            </button>
          ) : (
            <div className="flex items-center gap-2.5 bg-[#061529] px-3 py-2 rounded-xl border border-[#2ECC71]/50 text-xs">
              <CheckCircle2 className="w-4 h-4 text-[#2ECC71] shrink-0" />
              <div className="leading-tight">
                <div className="font-bold text-white truncate max-w-[170px]">
                  {googleUser?.displayName || 'Cuenta Google Conectada'}
                </div>
                <div className="text-[10px] font-mono text-[#5FA8E8] truncate max-w-[170px]">
                  {googleUser?.email || 'Acceso Sheets Activo'}
                </div>
              </div>
              <button
                type="button"
                onClick={handleGoogleSignOut}
                title="Desconectar cuenta de Google"
                className="p-1.5 rounded-lg bg-[#0A2342] hover:bg-[#E63946]/20 text-[#C9D1D9] hover:text-[#E63946] cursor-pointer transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Feedback Banner */}
      {statusBanner && (
        <div
          className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center justify-between gap-3 ${
            statusBanner.type === 'success'
              ? 'bg-[#2ECC71]/15 border-[#2ECC71]/60 text-[#2ECC71]'
              : statusBanner.type === 'error'
              ? 'bg-[#E63946]/15 border-[#E63946]/60 text-[#E63946]'
              : 'bg-[#1F6FB5]/15 border-[#5FA8E8]/60 text-[#5FA8E8]'
          }`}
        >
          <div className="flex items-center gap-2">
            {statusBanner.type === 'error' ? (
              <AlertTriangle className="w-4 h-4 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            )}
            <span>{statusBanner.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setStatusBanner(null)}
            className="text-white/70 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Connection & Provisioning Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Card A: Create New Relational Google Sheet DB */}
        <div className="p-5 rounded-2xl bg-[#0A2342] border border-[#14508F]/70 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-display font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FF8A00]" />
              <span>Opción 1: Crear Base de Datos Nueva en Google Sheets</span>
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#061529] text-[#5FA8E8] border border-[#14508F]/60">
              6 Tablas + Fórmulas
            </span>
          </div>
          <p className="text-xs text-[#C9D1D9]">
            Genera automáticamente un nuevo documento en tu Google Sheets con las 6 hojas relacionales, encabezados congelados, formato corporativo y tablero de fórmulas KPI.
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={newDbTitle}
              onChange={(e) => setNewDbTitle(e.target.value)}
              placeholder="Nombre del archivo en Google Sheets..."
              className="flex-1 px-3 py-2 rounded-xl bg-[#061529] border border-[#14508F]/70 text-xs text-white focus:outline-none focus:border-[#FF8A00]"
            />
            <button
              type="button"
              onClick={openCreateConfirm}
              disabled={isBusy || needsAuth}
              className="px-4 py-2 rounded-xl bg-[#FF8A00] hover:bg-[#ff9c24] disabled:opacity-50 text-[#0A2342] font-display font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0 transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Crear BD en Sheets</span>
            </button>
          </div>
        </div>

        {/* Card B: Connect Existing Google Sheet + Bidirectional Sync */}
        <div className="p-5 rounded-2xl bg-[#0A2342] border border-[#14508F]/70 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-display font-bold text-white flex items-center gap-2">
              <Link2 className="w-4 h-4 text-[#5FA8E8]" />
              <span>Opción 2: Conectar Documento Existente y Sincronizar</span>
            </h3>
            {pendingSheetChanges > 0 && (
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#FF8A00] text-[#0A2342]">
                {pendingSheetChanges} cambio(s) sin subir
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={sheetInput}
              onChange={(e) => setSheetInput(e.target.value)}
              placeholder="Pega el URL de Google Sheets o el Spreadsheet ID..."
              className="flex-1 px-3 py-2 rounded-xl bg-[#061529] border border-[#14508F]/70 text-xs font-mono text-white placeholder:text-[#C9D1D9]/40 focus:outline-none focus:border-[#5FA8E8]"
            />
            <button
              type="button"
              onClick={handleConnectExistingSheet}
              disabled={isBusy || needsAuth}
              className="px-3.5 py-2 rounded-xl bg-[#1F6FB5] hover:bg-[#2a82cf] disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isBusy ? 'animate-spin' : ''}`} />
              <span>Inspeccionar</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              type="button"
              onClick={openPushConfirm}
              disabled={isBusy || needsAuth || (!metadata && !sheetInput.trim())}
              className="px-3.5 py-2 rounded-xl bg-[#2ECC71] hover:bg-[#3ad97d] disabled:opacity-45 text-[#0A2342] font-display font-extrabold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Sincronizar App → Sheets</span>
            </button>

            <button
              type="button"
              onClick={openPullConfirm}
              disabled={isBusy || needsAuth || (!metadata && !sheetInput.trim())}
              className="px-3.5 py-2 rounded-xl bg-[#061529] hover:bg-[#14508F]/60 disabled:opacity-45 border border-[#5FA8E8]/50 text-[#5FA8E8] hover:text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <DownloadCloud className="w-4 h-4" />
              <span>Cargar Sheets → App</span>
            </button>

            {metadata?.spreadsheetUrl && (
              <a
                href={metadata.spreadsheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto px-3 py-2 rounded-xl bg-[#061529] border border-[#14508F]/70 text-xs text-white hover:border-[#FF8A00] flex items-center gap-1.5 transition-colors"
              >
                <span>Abrir en Google Sheets</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#FF8A00]" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Relational Integrity & Schema Audit Bar */}
      <div className="p-4 rounded-2xl bg-[#0A2342] border border-[#14508F]/70 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-[#061529] border border-[#14508F]/60 flex items-center gap-3">
          <ShieldCheck
            className={`w-5 h-5 shrink-0 ${
              orphanIncidents === 0 && orphanNotifications === 0 ? 'text-[#2ECC71]' : 'text-[#FF8A00]'
            }`}
          />
          <div>
            <div className="font-bold text-white">Integridad Referencial PK/FK</div>
            <div className="text-[11px] text-[#C9D1D9]">
              {orphanIncidents === 0 && orphanNotifications === 0
                ? '100% íntegra (0 claves foráneas huérfanas)'
                : `${orphanIncidents + orphanNotifications} referencia(s) por conciliar`}
            </div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#061529] border border-[#14508F]/60 flex items-center gap-3">
          <Layers className="w-5 h-5 text-[#5FA8E8] shrink-0" />
          <div>
            <div className="font-bold text-white">Esquema Detectado en Sheets</div>
            <div className="text-[11px] text-[#C9D1D9]">
              {metadata
                ? missingTabsInSheet.length === 0
                  ? '6/6 tablas SST-Active verificadas'
                  : `Faltan ${missingTabsInSheet.length} pestaña(s) (se crean al sincronizar)`
                : 'Modo previsualización local (sin hoja conectada aún)'}
            </div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#061529] border border-[#14508F]/60 flex items-center gap-3">
          <KeyRound className="w-5 h-5 text-[#FF8A00] shrink-0" />
          <div>
            <div className="font-bold text-white">Motor de Fórmulas Nativas</div>
            <div className="text-[11px] text-[#C9D1D9]">
              COUNTA, COUNTIF, SUM, AVERAGE e IF con USER_ENTERED
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Table Explorer */}
      <div className="p-5 rounded-2xl bg-[#0A2342] border border-[#14508F]/70 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-display font-bold text-white flex items-center gap-2">
              <Table2 className="w-4 h-4 text-[#FF8A00]" />
              <span>Explorador Relacional de Tablas</span>
            </h3>
            {activeSchemaMeta && (
              <div className="text-xs text-[#C9D1D9] mt-0.5">
                {activeSchemaMeta.description}{' '}
                <span className="font-mono text-[#5FA8E8]">
                  PK: {activeSchemaMeta.primaryKey}
                  {activeSchemaMeta.foreignKeys.length > 0
                    ? ` · FK: ${activeSchemaMeta.foreignKeys.join(', ')}`
                    : ''}
                </span>
              </div>
            )}
          </div>

          <div className="relative w-full lg:w-72">
            <Search className="w-3.5 h-3.5 text-[#5FA8E8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
              placeholder="Filtrar filas en esta tabla..."
              className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#061529] border border-[#14508F]/70 text-xs text-white placeholder:text-[#C9D1D9]/40 focus:outline-none focus:border-[#FF8A00]"
            />
          </div>
        </div>

        {/* Table Tabs */}
        <div className="flex flex-wrap gap-1.5">
          {SST_SHEET_SCHEMAS.map((schema) => {
            const isSelected = selectedTable === schema.name;
            const count =
              schema.name === 'Incidentes_y_Triaje'
                ? incidents.length
                : schema.name === 'Trabajadores_EPP'
                ? workers.length
                : schema.name === 'Inspecciones_Planeadas'
                ? inspections.length
                : schema.name === 'Boletines_SST'
                ? bulletins.length
                : schema.name === 'Notificaciones_Supervisor'
                ? supervisorNotifications.length
                : 9;

            return (
              <button
                key={schema.name}
                type="button"
                onClick={() => setSelectedTable(schema.name)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#FF8A00] text-[#0A2342] border-[#FF8A00] font-bold'
                    : 'bg-[#061529] text-[#C9D1D9] border-[#14508F]/60 hover:text-white'
                }`}
              >
                <span>{schema.name}</span>
                <span
                  className={`px-1.5 py-0.2 rounded text-[10px] ${
                    isSelected ? 'bg-[#0A2342] text-white' : 'bg-[#14508F]/60 text-[#5FA8E8]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Table Data Grid */}
        <div className="overflow-x-auto rounded-xl border border-[#14508F]/70 bg-[#061529]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0A2342] text-[#5FA8E8] font-mono text-[11px] border-b border-[#14508F]/70">
              <tr>
                {previewData.columns.map((col) => (
                  <th key={col} className="px-3 py-2.5 whitespace-nowrap font-bold">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#14508F]/40">
              {filteredRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={previewData.columns.length}
                    className="px-4 py-6 text-center text-[#C9D1D9]"
                  >
                    Sin registros para mostrar en esta vista.
                  </td>
                </tr>
              ) : (
                filteredRows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-[#14508F]/20 transition-colors">
                    {row.map((cell, cIdx) => (
                      <td
                        key={cIdx}
                        className={`px-3 py-2.5 max-w-[260px] truncate ${
                          cIdx === 0
                            ? 'font-mono font-bold text-[#FF8A00]'
                            : 'text-[#C9D1D9]'
                        }`}
                        title={cell}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Explicit Confirmation Modal for Mutating / Overwriting Google Sheets Operations */}
      {confirmDialog.open && (
        <div className="fixed inset-0 z-50 bg-[#061529]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-lg w-full rounded-2xl bg-[#0A2342] border-2 border-[#FF8A00] p-6 space-y-4 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-6 h-6 text-[#FF8A00] shrink-0" />
                <h4 className="text-base font-display font-bold text-white">
                  {confirmDialog.title}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setConfirmDialog((prev) => ({ ...prev, open: false }))}
                className="text-[#C9D1D9] hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#C9D1D9] leading-relaxed">
              {confirmDialog.description}
            </p>

            <ul className="p-3.5 rounded-xl bg-[#061529] border border-[#14508F]/70 space-y-1.5 text-xs font-mono text-[#5FA8E8]">
              {confirmDialog.details.map((d, idx) => (
                <li key={idx}>• {d}</li>
              ))}
            </ul>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDialog((prev) => ({ ...prev, open: false }))}
                className="px-4 py-2 rounded-xl bg-[#061529] border border-[#14508F]/70 text-xs font-semibold text-[#C9D1D9] hover:text-white cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={executeConfirmedAction}
                className="px-4 py-2 rounded-xl bg-[#FF8A00] hover:bg-[#ff9c24] text-[#0A2342] font-display font-extrabold text-xs cursor-pointer shadow-lg"
              >
                {confirmDialog.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
