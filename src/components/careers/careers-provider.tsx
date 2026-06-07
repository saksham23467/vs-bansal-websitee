"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { ApplicationModal, type ApplyPosition } from "@/components/careers/application-modal";

type CareersContextValue = {
  openApply: (positionTitle?: string) => void;
};

const CareersContext = createContext<CareersContextValue | null>(null);

export function useCareers() {
  const ctx = useContext(CareersContext);
  if (!ctx) {
    throw new Error("useCareers must be used within CareersProvider");
  }
  return ctx;
}

export function CareersProvider({
  positions,
  children,
}: {
  positions: ApplyPosition[];
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | undefined>(undefined);

  const openApply = useCallback(
    (positionTitle?: string) => {
      setSelected(positionTitle ?? positions[0]?.title);
      setOpen(true);
    },
    [positions]
  );

  const value = useMemo(() => ({ openApply }), [openApply]);

  return (
    <CareersContext.Provider value={value}>
      {children}
      <ApplicationModal
        open={open}
        onClose={() => setOpen(false)}
        positions={positions}
        initialPositionTitle={selected}
      />
    </CareersContext.Provider>
  );
}
