"use client";

import { Provider } from "react-redux";
import { authStore } from "@/store/store";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <Provider store={authStore}>{children}</Provider>;
}
