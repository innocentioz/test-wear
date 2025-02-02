"use client";

import './global.css';
import Header from './components/header';
import Footer from './components/footer';
import { CartProvider } from "@/app/context/CartContext";
import { SessionProvider } from "next-auth/react";
import Script from 'next/script';
import Image from 'next/image';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Script
          id="yandex-metrika"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
              (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

              ym(99737447, "init", {
                clickmap:true,
                trackLinks:true,
                accurateTrackBounce:true,
                ecommerce:"dataLayer"
              });
            `,
          }}
        />
        <meta name="yandex-verification" content="2eda3b196392eab2" />
        <meta name="google-site-verification" content="P_GscIXEXTPBMfYsHkK6ICiVDayViIrBfhqJETYA-w0" />
      </head>
      <body>
        <SessionProvider>
          <CartProvider>
            <Header />
            <main className='min-h-screen flex justify-evenly'>{children}</main>
            <Footer /> 
          </CartProvider>
        </SessionProvider>

        <noscript>
          <div>
            <Image
              src="https://mc.yandex.ru/watch/99737447"
              style={{ position: "absolute", left: "-9999px" }}
              alt=""
              width={50}
              height={50}
            />
          </div>
        </noscript>
      </body>
    </html>
  );
}