import { adminCardClass } from "../utils/theme"

function AdminStateView({ loading, error, onRetry, title = "Loading data..." }) {
  if (loading) {
    return (
      <div className={`p-8 ${adminCardClass}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-56 rounded-lg bg-slate-200 dark:bg-white/10" />
          <div className="h-4 w-full rounded-lg bg-slate-200 dark:bg-white/10" />
          <div className="h-4 w-5/6 rounded-lg bg-slate-200 dark:bg-white/10" />
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="h-24 rounded-2xl bg-slate-200 dark:bg-white/10" />
            <div className="h-24 rounded-2xl bg-slate-200 dark:bg-white/10" />
            <div className="h-24 rounded-2xl bg-slate-200 dark:bg-white/10" />
          </div>
        </div>
        <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">{title}</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-8 text-rose-800 dark:bg-rose-950/80 dark:text-rose-200">
        <p className="text-sm font-semibold uppercase tracking-[0.2em]">Data error</p>
        <h3 className="mt-2 text-xl font-semibold">Unable to load this section</h3>
        <p className="mt-2 text-sm opacity-90">{error}</p>
        <button className="mt-5 rounded-2xl bg-rose-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600" onClick={onRetry} type="button">
          Retry
        </button>
      </div>
    )
  }

  return null
}

export default AdminStateView