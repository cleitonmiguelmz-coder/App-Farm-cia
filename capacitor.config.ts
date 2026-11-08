import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  // Não se muda depois de publicar na Play Store.
  appId: "mz.appmarket.ancora",
  appName: "Âncora Farmácia",
  webDir: "out",
  plugins: {
    SystemBars: {
      // A WebView fica abaixo da barra de estado e acima da barra de navegação.
      insetsHandling: "native",
    },
  },
};

export default config;
