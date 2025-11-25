import React, { useState } from 'react';
import { Exposure, ExposureType } from '../types';
import { parseProtocolPDF } from '../services/geminiService';
import { DRUG_DICTIONARY, RADIATION_FIELDS, SURGERIES } from '../constants';

interface Props {
  exposures: Exposure[];
  setExposures: (e: Exposure[]) => void;
}

export const TreatmentInput: React.FC<Props> = ({ exposures, setExposures }) => {
  const [activeTab, setActiveTab] = useState<'manual' | 'pdf' | 'search'>('manual');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAddExposure = (type: ExposureType, name: string) => {
    setExposures([...exposures, { id: crypto.randomUUID(), type, name }]);
  };

  const handleRemoveExposure = (id: string) => {
    setExposures(exposures.filter(e => e.id !== id));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    // In a real app, this reads the file to base64 and sends to the service
    // simulating delay for demo
    setTimeout(async () => {
        try {
            const extracted = await parseProtocolPDF("mock_base64");
            setExposures([...exposures, ...extracted]);
            alert("Protocolo analizado correctamente. Exposiciones añadidas.");
        } catch (err) {
            alert("Error al analizar el PDF.");
        } finally {
            setIsProcessing(false);
        }
    }, 1500);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6 overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50">
        <nav className="flex -mb-px" aria-label="Tabs">
          {['manual', 'pdf', 'search'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`${
                activeTab === tab
                  ? 'border-medical-500 text-medical-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              } w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm capitalize`}
            >
              {tab === 'pdf' ? 'Subir Protocolo (OCR)' : tab === 'search' ? 'Biblioteca Protocolos' : 'Entrada Manual'}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-6">
        {/* Manual Entry Tab */}
        {activeTab === 'manual' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Añadir Quimioterapia</label>
              <select 
                className="block w-full rounded-md border-slate-300 border p-2"
                onChange={(e) => {
                   if(e.target.value) handleAddExposure(ExposureType.Chemotherapy, e.target.value);
                   e.target.value = "";
                }}
              >
                <option value="">Seleccionar Agente...</option>
                {DRUG_DICTIONARY.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Añadir Radioterapia</label>
              <select 
                className="block w-full rounded-md border-slate-300 border p-2"
                onChange={(e) => {
                   if(e.target.value) handleAddExposure(ExposureType.Radiation, e.target.value);
                   e.target.value = "";
                }}
              >
                <option value="">Seleccionar Campo...</option>
                {RADIATION_FIELDS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
             <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Añadir Cirugía/TPH</label>
              <select 
                className="block w-full rounded-md border-slate-300 border p-2"
                onChange={(e) => {
                   if(e.target.value) handleAddExposure(ExposureType.Surgery, e.target.value);
                   e.target.value = "";
                }}
              >
                <option value="">Seleccionar Procedimiento...</option>
                {SURGERIES.map(s => <option key={s} value={s}>{s}</option>)}
                <option value="TPH Autólogo">TPH Autólogo</option>
                <option value="TPH Alogénico">TPH Alogénico</option>
              </select>
            </div>
          </div>
        )}

        {/* PDF Upload Tab */}
        {activeTab === 'pdf' && (
          <div className="text-center py-8 border-2 border-dashed border-slate-300 rounded-lg">
            <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <div className="mt-4 flex text-sm text-slate-600 justify-center">
              <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-medical-600 hover:text-medical-500 focus-within:outline-none">
                <span>Subir un archivo</span>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".pdf,.png,.jpg" onChange={handleFileUpload} />
              </label>
              <p className="pl-1">o arrastrar y soltar</p>
            </div>
            <p className="text-xs text-slate-500">PDF, PNG, JPG hasta 10MB</p>
            {isProcessing && <p className="mt-4 text-sm text-medical-600 font-medium animate-pulse">Analizando protocolo con Gemini AI...</p>}
          </div>
        )}

        {/* Current List */}
        <div className="mt-8">
          <h4 className="text-sm font-medium text-slate-900 mb-4">Exposiciones Documentadas</h4>
          {exposures.length === 0 ? (
            <p className="text-sm text-slate-500 italic">No se han registrado exposiciones aún.</p>
          ) : (
            <ul className="divide-y divide-slate-200 border rounded-md">
              {exposures.map((exp) => (
                <li key={exp.id} className="flex items-center justify-between p-3">
                  <div>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full mr-2
                      ${exp.type === ExposureType.Chemotherapy ? 'bg-purple-100 text-purple-800' : 
                        exp.type === ExposureType.Radiation ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-800'}`}>
                      {exp.type === ExposureType.Chemotherapy ? 'Quimio' : exp.type === ExposureType.Radiation ? 'Radio' : exp.type === ExposureType.Surgery ? 'Cirugía' : exp.type}
                    </span>
                    <span className="text-sm font-medium text-slate-900">{exp.name}</span>
                    {exp.dose && <span className="text-sm text-slate-500 ml-2">({exp.dose} {exp.unit})</span>}
                  </div>
                  <button onClick={() => handleRemoveExposure(exp.id)} className="text-slate-400 hover:text-red-500">
                    <span className="sr-only">Eliminar</span>
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};