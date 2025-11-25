import { Patient, Exposure, FollowUpPlan, FollowUpRecommendation } from '../types';
import { CLINICAL_RULES } from '../constants';

/**
 * Deterministic Risk Engine
 * Applies COG/PanCare rules to patient exposures.
 * NO LLM is used for decision making here.
 */
export const generateFollowUpPlan = (
  patient: Patient,
  exposures: Exposure[],
  clinicianName: string
): FollowUpPlan => {
  
  const recommendations: FollowUpRecommendation[] = [];

  // Iterate through all exposures and checking against rules
  exposures.forEach(exposure => {
    // Filter rules applicable to this exposure type
    const potentialRules = CLINICAL_RULES.filter(
      r => r.exposureType === exposure.type
    );

    potentialRules.forEach(rule => {
      // Evaluate criteria function
      const isMatch = rule.exposureCriteria(exposure, patient);

      if (isMatch) {
        recommendations.push({
          id: crypto.randomUUID(),
          ruleId: rule.id,
          lateEffect: rule.lateEffectCategory,
          riskLevel: rule.riskLevel,
          test: rule.testModality,
          frequency: rule.interval,
          startCriteria: rule.startTimeCondition,
          clinicianText: rule.recommendationTextClinician,
          patientText: rule.recommendationTextPatient,
          source: `${rule.guidelineSource} - ${rule.sectionReference}`,
          evidence: rule.evidenceStrength
        });
      }
    });
  });

  // Simple Deduplication Logic (e.g., multiple anthracyclines triggering same cardiac rule)
  // In a real app, this would be more sophisticated to merge frequencies (e.g. every 2 years vs every 5)
  const uniqueRecommendations = recommendations.reduce((acc, current) => {
    const x = acc.find(item => item.ruleId === current.ruleId);
    if (!x) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, [] as FollowUpRecommendation[]);

  // Sort by Risk Level
  uniqueRecommendations.sort((a, b) => {
    const riskScore = { High: 3, Moderate: 2, Low: 1 };
    return riskScore[b.riskLevel] - riskScore[a.riskLevel];
  });

  return {
    patient,
    exposures,
    recommendations: uniqueRecommendations,
    generatedAt: new Date(),
    generatedBy: clinicianName
  };
};