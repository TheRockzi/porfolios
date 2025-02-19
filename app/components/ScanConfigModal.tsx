import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import type { ScanConfig } from '../lib/scanTypes';

interface ScanConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  scanConfig: ScanConfig;
  onStartScan: (config: Record<string, any>) => void;
}

export function ScanConfigModal({ isOpen, onClose, scanConfig, onStartScan }: ScanConfigModalProps) {
  const [config, setConfig] = useState<Record<string, any>>(() => {
    // Initialize with default values
    return scanConfig.configFields.reduce((acc, field) => {
      acc[field.id] = field.defaultValue ?? '';
      return acc;
    }, {} as Record<string, any>);
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartScan(config);
    onClose();
  };

  const handleInputChange = (fieldId: string, value: string | number) => {
    setConfig(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-[#141414] rounded-lg border border-white/10 w-full max-w-md p-6 shadow-xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">{scanConfig.label} Configuration</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {scanConfig.configFields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    {field.label}
                    {field.required && <span className="text-[#ff0000] ml-1">*</span>}
                    }
                  </label>

                  {field.type === 'select' && (
                    <select
                      value={config[field.id]}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white
                               focus:outline-none focus:border-[#ff0000]/40 transition-colors"
                    >
                      {field.options?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}

                  {field.type === 'text' && (
                    <input
                      type="text"
                      value={config[field.id]}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      placeholder={field.placeholder}
                      required={field.required}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white
                               placeholder:text-gray-500 focus:outline-none focus:border-[#ff0000]/40 transition-colors"
                    />
                  )}

                  {field.type === 'number' && (
                    <input
                      type="number"
                      value={config[field.id]}
                      onChange={(e) => handleInputChange(field.id, parseInt(e.target.value))}
                      min={field.min}
                      max={field.max}
                      required={field.required}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white
                               focus:outline-none focus:border-[#ff0000]/40 transition-colors"
                    />
                  )}

                  {field.type === 'range' && (
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        value={config[field.id]}
                        onChange={(e) => handleInputChange(field.id, parseInt(e.target.value))}
                        min={field.min}
                        max={field.max}
                        className="flex-1"
                      />
                      <span className="text-white min-w-[2.5rem] text-center">
                        {config[field.id]}
                      </span>
                    </div>
                  )}
                </div>
              ))}

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#ff0000] text-white px-6 py-2 rounded-lg hover:bg-[#ff0000]/90
                           transition-all duration-300 font-medium shadow-lg shadow-[#ff0000]/20
                           border border-[#ff0000]/50 hover:border-[#ff0000]"
                >
                  Start Scan
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}