import { useState, useCallback } from 'react';
import { Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isAnalyzing?: boolean;
}

export function FileUpload({ onFileSelect, isAnalyzing }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFile(file);
    }
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  }, []);

  const handleFile = (file: File) => {
    const url = URL.createObjectURL(file);
    setPreview(url);
    onFileSelect(file);
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <AnimatePresence mode="wait">
        {preview && isAnalyzing ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative aspect-video rounded-lg overflow-hidden border border-primary/20 bg-black shadow-2xl"
          >
            <img src={preview} alt="Analyzing" className="w-full h-full object-cover opacity-50" />
            
            {/* Scanning Effect */}
            <motion.div 
              className="absolute top-0 left-0 w-full h-1 bg-primary/80 shadow-[0_0_15px_rgba(224,176,61,0.8)] z-10"
              animate={{ top: ["0%", "100%", "0%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
              <div className="bg-black/70 backdrop-blur-sm p-6 rounded-xl border border-white/10 flex flex-col items-center gap-4">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <div className="text-center">
                  <h3 className="text-lg font-serif text-white">Analyzing Artwork...</h3>
                  <p className="text-sm text-muted-foreground">Identifying style, artist & period</p>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <label
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                "relative flex flex-col items-center justify-center w-full aspect-[4/3] md:aspect-video rounded-xl border-2 border-dashed transition-all duration-300 cursor-pointer group overflow-hidden",
                isDragging 
                  ? "border-primary bg-primary/5" 
                  : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-primary/50"
              )}
            >
              <input 
                type="file" 
                className="hidden" 
                accept="image/*"
                onChange={handleFileInput}
              />
              
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(224,176,61,0.05),transparent)] opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex flex-col items-center gap-4 text-center p-6 z-10">
                <div className={cn(
                  "w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300",
                  isDragging ? "bg-primary text-black" : "bg-white/10 text-white group-hover:scale-110 group-hover:bg-primary group-hover:text-black"
                )}>
                  <Upload className="w-8 h-8" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-serif font-medium text-foreground">
                    Upload Artwork
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                    Drag and drop your image here, or click to browse museum files
                  </p>
                </div>
                
                <div className="flex gap-4 mt-2 text-xs text-muted-foreground uppercase tracking-wider">
                  <span className="flex items-center gap-1"><ImageIcon className="w-3 h-3" /> JPG</span>
                  <span className="flex items-center gap-1"><ImageIcon className="w-3 h-3" /> PNG</span>
                  <span className="flex items-center gap-1"><ImageIcon className="w-3 h-3" /> WEBP</span>
                </div>
              </div>
            </label>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
