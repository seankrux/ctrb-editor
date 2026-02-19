'use client';

import { useMemo } from 'react';
import { useThemeStore } from '@/store';
import { motion, AnimatePresence } from 'framer-motion';

// Generate stable star positions
function generateStars(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    duration: 2 + Math.random() * 3,
    delay: Math.random() * 2,
  }));
}

export default function NebulaBackground() {
  const isDark = useThemeStore((state) => state.isDark);

  // Memoize star positions to prevent re-calculation on re-renders
  const stars = useMemo(() => generateStars(50), []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className={`absolute inset-0 ${
          isDark
            ? 'bg-gradient-to-br from-space-950 via-primary-950/30 to-space-950'
            : 'bg-gradient-to-br from-primary-50 via-white to-primary-100'
        }`}
      />

      {/* Cosmic grid */}
      {isDark && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="absolute inset-0 bg-cosmic-grid"
          style={{ backgroundSize: '50px 50px' }}
        />
      )}

      {/* Animated stars */}
      {isDark && (
        <div className="absolute inset-0">
          {stars.map((star) => (
            <motion.div
              key={star.id}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${star.left}%`,
                top: `${star.top}%`,
              }}
              animate={{
                opacity: [0.2, 1, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: star.duration,
                repeat: Infinity,
                delay: star.delay,
              }}
            />
          ))}
        </div>
      )}

      {/* Nebula clouds */}
      <AnimatePresence>
        {isDark && (
          <>
            <motion.div
              className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl"
              style={{ filter: 'blur(100px)' }}
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 0.3,
                x: [0, 50, 0],
                y: [0, 30, 0],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.div
              className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-purple/20 rounded-full blur-3xl"
              style={{ filter: 'blur(100px)' }}
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 0.2,
                x: [0, -40, 0],
                y: [0, -50, 0],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.div
              className="absolute top-1/2 right-1/3 w-64 h-64 bg-accent-cyan/20 rounded-full blur-3xl"
              style={{ filter: 'blur(100px)' }}
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 0.15,
                x: [0, 30, 0],
                y: [0, 40, 0],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 18,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </>
        )}
      </AnimatePresence>

      {/* Light mode subtle patterns */}
      {!isDark && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)
            `,
          }}
        />
      )}
    </div>
  );
}
