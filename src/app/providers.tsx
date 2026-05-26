"use client";

import { Provider } from "react-redux";
import store from "@/redux/store";
import PageTransitionProvider from "./PageTransitionProvider";
import SplashScreen from "./SplashScreen";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PageTransitionProvider>{children}</PageTransitionProvider>
      <SplashScreen />
    </Provider>
  );
}
