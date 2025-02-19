import { motion } from 'framer-motion';
import type { ScanProgress as ScanProgressType } from '../lib/api';

interface ScanProgressProps {
  progress: ScanProgressType;
}

export function ScanProgress({ progress }: ScanProgressProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-6 right-6 bg-[#141414] border border-white/10 rounded-lg p-4 shadow-xl w-80"
    >
      <div className="mb-2">
        <h3 className="text-white font-medium">{progress.status}</h3>
        {progress.details && (
          <p className="text-sm text-gray-400">{progress.details}</p>
        )}
      </div>
      
      <div className="relative h-2 bg-black/40 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress.progress}%` }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 bg-[#ff0000] rounded-full"
        />
      </div>
      
      <div className="mt-1 text-right text-sm text-gray-400">
        {progress.progress}%
      </div>
    </motion.div>
  );
}