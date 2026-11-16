import {
  PlantIncidentReport,
  WorkerEPPProfile,
  PlannedInspectionRun,
  SafetyBulletinItem,
  SupervisorNotification,
  BulletinCategory
} from '../types/plantOps';
import { clearCachedSheetsToken } from './googleSheetsAuth';

const SHEETS_API_BASE = 'https://sheets.googleapis.com/v4/spreadsheets';

export type SheetTableName =
  | 'Incidentes_y_Triaje'
  | 'Trabajadores_EPP'
  | 'Inspecciones_Planeadas'
  | 'Boletines_SST'
  | 'Notificaciones_Supervisor'
  | 'Tablero_KPI_Formulas';

export interface SheetTabMeta {
  sheetId: number;
  title: string;
  rowCount: number;
  columnCount: number;
}

export interface SpreadsheetMetadata {
  spreadsheetId: string;
  title: string;
  spreadsheetUrl: string;
  sheets: SheetTabMeta[];
}

export interface PlantDatabaseSnapshot {
  incidents: PlantIncidentReport[];
  workers: WorkerEPPProfile[];
  inspections: PlannedInspectionRun[];
  bulletins: SafetyBulletinItem[];
  notifications: SupervisorNotification[];
}

export interface TableSchemaDefinition {
  name: SheetTableName;
  primaryKey: string;
  foreignKeys: string[];
  description: string;
  headers: string[];
}

export const SST_SHEET_SCHEMAS: TableSchemaDefinition[] = [
  {
    name: 'Incidentes_y_Triaje',
    primaryKey: 'id',
    foreignKeys: ['quadrantId'],
    description: 'Registro maestro de reportes del Tótem, evaluaciones GTC 45 y órdenes de trabajo.',
    headers: [
      'id',
      'title',
      'category',
      'quadrantId',
      'quadrantName',
      'area',
      'supervisor',
      'reportedBy',
      'reportedAt',
      'status',
      'isAnonymous',
      'description',
      'gtc45_nd',
      'gtc45_ne',
      'gtc45_np',
      'gtc45_nc',
      'gtc45_nr',
      'gtc45_level',
      'workOrder_id',
      'workOrder_cost',
      'workOrder_status',
      'workOrder_description',
      'workOrder_authorizedBy'
    ]
  },
  {
    name: 'Trabajadores_EPP',
    primaryKey: 'id',
    foreignKeys: [],
    description: 'Directorio de personal habilitado para trabajo en alturas (Res. 4272) y equipos serializados.',
    headers: [
      'id',
      'name',
      'cedula',
      'cargo',
      'area',
      'certStatus',
      'certExpDate',
      'certNumber',
      'trainingCenter',
      'assignedGearCount',
      'assignedGearJson'
    ]
  },
  {
    name: 'Inspecciones_Planeadas',
    primaryKey: 'id',
    foreignKeys: ['quadrantId'],
    description: 'Cronograma, puntaje de cumplimiento y actas PDF de recorridos locativos mensuales.',
    headers: [
      'id',
      'area',
      'quadrantId',
      'scheduledDate',
      'inspector',
      'status',
      'score',
      'findingsCount',
      'actaPdfUrl'
    ]
  },
  {
    name: 'Boletines_SST',
    primaryKey: 'id',
    foreignKeys: [],
    description: 'Boletines operativos, controles exigidos y cobertura calculada con fórmula nativa.',
    headers: [
      'id',
      'title',
      'category',
      'urgency',
      'targetAudience',
      'publishedAt',
      'author',
      'readsCount',
      'totalAudience',
      'coveragePctFormula',
      'legalBasis',
      'summary',
      'requiredControlsJson',
      'acknowledgedByCarnetsJson',
      'contentJson'
    ]
  },
  {
    name: 'Notificaciones_Supervisor',
    primaryKey: 'id',
    foreignKeys: ['incidentId'],
    description: 'Cola de alertas en tiempo real generadas por el Tótem hacia el Supervisor HSEQ.',
    headers: [
      'id',
      'incidentId',
      'title',
      'description',
      'category',
      'quadrantName',
      'area',
      'reportedBy',
      'reportedAt',
      'isAnonymous',
      'read'
    ]
  },
  {
    name: 'Tablero_KPI_Formulas',
    primaryKey: 'indicador',
    foreignKeys: [],
    description: 'Indicadores dinámicos calculados automáticamente dentro de Google Sheets.',
    headers: ['indicador', 'formula_o_valor', 'referencia_tabla', 'meta_sst']
  }
];

