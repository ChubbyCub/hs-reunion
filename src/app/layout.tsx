import type { Metadata } from "next";
import "./globals.css";
import {NextIntlClientProvider} from 'next-intl';
import { Nunito } from "next/font/google";
import HomeLinkIfNotHome from "@/components/HomeLinkIfNotHome";
import viMessages from '../../messages/vi.json';

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "600", "700", "800"], // Light, Regular, SemiBold, Bold, ExtraBold
});

export const metadata: Metadata = {
  title: "Class 03-06 Reunion Page",
  description: "Made by class 03-06",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" sizes="32x32" />
      </head>
      <body className={`${nunito.variable} antialiased`}>
        <NextIntlClientProvider messages={viMessages}>
          <HomeLinkIfNotHome />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
