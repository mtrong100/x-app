"use client";
import { NextUIProvider } from "@nextui-org/react";

interface NextUIProviderProps {
  children: React.ReactNode;
}

export default function NextuiProvider({ children }: NextUIProviderProps) {
  return (
    <>
      <NextUIProvider>{children}</NextUIProvider>
    </>
  );
}
