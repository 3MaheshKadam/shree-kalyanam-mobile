"use client";

import { SessionProvider } from "context/SessionContext";
import Navigation from "./Navigation";

export default function App() {
  return (
    <SessionProvider>
      <Navigation />
    </SessionProvider>
  );
}