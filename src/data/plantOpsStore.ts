import { PlantIncidentReport, WorkerEPPProfile, PlantQuadrant, PlannedInspectionRun, SafetyBulletinItem, PlantUserProfile } from '../types/plantOps';

export const PLANT_USERS: PlantUserProfile[] = [
  {
    id: 'USR-01',
    carnet: '883921',
    cedula: '1.036.782.110',
    name: 'Juan Andrés Cataño Suárez',
    cargo: 'Operario de Prensas y Mantenimiento',
    area: 'Nave Prensas y Troquelado (Sector A)',
    turno: 'Turno A (06:00 - 14:00)',
    role: 'OPERARIO',
    roleLabel: 'Operario de Planta',
    allowedModules: ['dashboard', 'totem', 'boletines']
  },
  {
    id: 'USR-02',
    carnet: '401120',
    cedula: '71.380.220',
    name: 'Carlos Mario Vélez',
    cargo: 'Especialista SST / Inspector HSEQ',
    area: 'Coordinación HSEQ — Planta General',
    turno: 'Turno Campo / Administrativo',
    role: 'SUPERVISOR_HSEQ',
    roleLabel: 'Supervisor HSEQ / SST',
    allowedModules: ['dashboard', 'totem', 'triaje', 'inspecciones', 'legal', 'boletines', 'presupuesto']
  },
  {
    id: 'USR-03',
    carnet: '502310',
    cedula: '98.612.440',
    name: 'Diego Alejandro Pineda',
    cargo: 'Coordinador de Pañol y Equipos de Alturas',
    area: 'Almacén Técnico de EPP (Sector E)',
    turno: 'Turno A (06:00 - 14:00)',
    role: 'ALMACENISTA',
    roleLabel: 'Almacenista Técnico EPP',
    allowedModules: ['dashboard', 'alturas', 'totem', 'boletines']
  },
  {
    id: 'USR-04',
    carnet: '100001',
    cedula: '43.820.115',
    name: 'Dra. Valeria Aristizábal',
    cargo: 'Gerente General de Operaciones',
    area: 'Dirección Ejecutiva de Planta',
    turno: 'Consola Gerencial',
    role: 'GERENCIA',
    roleLabel: 'Gerencia General',
    allowedModules: ['dashboard', 'presupuesto', 'legal', 'inspecciones', 'boletines']
  }
];

export const INITIAL_QUADRANTS: PlantQuadrant[] = [
  { id: 'Q-A1', name: 'Nave Prensas y Troquelado', area: 'Sector A', riskClass: 'V', supervisor: 'Carlos Mario Vélez', activeHazards: 2, criticalConditions: 1 },
  { id: 'Q-B2', name: 'Hornos y Tratamiento Térmico', area: 'Sector B', riskClass: 'V', supervisor: 'Elena Montoya', activeHazards: 1, criticalConditions: 0 },
  { id: 'Q-C3', name: 'Línea de Ensamble y Soldadura', area: 'Sector C', riskClass: 'IV', supervisor: 'Andrés Gómez', activeHazards: 1, criticalConditions: 0 },
  { id: 'Q-D4', name: 'Almacén Químico y Solventes', area: 'Sector D', riskClass: 'V', supervisor: 'Marta Cecilia Ríos', activeHazards: 2, criticalConditions: 1 },
  { id: 'Q-E5', name: 'Patio de Maniobras y Montacargas', area: 'Sector E', riskClass: 'IV', supervisor: 'Diego Pineda', activeHazards: 1, criticalConditions: 0 },
  { id: 'Q-F6', name: 'Taller de Torno y Fresado', area: 'Sector F', riskClass: 'III', supervisor: 'Carlos Mario Vélez', activeHazards: 0, criticalConditions: 0 }
];

