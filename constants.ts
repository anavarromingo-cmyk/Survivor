import { GuidelineRule, ExposureType, RiskLevel, EvidenceLevel, Sex } from './types';

// Simulación de base de datos de reglas extraídas de COG v6.0 y PanCare (Traducido)
export const CLINICAL_RULES: GuidelineRule[] = [
  // --- ANTRACICLINAS (Cardiotoxicidad) ---
  {
    id: 'COG-34-Anthracyclines',
    guidelineSource: 'COG_v6',
    sectionReference: 'Sección 34 / 77',
    exposureType: ExposureType.Chemotherapy,
    lateEffectCategory: 'Cardiovascular',
    riskLevel: RiskLevel.High,
    recommendationTextClinician: 'Cribado de miocardiopatía. Los factores de riesgo cardiovascular tradicionales aumentan significativamente el riesgo.',
    recommendationTextPatient: 'Tu corazón necesita revisiones periódicas porque algunas de las medicinas que recibiste (antraciclinas) pueden afectar la forma en que el músculo cardíaco bombea.',
    testModality: 'Ecocardiograma',
    startTimeCondition: 'Entrada en seguimiento a largo plazo',
    interval: 'Cada 2-5 años según dosis',
    evidenceStrength: EvidenceLevel.High,
    exposureCriteria: (exp) => {
      const agents = ['doxorrubicina', 'daunorrubicina', 'epirrubicina', 'idarrubicina', 'mitoxantrona'];
      return agents.some(a => exp.name.toLowerCase().includes(a));
    }
  },
  
  // --- RADIOTERAPIA TORÁCICA (Cáncer de Mama) ---
  {
    id: 'COG-73-BreastCa',
    guidelineSource: 'COG_v6',
    sectionReference: 'Sección 73',
    exposureType: ExposureType.Radiation,
    lateEffectCategory: 'Neoplasia Secundaria',
    riskLevel: RiskLevel.High,
    recommendationTextClinician: 'Mamografía anual y RM de mama recomendada para mujeres tratadas con radioterapia torácica.',
    recommendationTextPatient: 'Debido a que recibiste radioterapia en el área del tórax, es muy importante revisar tus mamas regularmente para detectar cualquier cambio a tiempo.',
    testModality: 'Mamografía + RM',
    startTimeCondition: '25 años de edad u 8 años post-radiación (lo que ocurra después)',
    interval: 'Anual',
    evidenceStrength: EvidenceLevel.High,
    exposureCriteria: (exp, patient) => {
      return exp.type === ExposureType.Radiation && 
             (exp.name.toLowerCase().includes('tórax') || exp.name.toLowerCase().includes('manto') || exp.name.toLowerCase().includes('axila') || exp.name.toLowerCase().includes('mediastino')) &&
             patient.sex === Sex.Female;
    }
  },

  // --- RADIOTERAPIA TORÁCICA (Pulmonar) ---
  {
    id: 'COG-75-Pulmonary',
    guidelineSource: 'COG_v6',
    sectionReference: 'Sección 75',
    exposureType: ExposureType.Radiation,
    lateEffectCategory: 'Pulmonar',
    riskLevel: RiskLevel.Moderate,
    recommendationTextClinician: 'PFTs basales. Repetir según indicación clínica. Riesgo de fibrosis pulmonar.',
    recommendationTextPatient: 'La radioterapia en el tórax a veces puede endurecer los pulmones. Recomendamos una prueba de respiración para establecer una base.',
    testModality: 'PFTs (Espirometría + DLCO)',
    startTimeCondition: 'Entrada en seguimiento',
    interval: 'Basal, luego según clínica',
    evidenceStrength: EvidenceLevel.High,
    exposureCriteria: (exp) => {
       return exp.type === ExposureType.Radiation && 
             (exp.name.toLowerCase().includes('tórax') || exp.name.toLowerCase().includes('pulmón') || exp.name.toLowerCase().includes('tbi') || exp.name.toLowerCase().includes('manto'));
    }
  },

  // --- PLATINOS (Audición) ---
  {
    id: 'COG-22-Hearing',
    guidelineSource: 'COG_v6',
    sectionReference: 'Sección 22',
    exposureType: ExposureType.Chemotherapy,
    lateEffectCategory: 'Auditivo',
    riskLevel: RiskLevel.Moderate,
    recommendationTextClinician: 'Evaluación audiológica para pérdida auditiva de alta frecuencia.',
    recommendationTextPatient: 'Medicinas como el cisplatino o carboplatino pueden afectar la audición, especialmente los sonidos agudos. Las pruebas de audición regulares son importantes.',
    testModality: 'Audiometría (>8000Hz)',
    startTimeCondition: 'Entrada en seguimiento',
    interval: 'Una vez, luego según indicación',
    evidenceStrength: EvidenceLevel.High,
    exposureCriteria: (exp) => {
      return ['cisplatino', 'carboplatino'].some(a => exp.name.toLowerCase().includes(a));
    }
  },

    // --- ESPLENECTOMÍA (Inmune) ---
  {
    id: 'COG-147-Splenectomy',
    guidelineSource: 'COG_v6',
    sectionReference: 'Sección 147',
    exposureType: ExposureType.Surgery,
    lateEffectCategory: 'Inmunológico',
    riskLevel: RiskLevel.High,
    recommendationTextClinician: 'Riesgo de infección fulminante post-esplenectomía. Asegurar vacunas (Neumococo, Meningococo, Hib). Profilaxis antibiótica según guías.',
    recommendationTextPatient: 'Dado que se extirpó el bazo, tu cuerpo necesita ayuda extra para combatir ciertas bacterias. Mantén las vacunas al día y acude al médico inmediatamente si tienes fiebre.',
    testModality: 'Revisión de Vacunación',
    startTimeCondition: 'Inmediato',
    interval: 'Continuo',
    evidenceStrength: EvidenceLevel.High,
    exposureCriteria: (exp) => {
      return exp.name.toLowerCase().includes('esplenectomía');
    }
  }
];

export const DRUG_DICTIONARY = [
  'Doxorrubicina', 'Daunorrubicina', 'Epirrubicina', 'Idarrubicina', 'Mitoxantrona',
  'Cisplatino', 'Carboplatino',
  'Ciclofosfamida', 'Ifosfamida',
  'Metotrexato', 'Bleomicina', 'Vincristina', 'Vinblastina',
  'Etopósido'
];

export const RADIATION_FIELDS = [
  'Irradiación Corporal Total (TBI)',
  'Craneal / Cerebro',
  'Cabeza y Cuello',
  'Manto / Mediastino / Tórax',
  'Axila',
  'Abdomen / Flanco',
  'Pelvis',
  'Columna',
  'Extremidad'
];

export const SURGERIES = [
  'Esplenectomía',
  'Nefrectomía',
  'Amputación',
  'Toracotomía',
  'Laminectomía',
  'Ooforectomía',
  'Orquiectomía'
];