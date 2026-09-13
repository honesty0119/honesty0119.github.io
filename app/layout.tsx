import type { Metadata } from "next";
import "./globals.css";
import { site } from "./site.config";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: "%s · 吴廷颖" },
  description: site.description,
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    title: site.title,
    description: site.description,
    type: "website",
    images: [{ url: "/og.png", width: 1672, height: 941, alt: site.title }]
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN" suppressHydrationWarning><body>{children}</body></html>;
}
