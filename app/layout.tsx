import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { HeaderNav } from "@/components/HeaderNav";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap"
});

export const metadata: Metadata = {
  title: "Twin Unity | Buy, Sell, Trade Pokemon Cards",
  description:
    "Twin Unity is your trusted Pokemon card marketplace for buying, selling, and trading singles, slabs, sealed products, and collections."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <header className="site-header">
          <HeaderNav />
        </header>
        {children}
        <footer>
          <div className="container footer-row">
            <p>© {new Date().getFullYear()} Twin Unity. All rights reserved.</p>
            <p>Pokemon is a trademark of Nintendo/Creatures Inc./GAME FREAK inc.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
