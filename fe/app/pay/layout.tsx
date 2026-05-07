import type { ReactNode } from "react";
import { ImmersiveShell } from "@/components/layout/app-shell";

export default function PayLayout({ children }: { children: ReactNode }) {
  return <ImmersiveShell>{children}</ImmersiveShell>;
}