export const INITIAL_INCIDENTS: PlantIncidentReport[] = [
  {
    id: 'RAD-2026-088192',
    title: 'Fuga de aceite y ausencia de guarda mecánica en rodillo triturador',
    category: 'Mecánico',
    quadrantId: 'Q-A1',
    quadrantName: 'Nave Prensas y Troquelado',
    area: 'Sector A',
    supervisor: 'Carlos Mario Vélez',
    reportedBy: 'Juan Andrés Cataño S. (Operario Turno A)',
    reportedAt: '2026-10-28 07:15',
    status: 'Suspendido',
    description: 'Guarda protectora desprendida con vibración anormal en rodillo alimentador secundario.',
    gtc45Evaluation: {
      nd: 10,
      ne: 3,
      np: 30,
      nc: 100,
      nr: 3000,
      level: 'Nivel I (Crítico - No Aceptable)',
      evaluatedAt: '2026-10-28 08:30',
      evaluator: 'Carlos Mario Vélez (HSEQ)',
      suspensionOrder: {
        orderId: 'ORD-SUSP-2026-049',
        issuedAt: '2026-10-28 08:40',
        digitalSignature: 'SHA256:4a8b79e...881',
        machineStopped: 'Prensa Troqueladora #4 / Rodillo Alimentador'
      }
    },
    workOrder: {
      id: 'OT-MNT-2026-104',
      cost: 3950000,
      description: 'Reconstrucción de guarda estructural, enclavamiento micro-switch y cambio de retenedor de aceite.',
      status: 'Escalado a Gerencia'
    }
  },
  {
    id: 'RAD-2026-088190',
    title: 'Derrame de lubricante cerca de escalerilla de acceso a tolva',
    category: 'Locativo',
    quadrantId: 'Q-A1',
    quadrantName: 'Nave Prensas y Troquelado',
    area: 'Sector A',
    supervisor: 'Carlos Mario Vélez',
    reportedBy: 'Operario de Bodega',
    reportedAt: '2026-10-27 14:20',
    status: 'En Triaje',
    description: 'Piso resbaladizo sin cinta antideslizante en zona de alto tránsito peatonal.',
    workOrder: {
      id: 'OT-MNT-2026-098',
      cost: 720000,
      description: 'Instalación de piso antideslizante y rodapié perimetral.',
      status: 'Aprobado Autónomo SST',
      authorizedBy: 'Especialista SST',
      authorizedAt: '2026-10-27 16:00'
    }
  },
  {
    id: 'RAD-2026-088184',
    title: 'Sensor infrarrojo de cortina óptica con intermitencia en plegadora',
    category: 'Eléctrico',
    quadrantId: 'Q-C3',
    quadrantName: 'Línea de Ensamble y Soldadura',
    area: 'Sector C',
    supervisor: 'Andrés Gómez',
    reportedBy: 'Buzón Confidencial (Operario)',
    reportedAt: '2026-10-27 10:10',
    status: 'Mitigado',
    isAnonymous: true,
    description: 'La cortina no detiene el ciclo de bajada si el operario ingresa la mano por el extremo derecho.',
    gtc45Evaluation: {
      nd: 6,
      ne: 2,
      np: 12,
      nc: 60,
      nr: 720,
      level: 'Nivel I (Crítico - No Aceptable)',
      evaluatedAt: '2026-10-27 11:00',
      evaluator: 'Andrés Gómez (HSEQ)'
    }
  },
  {
    id: 'RAD-2026-088179',
    title: 'Fuga leve en válvula de alivio de vapor en caldera secundaria',
    category: 'Químico',
    quadrantId: 'Q-B2',
    quadrantName: 'Hornos y Tratamiento Térmico',
    area: 'Sector B',
    supervisor: 'Elena Montoya',
    reportedBy: 'Técnico de Turno',
    reportedAt: '2026-10-26 18:40',
    status: 'En Triaje',
    description: 'Escape audible con vapor caliente continuo a 1.5 metros de pasillo de tránsito.'
  }
];

