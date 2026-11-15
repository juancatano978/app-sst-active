import { UserStory, BusinessRule, PlantQuadrant } from '../types/sst';

export const BUSINESS_RULES: BusinessRule[] = [
  {
    code: 'RN001',
    name: 'Obligatoriedad de Reporte Express',
    formula: 'Tiempo_Radicación < 24h',
    legalBasis: 'Art. 2.2.4.6.10 Dec. 1072 de 2015',
    description: 'Obligación estricta de notificar cualquier condición o acto inseguro detectado dentro de las primeras 24 horas.'
  },
  {
    code: 'RN002',
    name: 'Inspección de Riesgo Crítico',
    formula: 'Si NR >= 600 ⇒ Tiempo_Atención <= 4h',
    legalBasis: 'GTC 45 / Dec. 1072 Art. 2.2.4.6.25',
    description: 'Inspección y triaje obligatorio en sitio para riesgos de Nivel I Crítico en <= 4 horas hábiles.'
  },
  {
    code: 'RN003',
    name: 'Límite Presupuestal Autónomo',
    formula: 'Costo <= 1 SMMLV ⇒ Autoriza SST | Costo > 1 SMMLV ⇒ Escala a Gerencia',
    legalBasis: 'Estatuto de Contratación y Delegación Financiera SST',
    description: 'Autorización autónoma del Encargado SST para reparaciones urgentes <= 1 SMMLV vs. escalamiento al Empleador con firma digital si > 1 SMMLV.'
  },
  {
    code: 'RN004',
    name: 'Notificación Legal ARL / EPS',
    formula: 'Accidente_Con_Lesión ⇒ Plazo <= 2 días hábiles',
    legalBasis: 'Decreto 1072 de 2015 / Res. 156 de 2005',
    description: 'Notificación legal obligatoria del borrador FURAT ante ARL y EPS en un plazo máximo e improrrogable de 2 días hábiles.'
  },
  {
    code: 'RN005',
    name: 'Garantía de EPP y Trabajo Alturas',
    formula: 'Certificado_Alturas == ACTIVO ⇒ Asigna EPP',
    legalBasis: 'Resolución 4272 de 2021',
    description: 'Exigencia de curso de alturas vigente y activo para autorizar la entrega de EPP de Categoría III (arnés, eslingas, líneas de vida).'
  },
  {
    code: 'RN006',
    name: 'Evaluación Estricta GTC 45',
    formula: 'NR = (ND * NE) * NC',
    legalBasis: 'Guía Técnica Colombiana GTC 45',
    description: 'Cálculo estandarizado del Nivel de Riesgo multiplicando Probabilidad (Deficiencia * Exposición) por Nivel de Consecuencia.'
  },
  {
    code: 'RN007',
    name: 'Alerta Inmediata COPASST',
    formula: 'Accidente_Grave/Mortal ⇒ Plazo <= 24h hábiles',
    legalBasis: 'Resolución 2013 de 1986 / Dec. 1072',
    description: 'Notificación inmediata a integrantes del COPASST ante accidentes graves o con potencial mortal en <= 24h hábiles.'
  },
  {
    code: 'RN008',
    name: 'Frecuencia de Inspecciones Locativas',
    formula: 'Frecuencia_Inspección <= 30 días calendario',
    legalBasis: 'Decreto 1072 de 2015',
    description: 'Ejecución obligatoria de inspecciones locativas planeadas con frecuencia mínima mensual en todas las áreas de planta.'
  },
  {
    code: 'RN009',
    name: 'Suspensión Inmediata de Labor',
    formula: 'Si NR >= 600 (Nivel I) ⇒ Detener Máquina / Faena',
    legalBasis: 'Facultad Legal Preventiva OIT / Dec. 1072',
    description: 'Emisión automática de la orden de detención de máquinas o trabajos ante riesgo inminente Nivel I Crítico (NR >= 600).'
  }
];

