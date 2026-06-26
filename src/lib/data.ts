// ── LGU Info ──────────────────────────────────────────────────────────────────
export const lgu = {
  name: "Marikina City",
  region: "NCR",
  activeDisaster: "Typhoon Carina",
  alertLabel: "Flood Alert Level 2",
};

// ── Overview Stats ─────────────────────────────────────────────────────────────
export const stats = {
  activeAlerts: 3,
  resourceReadiness: 67,
  pendingActions: 8,
  evacuees: 1240,
  affectedBarangays: 5,
};

// ── Recent Activity Feed ───────────────────────────────────────────────────────
export const activities = [
  {
    type: "alert",
    message: "Flood Alert Level 2 raised for Tumana and Calumpang barangays.",
    actor: "PAGASA",
    time: "2:14 PM",
  },
  {
    type: "update",
    message: "Evacuation center at Marikina Sports Center now at 60% capacity (744 evacuees).",
    actor: "CDRRMO",
    time: "2:02 PM",
  },
  {
    type: "request",
    message: "Additional rescue boats requested from OCD-NCR (REQ001).",
    actor: "CDRRMO",
    time: "1:45 PM",
  },
  {
    type: "response",
    message: "DOH-NCR medical team deployed to Tumana evacuation center.",
    actor: "DOH-NCR",
    time: "1:30 PM",
  },
  {
    type: "update",
    message: "Water level at Marikina River reached 15.2m — elevated status.",
    actor: "MMDA",
    time: "1:10 PM",
  },
  {
    type: "request",
    message: "Food pack replenishment request submitted to DSWD-NCR (REQ002).",
    actor: "CDRRMO",
    time: "12:58 PM",
  },
];

// ── DRRM Gaps ──────────────────────────────────────────────────────────────────
export type GapSeverity = "critical" | "moderate" | "low";
export type GapStatus = "open" | "in_progress" | "resolved";

export interface Gap {
  id: string;
  category: string;
  description: string;
  severity: GapSeverity;
  status: GapStatus;
  recommendedAction: string;
}

export const gaps: Gap[] = [
  {
    id: "G001",
    category: "Evacuation Protocol",
    description: "No nighttime evacuation protocol for Tumana barangay.",
    severity: "critical",
    status: "open",
    recommendedAction: "Coordinate with barangay captain to establish a manual buddy-system protocol and designate night marshals.",
  },
  {
    id: "G002",
    category: "Resource Inventory",
    description: "Life jackets stock below minimum threshold (12 of 30 required).",
    severity: "critical",
    status: "in_progress",
    recommendedAction: "Request 18 additional life jackets from OCD-NCR or procure via emergency funds.",
  },
  {
    id: "G003",
    category: "Communication",
    description: "No backup communication channel if primary radio system fails.",
    severity: "moderate",
    status: "open",
    recommendedAction: "Establish a secondary channel via SMS tree or community group chat with all barangay captains.",
  },
  {
    id: "G004",
    category: "Training",
    description: "Only 40% of BDRRMC members completed basic first aid training.",
    severity: "moderate",
    status: "open",
    recommendedAction: "Schedule a Red Cross first aid training session before the next typhoon season.",
  },
  {
    id: "G005",
    category: "Shelter Capacity",
    description: "Evacuation center maximum capacity may be insufficient for a Typhoon Signal No. 3 event.",
    severity: "moderate",
    status: "open",
    recommendedAction: "Identify and pre-designate two additional overflow evacuation centers.",
  },
  {
    id: "G006",
    category: "Early Warning",
    description: "Early warning sirens not yet installed in Calumpang.",
    severity: "low",
    status: "resolved",
    recommendedAction: "Install community warning siren per DRRM plan section 4.2.",
  },
];

// ── Resources ──────────────────────────────────────────────────────────────────
export interface Resource {
  name: string;
  available: number;
  total: number;
  location: string;
}

export const resources: Resource[] = [
  { name: "Food Packs", available: 480, total: 600, location: "City Hall Warehouse" },
  { name: "Rescue Boats", available: 4, total: 6, location: "CDRRMO Depot" },
  { name: "Life Jackets", available: 12, total: 30, location: "CDRRMO Depot" },
  { name: "Medical Kits", available: 18, total: 20, location: "City Health Office" },
  { name: "Tents", available: 10, total: 15, location: "City Hall Warehouse" },
  { name: "Water Containers", available: 90, total: 100, location: "City Hall Warehouse" },
];

