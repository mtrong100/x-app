"use client";

import useAuthWatcher from "@/hooks/useAuthWatcher";

interface Props {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: Props) {
  // Watch user
  useAuthWatcher();

  return <>{children}</>;
}
