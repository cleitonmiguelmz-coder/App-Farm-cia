"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { Capacitor } from "@capacitor/core";
import { BRAND } from "./brand";
import { LogoMark } from "./Logo";

type InstallEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "farmacia-install-dismissed";
const DISMISS_MS = 7 * 24 * 60 * 60 * 1000;

type Env = "ios" | "web" | "hidden";

function getEnv(): Env {
  if (Capacitor.isNativePlatform()) return "hidden";

  const standalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true;
  if (standalone) return "hidden";

  const ua = navigator.userAgent;
  const isIos =
    /iPhone|iPad|iPod/.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  return isIos ? "ios" : "web";
}

const subscribe = () => () => {};

function wasDismissed(): boolean {
  try {
    const at = Number(localStorage.getItem(DISMISS_KEY));
    return at > 0 && Date.now() - at < DISMISS_MS;
  } catch {
    return false;
  }
}

export default function InstallPrompt() {
  const env = useSyncExternalStore(subscribe, getEnv, () => "hidden" as Env);
  const [dismissed, setDismissed] = useState(wasDismissed);
  const [installEvent, setInstallEvent] = useState<InstallEvent | null>(null);

  useEffect(() => {
    if (Capacitor.isNativePlatform()) return;

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    const onPrompt = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as InstallEvent);
    };
    const onInstalled = () => setInstallEvent(null);

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  function dismiss() {
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {}
    setDismissed(true);
  }

  async function install() {
    if (!installEvent) return;
    await installEvent.prompt();
    await installEvent.userChoice;
    setInstallEvent(null);
  }

  if (dismissed || env === "hidden") return null;
  if (env === "web" && !installEvent) return null;

  return (
    <div
      role="region"
      aria-label="Instalar a app"
      className="fixed inset-x-0 bottom-0 z-50 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
    >
      <div className="mx-auto flex max-w-md items-start gap-3 rounded-xl border border-[#DDE5DE] bg-white p-4 shadow-[0_8px_30px_rgba(18,53,37,0.18)]">
        <LogoMark className="h-11 w-11 shrink-0" />

        <div className="min-w-0 flex-1">
          <p className="text-sm font-extrabold text-[#193629]">
            {env === "ios"
              ? `Instale a ${BRAND.name} no iPhone`
              : `Instale a ${BRAND.name} no telemóvel`}
          </p>

          {env === "ios" ? (
            <p className="mt-1 text-xs leading-5 text-[#5E6B62]">
              Toque em{" "}
              <svg
                viewBox="0 0 24 24"
                className="-mt-0.5 inline h-4 w-4 text-[#087F5B]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-label="Partilhar"
              >
                <path d="M12 3v12M8 7l4-4 4 4M6 11H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-1" />
              </svg>{" "}
              <strong>Partilhar</strong> e depois em{" "}
              <strong>Adicionar ao ecrã principal</strong>.
            </p>
          ) : (
            <p className="mt-1 text-xs leading-5 text-[#5E6B62]">
              Abre mais depressa e fica no ecrã principal, como qualquer outra
              app.
            </p>
          )}

          <div className="mt-3 flex items-center gap-2">
            {env === "web" && (
              <button
                type="button"
                onClick={install}
                className="bg-[#087F5B] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#066B4C]"
              >
                Instalar
              </button>
            )}
            <button
              type="button"
              onClick={dismiss}
              className="px-3 py-2 text-xs font-semibold text-[#68766D] hover:text-[#193629]"
            >
              {env === "ios" ? "Fechar" : "Agora não"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
