import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Храммам — во славу Великой Василисы",
  description: "Вымышленная религия, Великая Василиса и всё в целом лол. Этот сайт — рофл.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ru"><body>{children}</body></html>;
}

