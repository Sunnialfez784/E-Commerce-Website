import { createContext, useContext, useState } from "react"
import { cn } from "../utils/format"

export const AdminToastContext = createContext(null)

let toastId = 0

export function AdminToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken") || ""
  )

  const [refreshToken, setRefreshToken] = useState(
    localStorage.getItem("refreshToken") || ""
  )

  function removeToast(id) {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }

  function showToast(message, variant = "success") {
    const id = ++toastId
    const toast = { id, message, variant }

    setToasts((current) => [toast, ...current].slice(0, 3))

    window.setTimeout(() => removeToast(id), 3200)
  }

  function saveTokens(access, refresh) {
    setAccessToken(access)
    setRefreshToken(refresh)

    localStorage.setItem("accessToken", access)
    localStorage.setItem("refreshToken", refresh)
  }

  function clearTokens() {
    setAccessToken("")
    setRefreshToken("")

    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
  }

  const value = {
    showToast,
    accessToken,
    refreshToken,
    saveTokens,
    clearTokens,
  }

  return (
    <AdminToastContext.Provider value={value}>
      {children}

      <div className="pointer-events-none fixed right-4 top-4 z-[70] flex w-[min(92vw,24rem)] flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "pointer-events-auto rounded-2xl border px-4 py-3 shadow-2xl backdrop-blur transition-colors duration-200",
              toast.variant === "error" &&
                "border-rose-500/20 bg-rose-50 text-rose-900 dark:bg-rose-950/95 dark:text-rose-50",
              toast.variant === "warning" &&
                "border-amber-500/20 bg-amber-50 text-amber-900 dark:bg-amber-950/95 dark:text-amber-50",
              toast.variant === "info" &&
                "border-sky-500/20 bg-sky-50 text-sky-900 dark:bg-sky-950/95 dark:text-sky-50",
              toast.variant === "success" &&
                "border-emerald-500/20 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/95 dark:text-emerald-50"
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">
                  {toast.variant.toUpperCase()}
                </p>

                <p className="mt-1 text-sm opacity-90">
                  {toast.message}
                </p>
              </div>

              <button
                className="text-xs uppercase tracking-[0.2em] opacity-70 transition hover:opacity-100"
                onClick={() => removeToast(toast.id)}
                type="button"
              >
                Close
              </button>
            </div>
          </div>
        ))}
      </div>
    </AdminToastContext.Provider>
  )
}

export function useAdminToast() {
  return useContext(AdminToastContext)
}