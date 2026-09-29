import type { ReactNode } from "react";
import Footer from "./app/components/footer";
import Navbar from "./app/components/navbar";
import { CinematicMotionProvider } from "./app/components/motion/cinematic-reveal";

export default function Site({ pathname, children }: { pathname: string; children: ReactNode }) {
  return (
    <CinematicMotionProvider>
      <Navbar pathname={pathname} />
      <main id="main-content" className="flex-1">{children}</main>
      <Footer />
    </CinematicMotionProvider>
  );
}
