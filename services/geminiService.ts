import { GoogleGenAI } from "@google/genai";
import { Product } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const analyzeStockWithAI = async (inventory: Product[], userQuery: string): Promise<string> => {
  if (!apiKey) {
    return "Erro: Chave de API não configurada. Por favor configure a API_KEY.";
  }

  // Summarize inventory for context
  const inventorySummary = inventory.map(p => {
    const totalQty = p.batches.reduce((acc, b) => acc + b.quantity, 0);
    const expiringBatches = p.batches.filter(b => {
      const daysUntilExpiry = Math.ceil((new Date(b.expiryDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
      return daysUntilExpiry <= 90;
    }).map(b => `${b.batchNumber} (vence em ${b.expiryDate})`);

    return `- ${p.name} (SKU: ${p.sku}): Total ${totalQty} ${p.unit}. Nível Mínimo: ${p.minStockLevel}. ${expiringBatches.length > 0 ? `LOTES CRÍTICOS: ${expiringBatches.join(', ')}` : ''}`;
  }).join('\n');

  const prompt = `
    Você é um assistente especialista em gestão de estoque para clínicas de estética.
    Analise os dados do estoque abaixo e responda à pergunta do usuário de forma concisa e útil.
    Seja proativo sobre itens vencendo ou com estoque baixo.
    
    Dados do Estoque Atual:
    ${inventorySummary}
    
    Pergunta do Usuário: "${userQuery}"
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Não consegui analisar os dados no momento.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Desculpe, ocorreu um erro ao conectar com a IA.";
  }
};

export const generateProductDescription = async (productName: string, category: string): Promise<string> => {
  if (!apiKey) return "API Key missing.";
  
  try {
     const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Escreva uma descrição comercial curta e profissional para um produto de clínica de estética. 
      Produto: ${productName}
      Categoria: ${category}
      Foco: Benefícios clínicos e segurança. Máximo 2 frases.`,
    });
    return response.text || "";
  } catch (e) {
    return "";
  }
}