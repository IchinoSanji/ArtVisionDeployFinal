import { useEffect, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { Layout } from "@/components/layout";
import { useStore, AnalysisResult } from "@/lib/store";
import { motion } from "framer-motion";
import { Share2, Download, ExternalLink, ChevronLeft, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";

export default function Result() {
  const [, params] = useRoute("/result/:id");
  const [, setLocation] = useLocation();
  const { getAnalysis } = useStore();
  const [analysis, setAnalysis] = useState<AnalysisResult | undefined>();

  useEffect(() => {
    if (params?.id) {
      const result = getAnalysis(params.id);
      if (result) {
        setAnalysis(result);
      } else {
        setLocation("/"); // Redirect if not found
      }
    }
  }, [params?.id, getAnalysis, setLocation]);

  if (!analysis) return null;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
          <ChevronLeft className="w-4 h-4" />
          Voltar para Upload
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          {/* Left Column: Image */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative rounded-sm overflow-hidden shadow-2xl ring-1 ring-white/10 bg-black"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4 z-10">
                <Button variant="secondary" size="icon" className="rounded-full w-8 h-8 bg-white/20 backdrop-blur hover:bg-white">
                  <Download className="w-4 h-4 text-black" />
                </Button>
                <Button variant="secondary" size="icon" className="rounded-full w-8 h-8 bg-white/20 backdrop-blur hover:bg-white">
                  <Share2 className="w-4 h-4 text-black" />
                </Button>
              </div>
              <img 
                src={analysis.imageUrl} 
                alt="Analyzed Artwork" 
                className="w-full h-auto object-cover"
              />
            </motion.div>

              <div className="mt-6 p-4 rounded-lg bg-white/5 border border-white/10">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
                Detecção OCR
              </h4>
              <p className="font-mono text-sm text-primary/80 break-words">
                {analysis.ocrText || "Nenhum texto legível detectado na imagem."}
              </p>
            </div>
          </div>

          {/* Right Column: Data */}
          <div className="lg:col-span-7 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
                  {analysis.style}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/10 text-muted-foreground text-xs font-medium">
                  {analysis.period}
                </span>
              </div>

                <h1 className="text-4xl md:text-5xl font-serif font-medium mb-2 text-balance">
                {analysis.artist}
              </h1>
              <p className="text-muted-foreground text-lg">
                Atribuição provável ({Math.round(analysis.confidence.artist * 100)}% de correspondência)
              </p>
            </motion.div>

            <Separator className="bg-white/10" />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-6"
            >
              <div className="bg-black/20 p-6 rounded-xl border border-white/5 relative">
                <Quote className="absolute top-6 left-6 w-8 h-8 text-primary/20" />
                <p className="font-serif text-lg leading-relaxed pl-10 text-white/90">
                  {analysis.aiDescription}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="space-y-4">
                <h3 className="font-serif text-xl">Métricas de Confiança</h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Artista Correspondência</span>
                    <span className="text-primary">{Math.round(analysis.confidence.artist * 100)}%</span>
                  </div>
                  <Progress value={analysis.confidence.artist * 100} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Estilo Correspondência</span>
                    <span className="text-primary">{Math.round(analysis.confidence.style * 100)}%</span>
                  </div>
                  <Progress value={analysis.confidence.style * 100} className="h-2" />
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                <h3 className="font-serif text-lg mb-4">Contexto Histórico</h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                    Típico da era {analysis.period}
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                    Padrões visuais alinham com o movimento {analysis.style}
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                    Composição sugere obra do período maduro
                  </li>
                </ul>
                <Button 
                  className="w-full mt-6" 
                  variant="outline"
                  onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(`${analysis.artist} ${analysis.style} obras`)}&tbm=isch`, '_blank')}
                >
                  Ver Obras Semelhantes <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
