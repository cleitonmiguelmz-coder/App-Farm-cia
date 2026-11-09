"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { Capacitor } from "@capacitor/core";
import { BRAND } from "./brand";
import { LogoMark } from "./Logo";

type InstallEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

declare global {
  interface Window {
    // Guardado pelo script do layout, que corre antes de a app arrancar.
    __installEvent?: InstallEvent;
  }
}

const DISMISS_KEY = "farmacia-install-dismissed";
const DISMISS_MS = 7 * 24 * 60 * 60 * 1000;
const MANUAL_AFTER_MS = 4000;

type Env = "ios" | "android" | "web" | "hidden";

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
  if (isIos) return "ios";

  return /Android/.test(ua) ? "android" : "web";
}

const noopSubscribe = () => () => {};

function subscribeInstall(onChange: () => void) {
  window.addEventListener("install-ready", onChange);
  return () => window.removeEventListener("install-ready", onChange);
}

const getInstallEvent = () => window.__installEvent ?? null;

function setInstallEvent(event: InstallEvent | undefined) {
  window.__installEvent = event;
  window.dispatchEvent(new Event("install-ready"));
}

function wasDismissed(): boolean {
  try {
    const at = Number(localStorage.getItem(DISMISS_KEY));
    return at > 0 && Date.now() - at < DISMISS_MS;
  } catch {
    return false;
  }
}

export default function InstallPrompt() {
  const env = useSyncExternalStore(noopSubscribe, getEnv, () => "hidden" as Env);
  const installEvent = useSyncExternalStore(
    subscribeInstall,
    getInstallEvent,
    () => null
  );
  const [dismissed, setDismissed] = useState(wasDismissed);
  const [waited, setWaited] = useState(false);

  useEffect(() => {
    if (Capacitor.isNativePlatform()) return;

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    // Reserva: o script do layout já costuma ter guardado o evento.
    const onPrompt = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as InstallEvent);
    };
    const onInstalled = () => setInstallEvent(undefined);
    const timer = setTimeout(() => setWaited(true), MANUAL_AFTER_MS);

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      clearTimeout(timer);
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
    setInstallEvent(undefined);
  }

  if (dismissed || env === "hidden") return null;
  if (env === "web" && !installEvent) return null;
  // Android sem o evento do Chrome: passados uns segundos mostra o caminho manual.
  if (env === "android" && !installEvent && !waited) return null;

  const manual = env === "android" && !installEvent;

  return (
    <div
      role="region"
      aria-label="Instalar a app"
      className="border-b border-[#CFE3D6] bg-[#EEF7F1]"
    >
      <div className="mx-auto flex max-w-[1440px] items-start gap-3 px-4 py-3 sm:px-6 lg:px-10">
        <LogoMark className="h-10 w-10 shrink-0" />

        <div className="min-w-0 flex-1">
          <p className="text-sm font-extrabold text-[#193629]">
            {env === "ios"
              ? `Instale a ${BRAND.name} no iPhone`
              : env === "web"
                ? `Instale a ${BRAND.name}`
                : `Instale a ${BRAND.name} no telemóvel`}
          </p>

          {env === "ios" ? (
            <p className="mt-0.5 text-xs leading-5 text-[#5E6B62]">
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
          ) : manual ? (
            <p className="mt-0.5 text-xs leading-5 text-[#5E6B62]">
              Toque no menu <strong>⋮</strong> do Chrome e depois em{" "}
              <strong>Instalar app</strong> ou{" "}
              <strong>Adicionar ao ecrã principal</strong>. Se abriu este link
              dentro do WhatsApp ou do Instagram, abra-o primeiro no Chrome.
            </p>
          ) : (
            <p className="mt-0.5 text-xs leading-5 text-[#5E6B62]">
              Abre mais depressa e fica no ecrã principal, como qualquer outra
              app.
            </p>
          )}

          {installEvent && (
            <button
              type="button"
              onClick={install}
              className="mt-2 bg-[#087F5B] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#066B4C]"
            >
              Instalar
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={dismiss}
          aria-label="Fechar"
          className="-mr-1 flex h-9 w-9 shrink-0 items-center justify-center text-lg text-[#68766D] hover:text-[#193629]"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
