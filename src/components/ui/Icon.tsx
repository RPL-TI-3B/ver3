import { type ReactNode } from "react";
import { type IconName } from "../../types";

export function Icon({ name, size = "size-5" }: { name: IconName; size?: string }) {
  const paths: Record<IconName, ReactNode> = {
    arrowDown: <path d="m6 9 6 6 6-6" />,
    book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" /></>,
    books: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v15H6.5A2.5 2.5 0 0 0 4 19.5V4.5A2.5 2.5 0 0 1 6.5 2Z" /><path d="M8 7h8M8 11h6" /></>,
    building: <><path d="M3 21h18M6 18V9m4 9V9m4 9V9m4 9V9M4 6l8-4 8 4v3H4V6Z" /></>,
    calendar: <><path d="M8 2v4m8-4v4M3 10h18" /><rect x="3" y="4" width="18" height="18" rx="2" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    download: <><path d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14" /></>,
    file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6M8 13h8M8 17h5" /></>,
    grid4: <><path d="M3 3h3v3H3zM8 3h3v3H8zM13 3h3v3h-3zM18 3h3v3h-3zM3 8h3v3H3zM8 8h3v3H8zM13 8h3v3h-3zM18 8h3v3h-3zM3 13h3v3H3zM8 13h3v3H8zM13 13h3v3h-3zM18 13h3v3h-3zM3 18h3v3H3zM8 18h3v3H8zM13 18h3v3h-3zM18 18h3v3h-3z" /></>,
    grid5: <><path d="M3 4v16M7.5 4v16M12 4v16M16.5 4v16M21 4v16M3 8h18M3 12h18M3 16h18" /></>,
    grid6: <><path d="M2 4v16M6 4v16M10 4v16M14 4v16M18 4v16M22 4v16M2 8h20M2 12h20M2 16h20" /></>,
    info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5m0-9h.01" /></>,
    layers: <><path d="m12 2 9 5-9 5-9-5 9-5Z" /><path d="m3 12 9 5 9-5M3 17l9 5 9-5" /></>,
    list: <><path d="M8 6h13M8 12h13M8 18h13" /><path d="M3 6h.01M3 12h.01M3 18h.01" /></>,
    location: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    lock: <><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
    map: <><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z" /><path d="M9 3v15m6-12v15" /></>,
    phone: <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7 12.8 12.8 0 0 0 .7 2.8 2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5 12.8 12.8 0 0 0 2.8.7 2 2 0 0 1 1.8 2.1Z" />,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  };

  return (
    <svg className={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}
