import { ReactNode } from "react";
import { Inter } from "next/font/google";
import { Provider } from "../components/ui/provider";
import "../styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: 'Mahmoud Elfeel | Portfolio',
  description: 'A modern, all-around engineer portfolio site.',
  icons: {
    icon: '/Logo-transparent.png',
    shortcut: '/Logo-transparent.png',
    apple: '/Logo-transparent.png',
  }
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Provider>
          {children}
        </Provider>
      </body>
    </html>
  );
}
