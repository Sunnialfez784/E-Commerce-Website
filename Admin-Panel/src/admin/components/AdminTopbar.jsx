import { useContext, useEffect, useRef, useState } from "react"
import { WindmillContext } from "@windmill/react-ui"
import { MenuIcon, SearchIcon, BellIcon, OutlineLogoutIcon, SunIcon, MoonIcon } from "../../icons"
import { Button } from "@windmill/react-ui"
import { clearAdminSession } from "../auth/adminAuth"
import { useHistory } from "react-router-dom"
import { adminGhostButtonClass, adminIconButtonClass, adminInputClass } from "../utils/theme"

export default function AdminTopbar({ onMenuClick = () => {}, onSearch = () => {} }) {
  const { mode, toggleMode } = useContext(WindmillContext)
  const history = useHistory()
  const notificationRef = useRef(null)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)

  const notifications = [
    { title: "New order received", detail: "Order ORD-1007 arrived 2 minutes ago" },
    { title: "Low stock alert", detail: "Studio Smart Watch is down to 18 units" },
    { title: "Payout completed", detail: "May revenue payout was marked as paid" },
  ]

  useEffect(() => {
    function handleDocumentClick(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleDocumentClick)

    return () => document.removeEventListener("mousedown", handleDocumentClick)
  }, [])

  function handleLogout() {
    clearAdminSession()
    history.replace("/admin/login")
  }

  return (
    <header className="sticky top-0 z-30 w-full border-b border-white/60 bg-white/70 backdrop-blur dark:border-white/10 dark:bg-slate-950/70">
      <div className="flex items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <button aria-label="Open menu" onClick={onMenuClick} className={`-ml-2 ${adminIconButtonClass}`}>
          <MenuIcon className="h-5 w-5 text-slate-700 dark:text-slate-200" />
        </button>

        <div className="relative flex flex-1 items-center">
          <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            aria-label="Search"
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search admin..."
            className={`${adminInputClass} py-2 pl-10 pr-3`}
          />
        </div>

        <div className="ml-3 flex items-center gap-2">
          <div ref={notificationRef} className="relative">
            <button
              type="button"
              onClick={() => setIsNotificationsOpen((current) => !current)}
              aria-expanded={isNotificationsOpen}
              aria-label="Open notifications"
              className={adminIconButtonClass}
            >
              <BellIcon className="h-5 w-5 text-slate-700 dark:text-slate-200" />
              <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-sky-500 dark:border-slate-950" />
            </button>

            {isNotificationsOpen ? (
              <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/10 dark:border-white/10 dark:bg-slate-900">
                <div className="border-b border-slate-200 px-4 py-3 dark:border-white/10">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Notifications</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Latest activity from your store</p>
                </div>
                <div className="max-h-80 divide-y divide-slate-200 overflow-y-auto dark:divide-white/10">
                  {notifications.map((notification) => (
                    <button
                      key={notification.title}
                      type="button"
                      className="block w-full px-4 py-3 text-left transition hover:bg-slate-50 dark:hover:bg-white/5"
                    >
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{notification.title}</p>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{notification.detail}</p>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <button
            type="button"
            onClick={toggleMode}
            aria-label={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className={adminIconButtonClass}
          >
            {mode === "dark" ? (
              <SunIcon className="h-5 w-5 text-slate-700 dark:text-slate-200" />
            ) : (
              <MoonIcon className="h-5 w-5 text-slate-700 dark:text-slate-200" />
            )}
          </button>

          <Button layout="link" onClick={handleLogout} className={`!px-2 !py-1 ${adminGhostButtonClass}`}>
            <OutlineLogoutIcon className="h-5 w-5 text-rose-600" />
          </Button>
        </div>
      </div>
    </header>
  )
}
