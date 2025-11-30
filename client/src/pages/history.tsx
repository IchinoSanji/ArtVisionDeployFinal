import { Layout } from "@/components/layout";
import { useStore } from "@/lib/store";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Clock, ArrowRight, MessageCircle } from "lucide-react";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export default function History() {
  const { analyses } = useStore();
  const { data: conversations = [], refetch } = useQuery({
    queryKey: ["/api/conversations"],
    retry: false,
    refetchInterval: 1000,
  });

  // Refetch when page is visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refetch();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [refetch]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-serif mb-4">Histórico</h1>
          <p className="text-muted-foreground">
            Suas análises e conversas com o ArtVision.
          </p>
        </motion.div>

        {analyses.length === 0 && conversations.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-xl bg-white/5">
            <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-serif mb-2">Sem Histórico</h3>
            <p className="text-muted-foreground mb-6">Comece analisando uma obra de arte ou conversando sobre arte.</p>
            <Link href="/" className="inline-flex items-center justify-center h-10 px-6 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium">
              Analyze Artwork
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {analyses.length > 0 && (
              <div>
                <h2 className="text-2xl font-serif mb-4 flex items-center gap-2">
                  <span>Análises</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {analyses.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1"
              >
                <Link href={`/result/${item.id}`} className="block">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img 
                      src={item.imageUrl} 
                      alt={item.artist} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  </div>
                  
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-serif text-xl group-hover:text-primary transition-colors line-clamp-1">
                        {item.artist}
                      </h3>
                      <span className="text-xs font-mono text-muted-foreground border border-white/10 px-2 py-0.5 rounded">
                        {Math.round(item.confidence.artist * 100)}%
                      </span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-4">
                      {item.style} • {item.period}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground/60">
                      <span>{format(new Date(item.createdAt), "MMM d, yyyy")}</span>
                      <span className="flex items-center gap-1 group-hover:text-primary transition-colors">
                        View details <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
                    ))}
                </div>
              </div>
            )}
            
            {conversations.length > 0 && (
              <div>
                <h2 className="text-2xl font-serif mb-4 flex items-center gap-2">
                  <MessageCircle className="w-6 h-6" />
                  <span>Conversas</span>
                </h2>
                <div className="space-y-3">
                  {conversations.map((conv: any, index: number) => {
                    const messages = conv.messages || [];
                    const firstMessage = messages[0]?.content || "Conversa sem mensagens";
                    return (
                      <motion.div
                        key={conv.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-primary/50 transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm line-clamp-2 text-foreground mb-1">
                              {firstMessage}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {messages.length} mensagens • {format(new Date(conv.createdAt), "MMM d, yyyy HH:mm")}
                            </p>
                          </div>
                          <MessageCircle className="w-5 h-5 text-primary/60 ml-2 flex-shrink-0" />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
