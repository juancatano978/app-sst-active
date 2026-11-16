import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  PlantIncidentReport, 
  WorkerEPPProfile, 
  PlantQuadrant, 
  PlannedInspectionRun, 
  SafetyBulletinItem,
  BulletinCategory,
  PlantUserProfile,
  SupervisorNotification
} from '../types/plantOps';
import { 
  INITIAL_QUADRANTS, 
  INITIAL_INCIDENTS, 
  INITIAL_WORKERS, 
  INITIAL_INSPECTIONS, 
  INITIAL_BULLETINS,
  PLANT_USERS,
  SMMLV_PARAM
} from '../data/plantOpsStore';
import { getSystemTimestamp, getSystemDateOnly } from '../utils/dateUtils';
import type { PlantDatabaseSnapshot } from '../services/googleSheetsDb';

interface PlantContextType {
  currentUser: PlantUserProfile | null;
  availableUsers: PlantUserProfile[];
  loginWithCarnet: (carnetInput: string) => { success: boolean; user?: PlantUserProfile; error?: string };
  logout: () => void;
  quadrants: PlantQuadrant[];
  incidents: PlantIncidentReport[];
  workers: WorkerEPPProfile[];
  inspections: PlannedInspectionRun[];
  bulletins: SafetyBulletinItem[];
  selectedIncidentId: string;
  setSelectedIncidentId: (id: string) => void;
  createIncident: (data: Partial<PlantIncidentReport>) => PlantIncidentReport;
  updateGtc45Evaluation: (
    incidentId: string, 
    evaluation: NonNullable<PlantIncidentReport['gtc45Evaluation']>
  ) => void;
  assignEPPToWorker: (workerId: string, gearItem: { name: string; serial: string }) => boolean;
  updateWorkOrderStatus: (
    incidentId: string, 
    status: NonNullable<PlantIncidentReport['workOrder']>['status'],
    authorizedBy?: string
  ) => void;
  recordBulletinRead: (bulletinId: string, carnet?: string) => void;
  createBulletin: (data: {
    title: string;
    category: BulletinCategory;
    urgency: SafetyBulletinItem['urgency'];
    targetAudience: string;
    summary: string;
    legalBasis: string;
    requiredControls: string[];
    totalAudience: number;
    content: string[];
  }) => SafetyBulletinItem;
  completeInspection: (inspectionId: string, score: number, findings: number) => void;
  supervisorNotifications: SupervisorNotification[];
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;
  linkedSpreadsheetId: string;
  setLinkedSpreadsheetId: (id: string) => void;
  pendingSheetChanges: number;
  lastSheetSyncAt: string | null;
  markSheetSynced: (timestamp?: string) => void;
  hydrateDatabaseFromSheets: (snapshot: Partial<PlantDatabaseSnapshot>) => void;
}

const PlantContext = createContext<PlantContextType | undefined>(undefined);

const NOTIF_STORAGE_KEY = 'sst_active_supervisor_notifications_v1';
const INCIDENTS_STORAGE_KEY = 'sst_active_totem_incidents_v1';
const LINKED_SHEET_KEY = 'sst_active_linked_sheet_id_v1';

const loadStoredSheetId = (): string => {
  try {
    return localStorage.getItem(LINKED_SHEET_KEY) || '';
  } catch {
    return '';
  }
};

const loadStoredNotifications = (): SupervisorNotification[] => {
  try {
    const raw = localStorage.getItem(NOTIF_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SupervisorNotification[]) : [];
  } catch {
    return [];
  }
};

const loadStoredIncidents = (): PlantIncidentReport[] => {
  try {
    const raw = localStorage.getItem(INCIDENTS_STORAGE_KEY);
    if (!raw) return INITIAL_INCIDENTS;
    const custom = JSON.parse(raw) as PlantIncidentReport[];
    const existingIds = new Set(INITIAL_INCIDENTS.map(i => i.id));
    const uniqueCustom = custom.filter(c => !existingIds.has(c.id));
    return [...uniqueCustom, ...INITIAL_INCIDENTS];
  } catch {
    return INITIAL_INCIDENTS;
  }
};

