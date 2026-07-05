import { ReactNode } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Provider } from "../components/ui/provider";
import "../styles/globals.css";

const inter = Inter({ subsets: ["latin"] });
const siteUrl = "https://elfeel.me";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Mahmoud Elfeel | Portfolio",
    template: "%s | Mahmoud Elfeel",
  },
  description:
    "Mahmoud Elfeel, also written Mahmoud Elfil, is a Berlin-based software engineer building backend, full-stack, mobile, security, and developer-tooling projects.",
  keywords: [
    "Mahmoud Elfeel",
    "Mahmoud Elfil",
    "Elfeel",
    "Elfil",
    "Mahmoud",
    "Feel",
    "software engineer",
    "full-stack developer",
    "backend developer",
    "Berlin",
  ],
  authors: [{ name: "Mahmoud Elfeel", url: siteUrl }],
  creator: "Mahmoud Elfeel",
  publisher: "Mahmoud Elfeel",
  category: "technology",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "profile",
    url: siteUrl,
    siteName: "Mahmoud Elfeel",
    title: "Mahmoud Elfeel (Mahmoud Elfil) | Software Engineer",
    description:
      "Portfolio of Mahmoud Elfeel, a Berlin-based software engineer working across backend, full-stack, mobile, security, and developer tooling.",
    firstName: "Mahmoud",
    lastName: "Elfeel",
    images: [
      {
        url: "/project-previews/Portfolio.png",
        width: 1728,
        height: 960,
        alt: "Mahmoud Elfeel software engineering portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mahmoud Elfeel (Mahmoud Elfil) | Software Engineer",
    description:
      "Backend, full-stack, mobile, security, and developer-tooling projects by Mahmoud Elfeel.",
    images: ["/project-previews/Portfolio.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/Logo.ico",
    shortcut: "/Logo.ico",
    apple: "/Logo-transparent.png",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
