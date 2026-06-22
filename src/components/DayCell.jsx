import React from 'react';
import { motion } from 'framer-motion';
import { parseLocalDate } from '../utils';

export const DayCell = React.memo(({ dateKey, day, habit, val, config, theme, onPointerDown, onPointerUp, getButtonStyles }) => {
  const isPast = parseLocalDate(dateKey).setHours(0,0,0,0) > new Date().setHours(0,0,0,0);
  
  return (
    <motion.button 
      whileTap={{ scale: 0.9 }} 
      className={`w-11 h-11 rounded-2xl mx-auto border-2 flex items-center justify-center font-black transition-all text-xl ${getButtonStyles(val, dateKey, theme)} ${isPast ? 'opacity-20 grayscale cursor-not-allowed' : ''} touch-none select-none`}
      onPointerDown={(e) => onPointerDown(e, dateKey, habit, val)} 
      onPointerUp={(e) => onPointerUp(e, dateKey, habit, val)}
    >
      <span className={`text-[7px] font-black leading-none mb-0.5 pointer-events-none ${val > 0 ? 'text-white/60' : (theme === 'dark' ? 'text-slate-600' : 'text-slate-300')} hidden`}>
        {day.getDate()}
      </span>
      <span className="pointer-events-none font-bold">
        {(() => {
          const stepVal = config?.steps > 1 ? Math.round((val / 100) * config.steps) : null;
          return stepVal !== null ? stepVal : (val >= 100 ? '✔' : (val > 0 ? `${Math.round(val)}%` : '✘'));
        })()}
      </span>
    </motion.button>
  );
}, (prevProps, nextProps) => {
  return prevProps.val === nextProps.val &&
         prevProps.theme === nextProps.theme &&
         prevProps.config?.steps === nextProps.config?.steps;
});
