export interface UserStory {
  id: string; // e.g. "HU-001"
  title: string;
  subtitle: string;
  priority: 'Alta (Riesgo Crítico)' | 'Alta (Habeas Data)' | 'Alta (Cumplimiento Legal)' | 'Media (Control Operativo)' | 'Media (Inspecciones)' | 'Normal (Comunicación)' | 'Media/Alta (Finanzas)';
  priorityColor: string;
  status: 'Completado (Done)' | 'En Pruebas (Testing)' | 'En Proceso (In Progress)' | 'Por Hacer (To Do)' | 'Backlog de Producto';
  statusColor: string;
  estimatedHours: number;
  estimatedDays: number;
  channel: 'Tótem Fijo IK10/IP65' | 'Tablet ATEX IP68' | 'Consola Web / PC' | 'Consola Gerencial';
  channelIcon: string;
  actor: 'Operario de Planta' | 'Supervisor HSEQ' | 'Especialista SST' | 'Empleador / Gerencia';
  description: string;
  businessRules: {
    code: string;
    name: string;
    summary: string;
    legalBasis: string;
  }[];
  traceability: {
    rf: string[];
    rnf: string[];
    uc: string;
    uml: string;
  };
  bddScenarios: {
    name: string;
    given: string;
    when: string;
    then: string;
    timeEst: string;
  }[];
}

export interface BusinessRule {
  code: string;
  name: string;
  formula: string;
  legalBasis: string;
  description: string;
}

export interface PlantQuadrant {
  id: string;
  name: string;
  area: string;
  riskClass: 'III' | 'IV' | 'V';
  supervisor: string;
  activeHazards: number;
}
