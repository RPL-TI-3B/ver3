import { useState, useEffect, ReactNode } from "react";
import { Icon, Badge, Cover, Title, Stat, useCountdown, btnPrimary, btnSecondary, btnGhost, card, FINE_RATE, rupiah, Modal, UploadModal, QrisModal } from "./StudentShared";
import { StudentBook, Paper, papers } from "../data/portalData";
import { Icon as GlobalIcon } from "../components/ui/Icon";
import { Button } from "../components/ui/Button";

export function QrisMock() {
  const n = 25;
  const cells = Array.from({ length: n * n }, (_, i) => ((i * 7919) ^ ((i >> 2) * 131)) % 3 === 0);
  const finder = (r: number, c: number) => {
    const inF = (rr: number, cc: number) => rr >= 0 && rr < 7 && cc >= 0 && cc < 7;
    for (const [or, oc] of [[0, 0], [0, n - 7], [n - 7, 0]]) {
      const lr = r - or, lc = c - oc;
      if (inF(lr, lc)) return lr === 0 || lr === 6 || lc === 0 || lc === 6 || (lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4) ? 1 : 0;
    }
    return -1;
  };
  return (
    <div className="relative grid size-48 grid-cols-[repeat(25,1fr)] p-1">
      {cells.map((on, i) => {
        const f = finder(Math.floor(i / n), i % n);
        return <div key={i} className={(f === -1 ? on : f === 1) ? "bg-slate-900" : ""} />;
      })}
      <div className="absolute left-1/2 top-1/2 grid size-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-md border-2 border-white bg-[#0d372b] text-[9px] font-bold tracking-tight text-white">PNL</div>
    </div>
  );
}
