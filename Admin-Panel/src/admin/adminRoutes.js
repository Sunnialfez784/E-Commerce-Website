import { lazy } from "react"

const AdminDashboard = lazy(() => import("./pages/AdminDashboard"))
const AdminProducts = lazy(() => import("./pages/AdminProducts"))
const AdminOrders = lazy(() => import("./pages/AdminOrders"))
const AdminUsers = lazy(() => import("./pages/AdminUsers"))
const AdminInvoices = lazy(() => import("./pages/AdminInvoices"))

const adminRoutes = [
  { path: "/dashboard", component: AdminDashboard, name: "Dashboard" },
  { path: "/products", component: AdminProducts, name: "Products" },
  { path: "/orders", component: AdminOrders, name: "Orders" },
  { path: "/users", component: AdminUsers, name: "Users" },
  { path: "/invoice", component: AdminInvoices, name: "Invoice" },
]

export default adminRoutes