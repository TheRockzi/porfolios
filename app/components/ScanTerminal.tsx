import { motion } from 'framer-motion';
import { FiTerminal, FiMaximize2, FiMinimize2 } from 'react-icons/fi';
import { useState } from 'react';

interface ScanTerminalProps {
  logs: string[];
}

export function ScanTerminal({ logs }: ScanTerminalProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div 
      className={`chart-container mt-6 ${isExpanded ? 'col-span-2' : ''}`}
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <FiTerminal className="text-[#00e5ff]" />
          <h3 className="text-gray-400">Scan Terminal</h3>
        </div>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-500 hover:text-[#00e5ff] transition-colors"
        >
          {isExpanded ? <FiMinimize2 className="text-lg" /> : <FiMaximize2 className="text-lg" />}
        </button>
      </div>
      <div className="bg-black/60 rounded-lg p-4 h-[300px] overflow-y-auto font-mono text-sm">
        {logs.map((log, index) => (
          <div key={index} className="text-gray-300 mb-1">
            <span className="text-[#00e5ff]">$</span> {log}
          </div>
        ))}
      </div>
    </motion.div>
  );
}