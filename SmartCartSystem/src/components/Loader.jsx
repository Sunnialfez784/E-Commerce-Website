import React from "react";

const Loader = () => {
  return (
    <div className="flex min-h-[420px] w-full flex-col items-center justify-center gap-4 py-12" role="status" aria-live="polite">
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
