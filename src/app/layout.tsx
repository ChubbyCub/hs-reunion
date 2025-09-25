import type { Metadata } from "next";
import "./globals.css";
import { Nunito } from "next/font/google";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "600", "700", "800"], // Light, Regular, SemiBold, Bold, ExtraBold
});

export const metadata: Metadata = {
  title: "Họp mặt cựu học sinh LHP khóa 03-06",
  description: "Trang web họp mặt cựu học sinh Trường THPT Chuyên Lê Hồng Phong khóa 2003-2006",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="icon" type="image/png" href="/favicon.png" sizes="32x32" />
      </head>
      <body className={`${nunito.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
