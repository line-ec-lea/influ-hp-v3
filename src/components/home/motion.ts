import { animate, inView, type DOMKeyframesDefinition, type AnimationOptions } from "framer-motion/dom";

export { animate, inView, scroll, stagger } from "framer-motion/dom";
export const ease = [0.22, 1, 0.36, 1] as const;
export const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

export function reveal(
  target: Element | string,
  keyframes: DOMKeyframesDefinition,
  options: AnimationOptions = {},
  margin: NonNullable<Parameters<typeof inView>[2]>["margin"] = "0px 0px 15% 0px",
) {
  if (reducedMotion.matches) return;
  inView(target, (element) => {
    animate(element, keyframes, { ease, ...options });
  }, { margin });
}
