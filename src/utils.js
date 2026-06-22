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
  
  const oldOnload = script.onload;
  script.onload = (e) => {
    if (oldOnload) oldOnload(e);
    callback();
  };
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
