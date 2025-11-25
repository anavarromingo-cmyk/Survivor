export enum Sex {
  Male = 'Male',
  Female = 'Female'
}

export enum ExposureType {
  Chemotherapy = 'Chemotherapy',
  Radiation = 'Radiation',
  Surgery = 'Surgery',
  HSCT = 'HSCT'
}

export enum RiskLevel {
  Low = 'Low',
  Moderate = 'Moderate',
  High = 'High'
}

export enum EvidenceLevel {
  High = '1',
  Moderate = '2A',
  Consensus = '2B'
}

export interface Patient {
  id: string;
  age: number;
  birthYear: number;
  diagnosisYear: number;
  sex: Sex;
  weight?: number; // kg
  height?: number; // cm
  tumorType: string;
}

export interface Exposure {
  id: string;
  type: ExposureType;
  name: string; // e.g., "Doxorubicin", "Chest Radiation"
  dose?: number; // e.g., 300 mg/m2 or 20 Gy
  unit?: string;
  date?: string;
  details?: string; // e.g., "Mantle field", "Allogeneic"
}

export interface GuidelineRule {
  id: string;
  guidelineSource: 'COG_v6' | 'PanCare_2024';
  sectionReference: string; // e.g., "Section 34"
  exposureType: ExposureType;
  exposureCriteria: (exp: Exposure, patient: Patient) => boolean; // Logic function
  lateEffectCategory: string; // e.g., "Cardiovascular"
  riskLevel: RiskLevel;
  recommendationTextClinician: string;
  recommendationTextPatient: string;
  testModality: string;
  startTimeCondition: string;
  interval: string;
  evidenceStrength: EvidenceLevel;
  notes?: string;
}

export interface FollowUpRecommendation {
  id: string;
  ruleId: string;
  lateEffect: string;
  riskLevel: RiskLevel;
  test: string;
  frequency: string;
  startCriteria: string;
  clinicianText: string;
  patientText: string;
  source: string;
  evidence: EvidenceLevel;
}

export interface FollowUpPlan {
  patient: Patient;
  exposures: Exposure[];
  recommendations: FollowUpRecommendation[];
  generatedAt: Date;
  generatedBy: string;
}