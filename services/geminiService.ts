import { GoogleGenAI } from "@google/genai";
import { Exposure, ExposureType } from '../types';

// NOTE: In a production environment, these calls should go through a secured backend.
// Client-side API keys are risky. This is for architecture demonstration.

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || 'DEMO_KEY_DO_NOT_USE_IN_PROD' });

export const parseProtocolPDF = async (base64Data: string): Promise<Exposure[]> => {
  try {
    const model = 'gemini-2.5-flash'; 
    
    const prompt = `
      Eres un asistente clínico extrayendo datos de un resumen de tratamiento oncológico pediátrico.
      Analiza la imagen del documento proporcionada.
      Extrae una lista de exposiciones terapéuticas (Agentes de quimioterapia, campos de radioterapia, cirugías, TPH).
      
      Devuelve SOLO un array JSON válido con objetos siguiendo esta estructura:
      {
        "type": "Chemotherapy" | "Radiation" | "Surgery" | "HSCT",
        "name": "string (nombre genérico del fármaco o campo anatómico en español)",
        "dose": number (opcional, dosis acumulada),
        "unit": "string (ej. mg/m2, Gy)" (opcional),
        "date": "string" (opcional)
      }
      
      No incluyas ninguna explicación. Devuelve solo el JSON.
    `;

    // Simulating a call - in real implementation, we would send the image part
    // const response = await ai.models.generateContent({
    //   model,
    //   contents: [
    //     { inlineData: { mimeType: 'application/pdf', data: base64Data } }, // Note: Gemini accepts images/PDFs
    //     { text: prompt }
    //   ]
    // });
    
    // Mock response for the demo if API key is missing or fails
    console.log("Simulando análisis de PDF con Gemini...");
    return [
      { id: '1', type: ExposureType.Chemotherapy, name: 'Doxorrubicina', dose: 300, unit: 'mg/m2' },
      { id: '2', type: ExposureType.Chemotherapy, name: 'Vincristina' },
      { id: '3', type: ExposureType.Radiation, name: 'Campo Manto', dose: 24, unit: 'Gy' },
      { id: '4', type: ExposureType.Surgery, name: 'Esplenectomía' }
    ];

  } catch (error) {
    console.error("Error analizando PDF con Gemini:", error);
    throw new Error("Fallo al procesar el documento.");
  }
};

export const simplifyTextForPatient = async (clinicalText: string): Promise<string> => {
  try {
     const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Reescribe la siguiente recomendación clínica para un nivel de lectura de 14 años. Sé tranquilizador pero claro. No cambies los hechos médicos. Responde en Español. Texto: "${clinicalText}"`
    });
    return response.text || clinicalText;
  } catch (error) {
    return clinicalText; // Fallback to original text
  }
};