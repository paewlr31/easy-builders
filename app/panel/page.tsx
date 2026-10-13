import type { Metadata } from "next";
import { Panel } from "@/components/panel/Panel";

export const metadata: Metadata = {
  title: "Panel — Easy Builders",
  robots: { index: false, follow: false },
};

export default function PanelPage() {
  return <Panel />;
}