export const USER_STORIES: UserStory[] = [
  {
    id: 'HU-001',
    title: 'Captura Express de Peligros Locativos en Sitio',
    subtitle: 'Tótem / Kiosco Digital Fijo (IK10/IP65) en vestieres o comedores',
    priority: 'Alta (Riesgo Crítico)',
    priorityColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    status: 'Completado (Done)',
    statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    estimatedHours: 16,
    estimatedDays: 2.0,
    channel: 'Tótem Fijo IK10/IP65',
    channelIcon: 'Monitor',
    actor: 'Operario de Planta',
    description: 'Como operario de planta en sector de alto riesgo (Riesgo III, IV, V), quiero registrar una condición peligrosa o riesgo locativo en menos de 5 segundos interactuando con la pantalla de un Tótem/Kiosco Digital Fijo (IK10/IP65) en vestieres o comedores, para notificar la novedad inmediatamente sin usar teléfono celular personal ni desplazarme a la oficina de SST.',
    businessRules: [
      {
        code: 'RN001',
        name: 'Reporte < 24h',
        summary: 'Obligatoriedad de notificar cualquier condición o acto inseguro detectado dentro de las primeras 24 horas.',
        legalBasis: 'Art. 2.2.4.6.10 Dec. 1072'
      }
    ],
    traceability: {
      rf: [
        'RF-01: Captura express en mapa táctil por cuadrantes en < 5s.',
        'RF-02: Generación de radicado inmutable y estampa de tiempo.'
      ],
      rnf: [
        'RNF-01: Tiempo de respuesta y procesamiento en red <= 5s.',
        'RNF-04: Gabinete industrial con protección IK10 e IP65.'
      ],
      uc: 'UC-01: Registrar Peligro Locativo en Tótem Fijo',
      uml: 'Casos de Uso (1), Actividades (2), Secuencia (3), Despliegue (6)'
    },
    bddScenarios: [
      {
        name: 'UI/Hardware Qt e Íconos',
        given: 'El operario se ubica frente al Tótem en zona de vestieres',
        when: 'Se presenta la pantalla táctil de alto contraste',
        then: 'Muestra mapa por cuadrantes con botones ergonómicos de gran tamaño',
        timeEst: '4h'
      },
      {
        name: 'Lector RFID/NFC',
        given: 'El operario porta su carné de planta RFID',
        when: 'Aproxima el carné al sensor óptico/NFC',
        then: 'Autentica el perfil de operario en < 2 segundos sin contraseña',
        timeEst: '3h'
      },
      {
        name: 'BDD Éxito',
        given: 'El operario aproxima su carné al Tótem',
        when: 'Selecciona el cuadrante en < 5s',
        then: 'Genera radicado inmutable y despacha alerta push a la Tablet ATEX',
        timeEst: '3h'
      },
      {
        name: 'BDD Offline (Contingencia)',
        given: 'El Tótem pierde conexión de red con AWS',
        when: 'Se radica una novedad',
        then: 'Guarda en SQLite búfer local y sincroniza automáticamente al retornar la red',
        timeEst: '4h'
      }
    ]
  },
  {
    id: 'HU-002',
    title: 'Evaluación y Triaje con Matriz de Riesgos GTC 45',
    subtitle: 'Tablet Ruguerizada ATEX IP68 del Supervisor HSEQ',
    priority: 'Alta (Riesgo Crítico)',
    priorityColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    status: 'En Pruebas (Testing)',
    statusColor: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
    estimatedHours: 20,
    estimatedDays: 2.5,
    channel: 'Tablet ATEX IP68',
    channelIcon: 'Tablet',
    actor: 'Supervisor HSEQ',
    description: 'Como supervisor HSEQ, quiero evaluar reportes recibidos en mi Tablet ATEX (IP68) tomando foto evidencia y calculando el Nivel de Riesgo mediante la fórmula de la GTC 45 (NR = NP * NC), para priorizar atenciones e iniciar la orden de suspensión de labores si el riesgo es inmitigable.',
    businessRules: [
      {
        code: 'RN002',
        name: 'Atención <= 4h',
        summary: 'Inspección y triaje obligatorio en sitio para riesgos de Nivel I Crítico en <= 4h hábiles.',
        legalBasis: 'Dec. 1072'
      },
      {
        code: 'RN006',
        name: 'Matriz GTC 45',
        summary: 'Evaluación estricta aplicando la fórmula NR = (ND * NE) * NC.',
        legalBasis: 'GTC 45'
      },
      {
        code: 'RN009',
        name: 'Orden Suspensión',
        summary: 'Emisión automática de la orden de detención de máquinas/trabajos ante NR >= 600.',
        legalBasis: 'Facultad OIT'
      }
    ],
    traceability: {
      rf: [
        'RF-03: Captura fotográfica de evidencia desde Tablet ATEX.',
        'RF-06: Cálculo automático del Nivel de Riesgo GTC 45.',
        'RF-07: Disparo de temporizadores de atención urgente <= 4h.',
        'RF-08: Emisión de orden de suspensión de labor (NR >= 600).'
      ],
      rnf: [
        'RNF-01: Tiempo de procesamiento de evaluación <= 5s.',
        'RNF-05: Certificación intrínsecamente segura ATEX e IP68.'
      ],
      uc: 'UC-02: Evaluar y Triar Riesgo en Tablet ATEX',
      uml: 'Casos de Uso (1), Actividades (2), Secuencia (3), Clases C++ (5)'
    },
    bddScenarios: [
      {
        name: 'Módulo Cámara WebP',
        given: 'Supervisor en sitio de la novedad con Tablet ATEX',
        when: 'Captura fotografía de evidencia locativa',
        then: 'Comprime a WebP y asocia de forma inmutable al radicado',
        timeEst: '4h'
      },
      {
        name: 'BDD Crítico (NR >= 600)',
        given: 'Se evalúa ND=10, NE=3 (NP=30) y NC=100 (NR = 3000)',
        when: 'Se guarda la evaluación',
        then: 'Califica Nivel I Crítico en pantalla roja, activa temporizador <= 4h (RN002) y emite Orden de Suspensión (RN009)',
        timeEst: '4h'
      },
      {
        name: 'BDD Moderado (NR < 600)',
        given: 'Se evalúan parámetros con resultado NR < 600 (Nivel II, III o IV)',
        when: 'Se guarda la evaluación',
        then: 'Asigna orden de mantenimiento ordinaria sin detener producción',
        timeEst: '4h'
      }
    ]
  },
  {
    id: 'HU-003',
    title: 'Reporte Confidencial y Anónimo de Casi-Accidentes',
    subtitle: 'Buzón Anónimo - Estatuto de Protección de Datos Ley 1581',
    priority: 'Alta (Habeas Data)',
    priorityColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    status: 'En Proceso (In Progress)',
    statusColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    estimatedHours: 14,
    estimatedDays: 1.75,
    channel: 'Tótem Fijo IK10/IP65',
    channelIcon: 'ShieldAlert',
    actor: 'Operario de Planta',
    description: 'Como empleado de bodega o planta, quiero registrar incidentes o casi-accidentes en el Tótem Fijo activando el "Modo Anónimo", para visibilizar fallas preventivas del Iceberg de Frank Bird sin miedo a represalias, sanciones o señalamientos.',
    businessRules: [
      {
        code: 'Ley 1581 de 2012',
        name: 'Habeas Data y Protección',
        summary: 'Supresión total de identificadores personales en reportes anónimos.',
        legalBasis: 'Ley Estatutaria 1581 de 2012'
      }
    ],
    traceability: {
      rf: [
        'RF-04: Enmascaramiento de datos en Modo Anónimo (DesacopladorAnonimo).',
        'RF-05: Consolidado estadístico mensual sin trazabilidad de identidades.'
      ],
      rnf: [
        'RNF-02: Cifrado de datos sensibles en reposo con AES-256.'
      ],
      uc: 'UC-03: Radicar Casi-Accidente Anónimo',
      uml: 'Casos de Uso (1), Secuencia (3), Paquetes (4)'
    },
    bddScenarios: [
      {
        name: 'UI Modo Anónimo',
        given: 'Trabajador frente al Tótem en vestier',
        when: 'Activa el interruptor switch "Modo Anónimo"',
        then: 'Desacopla inmediatamente datos de sesión y muestra sello de confidencialidad',
        timeEst: '2h'
      },
      {
        name: 'BDD Privacidad Desacoplador',
        given: 'Se radica novedad en Modo Anónimo',
        when: 'El backend procesa la petición',
        then: 'Suprime cédula, nombre, IP y hardware ID; genera token efímero AES-256 e inserta en DB con id_usuario = NULL',
        timeEst: '3h'
      },
      {
        name: 'BDD Métrica Frank Bird',
        given: 'Reportes anónimos acumulados',
        when: 'Se genera el informe mensual de accidentalidad',
        then: 'Suma totales por área al Iceberg preventivo manteniendo anonimato estricto',
        timeEst: '3h'
      }
    ]
  },
  {
    id: 'HU-004',
    title: 'Notificación Automatizada a ARL, EPS y COPASST',
    subtitle: 'Generador de Borrador FURAT y Alertas Legales con Temporizador',
    priority: 'Alta (Cumplimiento Legal)',
    priorityColor: 'text-red-400 bg-red-500/10 border-red-500/20',
    status: 'Por Hacer (To Do)',
    statusColor: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
    estimatedHours: 18,
    estimatedDays: 2.25,
    channel: 'Consola Web / PC',
    channelIcon: 'FileText',
    actor: 'Especialista SST',
    description: 'Como encargado de SST, quiero que el sistema pre-diligencie el borrador FURAT para ARL/EPS y notifique automáticamente al COPASST, para cumplir estrictamente los plazos legales del Decreto 1072 (2 días hábiles) y la Resolución 2013 de 1986 (24 horas).',
    businessRules: [
      {
        code: 'RN004',
        name: 'ARL/EPS <= 2 días',
        summary: 'Notificación legal de accidentes de trabajo ante ARL/EPS en <= 2 días hábiles.',
        legalBasis: 'Dec. 1072 de 2015 / Res. 156 de 2005'
      },
      {
        code: 'RN007',
        name: 'COPASST <= 24h',
        summary: 'Notificación inmediata a integrantes del COPASST ante accidentes graves en <= 24h hábiles.',
        legalBasis: 'Res. 2013 de 1986'
      }
    ],
    traceability: {
      rf: [
        'RF-11: Pre-diligenciamiento de borrador FURAT para ARL/EPS.',
        'RF-12: Notificación automática al COPASST en <= 24h.'
      ],
      rnf: [
        'RNF-02: Cifrado en tránsito mediante túnel seguro TLS 1.3.'
      ],
      uc: 'UC-04: Notificar Entidades Legales',
      uml: 'Casos de Uso (1), Despliegue (6)'
    },
    bddScenarios: [
      {
        name: 'Borrador FURAT',
        given: 'Ocurrencia de accidente laboral con lesión',
        when: 'El encargado SST revisa el evento',
        then: 'Pre-diligencia automáticamente los 5 bloques del FURAT con firma digital',
        timeEst: '5h'
      },
      {
        name: 'BDD ARL (2 días hábiles)',
        given: 'Evento con lesión confirmado',
        when: 'Se radicar el evento',
        then: 'Activa cuenta regresiva estricta de 48 horas hábiles para reporte ante ARL Sura',
        timeEst: '4h'
      },
      {
        name: 'BDD COPASST (24 horas)',
        given: 'Evento clasificado como grave o amputación',
        when: 'Se registra en base de datos',
        then: 'Despacha alerta de alta prioridad al correo/app de los miembros del COPASST en <= 24h',
        timeEst: '3h'
      }
    ]
  },
  {
    id: 'HU-005',
    title: 'Validación Estricta de EPP y Trabajo en Alturas',
    subtitle: 'Compuerta Operativa Resolución 4272 de 2021',
    priority: 'Media (Control Operativo)',
    priorityColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    status: 'Por Hacer (To Do)',
    statusColor: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
    estimatedHours: 12,
    estimatedDays: 1.5,
    channel: 'Consola Web / PC',
    channelIcon: 'HardHat',
    actor: 'Supervisor HSEQ',
    description: 'Como coordinador HSEQ, quiero que el sistema verifique el estado del certificado de alturas antes de autorizar arnés y líneas de vida, para garantizar que solo personal apto ejecute tareas críticas bajo la Resolución 4272 de 2021.',
    businessRules: [
      {
        code: 'RN005',
        name: 'Certificado Alturas',
        summary: 'Exigencia de curso de alturas vigente y activo para autorizar la entrega de EPP de Categoría III.',
        legalBasis: 'Resolución 4272 de 2021'
      }
    ],
    traceability: {
      rf: [
        'RF-10: Registro inmutable de asignaciones y validaciones de EPP.',
        'RF-14: Validación del atributo Certificado_Alturas bajo la Res. 4272.',
        'RF-15: Control de inventario serializado de EPPs de Alturas.'
      ],
      rnf: [
        'RNF-02: Cifrado de registros de personal con AES-256.'
      ],
      uc: 'UC-05: Validar Entrega de EPP de Alturas',
      uml: 'Casos de Uso (1), Clases POO C++ (5)'
    },
    bddScenarios: [
      {
        name: 'BDD Válido (Entrega Aprobada)',
        given: 'Operario solicita arnés y su certificado está ACTIVO bajo Res. 4272',
        when: 'Valida perfil en pañol/almacén',
        then: 'Autoriza entrega, descuenta del stock y vincula el número serial del arnés',
        timeEst: '3h'
      },
      {
        name: 'BDD Vencido (Bloqueo Automático)',
        given: 'Operario con curso de alturas VENCIDO',
        when: 'Intenta solicitar arnés o eslinga',
        then: 'Bloquea entrega inmediatamente (RN005), muestra alerta roja y notifica para re-certificación',
        timeEst: '2h'
      },
      {
        name: 'Alertas Preventivas',
        given: 'Certificado de alturas próximo a expirar',
        when: 'Faltan 30 días calendario para la fecha límite',
        then: 'Dispara notificación preventiva al trabajador y coordinador HSEQ',
        timeEst: '2h'
      }
    ]
  },
  {
    id: 'HU-006',
    title: 'Programación y Ejecución de Inspecciones Planeadas',
    subtitle: 'Cumplimiento Decreto 1072 (Recorridos <= 30 días y Acta PDF)',
    priority: 'Media (Inspecciones)',
    priorityColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    status: 'Backlog de Producto',
    statusColor: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
    estimatedHours: 16,
    estimatedDays: 2.0,
    channel: 'Consola Web / PC',
    channelIcon: 'ClipboardCheck',
    actor: 'Especialista SST',
    description: 'Como especialista HSEQ, quiero programar calendarios de inspección locativa mensual por área en la consola web, para asegurar el cumplimiento de los recorridos obligatorios exigidos por el Decreto 1072 de 2015.',
    businessRules: [
      {
        code: 'RN008',
        name: 'Periodicidad <= 30 días',
        summary: 'Ejecución obligatoria de inspecciones locativas planeadas con frecuencia mínima mensual.',
        legalBasis: 'Dec. 1072 de 2015'
      }
    ],
    traceability: {
      rf: [
        'RF-08: Generación de alertas vinculadas a mantenimiento locativo.',
        'RF-12: Registro consolidado para auditorías de SST.',
        'RF-16: Generación de actas de inspección planeada en PDF inmutable.'
      ],
      rnf: [
        'RNF-03: Disponibilidad del servicio en nube AWS >= 99.5%.'
      ],
      uc: 'UC-06: Ejecutar Inspección Planeada Locativa',
      uml: 'Casos de Uso (1), Clases C++ (5), Despliegue (6)'
    },
    bddScenarios: [
      {
        name: 'Sincronización Tablet',
        given: 'Ronda de inspección planeada en calendario',
        when: 'Supervisor inicia turno en Tablet ATEX',
        then: 'Sincroniza lista de verificación por cuadrante offline/online',
        timeEst: '3h'
      },
      {
        name: 'BDD Cierre y Acta Inmutable',
        given: 'Supervisor completa recorrido por nave industrial',
        when: 'Cierra lista en Tablet y firma digitalmente en pantalla',
        then: 'Genera acta PDF inmutable (RF-16) con sello de tiempo y envía copia a auditoría',
        timeEst: '4h'
      },
      {
        name: 'BDD Hallazgo a Mantenimiento',
        given: 'Inspección detecta barandilla suelta o luminaria rota',
        when: 'Marca hallazgo negativo en el ítem',
        then: 'Genera ticket de trabajo correctivo directo para cuadrilla de mantenimiento',
        timeEst: '3h'
      }
    ]
  },
  {
    id: 'HU-007',
    title: 'Difusión Interactiva de Boletines y Verificación de Lectura',
    subtitle: 'Lecciones Aprendidas con Acuse de Recibo RFID sin Huella',
    priority: 'Normal (Comunicación)',
    priorityColor: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
    status: 'Backlog de Producto',
    statusColor: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
    estimatedHours: 10,
    estimatedDays: 1.25,
    channel: 'Tótem Fijo IK10/IP65',
    channelIcon: 'Megaphone',
    actor: 'Especialista SST',
    description: 'Como empleador o especialista SST, quiero emitir lecciones aprendidas y boletines de seguridad a Tótems y Tablets con acuse de recibo, para garantizar que las alertas preventivas sean asimiladas por el personal operativo sin recabar datos biométricos sensibles.',
    businessRules: [
      {
        code: 'Cumplimiento Ley 1581',
        name: 'Sin Biometría Sensible',
        summary: 'Confirmación de lectura mediante carné RFID/NFC en sustitución de huella dactilar biométrica.',
        legalBasis: 'Ley 1581 de 2012'
      }
    ],
    traceability: {
      rf: [
        'RF-09: Emisión de boletines de seguridad segmentados por cuadrilla.',
        'RF-10: Acuse de lectura digital con estampa de tiempo inmutable.'
      ],
      rnf: [
        'RNF-01: Respuesta de confirmación en pantalla en <= 5s.',
        'RNF-03: Almacenamiento redundante en AWS S3.'
      ],
      uc: 'UC-07: Difundir Boletín de Seguridad',
      uml: 'Casos de Uso (1), Secuencia (3)'
    },
    bddScenarios: [
      {
        name: 'Redactor Web Segmentado',
        given: 'Especialista SST en consola web',
        when: 'Publica lección aprendida clasificada por zona o cuadrilla',
        then: 'Distribuye instantáneamente a todos los Tótems de vestieres',
        timeEst: '3h'
      },
      {
        name: 'BDD Confirmación RFID',
        given: 'Boletín urgente mostrado en el Tótem',
        when: 'Operario toca pantalla y aproxima carné RFID/NFC',
        then: 'Registra acuse digital con estampa inmutable sin capturar huella dactilar',
        timeEst: '2h'
      },
      {
        name: 'BDD Cobertura en Tiempo Real',
        given: 'Boletín emitido a 120 trabajadores de planta',
        when: 'HSEQ consulta el panel de analítica',
        then: 'Calcula porcentaje de lectura y pendientes por turno en tiempo real',
        timeEst: '2h'
      }
    ]
  },
  {
    id: 'HU-008',
    title: 'Control de Presupuesto Autónomo y Autorizaciones Gerenciales',
    subtitle: 'Compuerta Financiera: Límite 1 SMMLV vs Escalamiento Gerencial',
    priority: 'Media/Alta (Finanzas)',
    priorityColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    status: 'Backlog de Producto',
    statusColor: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
    estimatedHours: 14,
    estimatedDays: 1.75,
    channel: 'Consola Gerencial',
    channelIcon: 'Banknote',
    actor: 'Empleador / Gerencia',
    description: 'Como Encargado de SST, quiero aprobar directamente las reparaciones locativas <= 1 SMMLV y derivar a gerencia las de mayor costo, para agilizar intervenciones correctivas urgentes sin exceder mi límite de gasto autónomo.',
    businessRules: [
      {
        code: 'RN003',
        name: 'Límite 1 SMMLV',
        summary: 'Autorización autónoma del Encargado SST para reparaciones <= 1 SMMLV vs. escalamiento al Empleador si > 1 SMMLV.',
        legalBasis: 'RN003 / Manual de Delegación Financiera'
      }
    ],
    traceability: {
      rf: [
        'RF-07: Evaluación de la compuerta presupuestal de 1 SMMLV.',
        'RF-13: Firma digital gerencial para gastos > 1 SMMLV.'
      ],
      rnf: [
        'RNF-02: Cifrado y sellado de tiempo inmutable en firmas digitales.'
      ],
      uc: 'UC-08: Autorizar Presupuesto de Reparación Locativa',
      uml: 'Casos de Uso (1), Actividades (2), Clases POO C++ (5)'
    },
    bddScenarios: [
      {
        name: 'BDD Autónomo (<= 1 SMMLV)',
        given: 'Costo cotizado de reparación es de $750.000 COP (<= 1 SMMLV)',
        when: 'Encargado SST evalúa el caso',
        then: 'Autoriza orden de compra directamente con su firma digital inmediata',
        timeEst: '3h'
      },
      {
        name: 'BDD Escalamiento (> 1 SMMLV)',
        given: 'Costo de reparación locativa asciende a $4.200.000 COP (> 1 SMMLV)',
        when: 'Encargado SST procesa el radicado',
        then: 'Bloquea aprobación directa y deriva expediente a la bandeja del Empleador / Gerente',
        timeEst: '3h'
      },
      {
        name: 'Firma Digital y Sello de Tiempo',
        given: 'Gerente aprueba en consola gerencial',
        when: 'Aplica token de firma cifrada',
        then: 'Genera comprobante sellado en reposo con AES-256 e inicia orden de trabajo',
        timeEst: '2h'
      }
    ]
  }
];

