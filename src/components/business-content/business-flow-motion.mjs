// Seconds of visible animation time; hidden diagrams pause their clock.
export function flowFrame(elapsed) {
  const phase = elapsed % 8;
  const leg = phase >= 0.9 && phase < 2.75 ? "input"
    : phase >= 3.25 && phase < 5.2 ? "output" : null;
  return {
    leg,
    progress: leg === "input" ? (phase - 0.9) / 1.85
      : leg === "output" ? (phase - 3.25) / 1.95 : 0,
    pulse: phase >= 2.75 && phase < 3.45 ? Math.sin((phase - 2.75) / 0.7 * Math.PI) : 0,
    entrance: 1 - (1 - Math.min(elapsed / 0.7, 1)) ** 3,
  };
}
