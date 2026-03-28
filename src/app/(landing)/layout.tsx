import Header from "./components/Header";
import type { ReactNode } from "react";

function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <section className="min-h-screen bg-white overflow-hidden">
      <Header />

      {/* pt-16 ensures content doesn't go under the fixed header */}
      <main className="pt-16">{children}</main>
    </section>
  );
}

export default LandingLayout;
