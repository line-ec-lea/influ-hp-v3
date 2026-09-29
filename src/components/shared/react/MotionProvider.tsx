import type { ReactNode } from "react";
import { MotionPreferences } from "./Motion";
import { CinematicMotionProvider } from "./motion/cinematic-reveal";

export default function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionPreferences><CinematicMotionProvider>
      {children}
    </CinematicMotionProvider></MotionPreferences>
  );
}
