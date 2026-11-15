export type RiskLevel = 'CRITICO' | 'ALTO' | 'MEDIO' | 'BAJO';

export interface PlantIncidentReport {
  id: string; // e.g. "RAD-2026-088192"
  title: string;
  category: 'Locativo' | 'Mecánico' | 'Eléctrico' | 'Químico';
  quadrantId: string;
  quadrantName: string;
  area: string;
  supervisor: string;
  reportedBy: string;
  reportedAt: string;
  status: 'Reportado' | 'En Triaje' | 'Mitigado' | 'Suspendido' | 'Cerrado';
  description: string;
  isAnonymous?: boolean;
  gtc45Evaluation?: {
    nd: number;
    ne: number;
    np: number;
    nc: number;
    nr: number;
    level: string;
    evaluatedAt: string;
    evaluator: string;
    photoEvidenceUrl?: string;
    suspensionOrder?: {
      orderId: string;
      issuedAt: string;
      digitalSignature: string;
      machineStopped: string;
    };
  };
  workOrder?: {
    id: string;
    cost: number;
    description: string;
    status: 'Pendiente SST' | 'Aprobado Autónomo SST' | 'Escalado a Gerencia' | 'Aprobado Gerencia' | 'Rechazado';
    authorizedBy?: string;
    authorizedAt?: string;
  };
}

export interface WorkerEPPProfile {
  id: string;
  name: string;
  cedula: string;
  cargo: string;
  area: string;
  certStatus: 'ACTIVO' | 'VENCIDO' | 'PROXIMO_VENCER';
  certExpDate: string;
  certNumber: string;
  trainingCenter: string;
  assignedGear: {
    id: string;
    name: string;
    serial: string;
    assignedAt: string;
    inspectionDue: string;
  }[];
}

export interface PlantQuadrant {
  id: string;
  name: string;
  area: string;
  riskClass: 'III' | 'IV' | 'V';
  supervisor: string;
  activeHazards: number;
  criticalConditions: number;
}

export interface PlannedInspectionRun {
  id: string;
  area: string;
  quadrantId: string;
  scheduledDate: string;
  inspector: string;
  status: 'Completada' | 'En Curso' | 'Programada';
  score: number;
  actaPdfUrl?: string;
  findingsCount: number;
}

export interface SafetyBulletinItem {
  id: string;
  title: string;
  urgency: 'ALTA PRIORIDAD' | 'PREVENTIVO' | 'INFORMATIVO';
  targetAudience: string;
  publishedAt: string;
  readsCount: number;
  totalAudience: number;
  content: string[];
}

export type ModuleId =
  | 'dashboard'
  | 'totem'
  | 'triaje'
  | 'alturas'
  | 'inspecciones'
  | 'legal'
  | 'boletines'
  | 'presupuesto';

export type UserRole =
  | 'OPERARIO'
  | 'SUPERVISOR_HSEQ'
  | 'ALMACENISTA'
  | 'GERENCIA';

export interface PlantUserProfile {
  id: string;
  carnet: string;
  cedula: string;
  name: string;
  cargo: string;
  area: string;
  turno: string;
  role: UserRole;
  roleLabel: string;
  allowedModules: ModuleId[];
}