export const extractSpreadsheetId = (input: string): string => {
  const trimmed = input.trim();
  const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) return match[1];
  return trimmed;
};

async function sheetsFetch<T>(
  url: string,
  accessToken: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });

  if (res.status === 401) {
    clearCachedSheetsToken();
    throw new Error('AUTH_EXPIRED');
  }

  if (!res.ok) {
    let msg = `Error HTTP ${res.status}`;
    try {
      const errBody = await res.json();
      msg = errBody?.error?.message || msg;
    } catch {
      // ignore json parse error
    }
    throw new Error(msg);
  }

  return (await res.json()) as T;
}

const buildRowsForSnapshot = (snapshot: PlantDatabaseSnapshot): Record<SheetTableName, (string | number | boolean)[][]> => {
  const incidentRows = snapshot.incidents.map((inc) => [
    inc.id,
    inc.title,
    inc.category,
    inc.quadrantId,
    inc.quadrantName,
    inc.area,
    inc.supervisor,
    inc.reportedBy,
    inc.reportedAt,
    inc.status,
    inc.isAnonymous ? 'SI' : 'NO',
    inc.description,
    inc.gtc45Evaluation?.nd ?? '',
    inc.gtc45Evaluation?.ne ?? '',
    inc.gtc45Evaluation?.np ?? '',
    inc.gtc45Evaluation?.nc ?? '',
    inc.gtc45Evaluation?.nr ?? '',
    inc.gtc45Evaluation?.level ?? '',
    inc.workOrder?.id ?? '',
    inc.workOrder?.cost ?? '',
    inc.workOrder?.status ?? '',
    inc.workOrder?.description ?? '',
    inc.workOrder?.authorizedBy ?? ''
  ]);

  const workerRows = snapshot.workers.map((w) => [
    w.id,
    w.name,
    w.cedula,
    w.cargo,
    w.area,
    w.certStatus,
    w.certExpDate,
    w.certNumber,
    w.trainingCenter,
    w.assignedGear.length,
    JSON.stringify(w.assignedGear)
  ]);

  const inspectionRows = snapshot.inspections.map((ins) => [
    ins.id,
    ins.area,
    ins.quadrantId,
    ins.scheduledDate,
    ins.inspector,
    ins.status,
    ins.score,
    ins.findingsCount,
    ins.actaPdfUrl || ''
  ]);

  const bulletinRows = snapshot.bulletins.map((b, idx) => {
    const rowNum = idx + 2;
    return [
      b.id,
      b.title,
      b.category,
      b.urgency,
      b.targetAudience,
      b.publishedAt,
      b.author,
      b.readsCount,
      b.totalAudience,
      `=IF(I${rowNum}>0,H${rowNum}/I${rowNum},0)`,
      b.legalBasis,
      b.summary,
      JSON.stringify(b.requiredControls),
      JSON.stringify(b.acknowledgedByCarnets),
      JSON.stringify(b.content)
    ];
  });

  const notificationRows = snapshot.notifications.map((n) => [
    n.id,
    n.incidentId,
    n.title,
    n.description,
    n.category,
    n.quadrantName,
    n.area,
    n.reportedBy,
    n.reportedAt,
    n.isAnonymous ? 'SI' : 'NO',
    n.read ? 'LEIDA' : 'PENDIENTE'
  ]);

  const kpiRows: (string | number)[][] = [
    ['Total Incidentes Reportados', '=COUNTA(Incidentes_y_Triaje!A2:A)', 'Incidentes_y_Triaje', 'Trazabilidad 100%'],
    ['Equipos en Suspensión Crítica', '=COUNTIF(Incidentes_y_Triaje!J2:J,"Suspendido")', 'Incidentes_y_Triaje', '0 Tolerancia'],
    ['Reportes Confidenciales Anónimos', '=COUNTIF(Incidentes_y_Triaje!K2:K,"SI")', 'Incidentes_y_Triaje', 'Cultura Justa'],
    ['Inversión Total en Órdenes (COP)', '=SUM(Incidentes_y_Triaje!T2:T)', 'Incidentes_y_Triaje', 'Control > 1 SMMLV'],
    ['Personal Apto para Alturas', '=COUNTIF(Trabajadores_EPP!F2:F,"ACTIVO")', 'Trabajadores_EPP', 'Res. 4272/2021'],
    ['Personal Certificado Vencido', '=COUNTIF(Trabajadores_EPP!F2:F,"VENCIDO")', 'Trabajadores_EPP', 'Bloqueo Automático'],
    ['Promedio Cumplimiento Inspecciones', '=AVERAGE(Inspecciones_Planeadas!G2:G)', 'Inspecciones_Planeadas', '>= 90%'],
    ['Cobertura Promedio Boletines', '=AVERAGE(Boletines_SST!J2:J)', 'Boletines_SST', '>= 80%'],
    ['Alertas Pendientes Supervisor', '=COUNTIF(Notificaciones_Supervisor!K2:K,"PENDIENTE")', 'Notificaciones_Supervisor', 'Atención < 15 min']
  ];

  return {
    Incidentes_y_Triaje: incidentRows,
    Trabajadores_EPP: workerRows,
    Inspecciones_Planeadas: inspectionRows,
    Boletines_SST: bulletinRows,
    Notificaciones_Supervisor: notificationRows,
    Tablero_KPI_Formulas: kpiRows
  };
};

