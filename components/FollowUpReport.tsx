import React, { useState } from 'react';
import { FollowUpPlan, RiskLevel } from '../types';

interface Props {
  plan: FollowUpPlan;
}

export const FollowUpReport: React.FC<Props> = ({ plan }) => {
  const [view, setView] = useState<'clinician' | 'patient'>('clinician');
  const [isGenerating, setIsGenerating] = useState(false);

  const getRiskBadge = (level: RiskLevel) => {
    const colors = {
      [RiskLevel.High]: 'bg-red-100 text-red-800',
      [RiskLevel.Moderate]: 'bg-yellow-100 text-yellow-800',
      [RiskLevel.Low]: 'bg-green-100 text-green-800',
    };
    const labels = {
      [RiskLevel.High]: 'Riesgo Alto',
      [RiskLevel.Moderate]: 'Riesgo Moderado',
      [RiskLevel.Low]: 'Riesgo Bajo',
    };
    return <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colors[level]}`}>{labels[level]}</span>;
  };

  const handleDownloadPDF = () => {
    setIsGenerating(true);
    const element = document.getElementById('printable-report');
    const opt = {
      margin: [10, 10, 10, 10], // top, left, bottom, right (mm)
      filename: `SurvivorCare_${view === 'clinician' ? 'Clinico' : 'Paciente'}_${plan.patient.id.slice(0,6)}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: false
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // @ts-ignore
    if (window.html2pdf) {
        // @ts-ignore
        window.html2pdf().set(opt).from(element).save().then(() => {
            setIsGenerating(false);
        }).catch((err: any) => {
            console.error(err);
            setIsGenerating(false);
            alert("Error al generar PDF. Intente imprimir usando el navegador (Ctrl+P).");
        });
    } else {
        // Fallback if library fails to load
        window.print();
        setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls - Hidden in Print */}
      <div className="flex justify-between items-center no-print bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex space-x-4">
          <button 
            onClick={() => setView('clinician')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${view === 'clinician' ? 'bg-medical-600 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
          >
            Informe Clínico
          </button>
          <button 
            onClick={() => setView('patient')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${view === 'patient' ? 'bg-medical-600 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
          >
            Guía para el Paciente
          </button>
        </div>
        <button 
          onClick={handleDownloadPDF}
          disabled={isGenerating}
          className={`flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-medical-700 bg-medical-100 hover:bg-medical-200 ${isGenerating ? 'opacity-50 cursor-wait' : ''}`}
        >
          {isGenerating ? (
             <span className="flex items-center">Generando...</span>
          ) : (
             <>
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                Descargar PDF
             </>
          )}
        </button>
      </div>

      {/* Printable Area */}
      <div className="bg-white p-8 shadow-lg print:shadow-none print:p-0 max-w-4xl mx-auto" id="printable-report">
        
        {/* Header */}
        <div className="border-b pb-4 mb-6 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 text-medical-700">Plan de Seguimiento SurvivorCare</h1>
            <p className="text-sm text-slate-500">Generado por: {plan.generatedBy} el {plan.generatedAt.toLocaleDateString()}</p>
          </div>
          <div className="text-right text-sm bg-slate-50 p-2 rounded">
            <p><strong>Paciente ID:</strong> {plan.patient.id.slice(0,8)}...</p>
            <p><strong>Edad:</strong> {plan.patient.age} años ({plan.patient.sex === 'Male' ? 'H' : 'M'})</p>
            <p><strong>Diagnóstico:</strong> {plan.patient.diagnosisYear} - {plan.patient.tumorType}</p>
          </div>
        </div>

        {/* Content based on View */}
        {view === 'clinician' ? (
          <div className="space-y-6">
            <div className="bg-slate-50 p-4 rounded border border-slate-200">
              <h2 className="font-semibold text-medical-800 mb-2 text-sm uppercase tracking-wide">Resumen del Tratamiento</h2>
              <div className="flex flex-wrap gap-2">
                {plan.exposures.map(e => (
                  <span key={e.id} className="bg-white border border-slate-300 px-2 py-1 rounded text-xs font-medium text-slate-700">
                    {e.name} {e.dose ? `(${e.dose} ${e.unit})` : ''}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-bold text-lg mb-4 border-l-4 border-medical-500 pl-2 text-slate-800">Recomendaciones Estratificadas por Riesgo</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 border">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="px-3 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Efecto Tardío</th>
                      <th className="px-3 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Riesgo</th>
                      <th className="px-3 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Prueba</th>
                      <th className="px-3 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Frecuencia</th>
                      <th className="px-3 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Ref.</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200 text-sm">
                    {plan.recommendations.map(rec => (
                      <tr key={rec.id} className={rec.riskLevel === RiskLevel.High ? 'bg-red-50/30' : ''}>
                        <td className="px-3 py-4 font-medium text-slate-900">
                            <div>{rec.lateEffect}</div>
                            <div className="text-xs text-slate-500 font-normal mt-1">{rec.clinicianText}</div>
                        </td>
                        <td className="px-3 py-4 align-top">{getRiskBadge(rec.riskLevel)}</td>
                        <td className="px-3 py-4 align-top font-medium">{rec.test}</td>
                        <td className="px-3 py-4 align-top">{rec.frequency}</td>
                        <td className="px-3 py-4 text-slate-500 text-xs align-top">{rec.source}<br/>(Evidencia {rec.evidence})</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="mt-8 text-xs text-slate-500 border-t pt-4">
              <p><strong>Aviso legal:</strong> Estas recomendaciones se basan en las Guías COG v6.0 y PanCare (2024). No sustituyen el juicio clínico profesional. Valide siempre con la historia clínica completa.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Patient Friendly View */}
            <div className="prose max-w-none">
              <h2 className="text-xl font-bold text-medical-700">Tu Hoja de Ruta de Salud</h2>
              <p className="text-slate-600">¡Hola! Basado en los tratamientos que recibiste para curar tu cáncer, hemos preparado esta guía personalizada. El objetivo es ayudarte a mantenerte saludable y detectar cualquier problema a tiempo.</p>
            </div>

            <div className="grid gap-6">
              {plan.recommendations.map(rec => (
                <div key={rec.id} className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm break-inside-avoid">
                  <div className="flex items-center mb-3 border-b pb-2">
                    <div className={`w-2 h-8 mr-3 rounded ${rec.riskLevel === RiskLevel.High ? 'bg-red-500' : 'bg-medical-500'}`}></div>
                    <h3 className="text-lg font-bold text-slate-800">Salud {rec.lateEffect}</h3>
                  </div>
                  
                  <p className="text-slate-700 mb-4 leading-relaxed">{rec.patientText}</p>
                  
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <svg className="h-6 w-6 text-medical-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-bold text-medical-900 uppercase tracking-wide">Plan de Acción</h4>
                      <p className="text-base font-medium text-slate-900 mt-1">{rec.test}</p>
                      <p className="text-sm text-slate-600">Frecuencia: {rec.frequency}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6 break-inside-avoid">
              <div className="flex items-center mb-4">
                 <svg className="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                 <h3 className="font-bold text-lg text-green-800">Estilo de Vida Saludable</h3>
              </div>
              <ul className="space-y-2">
                <li className="flex items-start text-green-800 text-sm">
                    <span className="mr-2">•</span> Lleva una dieta equilibrada rica en frutas, verduras y fibra.
                </li>
                <li className="flex items-start text-green-800 text-sm">
                    <span className="mr-2">•</span> Evita fumar y el humo de segunda mano. Es el factor de riesgo #1.
                </li>
                <li className="flex items-start text-green-800 text-sm">
                    <span className="mr-2">•</span> Usa protector solar (SPF 30+) y ropa protectora, tu piel puede ser más sensible.
                </li>
                <li className="flex items-start text-green-800 text-sm">
                    <span className="mr-2">•</span> Mantén al día tu calendario de vacunación nacional (incluyendo gripe anual).
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Mandatory Footer */}
        <div className="mt-12 pt-6 border-t border-slate-300 text-center text-xs text-slate-400 break-inside-avoid">
          <p>© {new Date().getFullYear()} — Alvaro Navarro Mingorance — Licencia Creative Commons CC BY-NC</p>
          <p className="mt-1">Generado con SurvivorCare v1.0</p>
        </div>
      </div>
    </div>
  );
};