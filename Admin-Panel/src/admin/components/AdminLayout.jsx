import React, { Suspense, useContext, useEffect, useState } from "react"
import { Route, Redirect, Switch, useLocation } from "react-router-dom"
import { Card, CardBody } from "@windmill/react-ui"
import { SidebarContext } from "../../context/sidebarContext"
import ThemedSuspense from "../../components/ThemedSuspense"
import adminRoutes from "../adminRoutes"
import AdminSidebar from "./AdminSidebar"
import AdminTopbar from "./AdminTopbar"
import { AdminToastProvider } from "../context/AdminToastContext"
import { adminCardClass, adminShellClass } from "../utils/theme"

const AdminNotFound = React.lazy(() => import("../../pages/404"))

function AdminLayout() {
  const { isSidebarOpen, closeSidebar, toggleSidebar } = useContext(SidebarContext)
  const location = useLocation()
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    closeSidebar()
  }, [location, closeSidebar])

  return (
    <AdminToastProvider>
      <div className={adminShellClass}>
        <div className="flex min-h-screen">
          <AdminSidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

          <div className="flex min-w-0 flex-1 flex-col lg:pl-0">
            <AdminTopbar onMenuClick={toggleSidebar} onSearch={setSearchTerm} />

            <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-7xl">
                <Card className={`mb-6 overflow-hidden ${adminCardClass}`}>
                  <CardBody className="flex flex-col gap-4 border-l-4 border-cyan-500 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-600 dark:text-cyan-300">Admin operations</p>
                      <h1 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">Modern commerce control center</h1>
                      <p className="mt-1 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
                        Manage orders, users, products, and invoices from one responsive dashboard.
                      </p>
                    </div>
                    <div className="rounded-2xl dark:bg-slate-950 bg-slate-100 px-4 py-3 text-sm dark:text-slate-100 text-slate-900 shadow-lg shadow-slate-950/20 dark:bg-white/5">
                      <p className="font-semibold">Live search</p>
                      <p className="text-slate-600">{searchTerm ? `Filtering by "${searchTerm}"` : "Use the top search bar on data-heavy screens"}</p>
                    </div>
                  </CardBody>
                </Card>

                <Suspense fallback={<ThemedSuspense />}>
                  <Switch>
                    {adminRoutes.map((route) => (
                      <Route
                        key={route.path}
                        exact
                        path={`/admin${route.path}`}
                        render={(props) => <route.component {...props} searchTerm={searchTerm} />}
                      />
                    ))}
                    <Redirect exact from="/admin" to="/admin/dashboard" />
                    <Route component={AdminNotFound} />
                  </Switch>
                </Suspense>
              </div>
            </main>
          </div>
        </div>
      </div>
    </AdminToastProvider>
  )
}

export default AdminLayout