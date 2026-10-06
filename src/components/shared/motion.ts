export { animate, inView, scroll, stagger } from "framer-motion/dom";
export const ease = [0.22, 1, 0.36, 1] as const;
export const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
