import { BRAND } from "./brand";

export function LogoMark({ className = "h-11 w-11" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <rect width="100" height="100" rx="24" fill="#087F5B" />
      <rect x="16" y="36" width="68" height="28" rx="14" fill="#B5EBD2" />
      <rect x="36" y="16" width="28" height="68" rx="14" fill="#FFFFFF" />
    </svg>
  );
}

export function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark />
      <span className="text-[22px] font-extrabold leading-none tracking-tight text-[#193629]">
        {BRAND.name}
      </span>
    </span>
  );
}
