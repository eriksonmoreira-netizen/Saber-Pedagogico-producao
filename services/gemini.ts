import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { Student, Grade, Attendance, AIInsight } from "../types";

/**
 * Saber Pedagógico - Intelligence Service
 * Centraliza as chamadas ao Gemini para análise preditiva e extração de dados.
 * Utiliza a SDK @google/generative-ai compatível.
 */

const getAIClient = () => {
  const apiKey = process.env.API_KEY || "";
  return new GoogleGenerativeAI(apiKey);
};

export async function analyzeStudentRisk(
  student: Student,
  grades: Grade[],
  attendances: Attendance[]
): Promise<AIInsight> {
  const genAI = getAIClient();
  
  // Usando Gemini 1.5 Pro ou Flash conforme disponibilidade
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          risk_level: { type: SchemaType.STRING, enum: ["LOW", "MEDIUM", "HIGH"] },
          reasons: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
          suggestions: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } }
        },
        required: ["risk_level", "reasons", "suggestions"]
      }
    }
  });

  const context = `
    Aluno: ${student.name}
    Notas: ${JSON.stringify(grades.map(g => ({ nota: g.score, bimestre: g.bimester })))}
    Frequência Recente: ${JSON.stringify(attendances.slice(-10).map(a => a.status))}
  `;

  const prompt = `Você é um coordenador pedagógico experiente. Analise o risco de evasão ou retenção deste aluno.
  Contexto: ${context}`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    return JSON.parse(responseText.trim());
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return {
      risk_level: 'LOW',
      reasons: ["Sistema de análise em manutenção temporária ou erro na chave de API."],
      suggestions: ["Mantenha o acompanhamento regular das notas e frequência."]
    };
  }
}

export async function extractStudentsFromText(text: string): Promise<Partial<Student>[]> {
  const genAI = getAIClient();
  
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.OBJECT,
          properties: {
            name: { type: SchemaType.STRING },
            registration_number: { type: SchemaType.STRING },
            guardian_name: { type: SchemaType.STRING }
          }
        }
      }
    }
  });

  const prompt = `Extraia os alunos deste texto para um array JSON. Texto: ${text}`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    return JSON.parse(responseText.trim());
  } catch (error) {
    console.error("AI Extraction Error:", error);
    return [];
  }
}