"use client";

import './global.css';
import Header from './components/header';
import Footer from './components/footer';
import { CartProvider } from "@/app/context/CartContext";
import { SessionProvider } from "next-auth/react";
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="yandex-verification" content="2eda3b196392eab2" />
        <meta name="google-site-verification" content="P_GscIXEXTPBMfYsHkK6ICiVDayViIrBfhqJETYA-w0" />
      </head>
      <body className="">
        <SessionProvider>
          <CartProvider>
            <Header />
            <main className='min-h-screen flex justify-evenly'>{children}</main>
            <Footer /> 
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}