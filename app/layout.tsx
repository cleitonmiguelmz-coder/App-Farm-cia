
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { BRAND } from "./brand";
import { CartProvider } from "./CartContext";
import InstallPrompt from "./InstallPrompt";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#075C3D",
};

export const metadata: Metadata = {
  title: `${BRAND.name} | Cuidamos de Si`,
  description:
    "Encontre produtos de farmácia, faça os seus pedidos online e escolha entre entrega ao domicílio ou levantamento na farmácia.",
  icons: { apple: "/icons/apple-touch-icon.png" },
  appleWebApp: { capable: true, title: BRAND.name, statusBarStyle: "default" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Apanha o convite de instalação do Android antes de a app arrancar */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              'window.addEventListener("beforeinstallprompt",function(e){e.preventDefault();window.__installEvent=e;window.dispatchEvent(new Event("install-ready"))});',
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <InstallPrompt />
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
