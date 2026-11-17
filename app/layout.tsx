import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "gurukulOS", description: "Connected learning, institute operations, and infinite growth" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
