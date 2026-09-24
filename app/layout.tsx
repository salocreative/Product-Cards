import type { Metadata, Viewport } from "next";
import "@fontsource-variable/fustat";
import "@fontsource-variable/space-grotesk";
import { WHO_WE_ARE, metadataBaseUrl } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(metadataBaseUrl()),
  title: {
    default: "Salo products",
    template: "%s · Salo",
  },
  description: WHO_WE_ARE,
  applicationName: "Salo",
  icons: {
    icon: [
      { url: "/favicon/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    shortcut: "/favicon/favicon.ico",
    apple: { url: "/favicon/apple-touch-icon.png", sizes: "180x180" },
  },
  manifest: "/favicon/site.webmanifest",
  robots: { index: false, follow: false },
  openGraph: {
    siteName: "Salo",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#101010",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB">
      <body>
        <a className="skip" href="#content">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
