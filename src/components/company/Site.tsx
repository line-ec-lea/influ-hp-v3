import type { ReactNode } from "react";
import { MotionPreferences } from "./Motion";
import Footer from "./components/footer";
import Navbar from "./components/navbar";
import { CinematicMotionProvider } from "./components/motion/cinematic-reveal";

export default function Site({ pathname, children }: { pathname: string; children: ReactNode }) {
  return (
    <MotionPreferences><CinematicMotionProvider>
      <Navbar pathname={pathname} />
      <main id="main-content" className="flex-1">{children}</main>
      <Footer />
    </CinematicMotionProvider></MotionPreferences>
  );
}
