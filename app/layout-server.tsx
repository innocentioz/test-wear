export const metadata = {
    title: 'Limitless Wear',
    description: 'Магазин по продаже лимитированной одежды',
    other: {
      "google-site-verification": "P_GscIXEXTPBMfYsHkK6ICiVDayViIrBfhqJETYA-w0",
    },
  };

import RootLayout from "./layout";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    return <RootLayout>{children}</RootLayout>;
}