/**
 * Consulta los metadatos reales de un Google Sheet (sin asumir nombres de pestañas).
 */
export const inspectSpreadsheetMetadata = async (
  accessToken: string,
  rawIdOrUrl: string
): Promise<SpreadsheetMetadata> => {
  const spreadsheetId = extractSpreadsheetId(rawIdOrUrl);
  const data = await sheetsFetch<{
    spreadsheetId: string;
    spreadsheetUrl: string;
    properties: { title: string };
    sheets: Array<{
      properties: {
        sheetId: number;
        title: string;
        gridProperties?: { rowCount?: number; columnCount?: number };
      };
    }>;
  }>(
    `${SHEETS_API_BASE}/${spreadsheetId}?fields=spreadsheetId,spreadsheetUrl,properties.title,sheets(properties(sheetId,title,gridProperties))`,
    accessToken
  );

  return {
    spreadsheetId: data.spreadsheetId,
    title: data.properties?.title || 'Google Sheet SST-Active',
    spreadsheetUrl: data.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${data.spreadsheetId}/edit`,
    sheets: (data.sheets || []).map((s) => ({
      sheetId: s.properties.sheetId,
      title: s.properties.title,
      rowCount: s.properties.gridProperties?.rowCount ?? 1000,
      columnCount: s.properties.gridProperties?.columnCount ?? 26
    }))
  };
};

/**
 * Aplica formato corporativo SST-Active (encabezados Azul Marino, filas congeladas y porcentaje en KPI).
 */
const applyCorporateFormatting = async (
  accessToken: string,
  spreadsheetId: string,
  sheets: SheetTabMeta[]
): Promise<void> => {
  const requests: Record<string, unknown>[] = [];

  for (const schema of SST_SHEET_SCHEMAS) {
    const tab = sheets.find((s) => s.title === schema.name);
    if (!tab) continue;

    // Congelar fila 1
    requests.push({
      updateSheetProperties: {
        properties: {
          sheetId: tab.sheetId,
          gridProperties: { frozenRowCount: 1 }
        },
        fields: 'gridProperties.frozenRowCount'
      }
    });

    // Estilo de encabezado Azul Marino #0A2342 con texto blanco negrita
    requests.push({
      repeatCell: {
        range: {
          sheetId: tab.sheetId,
          startRowIndex: 0,
          endRowIndex: 1,
          startColumnIndex: 0,
          endColumnIndex: schema.headers.length
        },
        cell: {
          userEnteredFormat: {
            backgroundColor: { red: 10 / 255, green: 35 / 255, blue: 66 / 255 },
            textFormat: {
              foregroundColor: { red: 1, green: 1, blue: 1 },
              bold: true,
              fontSize: 10
            },
            horizontalAlignment: 'LEFT',
            verticalAlignment: 'MIDDLE'
          }
        },
        fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)'
      }
    });

    // Autoajustar columnas
    requests.push({
      autoResizeDimensions: {
        dimensions: {
          sheetId: tab.sheetId,
          dimension: 'COLUMNS',
          startIndex: 0,
          endIndex: schema.headers.length
        }
      }
    });

    // Formato % en columna J de Boletines_SST
    if (schema.name === 'Boletines_SST') {
      requests.push({
        repeatCell: {
          range: {
            sheetId: tab.sheetId,
            startRowIndex: 1,
            endRowIndex: 200,
            startColumnIndex: 9,
            endColumnIndex: 10
          },
          cell: {
            userEnteredFormat: {
              numberFormat: { type: 'PERCENT', pattern: '0.0%' }
            }
          },
          fields: 'userEnteredFormat.numberFormat'
        }
      });
    }
  }

  if (requests.length > 0) {
    await sheetsFetch(`${SHEETS_API_BASE}/${spreadsheetId}:batchUpdate`, accessToken, {
      method: 'POST',
      body: JSON.stringify({ requests })
    });
  }
};

/**
 * Asegura que todas las pestañas relacionales de SST-Active existan en el Spreadsheet conectado.
 */
export const ensureSchemaTabs = async (
  accessToken: string,
  spreadsheetId: string
): Promise<SpreadsheetMetadata> => {
  let meta = await inspectSpreadsheetMetadata(accessToken, spreadsheetId);
  const existingTitles = new Set(meta.sheets.map((s) => s.title));
  const missingSchemas = SST_SHEET_SCHEMAS.filter((s) => !existingTitles.has(s.name));

  if (missingSchemas.length > 0) {
    const requests = missingSchemas.map((schema) => ({
      addSheet: {
        properties: {
          title: schema.name,
          gridProperties: {
            frozenRowCount: 1,
            rowCount: 200,
            columnCount: Math.max(12, schema.headers.length + 2)
          }
        }
      }
    }));

    await sheetsFetch(`${SHEETS_API_BASE}/${spreadsheetId}:batchUpdate`, accessToken, {
      method: 'POST',
      body: JSON.stringify({ requests })
    });

    meta = await inspectSpreadsheetMetadata(accessToken, spreadsheetId);
  }

  return meta;
};

/**
 * Crea un nuevo Google Sheet con el esquema relacional completo SST-Active y carga los datos iniciales.
 */
export const createSstDatabaseSpreadsheet = async (
  accessToken: string,
  snapshot: PlantDatabaseSnapshot,
  customTitle = 'SST-Active — Base de Datos Industrial (2026)'
): Promise<{ metadata: SpreadsheetMetadata; totalRowsSynced: number }> => {
  const created = await sheetsFetch<{
    spreadsheetId: string;
    spreadsheetUrl: string;
    properties: { title: string };
    sheets: Array<{
      properties: {
        sheetId: number;
        title: string;
        gridProperties?: { rowCount?: number; columnCount?: number };
      };
    }>;
  }>(SHEETS_API_BASE, accessToken, {
    method: 'POST',
    body: JSON.stringify({
      properties: {
        title: customTitle,
        locale: 'es_CO'
      },
      sheets: SST_SHEET_SCHEMAS.map((schema, idx) => ({
        properties: {
          title: schema.name,
          index: idx,
          gridProperties: {
            frozenRowCount: 1,
            rowCount: 250,
            columnCount: Math.max(12, schema.headers.length + 2)
          }
        }
      }))
    })
  });

  const syncRes = await syncAllTablesToSheets(accessToken, created.spreadsheetId, snapshot);
  return syncRes;
};

/**
 * Sincroniza (limpia y reescribe de forma atómica) todas las 6 tablas SST-Active hacia Google Sheets.
 */
export const syncAllTablesToSheets = async (
  accessToken: string,
  spreadsheetId: string,
  snapshot: PlantDatabaseSnapshot
): Promise<{ metadata: SpreadsheetMetadata; totalRowsSynced: number }> => {
  const metadata = await ensureSchemaTabs(accessToken, spreadsheetId);
  const rowsMap = buildRowsForSnapshot(snapshot);

  // Limpiar rangos existentes antes de escribir para evitar filas huérfanas tras eliminaciones/cambios
  const rangesToClear = SST_SHEET_SCHEMAS.map((s) => `'${s.name}'!A1:Z500`);
  await sheetsFetch(`${SHEETS_API_BASE}/${spreadsheetId}/values:batchClear`, accessToken, {
    method: 'POST',
    body: JSON.stringify({ ranges: rangesToClear })
  });

  // Escribir encabezados y registros usando USER_ENTERED para activar fórmulas nativas
  let totalRowsSynced = 0;
  const data = SST_SHEET_SCHEMAS.map((schema) => {
    const bodyRows = rowsMap[schema.name] || [];
    totalRowsSynced += bodyRows.length;
    return {
      range: `'${schema.name}'!A1`,
      majorDimension: 'ROWS',
      values: [schema.headers, ...bodyRows]
    };
  });

  await sheetsFetch(`${SHEETS_API_BASE}/${spreadsheetId}/values:batchUpdate`, accessToken, {
    method: 'POST',
    body: JSON.stringify({
      valueInputOption: 'USER_ENTERED',
      data
    })
  });

  await applyCorporateFormatting(accessToken, spreadsheetId, metadata.sheets);
  const refreshedMeta = await inspectSpreadsheetMetadata(accessToken, spreadsheetId);
  return { metadata: refreshedMeta, totalRowsSynced };
};

const safeJsonParse = <T,>(raw: string | undefined, fallback: T): T => {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

export interface PulledDatabaseResult {
  metadata: SpreadsheetMetadata;
  snapshot: Partial<PlantDatabaseSnapshot>;
  kpis: Array<{ indicador: string; valor: string; referencia: string; meta: string }>;
}

/**
 * Lee dinámicamente las pestañas presentes en Google Sheets e hidrata los datos de SST-Active.
 */
export const pullDatabaseFromSheets = async (
  accessToken: string,
  spreadsheetId: string
): Promise<PulledDatabaseResult> => {
  const metadata = await inspectSpreadsheetMetadata(accessToken, spreadsheetId);
  const existingTitles = new Set(metadata.sheets.map((s) => s.title));
  const targetTabs = SST_SHEET_SCHEMAS.map((s) => s.name).filter((name) =>
    existingTitles.has(name)
  );

  if (targetTabs.length === 0) {
    throw new Error(
      'Este Google Sheet aún no contiene las tablas de SST-Active. Use "Inicializar / Sincronizar Esquema" primero.'
    );
  }

  const queryParams = targetTabs
    .map((tab) => `ranges=${encodeURIComponent(`'${tab}'!A1:Z500`)}`)
    .join('&');

  const batchData = await sheetsFetch<{
    valueRanges: Array<{ range: string; values?: string[][] }>;
  }>(`${SHEETS_API_BASE}/${spreadsheetId}/values:batchGet?${queryParams}`, accessToken);

  const byTable: Partial<Record<SheetTableName, string[][]>> = {};
  targetTabs.forEach((tabName, idx) => {
    const vr = batchData.valueRanges?.[idx];
    byTable[tabName] = (vr?.values || []).slice(1); // omitir encabezado
  });

  const snapshot: Partial<PlantDatabaseSnapshot> = {};

  if (byTable.Incidentes_y_Triaje && byTable.Incidentes_y_Triaje.length > 0) {
    snapshot.incidents = byTable.Incidentes_y_Triaje.filter((r) => r[0]).map((r) => {
      const nd = Number(r[12]);
      const ne = Number(r[13]);
      const np = Number(r[14]);
      const nc = Number(r[15]);
      const nr = Number(r[16]);
      const hasEval = !Number.isNaN(nd) && nd > 0 && !Number.isNaN(nr) && nr > 0;
      const hasWorkOrder = Boolean(r[18]);

      const validCategories: PlantIncidentReport['category'][] = [
        'Locativo',
        'Mecánico',
        'Eléctrico',
        'Químico'
      ];
      const cat = validCategories.includes(r[2] as PlantIncidentReport['category'])
        ? (r[2] as PlantIncidentReport['category'])
        : 'Locativo';

      const validStatuses: PlantIncidentReport['status'][] = [
        'Reportado',
        'En Triaje',
        'Mitigado',
        'Suspendido',
        'Cerrado'
      ];
      const st = validStatuses.includes(r[9] as PlantIncidentReport['status'])
        ? (r[9] as PlantIncidentReport['status'])
        : 'Reportado';

      return {
        id: r[0],
        title: r[1] || 'Condición reportada',
        category: cat,
        quadrantId: r[3] || 'Q-A1',
        quadrantName: r[4] || 'Nave Prensas y Troquelado',
        area: r[5] || 'Sector A',
        supervisor: r[6] || 'Carlos Mario Vélez',
        reportedBy: r[7] || 'Operario de Turno',
        reportedAt: r[8] || '2026-10-28 08:00',
        status: st,
        isAnonymous: r[10] === 'SI',
        description: r[11] || '',
        ...(hasEval
          ? {
              gtc45Evaluation: {
                nd,
                ne,
                np,
                nc,
                nr,
                level: r[17] || 'Nivel II',
                evaluatedAt: r[8] || '2026-10-28 08:30',
                evaluator: r[6] || 'Carlos Mario Vélez (HSEQ)'
              }
            }
          : {}),
        ...(hasWorkOrder
          ? {
              workOrder: {
                id: r[18],
                cost: Number(r[19]) || 0,
                status: (r[20] as NonNullable<PlantIncidentReport['workOrder']>['status']) || 'Pendiente SST',
                description: r[21] || '',
                authorizedBy: r[22] || undefined
              }
            }
          : {})
      };
    });
  }

  if (byTable.Trabajadores_EPP && byTable.Trabajadores_EPP.length > 0) {
    snapshot.workers = byTable.Trabajadores_EPP.filter((r) => r[0]).map((r) => ({
      id: r[0],
      name: r[1] || '',
      cedula: r[2] || '',
      cargo: r[3] || '',
      area: r[4] || '',
      certStatus:
        (r[5] as WorkerEPPProfile['certStatus']) === 'VENCIDO' ||
        (r[5] as WorkerEPPProfile['certStatus']) === 'PROXIMO_VENCER'
          ? (r[5] as WorkerEPPProfile['certStatus'])
          : 'ACTIVO',
      certExpDate: r[6] || '2027-01-01',
      certNumber: r[7] || '',
      trainingCenter: r[8] || '',
      assignedGear: safeJsonParse(r[10], [])
    }));
  }

  if (byTable.Inspecciones_Planeadas && byTable.Inspecciones_Planeadas.length > 0) {
    snapshot.inspections = byTable.Inspecciones_Planeadas.filter((r) => r[0]).map((r) => ({
      id: r[0],
      area: r[1] || '',
      quadrantId: r[2] || 'Q-A1',
      scheduledDate: r[3] || '2026-10-28',
      inspector: r[4] || '',
      status:
        (r[5] as PlannedInspectionRun['status']) === 'Completada' ||
        (r[5] as PlannedInspectionRun['status']) === 'Programada'
          ? (r[5] as PlannedInspectionRun['status'])
          : 'En Curso',
      score: Number(r[6]) || 0,
      findingsCount: Number(r[7]) || 0,
      actaPdfUrl: r[8] || undefined
    }));
  }

  if (byTable.Boletines_SST && byTable.Boletines_SST.length > 0) {
    snapshot.bulletins = byTable.Boletines_SST.filter((r) => r[0]).map((r) => ({
      id: r[0],
      title: r[1] || '',
      category: (r[2] as BulletinCategory) || 'Riesgo Mecánico',
      urgency:
        (r[3] as SafetyBulletinItem['urgency']) === 'PREVENTIVO' ||
        (r[3] as SafetyBulletinItem['urgency']) === 'INFORMATIVO'
          ? (r[3] as SafetyBulletinItem['urgency'])
          : 'ALTA PRIORIDAD',
      targetAudience: r[4] || '',
      publishedAt: r[5] || '2026-10-28 07:00',
      author: r[6] || 'Coordinación HSEQ',
      readsCount: Number(r[7]) || 0,
      totalAudience: Number(r[8]) || 60,
      legalBasis: r[10] || 'Decreto 1072 de 2015',
      summary: r[11] || '',
      requiredControls: safeJsonParse<string[]>(r[12], []),
      acknowledgedByCarnets: safeJsonParse<string[]>(r[13], []),
      content: safeJsonParse<string[]>(r[14], [])
    }));
  }

  if (byTable.Notificaciones_Supervisor) {
    snapshot.notifications = byTable.Notificaciones_Supervisor.filter((r) => r[0]).map((r) => ({
      id: r[0],
      incidentId: r[1] || '',
      title: r[2] || '',
      description: r[3] || '',
      category: (r[4] as PlantIncidentReport['category']) || 'Locativo',
      quadrantName: r[5] || '',
      area: r[6] || '',
      reportedBy: r[7] || '',
      reportedAt: r[8] || '',
      isAnonymous: r[9] === 'SI',
      read: r[10] === 'LEIDA'
    }));
  }

  const kpis = (byTable.Tablero_KPI_Formulas || [])
    .filter((r) => r[0])
    .map((r) => ({
      indicador: r[0] || '',
      valor: r[1] || '',
      referencia: r[2] || '',
      meta: r[3] || ''
    }));

  return { metadata, snapshot, kpis };
};
