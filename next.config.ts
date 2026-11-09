import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Exportação estática: gera a pasta `out/`, que o Capacitor empacota na app.
  output: "export",
  // /checkout -> /checkout/index.html (necessário para o servidor local do Android)
  trailingSlash: true,
  // cacheComponents e partialPrefetching foram retirados: não funcionam com output: "export".
  // O otimizador de imagens precisa de servidor; na app as imagens vão como estão.
  images: { unoptimized: true },
  // Só afecta `npm run dev`: deixa abrir o site no telemóvel pelo IP do PC (ex.: 192.168.1.20:3000).
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*"],
  experimental: {
    agentFeedback: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
