import "./globals.css";
import { Barlow, Barlow_Semi_Condensed } from "next/font/google";
import Header from "@/components/Header";
import { UserProvider } from "@/components/UserProvider";
import { APP_NAME, APP_TAGLINE } from "@/lib/config";

// Body text and the condensed display face used for headings, nav and the wordmark.
const body = Barlow({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--nf-body" });
const display = Barlow_Semi_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--nf-display",
});

export const metadata = {
  title: APP_NAME,
  description: APP_TAGLINE,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${body.variable} ${display.variable}`}>
      <body>
        <UserProvider>
          <Header />
          <main className="container main">{children}</main>
        </UserProvider>
      </body>
    </html>
  );
}
