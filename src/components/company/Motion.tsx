import { createContext, useContext, useSyncExternalStore, type ReactNode } from "react";

export { AnimatePresence, MotionConfig, motion, useInView, useScroll, useSpring, useTransform } from "framer-motion";

const preference = "(prefers-reduced-motion: reduce)";
const ReducedMotion = createContext(false);
const serverSnapshot = () => false;
const snapshot = () => window.matchMedia(preference).matches;
function subscribe(notify: () => void) {
  const query = window.matchMedia(preference);
  query.addEventListener("change", notify);
  return () => query.removeEventListener("change", notify);
}

export function MotionPreferences({ children }: { children: ReactNode }) {
  // Match SSR on the first client render, then mount the user's preferred state.
  // Remounting prevents original initial/whileInView branches leaving content hidden.
  const reduced = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  return <ReducedMotion.Provider key={String(reduced)} value={reduced}>{children}</ReducedMotion.Provider>;
}

export function useReducedMotion() {
  return useContext(ReducedMotion);
}
