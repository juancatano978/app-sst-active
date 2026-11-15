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
    title: 'Protocolo Obligatorio de Manos Libres y Bloqueo LOTO en Prensas y Troqueladoras',
    category: 'Riesgo Mecánico',
    urgency: 'ALTA PRIORIDAD',
    targetAudience: 'Cuadrilla Mecánica, Troquelado y Prensas — Sector A (Clase V)',
    publishedAt: '2026-10-28 07:00',
    author: 'Carlos Mario Vélez · Especialista SST',
    summary:
      'Emitido tras detectar guarda desprendida en Prensa #2 y falla intermitente en cortina óptica de plegadora. Ningún operario debe acercar las extremidades al punto de atrapamiento con energía residual conectada.',
    legalBasis: 'Res. 2400/1979 Art. 267 · ISO 12100 · OSHA 1910.147 (LOTO)',
    requiredControls: ['Candado Personal LOTO', 'Pinzas Extractoras 40 cm', 'Guantes Anticorte Nivel 5', 'Prueba de Cortina Óptica'],
    readsCount: 104,
    totalAudience: 120,
    acknowledgedByCarnets: ['401120'],
    content: [
      'Aplique aislamiento de energía (candado + tarjeta LOTO) en el seccionador principal antes de ajustar matrices, limpiar viruta o retirar piezas trabadas.',
      'Verifique al inicio de cada turno el tiempo de respuesta de la cortina óptica con la varilla de prueba; si parpadea o falla, detenga el equipo y reporte en el Tótem.',
      'Está estrictamente prohibido introducir manos o dedos en matriz abierta: utilice únicamente pinzas extractoras de aluminio de 40 cm.',
      'No opere equipos cuyas guardas físicas estén sueltas o cuyos micro-switches de enclavamiento presenten puentes eléctricos.'
    ]
  },
  {
    id: 'BOL-2026-047',
    title: 'Control Electrostático y Rotulado SGA de Solventes Inflamables en Sector D',
    category: 'Riesgo Químico',
    urgency: 'PREVENTIVO',
    targetAudience: 'Almacén Químico, Dosificación y Pinturas — Sector D',
    publishedAt: '2026-10-26 08:30',
    author: 'Carlos Mario Vélez · Especialista SST',
    summary:
      'Recordatorio operativo previo al trasvase mensual de thinner, tolueno y resinas epóxicas. La acumulación de carga estática durante el trasiego sin pinza a tierra es la principal fuente de ignición en cuartos químicos.',
    legalBasis: 'Decreto 1496/2018 (SGA) · NFPA 30 · Res. 2400/1979 Cap. X',
    requiredControls: ['Pinza de Puesta a Tierra', 'Respirador Vapores Orgánicos', 'Gafas Antisalpicaduras', 'Kit Antiderrames'],
    readsCount: 88,
    totalAudience: 95,
    acknowledgedByCarnets: ['401120', '502310'],
    content: [
      'Conecte obligatoriamente la pinza equipotencial y el cable de descarga electrostática a tierra antes de abrir válvulas o trasvasar tambores metálicos de 55 galones.',
      'Todo envase secundario fraccionado debe portar etiqueta SGA legible con pictogramas de peligro, palabra de advertencia y ficha FDS disponible en el atril del sector.',
      'Respete la matriz de incompatibilidad química: nunca almacene oxidantes o ácidos fuertes junto a solventes inflamables en las estanterías antiexplosión.',
      'Verifique que los extractores de aire permanezcan encendidos durante toda la jornada de mezcla y mantenga el kit antiderrames despejado.'
    ]
  },
  {
    id: 'BOL-2026-046',
    title: 'Inspección Pre-Uso de Arnés y Bloqueo por Certificación Vencida (Res. 4272/2021)',
    category: 'Trabajo en Alturas',
    urgency: 'ALTA PRIORIDAD',
    targetAudience: 'Mantenimiento Locativo, Montajes y Almacén EPP — Sectores A, B y E',
    publishedAt: '2026-10-24 06:15',
    author: 'Diego Alejandro Pineda · Almacenista Técnico EPP',
    summary:
      'Se recuerda al personal de montaje y mantenimiento que todo trabajo igual o superior a 2.0 metros requiere permiso firmado y reentrenamiento anual vigente. El pañol bloqueará automáticamente el despacho si la certificación supera 365 días.',
    legalBasis: 'Resolución 4272 de 2021 · ANSI/ASSP Z359.11',
    requiredControls: ['Arnés Dieléctrico 4 Argollas', 'Eslinga con Absorbedor', 'Casco con Barbuquejo 3 Puntos', 'Certificado Vigente'],
    readsCount: 54,
    totalAudience: 60,
    acknowledgedByCarnets: ['502310', '883921'],
    content: [
      'Inspeccione visualmente reatas, costuras de contraste, argollas en D y paquete absorbedor de choque antes de recibir o colgarse del equipo.',
      'Si el testigo de impacto del absorbedor está rasgado o el arnés presenta quemaduras de soldadura o pintura química, retírelo de inmediato para baja en pañol.',
      'Valide la vigencia de su certificado de Trabajo Seguro en Alturas en el Tótem o con el almacenista antes de solicitar permiso de trabajo en cubiertas o puentes grúa.',
      'El barbuquejo de tres puntos debe permanecer abrochado en todo momento durante labores en escaleras, plataformas elevadoras o andamios certificados.'
    ]
  },
  {
    id: 'BOL-2026-045',
    title: 'Distancias de Seguridad por Arco Eléctrico y Despeje en Subestación T-04 (440V)',
    category: 'Riesgo Eléctrico',
    urgency: 'INFORMATIVO',
    targetAudience: 'Cuadrilla Eléctrica, Hornos y Supervisores de Turno',
    publishedAt: '2026-10-21 10:00',
    author: 'Dra. Valeria Aristizábal / Coordinación HSEQ',
    summary:
      'Lineamientos preventivos para maniobras de restablecimiento de breakers y limpieza alrededor de tableros de fuerza de 440V tras hallazgos detectados en inspección locativa.',
    legalBasis: 'RETIE Art. 13 · NFPA 70E · NTC 2050',
    requiredControls: ['Tapete Dieléctrico Certificado', 'Guantes Dieléctricos Clase 00', 'Careta Arco Eléctrico', 'Candado LOTO Eléctrico'],
    readsCount: 41,
    totalAudience: 50,
    acknowledgedByCarnets: ['401120', '100001'],
    content: [
      'Mantenga un despeje frontal mínimo de 1.0 metro libre de estibas, canecas o herramientas frente a todos los tableros de distribución eléctrica.',
      'Verifique que el tapete dieléctrico permanezca centrado y limpio frente al gabinete y reporte de inmediato cualquier puerta sin seguro o sin tapa acrílica cubre-bornes.',
      'Solo personal electricista con matrícula CONTE/CONALTEL vigente y EPP ignífugo categoría 2 puede abrir puertas de tableros energizados a 440V.'
    ]
  }
];

export const SMMLV_PARAM = 1423500; // COP parametrizado 1 SMMLV
