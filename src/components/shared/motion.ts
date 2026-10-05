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

export function revealStaggered(section: Element, selector: string) {
  if (!reducedMotion.matches) {
    const targets = [...section.querySelectorAll<HTMLElement>(selector)];
    const pending = new Set<Element>(targets);
    const entrances = new Map<Element, ReturnType<typeof animate>>();
    const distance = window.matchMedia("(min-width: 768px)").matches ? 20 : 12;
    // Only elements entering together share a stagger; a later scroll starts immediately.
    const observer = new IntersectionObserver(entries => {
      entries.filter(entry => entry.isIntersecting && pending.has(entry.target)).forEach(({ target }, index) => {
        pending.delete(target);
        observer.unobserve(target);
        entrances.set(target, animate(target, { opacity: [0, 1], y: [distance, 0] }, {
          duration: 0.6, delay: Math.min(index * 0.07, 0.21), ease,
        }));
      });
    }, { rootMargin: "0px 0px -48px 0px" });
    targets.forEach(target => {
      target.style.opacity = "0";
      observer.observe(target);
    });
    // Focus reveals just that control, without skipping the rest of the scroll sequence.
    const onFocus = (event: Event) => {
      const target = targets.find(target => target.contains(event.target as Node));
      if (!target) return;
      pending.delete(target);
      observer.unobserve(target);
      entrances.get(target)?.complete();
      animate(target, { opacity: 1, y: 0 }, { duration: 0 });
    };
    const finishEntrances = () => {
      observer.disconnect();
      pending.clear();
      entrances.forEach(animation => animation.complete());
      animate(targets, { opacity: 1, y: 0 }, { duration: 0 });
    };
    section.addEventListener("focusin", onFocus);
    reducedMotion.addEventListener("change", finishEntrances, { once: true });
    window.addEventListener("pagehide", event => {
      if (event.persisted) return;
      observer.disconnect();
      entrances.forEach(animation => animation.stop());
      section.removeEventListener("focusin", onFocus);
      reducedMotion.removeEventListener("change", finishEntrances);
    });
  }
}
