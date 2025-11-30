import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface TierUpNotificationProps {
  show: boolean;
  oldTier: string;
  newTier: string;
  color: string;
  onComplete?: () => void;
}

export function TierUpNotification({ show, oldTier, newTier, color, onComplete }: TierUpNotificationProps) {
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    setIsVisible(show);
    if (show) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, y: -50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.5, y: 50 }}
      className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none"
    >
      <div className="bg-black/90 border-2 rounded-2xl px-8 py-6 text-center backdrop-blur-xl shadow-2xl max-w-sm" style={{ borderColor: color }}>
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.6, repeat: 2 }}
          className="text-5xl mb-4"
        >
          ⭐
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold mb-2"
        >
          Parabéns!
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-muted-foreground mb-4"
        >
          Você subiu de <span className="font-semibold">{oldTier}</span> para{" "}
          <span className="font-semibold" style={{ color }}>
            {newTier}
          </span>
        </motion.p>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.6, duration: 3 }}
          className="h-1 rounded-full"
          style={{ backgroundColor: color, transformOrigin: "left" }}
        />
      </div>
    </motion.div>
  );
}
