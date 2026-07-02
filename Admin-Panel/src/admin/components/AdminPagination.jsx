import { adminGhostButtonClass } from "../utils/theme"

function AdminPagination({ page, totalPages, onPageChange, totalItems, pageSize }) {
  if (!totalPages || totalPages <= 1) {
    return null
  }

  const start = (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, totalItems)

  return (
    <div className="mt-5 flex flex-col gap-3 border-t border-slate-200 pt-4 text-sm text-slate-600 dark:border-white/10 dark:text-slate-300 sm:flex-row sm:items-center sm:justify-between">
      <p>
        Showing {start}-{end} of {totalItems}
      </p>
      <div className="flex items-center gap-2">
        <button className={`${adminGhostButtonClass} disabled:cursor-not-allowed disabled:opacity-40`} onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
          Previous
        </button>
        <span className="rounded-xl bg-slate-950 px-3 py-2 font-medium text-white dark:bg-white/10">
          {page} / {totalPages}
        </span>
        <button className={`${adminGhostButtonClass} disabled:cursor-not-allowed disabled:opacity-40`} onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}>
          Next
        </button>
      </div>
    </div>
  )
}

export default AdminPagination