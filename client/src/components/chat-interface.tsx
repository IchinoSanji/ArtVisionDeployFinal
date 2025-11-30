import { useState, useRef, useEffect } from 'react';
import { useStore, simulateAnalysis, simulateChatResponse, type Message } from '@/lib/store';
import { Send, Paperclip, Image as ImageIcon, Bot, User, Loader2, X, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Link } from 'wouter';
import { TierUpNotification } from '@/components/tier-up-notification';
import { useAuth } from '@/hooks/useAuth';

export function ChatInterface() {
  const { messages, addMessage, addAnalysis, getAnalysis } = useStore();
  const { user } = useAuth();
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [tierUpData, setTierUpData] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      createdAt: new Date().toISOString()
    };
    addMessage(userMsg);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: inputValue,
          conversationHistory: messages.map(m => ({ role: m.role, content: m.content }))
        })
      });
      
      const data = await response.json();
      if (data.tierUp) {
        setTierUpData(data.tierUp);
      }
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        createdAt: new Date().toISOString()
      };
      addMessage(aiMsg);
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    
    // 1. Add User Message with Image
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      imageUrl: imageUrl,
      content: "Can you analyze this artwork?",
      createdAt: new Date().toISOString()
    };
    addMessage(userMsg);
    setIsTyping(true);

    // Increment chat count for image upload
    if (user) {
      try {
        await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: '[Image Analysis]',
            conversationHistory: []
          })
        });
      } catch (error) {
        console.error('Error incrementing chat count:', error);
      }
    }

    try {
      // 2. Run Analysis
      const result = await simulateAnalysis(imageUrl);
      addAnalysis(result);

      // 3. Add Assistant Message with Analysis Card
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        analysisId: result.id,
        content: `Analisei a imagem. Parece ser uma obra do movimento ${result.style}, provavelmente de ${result.artist}.`,
        createdAt: new Date().toISOString()
      };
      addMessage(aiMsg);
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
    
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto bg-black/40 border-x border-white/5 backdrop-blur-sm shadow-2xl relative">
      {tierUpData && (
        <TierUpNotification
          show={!!tierUpData}
          oldTier={tierUpData.oldTier}
          newTier={tierUpData.newTier}
          color={tierUpData.color}
          onComplete={() => setTierUpData(null)}
        />
      )}
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex gap-4 max-w-[90%]",
              msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
            )}
          >
            {/* Avatar */}
            <div className={cn(
              "w-8 h-8 rounded-sm flex items-center justify-center shrink-0 mt-1",
              msg.role === 'assistant' ? "bg-primary text-black" : "bg-white/10 text-white"
            )}>
              {msg.role === 'assistant' ? <Bot size={18} /> : <User size={18} />}
            </div>

            {/* Content */}
            <div className={cn(
              "space-y-2",
              msg.role === 'user' ? "items-end flex flex-col" : "items-start"
            )}>
              
              {/* Image Attachment */}
              {msg.imageUrl && (
                <div className="rounded-lg overflow-hidden border border-white/10 max-w-xs md:max-w-sm shadow-lg">
                  <img src={msg.imageUrl} alt="Uploaded art" className="w-full h-auto" />
                </div>
              )}

              {/* Text Bubble */}
              {msg.content && (
                <div className={cn(
                  "px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm",
                  msg.role === 'user' 
                    ? "bg-white/10 text-white rounded-tr-none" 
                    : "bg-zinc-900 border border-white/5 text-gray-100 rounded-tl-none"
                )}>
                  {msg.content}
                </div>
              )}

              {/* Analysis Card */}
              {msg.analysisId && (
                <AnalysisCard id={msg.analysisId} getAnalysis={getAnalysis} />
              )}
              
              <span className="text-[10px] text-muted-foreground opacity-50 px-1">
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-4 mr-auto max-w-[80%]">
             <div className="w-8 h-8 rounded-sm bg-primary text-black flex items-center justify-center shrink-0">
              <Bot size={18} />
            </div>
            <div className="bg-zinc-900 border border-white/5 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-2">
              <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-white/10 bg-black/60 backdrop-blur-md">
        <div className="flex items-end gap-2 relative">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileSelect}
          />
          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            ref={cameraInputRef}
            onChange={handleFileSelect}
          />
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 text-muted-foreground hover:text-primary hover:bg-white/5"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 text-muted-foreground hover:text-primary hover:bg-white/5"
            onClick={() => cameraInputRef.current?.click()}
          >
            <Camera className="w-5 h-5" />
          </Button>
          
          <div className="flex-1 bg-white/5 rounded-xl border border-white/10 focus-within:border-primary/50 focus-within:bg-white/10 transition-all">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
              placeholder="Descreva a obra de arte ou envie uma imagem..."
              className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 py-3 px-4 min-h-[50px]"
            />
          </div>

          <Button
            size="icon"
            onClick={handleSendMessage}
            disabled={!inputValue.trim() && !isTyping}
            className={cn(
              "shrink-0 rounded-xl w-12 h-12 transition-all",
              inputValue.trim() ? "bg-primary text-black hover:bg-primary/90" : "bg-white/10 text-muted-foreground hover:bg-white/20"
            )}
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function AnalysisCard({ id, getAnalysis }: { id: string, getAnalysis: (id: string) => any }) {
  const result = getAnalysis(id);
  if (!result) return null;

  return (
    <div className="w-full max-w-sm mt-2 rounded-xl overflow-hidden bg-zinc-900 border border-white/10 hover:border-primary/30 transition-colors group shadow-lg">
      <div className="relative h-32 overflow-hidden">
        <img src={result.imageUrl} alt="Analysis thumb" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex justify-between items-end">
            <h4 className="font-serif text-lg text-white leading-none">{result.artist}</h4>
            <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded border border-primary/20">
              {Math.round(result.confidence.artist * 100)}% Match
            </span>
          </div>
        </div>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Style: <span className="text-gray-300">{result.style}</span></span>
          <span>Period: <span className="text-gray-300">{result.period}</span></span>
        </div>
        <p className="text-sm text-gray-400 line-clamp-2 italic border-l-2 border-primary/20 pl-3">
          "{result.aiDescription}"
        </p>
        <Link href={`/result/${id}`}>
           <a className="block w-full text-center py-2 rounded bg-white/5 hover:bg-primary hover:text-black text-xs font-medium uppercase tracking-wider transition-all">
             View Full Report
           </a>
        </Link>
      </div>
    </div>
  );
}
