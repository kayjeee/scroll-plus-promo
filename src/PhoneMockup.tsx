import React from "react";

export const PhoneMockup: React.FC<{
  readonly children: React.ReactNode;
}> = ({ children }) => (
  <div className="relative w-[320px] h-[650px] bg-slate-900 rounded-[48px] border-[8px] border-slate-800 shadow-2xl overflow-hidden">
    {/* Notch / Dynamic Island */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-2xl z-20" />
    {/* Screen Content Window */}
    <div className="relative w-full h-full overflow-hidden bg-white">
      {children}
    </div>
  </div>
);
