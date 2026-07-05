export const getSafeKey = (date) => {
  if (!date) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const parseLocalDate = (dateStr) => {
  if (!dateStr) return new Date();
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d, 12, 0, 0, 0); // Use noon to prevent DST hours shifting days
};

export const loadConfettiScript = (callback) => {
  if (window.confetti) {
    callback();
    return;
  }
  let script = document.getElementById('canvas-confetti-script');
  if (!script) {
    script = document.createElement('script');
    script.id = 'canvas-confetti-script';
    script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js';
    document.head.appendChild(script);
  }
  
  script.addEventListener('load', callback, { once: true });
};

export const solveFluidPath = (points) => {
  if (!points || points.length < 2) return "";
  let d = `M ${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const curr = points[i]; const next = points[i + 1];
    const cp1x = curr.x + (next.x - curr.x) / 2; const cp2x = curr.x + (next.x - curr.x) / 2;
    d += ` C ${cp1x},${curr.y} ${cp2x},${next.y} ${next.x},${next.y}`;
  }
  return d;
};

export const calculateStreakStats = (trackerData, habits, filter, archivedHabits = []) => {
  if (!trackerData || Object.keys(trackerData).length === 0) {
    return { currentStreak: 0, longestStreak: 0, bestDayOfWeek: '-' };
  }

  const activeHabits = habits.filter(h => !archivedHabits.includes(h));
  const sortedDates = Object.keys(trackerData).sort((a, b) => new Date(a) - new Date(b));
  
  let longestStreak = 0;
  let dayOfWeekCounts = { 0:0, 1:0, 2:0, 3:0, 4:0, 5:0, 6:0 }; 
  
  const isDaySuccess = (dateKey) => {
    const data = trackerData[dateKey];
    if (!data) return false;
    
    if (filter === 'all') {
      let totalPct = 0;
      activeHabits.forEach((h) => {
        const r = data[h] ?? 0;
        totalPct += typeof r === 'number' ? r : (r ? 100 : 0);
      });
      const avg = activeHabits.length > 0 ? totalPct / (activeHabits.length * 100) : 0;
      return avg >= 0.5; 
    } else {
      const r = data[filter] ?? 0;
      const val = typeof r === 'number' ? r : (r ? 100 : 0);
      return val === 100; 
    }
  };

  let activeStreak = 0;
  const todayStr = getSafeKey(new Date());

  if (sortedDates.length > 0) {
    const firstDate = parseLocalDate(sortedDates[0]);
    const lastDate = new Date(); 
    
    const diffTime = Math.abs(lastDate - firstDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 5000) { 
      let curr = new Date(firstDate);
      curr.setHours(12,0,0,0);
      
      while (curr <= lastDate) {
        const dStr = getSafeKey(curr);
        if (isDaySuccess(dStr)) {
          activeStreak++;
          if (activeStreak > longestStreak) {
            longestStreak = activeStreak;
          }
          dayOfWeekCounts[curr.getDay()]++;
        } else {
          if (dStr !== todayStr) {
            activeStreak = 0;
          }
        }
        curr.setDate(curr.getDate() + 1);
      }
    }
  }

  let bestDay = '-';
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  let maxCount = -1;
  let bestDayIdx = -1;
  for (let i = 0; i < 7; i++) {
    if (dayOfWeekCounts[i] > maxCount && dayOfWeekCounts[i] > 0) {
      maxCount = dayOfWeekCounts[i];
      bestDayIdx = i;
    }
  }
  if (bestDayIdx !== -1) bestDay = dayNames[bestDayIdx];

  return { currentStreak: activeStreak, longestStreak, bestDayOfWeek: bestDay };
};