export const INITIAL_WORKERS: WorkerEPPProfile[] = [
  {
    id: 'W-01',
    name: 'Juan Andrés Cataño Suárez',
    cedula: '1.036.782.110',
    cargo: 'Técnico de Mantenimiento Mecánico',
    area: 'Nave Prensas y Troquelado',
    certStatus: 'ACTIVO',
    certExpDate: '2027-04-18',
    certNumber: 'RES4272-SENA-2024-88419',
    trainingCenter: 'SENA Centro Metalmecánico',
    assignedGear: [
      { id: 'G-1', name: 'Arnés Multipropósito Dieléctrico 4 Argollas', serial: 'SER-ARN-2026-0941', assignedAt: '2026-09-01', inspectionDue: '2026-12-01' },
      { id: 'G-2', name: 'Eslinga Doble en Y con Absorbedor', serial: 'SER-ESL-2026-1188', assignedAt: '2026-09-01', inspectionDue: '2026-12-01' }
    ]
  },
  {
    id: 'W-02',
    name: 'Pedro Luis Restrepo Zapata',
    cedula: '71.289.441',
    cargo: 'Operario de Montaje Estructural',
    area: 'Nave Prensas y Troquelado',
    certStatus: 'VENCIDO',
    certExpDate: '2026-08-15',
    certNumber: 'RES4272-COL-2023-11029',
    trainingCenter: 'Centro de Formación ARL Sura',
    assignedGear: []
  },
  {
    id: 'W-03',
    name: 'Camilo Andrés Rúa Gil',
    cedula: '1.017.654.332',
    cargo: 'Instalador de Líneas Eléctricas',
    area: 'Línea de Ensamble y Soldadura',
    certStatus: 'PROXIMO_VENCER',
    certExpDate: '2026-11-24',
    certNumber: 'RES4272-SENA-2024-33291',
    trainingCenter: 'SENA Centro de la Construcción',
    assignedGear: [
      { id: 'G-3', name: 'Línea de Vida Vertical con Freno Arrestador', serial: 'SER-LVV-2026-4412', assignedAt: '2026-08-15', inspectionDue: '2026-11-15' }
    ]
  },
  {
    id: 'W-04',
    name: 'Marta Cecilia Ríos Galeano',
    cedula: '43.910.224',
    cargo: 'Operaria de Dosificación Química',
    area: 'Almacén Químico y Solventes',
    certStatus: 'ACTIVO',
    certExpDate: '2027-02-10',
    certNumber: 'RES4272-SURA-2025-10294',
    trainingCenter: 'ARL SURA Centro de Entrenamiento',
    assignedGear: []
  }
];

export const INITIAL_INSPECTIONS: PlannedInspectionRun[] = [
  {
    id: 'INSP-2026-10-A',
    area: 'Nave Prensas (Sector A)',
    quadrantId: 'Q-A1',
    scheduledDate: '2026-10-28',
    inspector: 'Carlos Mario Vélez',
    status: 'En Curso',
    score: 85,
    findingsCount: 2
  },
  {
    id: 'INSP-2026-10-B',
    area: 'Hornos y Térmico (Sector B)',
    quadrantId: 'Q-B2',
    scheduledDate: '2026-11-12',
    inspector: 'Elena Montoya',
    status: 'Programada',
    score: 0,
    findingsCount: 0
  },
  {
    id: 'INSP-2026-09-C',
    area: 'Línea de Ensamble (Sector C)',
    quadrantId: 'Q-C3',
    scheduledDate: '2026-10-15',
    inspector: 'Andrés Gómez',
    status: 'Completada',
    score: 96,
    actaPdfUrl: 'ACTA-INSP-2026-09-C.pdf',
    findingsCount: 1
  }
];

export const INITIAL_BULLETINS: SafetyBulletinItem[] = [
  {
    id: 'BOL-2026-048',
    title: 'Protocolo Obligatorio de Manos Libres en Prensas y Troqueladoras',
    urgency: 'ALTA PRIORIDAD',
    targetAudience: 'Cuadrilla Mecánica, Troquelado y Prensas (Clase V)',
    publishedAt: '2026-10-28 07:00',
    readsCount: 104,
    totalAudience: 120,
    content: [
      'Bloqueo LOTO obligatorio antes de ajustar matrices o desatorar piezas metálicas.',
      'Si la cortina óptica parpadea o pierde calibración, detenga la faena y notifique de inmediato en el Tótem.',
      'Uso imperativo de pinzas extractoras de 40 cm para cualquier alimentación en matriz abierta.'
    ]
  },
  {
    id: 'BOL-2026-047',
    title: 'Disposición y Rotulado de Solventes Inflamables en Sector D',
    urgency: 'PREVENTIVO',
    targetAudience: 'Almacén Químico y Pinturas',
    publishedAt: '2026-10-24 08:30',
    readsCount: 88,
    totalAudience: 95,
    content: [
      'Mantener los bidones conectados a cable de descarga electrostática a tierra.',
      'Respetar compatibilidad química según la matriz SGA en las estanterías antiexplosión.'
    ]
  }
];

export const SMMLV_PARAM = 1423500; // COP parametrizado 1 SMMLV
