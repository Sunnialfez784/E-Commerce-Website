import {Card, CardBody} from "@windmill/react-ui";
import {Line, Doughnut} from "react-chartjs-2";
import AdminPageHeader from "../components/AdminPageHeader";
import AdminStatCard from "../components/AdminStatCard";
import AdminStateView from "../components/AdminStateView";
import useAdminResource from "../hooks/useAdminResource";
import {adminApi} from "../services/adminApi";
import {formatCurrency, formatDate, getStatusTone} from "../utils/format";
import {CartIcon, TruckIcon, GroupIcon, MoneyIcon, ChartsIcon} from "../../icons";
import {adminCardClass} from "../utils/theme";
import {useCallback} from "react";

function AdminDashboard() {
  const {loading, error, reload} = useAdminResource(adminApi.getDashboardSummary);
  const accessToken = localStorage.getItem("accessToken") || "";

  const fetchOrders = useCallback(() => {
    return adminApi.getOrders(accessToken);
  }, [accessToken]);

  const {data: ordersData, loading: ordersLoading} = useAdminResource(fetchOrders);

  const recentOrders = ordersData?.slice(0, 5) || [];  

  const fetchHighlights = useCallback(() => {
    return adminApi.getHighlight(accessToken);
  }, [accessToken]);

  const {data: highlightData} = useAdminResource(fetchHighlights);

  const highlights = highlightData || {};

  const quickStats = [
    ["Pending orders", highlights.pendingOrders ?? 0, "Need review"],
    ["Low stock items", highlights.lowStock ?? 0, "Inventory alert"],
    ["Active customers", highlights.activeAccount ?? 0, "Growing month over month"],
  ];

  const stats = [
    {
      label: "Total Users",
      value: (highlights.totalUsers ?? 0).toLocaleString(),
      delta: "+8.2%",
      icon: GroupIcon,
      accent: "from-cyan-500 to-sky-500",
    },
    {
      label: "Total Products",
      value: (highlights.totalProduct ?? 0).toLocaleString(),
      delta: "+13.7%",
      icon: TruckIcon,
      accent: "from-indigo-500 to-violet-500",
    },
    {
      label: "Total Orders",
      value: (highlights.totalOrders ?? 0).toLocaleString(),
      delta: "+5.4%",
      icon: CartIcon,
      accent: "from-emerald-500 to-teal-500",
    },
    {
      label: "Revenue",
      value: (highlights.revenue ?? 0).toLocaleString(),
      delta: "+8.4%",
      icon: MoneyIcon,
      accent: "from-emerald-500 to-teal-500",
    },
  ];

  const fetchGraphData = useCallback(() => {
    return adminApi.getGraphData(accessToken);
  }, [accessToken]);

  const {data: graphData} = useAdminResource(fetchGraphData);

  const graphLabels = graphData?.length ? graphData.map((item) => item.month) : [];

  const graphRevenue = graphData?.length ? graphData.map((item) => Number(item.revenue)) : [];

  const salesChart = {
    labels: graphLabels,
    datasets: [
      {
        label: "Revenue",
        data: graphRevenue,
        borderColor: "#06b6d4",
        backgroundColor: "rgba(6,182,212,0.12)",
        tension: 0.45,
        fill: true,
      },
    ],
  };

  const orderChart = {
    labels: ["Pending", "Shipped", "Delivered", "Cancelled"],
    datasets: [
      {
        data: [14, 28, 61, 7],
        backgroundColor: ["#f59e0b", "#3b82f6", "#10b981", "#f43f5e"],
        borderWidth: 0,
      },
    ],
  };

  if (loading || error) {
    return (
      <div>
        <AdminPageHeader eyebrow="Dashboard" title="Commerce overview" description="Track revenue, orders, inventory, and recent activity from a clean admin dashboard built for speed and clarity." />
        <AdminStateView loading={loading} error={error} onRetry={reload} title="Loading dashboard statistics and recent order activity..." />
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader eyebrow="Dashboard" title="Commerce overview" description="Track revenue, orders, inventory, and recent activity from a clean admin dashboard built for speed and clarity." />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <AdminStatCard key={item.label} {...item} />
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.65fr_0.95fr]">
        <Card className={adminCardClass}>
          <CardBody className="p-5">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Sales & order trends</p>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Revenue performance</h3>
              </div>
              <ChartsIcon className="h-5 w-5 text-cyan-500" />
            </div>
            <div className="h-[22rem]">
              <Line
                data={salesChart}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {legend: {display: false}},
                  scales: {
                    x: {grid: {display: false}},
                    y: {grid: {color: "rgba(148,163,184,0.14)"}},
                  },
                }}
              />
            </div>
          </CardBody>
        </Card>

        
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
        <Card className={adminCardClass}>
          <CardBody className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Recent orders</p>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Latest transactions</h3>
              </div>
              <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-600 dark:text-cyan-300">Live</span>
            </div>

            <div className="mt-5 overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-white/10">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                    <th className="pb-3 pr-4">Customer</th>
                    <th className="pb-3 pr-4">Order</th>
                    <th className="pb-3 pr-4">Amount</th>
                    <th className="pb-3 pr-4">Status</th>
                    <th className="pb-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {recentOrders.map((order) => (
                    <tr key={order["Orders.order_id"]} className="text-sm">
                      <td className="py-3 pr-4 font-medium text-slate-900 dark:text-white">{`${order?.firstName} ${order?.lastName}`}</td>
                      <td className="py-3 pr-4 text-slate-600 dark:text-slate-300">ORD-{order["Orders.order_id"]}</td>
                      <td className="py-3 pr-4 font-medium text-slate-900 dark:text-white">{formatCurrency(order["Orders.total_amount"])}</td>
                      <td className="py-3 pr-4">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusTone(order["Orders.order_status"])}`}>{order["Orders.order_status"]}</span>
                      </td>
                      <td className="py-3 text-slate-500 dark:text-slate-400">{formatDate(order["Orders.createdAt"])}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>

        <Card className={adminCardClass}>
          <CardBody className="p-5">
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Quick statistics</p>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Operational highlights</h3>
            <div className="mt-5 space-y-4">
              {quickStats.map(([label, value, note]) => (
                <div key={label} className="rounded-2xl bg-slate-100 p-4 dark:bg-white/5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{label}</span>
                    <span className="text-lg font-semibold text-slate-900 dark:text-white">{value}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{note}</p>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default AdminDashboard;
