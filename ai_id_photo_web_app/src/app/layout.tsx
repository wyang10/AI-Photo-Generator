import type { Metadata } from "next";
// import localFont from "next/font/local";
import "./globals.css";
import { UserProvider } from "../contexts/UserContext";
// import { Toaster } from 'react-hot-toast';
// import Script from 'next/script';

// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

export const metadata: Metadata = {
  title: "AI ID Photo Generator",
  description: "Generate ID photos with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link type="image/png" sizes="32x32" rel="icon" href="/icons8-id-64.png" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
        />
      </head>
      <body
        className={`/*  */ antialiased`}
      >
        {/* <Script
          src="https://accounts.google.com/gsi/client"
          strategy="afterInteractive"
        />
        <Toaster /> */}
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
