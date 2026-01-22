
import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, FinancialHealthReport } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const extractTransactionsFromFiles = async (files: File[]): Promise<Transaction[]> => {
  const parts: any[] = [];
  
  for (const file of files) {
    const base64 = await fileToBase64(file);
    parts.push({
      inlineData: {
        mimeType: file.type || 'application/pdf',
        data: base64
      }
    });
  }

  const prompt = `Analise estes extratos bancários e extraia TODAS as transações em um formato JSON estruturado.
  Para cada transação, forneça:
  - date: data no formato YYYY-MM-DD
  - description: descrição limpa da transação
  - amount: valor numérico positivo
  - type: 'INCOME' para entradas ou 'EXPENSE' para saídas
  - category: Categoria lógica (Alimentação, Moradia, Transporte, Lazer, Saúde, Salário, Investimentos, Educação, Outros)
  - tags: Array de strings com tags relevantes (ex: fixo, variável, essencial, supérfluo)
  - status: 'PAID' ou 'PENDING' (assuma PAID se for extrato passado)

  Retorne APENAS o array JSON.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts: [...parts, { text: prompt }] },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            date: { type: Type.STRING },
            description: { type: Type.STRING },
            amount: { type: Type.NUMBER },
            type: { type: Type.STRING, enum: ['INCOME', 'EXPENSE'] },
            category: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            status: { type: Type.STRING, enum: ['PAID', 'PENDING'] }
          },
          required: ['date', 'description', 'amount', 'type', 'category']
        }
      }
    }
  });

  try {
    const data = JSON.parse(response.text || '[]');
    return data.map((t: any, index: number) => ({
      ...t,
      id: `t-${Date.now()}-${index}`
    }));
  } catch (error) {
    console.error("Erro ao processar JSON da IA:", error);
    return [];
  }
};

export const getFinancialHealthReport = async (transactions: Transaction[]): Promise<FinancialHealthReport> => {
  const prompt = `Com base nestas transações: ${JSON.stringify(transactions.slice(0, 50))}, 
  gere um relatório de saúde financeira abrangente.
  Retorne um JSON com:
  - score: Número de 0 a 100
  - summary: Texto curto resumindo a situação
  - strengths: Lista de 3 pontos fortes
  - weaknesses: Lista de 3 pontos de atenção
  - recommendations: Lista de 3 ações práticas`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          summary: { type: Type.STRING },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
          recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['score', 'summary', 'strengths', 'weaknesses', 'recommendations']
      }
    }
  });

  return JSON.parse(response.text || '{}');
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
};