export const PlantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<PlantUserProfile | null>(null);
  const [quadrants, setQuadrants] = useState<PlantQuadrant[]>(INITIAL_QUADRANTS);
  const [incidents, setIncidents] = useState<PlantIncidentReport[]>(loadStoredIncidents);
  const [workers, setWorkers] = useState<WorkerEPPProfile[]>(INITIAL_WORKERS);
  const [inspections, setInspections] = useState<PlannedInspectionRun[]>(INITIAL_INSPECTIONS);
  const [bulletins, setBulletins] = useState<SafetyBulletinItem[]>(INITIAL_BULLETINS);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>('RAD-2026-088192');
  const [supervisorNotifications, setSupervisorNotifications] = useState<SupervisorNotification[]>(loadStoredNotifications);
  const [linkedSpreadsheetId, setLinkedSpreadsheetIdState] = useState<string>(loadStoredSheetId);
  const [pendingSheetChanges, setPendingSheetChanges] = useState<number>(0);
  const [lastSheetSyncAt, setLastSheetSyncAt] = useState<string | null>(null);

  const setLinkedSpreadsheetId = (id: string) => {
    setLinkedSpreadsheetIdState(id);
    try {
      if (id) {
        localStorage.setItem(LINKED_SHEET_KEY, id);
      } else {
        localStorage.removeItem(LINKED_SHEET_KEY);
      }
    } catch {
      // ignore storage errors
    }
  };

  const markSheetSynced = (timestamp?: string) => {
    setPendingSheetChanges(0);
    setLastSheetSyncAt(timestamp || getSystemTimestamp());
  };

  useEffect(() => {
    const handleStorageSync = (e: StorageEvent) => {
      if (e.key === NOTIF_STORAGE_KEY) {
        setSupervisorNotifications(loadStoredNotifications());
      }
      if (e.key === INCIDENTS_STORAGE_KEY) {
        setIncidents(loadStoredIncidents());
      }
    };
    window.addEventListener('storage', handleStorageSync);
    return () => window.removeEventListener('storage', handleStorageSync);
  }, []);

  const loginWithCarnet = (carnetInput: string) => {
    const cleaned = carnetInput.trim().replace(/^#/, '').replace(/\./g, '');
    if (!cleaned) {
      return { success: false, error: 'Ingrese o aproxime un número de carné válido.' };
    }
    const found = PLANT_USERS.find(
      u => u.carnet === cleaned || u.cedula.replace(/\./g, '') === cleaned
    );
    if (!found) {
      return {
        success: false,
        error: `El carné "${carnetInput.trim()}" no se encuentra habilitado en el directorio activo de planta.`
      };
    }
    setCurrentUser(found);
    return { success: true, user: found };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const createIncident = (data: Partial<PlantIncidentReport>): PlantIncidentReport => {
    const id = `RAD-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const formattedDate = getSystemTimestamp();

    const newIncident: PlantIncidentReport = {
      id,
      title: data.title || 'Condición de riesgo en línea',
      category: data.category || 'Locativo',
      quadrantId: data.quadrantId || 'Q-A1',
      quadrantName: data.quadrantName || 'Nave Prensas y Troquelado',
      area: data.area || 'Sector A',
      supervisor: data.supervisor || 'Carlos Mario Vélez',
      reportedBy: data.reportedBy || 'Operario de Turno',
      reportedAt: formattedDate,
      status: 'Reportado',
      description: data.description || '',
      isAnonymous: data.isAnonymous || false
    };

    setIncidents(prev => {
      const updated = [newIncident, ...prev];
      try {
        const initialIds = new Set(INITIAL_INCIDENTS.map(i => i.id));
        const onlyCustom = updated.filter(i => !initialIds.has(i.id));
        localStorage.setItem(INCIDENTS_STORAGE_KEY, JSON.stringify(onlyCustom));
      } catch {
        // ignore storage quota errors
      }
      return updated;
    });
    setSelectedIncidentId(id);

    // Emitir notificación inmediata para el Supervisor HSEQ cuando ingrese
    const newNotification: SupervisorNotification = {
      id: `NOTIF-${Date.now()}`,
      incidentId: newIncident.id,
      title: newIncident.title,
      description: newIncident.description,
      category: newIncident.category,
      quadrantName: newIncident.quadrantName,
      area: newIncident.area,
      reportedBy: newIncident.reportedBy,
      reportedAt: newIncident.reportedAt,
      isAnonymous: Boolean(newIncident.isAnonymous),
      read: false
    };

    setSupervisorNotifications(prev => {
      const updated = [newNotification, ...prev];
      try {
        localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore storage quota errors
      }
      return updated;
    });

    // Update active hazard count for that quadrant
    setQuadrants(prev => prev.map(q => {
      if (q.id === newIncident.quadrantId) {
        return { ...q, activeHazards: q.activeHazards + 1 };
      }
      return q;
    }));
    setPendingSheetChanges(prev => prev + 1);

    return newIncident;
  };

  const updateGtc45Evaluation = (
    incidentId: string, 
    evaluation: NonNullable<PlantIncidentReport['gtc45Evaluation']>
  ) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        const isSuspension = Boolean(evaluation.suspensionOrder);
        const newStatus = isSuspension ? 'Suspendido' : 'En Triaje';
        return {
          ...inc,
          status: newStatus,
          gtc45Evaluation: evaluation
        };
      }
      return inc;
    }));

    // If critical condition, mark quadrant
    if (evaluation.nr >= 600) {
      setQuadrants(prev => prev.map(q => {
        const targetInc = incidents.find(i => i.id === incidentId);
        if (targetInc && q.id === targetInc.quadrantId) {
          return { ...q, criticalConditions: q.criticalConditions + 1 };
        }
        return q;
      }));
    }
    setPendingSheetChanges(prev => prev + 1);
  };

  const assignEPPToWorker = (workerId: string, gearItem: { name: string; serial: string }): boolean => {
    const worker = workers.find(w => w.id === workerId);
    if (!worker || worker.certStatus === 'VENCIDO') {
      return false;
    }

    const assignedAt = getSystemDateOnly();
    const inspectionDue = '2027-01-28'; // Próxima inspección trimestral

    const newGear = {
      id: `G-${Date.now()}`,
      name: gearItem.name,
      serial: gearItem.serial,
      assignedAt,
      inspectionDue
    };

    setWorkers(prev => prev.map(w => {
      if (w.id === workerId) {
        return {
          ...w,
          assignedGear: [newGear, ...w.assignedGear]
        };
      }
      return w;
    }));
    setPendingSheetChanges(prev => prev + 1);

    return true;
  };

  const updateWorkOrderStatus = (
    incidentId: string, 
    status: NonNullable<PlantIncidentReport['workOrder']>['status'],
    authorizedBy?: string
  ) => {
    const dateStr = getSystemDateOnly();

    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId && inc.workOrder) {
        return {
          ...inc,
          workOrder: {
            ...inc.workOrder,
            status,
            authorizedBy: authorizedBy || inc.workOrder.authorizedBy,
            authorizedAt: dateStr
          }
        };
      }
      return inc;
    }));
    setPendingSheetChanges(prev => prev + 1);
  };

  const recordBulletinRead = (bulletinId: string, carnet?: string) => {
    const badge = carnet || currentUser?.carnet || '883921';
    setBulletins(prev => prev.map(b => {
      if (b.id === bulletinId) {
        if (b.acknowledgedByCarnets.includes(badge)) {
          return b;
        }
        return {
          ...b,
          readsCount: Math.min(b.totalAudience, b.readsCount + 1),
          acknowledgedByCarnets: [...b.acknowledgedByCarnets, badge]
        };
      }
      return b;
    }));
    setPendingSheetChanges(prev => prev + 1);
  };

  const createBulletin = (data: {
    title: string;
    category: BulletinCategory;
    urgency: SafetyBulletinItem['urgency'];
    targetAudience: string;
    summary: string;
    legalBasis: string;
    requiredControls: string[];
    totalAudience: number;
    content: string[];
  }): SafetyBulletinItem => {
    const nextNum = 49 + bulletins.length - 4;
    const padded = String(Math.max(49, nextNum)).padStart(3, '0');
    const authorLabel = currentUser
      ? `${currentUser.name} · ${currentUser.roleLabel}`
      : 'Carlos Mario Vélez · Especialista SST';

    const newBulletin: SafetyBulletinItem = {
      id: `BOL-2026-${padded}`,
      title: data.title.trim(),
      category: data.category,
      urgency: data.urgency,
      targetAudience: data.targetAudience.trim(),
      publishedAt: getSystemTimestamp(),
      author: authorLabel,
      summary: data.summary.trim(),
      legalBasis: data.legalBasis.trim() || 'Decreto 1072 de 2015 · Resolución 0312 de 2019',
      requiredControls: data.requiredControls.filter(Boolean),
      readsCount: 1,
      totalAudience: Math.max(1, data.totalAudience || 60),
      acknowledgedByCarnets: currentUser?.carnet ? [currentUser.carnet] : [],
      content: data.content.map(c => c.trim()).filter(Boolean)
    };

    setBulletins(prev => [newBulletin, ...prev]);
    setPendingSheetChanges(prev => prev + 1);
    return newBulletin;
  };

  const completeInspection = (inspectionId: string, score: number, findings: number) => {
    setInspections(prev => prev.map(ins => {
      if (ins.id === inspectionId) {
        return {
          ...ins,
          status: 'Completada',
          score,
          findingsCount: findings,
          actaPdfUrl: `ACTA-${ins.id}.pdf`
        };
      }
      return ins;
    }));
    setPendingSheetChanges(prev => prev + 1);
  };

  const markNotificationRead = (notificationId: string) => {
    setSupervisorNotifications(prev => {
      const updated = prev.map(n => (n.id === notificationId ? { ...n, read: true } : n));
      try {
        localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore storage quota errors
      }
      return updated;
    });
  };

  const markAllNotificationsRead = () => {
    setSupervisorNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }));
      try {
        localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore storage quota errors
      }
      return updated;
    });
  };

  const hydrateDatabaseFromSheets = (snapshot: Partial<PlantDatabaseSnapshot>) => {
    if (snapshot.incidents && snapshot.incidents.length > 0) {
      setIncidents(snapshot.incidents);
      try {
        localStorage.setItem(INCIDENTS_STORAGE_KEY, JSON.stringify(snapshot.incidents));
      } catch {
        // ignore storage quota
      }
    }
    if (snapshot.workers && snapshot.workers.length > 0) {
      setWorkers(snapshot.workers);
    }
    if (snapshot.inspections && snapshot.inspections.length > 0) {
      setInspections(snapshot.inspections);
    }
    if (snapshot.bulletins && snapshot.bulletins.length > 0) {
      setBulletins(snapshot.bulletins);
    }
    if (snapshot.notifications) {
      setSupervisorNotifications(snapshot.notifications);
      try {
        localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(snapshot.notifications));
      } catch {
        // ignore storage quota
      }
    }
    markSheetSynced();
  };

  return (
    <PlantContext.Provider value={{
      currentUser,
      availableUsers: PLANT_USERS,
      loginWithCarnet,
      logout,
      quadrants,
      incidents,
      workers,
      inspections,
      bulletins,
      selectedIncidentId,
      setSelectedIncidentId,
      createIncident,
      updateGtc45Evaluation,
      assignEPPToWorker,
      updateWorkOrderStatus,
      recordBulletinRead,
      createBulletin,
      completeInspection,
      supervisorNotifications,
      markNotificationRead,
      markAllNotificationsRead,
      linkedSpreadsheetId,
      setLinkedSpreadsheetId,
      pendingSheetChanges,
      lastSheetSyncAt,
      markSheetSynced,
      hydrateDatabaseFromSheets
    }}>
      {children}
    </PlantContext.Provider>
  );
};

export const usePlant = () => {
  const context = useContext(PlantContext);
  if (!context) {
    throw new Error('usePlant must be used within a PlantProvider');
  }
  return context;
};
