export const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
export const segment = (progress, start, end) => clamp((progress - start) / (end - start));
export const smooth = (progress) => progress * progress * (3 - 2 * progress);
export const dampMessageProgress = (current, target, elapsed) => current + (target - current) * (1 - Math.exp(-elapsed / 80));

// Hold each paragraph, then let it leave left as the next arrives from the right.
export function messageFrame(progress, count = 5) {
  const time = clamp(progress) * (count - 1 + 0.35);
  const index = Math.min(count - 1, Math.floor(time));
  const local = time - index;
  return {
    index,
    next: Math.min(count - 1, index + 1),
    exit: index === count - 1 ? 0 : smooth(segment(local, 0.55, 0.75)),
    entrance: index === count - 1 ? 1 : smooth(segment(local, 0.7, 1)),
  };
}

// Match the reference's travel / reading pauses, including the final hand-off.
export function careerFrame(progress, count = 6) {
  const time = clamp(progress) * (0.4 + count * 1.55 + 1);
  if (time < 0.4) return { from: 0, to: 0, travel: 0, active: 0, exit: 0 };
  for (let i = 0; i < count; i++) {
    const local = time - 0.4 - i * 1.55;
    if (local < 1.55) return {
      from: i, to: i + 1, travel: smooth(clamp(local)),
      active: local >= 0.5 ? i + 1 : i, exit: 0,
    };
  }
  return { from: count, to: count, travel: 1, active: count, exit: smooth(clamp(time - 0.4 - count * 1.55)) };
}
