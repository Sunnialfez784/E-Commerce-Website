import { NavLink } from "react-router-dom"
import { HomeIcon, TruckIcon, CartIcon, GroupIcon, InvoiceIcon, OutlineLogoutIcon } from "../../icons"
import { clearAdminSession, getAdminSession } from "../auth/adminAuth"
import { cn } from "../utils/format"
import { adminPrimaryButtonClass } from "../utils/theme"

const navigation = [
  { to: "/admin/dashboard", label: "Dashboard", icon: HomeIcon },
  { to: "/admin/products", label: "Products", icon: TruckIcon },
  { to: "/admin/orders", label: "Orders", icon: CartIcon },
  { to: "/admin/users", label: "Users", icon: GroupIcon },
  { to: "/admin/invoice", label: "Invoice", icon: InvoiceIcon },
]

function AdminSidebar({ isOpen, onClose }) {
  // const session = getAdminSession(JSON.parse(localStorage.getItem(currentUser)))
  const session = JSON.parse(localStorage.getItem("ecommerce-admin-session"));

  // const user = 

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-slate-950/50 transition-opacity duration-300 lg:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full w-[19rem] flex-col border-r border-white/10 bg-white dark:bg-slate-950 text-slate-100 shadow-2xl transition-transform duration-300 lg:sticky lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex items-center gap-3 border-b border-black/10 dark:border-white/10 px-6 py-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-500 to-indigo-500 text-3xl font-black text-white shadow-lg shadow-cyan-500/20">
            A
          </div>
          <div>
            <p className="text-sm font-semibold tracking-[0.25em] text-cyan-200 uppercase">Admin Panel</p>
            <p className="text-xs text-slate-400">E-commerce control center</p>
          </div>
        </div>

        <div className="px-10 py-5">
          <div className="rounded-3xl border dark:border-white/10 border-black/10 dark:bg-white/5 bg-black/5 p-4 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Signed in as</p>
            <p className="mt-2 text-sm font-bold text-black/75 dark:text-white">{`${session?.firstName} ${session?.lastName}` || "Admin User"}</p>
            <p className="text-xs text-slate-400">{session?.email || "admin@shoplane.com"}</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 pb-4">
          {navigation.map((item) => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium dark:text-white text-black transition hover:bg-slate-600 dark:hover:bg-white/10 hover:text-gray-300"
                activeClassName="bg-white/10 text-gray-500 shadow-lg shadow-black/10"
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </NavLink>
            )
          })}
        </nav>

        <div className="border-t border-white/10 p-4">
          <button
            className={`${adminPrimaryButtonClass} flex w-full items-center justify-center gap-2 border border-rose-500/20 bg-rose-500/10 text-rose-200 hover:bg-rose-500/20`}
            type="button"
            onClick={() => {
              clearAdminSession()
              window.location.href = "/admin/login"
            }}
          >
            <OutlineLogoutIcon className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}

export default AdminSidebar