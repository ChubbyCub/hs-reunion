import type { Metadata } from "next";
import "./globals.css";
import {NextIntlClientProvider} from 'next-intl';
import {getLocale, getMessages} from 'next-intl/server';
import { Nunito } from "next/font/google";
import HomeLinkIfNotHome from "@/components/HomeLinkIfNotHome";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();
  
  return (
    <html lang={locale}>
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" sizes="32x32" />
      </head>
      <body className={`${nunito.variable} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <HomeLinkIfNotHome />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
