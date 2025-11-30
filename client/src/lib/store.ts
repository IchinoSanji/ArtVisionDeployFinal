import { useState, useEffect } from 'react';

export type AnalysisResult = {
  id: string;
  imageUrl: string;
  style: string;
  artist: string;
  period: string;
  ocrText: string;
  aiDescription: string;
  confidence: {
    style: number;
    artist: number;
  };
  createdAt: string;
};

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content?: string;
  imageUrl?: string;
  analysisId?: string;
  isTyping?: boolean;
  createdAt: string;
};

// Simple event bus for our store
const listeners: (() => void)[] = [];
let analyses: AnalysisResult[] = [];
let messages: Message[] = [
  {
    id: 'welcome',
    role: 'assistant',
    content: "Bem-vindo ao ArtVision. Sou seu Curador de IA. Por favor, envie uma imagem de uma obra de arte e eu analisarei seu estilo, artista e contexto histórico para você.",
    createdAt: new Date().toISOString()
  }
];

export const useStore = () => {
  const [items, setItems] = useState<AnalysisResult[]>(analyses);
  const [chatMessages, setChatMessages] = useState<Message[]>(messages);

  useEffect(() => {
    const handler = () => {
      setItems([...analyses]);
      setChatMessages([...messages]);
    };
    listeners.push(handler);
    return () => {
      const idx = listeners.indexOf(handler);
      if (idx > -1) listeners.splice(idx, 1);
    };
  }, []);

  return {
    analyses: items,
    messages: chatMessages,
    addAnalysis: (item: AnalysisResult) => {
      analyses = [item, ...analyses];
      listeners.forEach(l => l());
    },
    addMessage: (msg: Message) => {
      messages = [...messages, msg];
      listeners.forEach(l => l());
    },
    getAnalysis: (id: string) => analyses.find(a => a.id === id)
  };
};

// Convert image to base64
async function imageUrlToBase64(imageUrl: string): Promise<string> {
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export const simulateAnalysis = async (imageUrl: string): Promise<AnalysisResult> => {
  try {
    const imageBase64 = await imageUrlToBase64(imageUrl);
    
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64 })
    });

    if (!response.ok) {
      throw new Error('Falha ao analisar imagem');
    }

    const result = await response.json();
    
    return {
      id: Math.random().toString(36).substring(7),
      imageUrl,
      style: result.style || 'Desconhecido',
      artist: result.artist || 'Artista Desconhecido',
      period: result.period || 'Período Desconhecido',
      ocrText: result.ocrText || 'Nenhum texto detectado',
      aiDescription: result.aiDescription || 'Análise não disponível',
      confidence: result.confidence || { style: 0, artist: 0 },
      createdAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Erro na análise:', error);
    throw error;
  }
};

export const simulateChatResponse = async (text: string, history: Message[] = []): Promise<string> => {
  try {
    // Build conversation history for context
    const conversationHistory = history
      .filter(msg => !msg.imageUrl && !msg.analysisId)
      .slice(-10)
      .map(msg => ({
        role: msg.role,
        content: msg.content || ''
      }));

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        message: text,
        conversationHistory 
      })
    });

    if (!response.ok) {
      throw new Error('Falha ao obter resposta');
    }

    const data = await response.json();
    return data.response || 'Desculpe, não consegui processar sua mensagem.';
  } catch (error) {
    console.error('Erro no chat:', error);
    return 'Desculpe, houve um erro ao processar sua mensagem. Por favor, tente novamente.';
  }
};
