"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', updatePosition);
    return () => window.removeEventListener('mousemove', updatePosition);
  }, []);

  return (
    <motion.div
      className="custom-cursor"
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", damping: 30, stiffness: 200 }}
    >
      <div className="w-full h-full rounded-full border-2 border-white/50" />
    </motion.div>
  );
}