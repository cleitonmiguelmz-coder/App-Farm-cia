import { Capacitor } from "@capacitor/core";
import { AppLauncher } from "@capacitor/app-launcher";

/**
 * Abre um link fora da app (WhatsApp, etc.).
 * Na app Android usa o sistema (abre o WhatsApp directamente se estiver instalado);
 * no browser usa window.open. Devolve false se não foi possível abrir.
 */
export async function openExternal(url: string): Promise<boolean> {
  if (Capacitor.isNativePlatform()) {
    try {
      await AppLauncher.openUrl({ url });
      return true;
    } catch {
      return false;
    }
  }

  const opened = window.open(url, "_blank");

  if (!opened) return false;

  opened.opener = null;
  return true;
}
