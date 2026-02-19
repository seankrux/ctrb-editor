'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Sun, Moon, Sparkles } from 'lucide-react';
import { useThemeStore } from '@/store';
import { cn } from '@/lib/utils';

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useThemeStore();

  return (
    <motion.button
      onClick={toggleTheme}
      className={cn(
        'relative flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all duration-300',
        'hover:scale-105 active:scale-95',
        isDark
          ? 'bg-primary-500/20 text-primary-200 hover:bg-primary-500/30 border border-primary-500/30'
          : 'bg-amber-500/20 text-amber-700 hover:bg-amber-500/30 border border-amber-500/30'
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Animated icon container */}
      <div className="relative w-5 h-5">
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.div
              key="moon"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Moon className="w-5 h-5" />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Sun className="w-5 h-5" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Label with animation */}
      <motion.span
        initial={false}
        animate={{ opacity: 1 }}
        className="hidden sm:inline"
      >
        {isDark ? 'Dark' : 'Light'}
      </motion.span>

      {/* Sparkle effect on hover */}
      <motion.div
        className="absolute -top-1 -right-1"
        initial={{ scale: 0 }}
        whileHover={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 500 }}
      >
        <Sparkles className="w-3 h-3 text-accent-cyan" />
      </motion.div>
    </motion.button>
  );
}