export const PLANT_QUADRANTS: PlantQuadrant[] = [
  { id: 'Q-A1', name: 'Nave Prensas y Troquelado', area: 'Sector A', riskClass: 'V', supervisor: 'Carlos Mario Vélez', activeHazards: 2 },
  { id: 'Q-B2', name: 'Hornos y Tratamiento Térmico', area: 'Sector B', riskClass: 'V', supervisor: 'Elena Montoya', activeHazards: 1 },
  { id: 'Q-C3', name: 'Línea de Ensamble y Soldadura', area: 'Sector C', riskClass: 'IV', supervisor: 'Andrés Gómez', activeHazards: 0 },
  { id: 'Q-D4', name: 'Almacén Químico y Solventes', area: 'Sector D', riskClass: 'V', supervisor: 'Marta Cecilia Ríos', activeHazards: 3 },
  { id: 'Q-E5', name: 'Patio de Maniobras y Montacargas', area: 'Sector E', riskClass: 'IV', supervisor: 'Diego Pineda', activeHazards: 1 },
  { id: 'Q-F6', name: 'Taller de Torno y Fresado', area: 'Sector F', riskClass: 'III', supervisor: 'Carlos Mario Vélez', activeHazards: 0 }
];

export const SMMLV_PARAM = 1423500; // COP 2026 parametrizado