// ── Action Items (During Disaster) ─────────────────────────────────────────────
export type ActionPriority = "high" | "medium" | "low";
export type ActionStatus = "pending" | "in_progress" | "done";

export interface ActionItem {
  id: string;
  task: string;
  role: string;
  trigger: string;
  priority: ActionPriority;
  status: ActionStatus;
}

export const actionItems: ActionItem[] = [
  {
    id: "A001",
    task: "Initiate preemptive evacuation for Tumana and Calumpang barangays.",
    role: "CDRRMO Director",
    trigger: "River level exceeded 15m threshold",
    priority: "high",
    status: "in_progress",
  },
  {
    id: "A002",
    task: "Coordinate with OCD-NCR for additional rescue boat deployment (REQ001).",
    role: "Operations Officer",
    trigger: "Rescue boat shortage flagged",
    priority: "high",
    status: "pending",
  },
  {
    id: "A003",
    task: "Submit food pack replenishment request to DSWD-NCR (REQ002).",
    role: "Logistics Officer",
    trigger: "Food stock below 3-day threshold",
    priority: "high",
    status: "pending",
  },
  {
    id: "A004",
    task: "Activate overflow evacuation centers at Marikina High School and Sta. Elena.",
    role: "CDRRMO Director",
    trigger: "Sports Center at 60% capacity",
    priority: "medium",
    status: "pending",
  },
  {
    id: "A005",
    task: "Deploy medical team to Tumana evacuation center.",
    role: "City Health Officer",
    trigger: "DOH-NCR team arrival confirmed",
    priority: "medium",
    status: "done",
  },
  {
    id: "A006",
    task: "Brief all barangay captains on nighttime evacuation buddy-system protocol.",
    role: "Operations Officer",
    trigger: "Gap G001 — no nighttime protocol",
    priority: "medium",
    status: "pending",
  },
  {
    id: "A007",
    task: "Monitor Marikina River water level every 30 minutes and report to EOC.",
    role: "Monitoring Officer",
    trigger: "Active disaster — elevated water level",
    priority: "low",
    status: "in_progress",
  },
];

// ── Affected Barangays ─────────────────────────────────────────────────────────
export interface AffectedBarangay {
  name: string;
  populationAtRisk: number;
  evacuees: number;
  waterLevel: "normal" | "elevated" | "critical";
  status: "monitoring" | "evacuating" | "critical";
}

export const affectedBarangays: AffectedBarangay[] = [
  { name: "Tumana", populationAtRisk: 8200, evacuees: 540, waterLevel: "critical", status: "critical" },
  { name: "Calumpang", populationAtRisk: 6400, evacuees: 380, waterLevel: "elevated", status: "evacuating" },
  { name: "Nangka", populationAtRisk: 3100, evacuees: 180, waterLevel: "elevated", status: "evacuating" },
  { name: "Sto. Niño", populationAtRisk: 2800, evacuees: 100, waterLevel: "normal", status: "monitoring" },
  { name: "Malanday", populationAtRisk: 1900, evacuees: 40, waterLevel: "normal", status: "monitoring" },
];

// ── Agency Requests ────────────────────────────────────────────────────────────
export interface AgencyRequest {
  id: string;
  agency: string;
  item: string;
  quantity: string;
  status: "pending" | "approved" | "delivered";
  requestedAt: string;
}

export const agencyRequests: AgencyRequest[] = [
  { id: "REQ001", agency: "OCD-NCR", item: "Rescue Boats", quantity: "2 units", status: "approved", requestedAt: "1:45 PM" },
  { id: "REQ002", agency: "DSWD-NCR", item: "Food Packs", quantity: "500 packs", status: "pending", requestedAt: "12:58 PM" },
  { id: "REQ003", agency: "DOH-NCR", item: "Medical Team", quantity: "1 team (5 pax)", status: "delivered", requestedAt: "11:30 AM" },
  { id: "REQ004", agency: "PNP-Marikina", item: "Personnel for crowd control", quantity: "10 officers", status: "approved", requestedAt: "10:00 AM" },
];
