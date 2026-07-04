import React from "react";

const Loader = ({isLoader}) => {
  return (
    <div className={`flex w-full flex-col items-center justify-center ${isLoader ? "gap-2 py-0 max-h-8" : "gap-4 py-12 min-h-[420px]"}`} role="status" aria-live="polite">
      <div className="loading scale-110">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Loading</p>
    </div>
  );
};

export default Loader;
