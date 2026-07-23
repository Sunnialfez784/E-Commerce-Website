import {useEffect, useMemo, useState, useCallback} from "react";
import {Card, CardBody} from "@windmill/react-ui";
import AdminPageHeader from "../components/AdminPageHeader";
import AdminPagination from "../components/AdminPagination";
import AdminStateView from "../components/AdminStateView";
import useAdminResource from "../hooks/useAdminResource";
import {adminApi} from "../services/adminApi";
import {formatCurrency, formatDate, getStatusTone} from "../utils/format";
import {useAdminToast} from "../context/AdminToastContext";
import {SearchIcon} from "../../icons";
import {adminCardClass, adminInputClass, adminPrimaryButtonClass} from "../utils/theme";

const orderStatuses = ["All", "Pending", "Delivered", "Cancelled"];
const paymentStatuses = ["All", "Paid", "Pending", "Refunded"];

function AdminOrders({searchTerm = ""}) {
  const accessToken = localStorage.getItem("accessToken") || "";

  const fetchOrders = useCallback(() => {
    return adminApi.getOrders(accessToken);
  }, [accessToken]);

  const {data, loading, error, reload} = useAdminResource(fetchOrders);
  const [items, setItems] = useState(null);
  const [search, setSearch] = useState(searchTerm);
  const [statusFilter, setStatusFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setSearch(searchTerm);
    setPage(1);
  }, [searchTerm]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const {showToast} = useAdminToast();
  const pageSize = 5;

  const sourceItems = useMemo(() => {
    const rawData = items ?? data ?? [];

    return Array.isArray(rawData) ? rawData : [];
  }, [items, data]);

  const filtered = useMemo(() => {
    const query = search.toLowerCase();

    return sourceItems.filter((order) => {
      const matchesSearch = [order.id, order.order_id, order.customer, order.email].some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(query),
      );

      const matchesStatus = statusFilter === "All" || order.status === statusFilter;

      const matchesPayment = paymentFilter === "All" || order.paymentStatus === paymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [sourceItems, search, statusFilter, paymentFilter]);

  const selectedOrder = useMemo(() => {
    if (!sourceItems.length) {
      return null;
    }

    if (selectedOrderId) {
      return sourceItems.find((order) => order["Orders.order_id"] === selectedOrderId) || sourceItems[0];
    }

    return sourceItems[0];
  }, [sourceItems, selectedOrderId]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  function handleStatusUpdate(id, status) {
    setItems((current) => {
      const currentItems = current ?? data ?? [];

      return currentItems.map((order) =>
        order["Orders.order_id"] === id
          ? {
              ...order,
              "Orders.order_status": status,
            }
          : order,
      );
    });

    setSelectedOrderId(id);

    showToast(`Order status updated to ${status}.`, "success");
  }

  return (
    <div>
      <AdminPageHeader eyebrow="Orders" title="Order management" description="Track fulfillment, payment status, and detailed order information while keeping the queue searchable and easy to filter." />

      {(loading || error) && <AdminStateView loading={loading} error={error} onRetry={reload} title="Loading order queue..." />}

      {!loading && !error && (
        <div className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
          <Card className={adminCardClass}>
            <CardBody className="p-5">
              <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto]">
                <div className="relative">
                  <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    className={`${adminInputClass} py-3 pl-10 pr-4`}
                    placeholder="Search orders"
                    value={search}
                    onChange={(event) => {
                      setSearch(event.target.value);
                      setPage(1);
                    }}
                  />
                </div>
                <select
                  className={`${adminInputClass} px-4 py-3`}
                  value={statusFilter}
                  onChange={(event) => {
                    setStatusFilter(event.target.value);
                    setPage(1);
                  }}>
                  {orderStatuses.map((item) => (
                    <option key={item} className="dark:bg-gray-950">
                      {item}
                    </option>
                  ))}
                </select>
                <select
                  className={`${adminInputClass} px-4 py-3`}
                  value={paymentFilter}
                  onChange={(event) => {
                    setPaymentFilter(event.target.value);
                    setPage(1);
                  }}>
                  {paymentStatuses.map((item) => (
                    <option key={item} className="dark:bg-gray-950">
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-5 overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-white/10">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                      <th className="pb-3 pr-4">Order</th>
                      <th className="pb-3 pr-4">Product</th>
                      <th className="pb-3 pr-4">Customer</th>
                      <th className="pb-3 pr-4">Amount</th>
                      <th className="pb-3 pr-4">Status</th>
                      <th className="pb-3 pr-4">Payment</th>
                      <th className="pb-3 pr-4">Date</th>
                      <th className="pb-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {paged.map((order) => (
                      <tr key={order.id || order.order_id} className="text-sm hover:bg-slate-50/80 dark:hover:bg-white/5">
                        <td className="py-3 pr-4 font-semibold text-slate-900 dark:text-white">ORD-{order.order_id}</td>
                        <td className="py-3 pr-4 font-semibold text-slate-900 dark:text-white">{order.Order_Items[0].Product.productName}</td>
                        <td className="py-3 pr-4 text-slate-600 dark:text-slate-300">{`${order?.User?.firstName} ${order?.User?.lastName}`}</td>
                        <td className="py-3 pr-4 font-medium text-slate-900 dark:text-white">{formatCurrency(order.total_amount)}</td>
                        <td className="py-3 pr-4">
                          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusTone(order.order_status)}`}>{order.order_status}</span>
                        </td>
                        <td className="py-3 pr-4">
                          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusTone(order.payment_status)}`}>{order.payment_status}</span>
                        </td>
                        <td className="py-3 pr-4 text-slate-500 dark:text-slate-400">{formatDate(order.createdAt)}</td>
                        <td className="py-3">
                          <button
                            className={`${adminPrimaryButtonClass} px-3 py-2 text-xs`}
                            onClick={() => {
                              console.log("Clicked:", order.order_id);
                              setSelectedOrderId(order.order_id);
                            }}
                            type="button">
                            View details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <AdminPagination page={page} totalPages={totalPages} onPageChange={setPage} totalItems={filtered.length} pageSize={pageSize} />
            </CardBody>
          </Card>

          <Card className={`h-fit ${adminCardClass}`}>
            <CardBody className="p-5">
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Selected order</p>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">ORD-{selectedOrder?.order_id}</h3>
              {selectedOrder ? (
                <div className="mt-5 space-y-4 text-sm">
                  <div className="rounded-2xl bg-slate-100 p-4 dark:bg-white/5">
                    <p className="text-slate-500 dark:text-slate-400">Customer</p>
                    <p className="mt-1 font-semibold text-slate-900 dark:text-white">{`${selectedOrder?.User?.firstName} ${selectedOrder?.User?.lastName}`}</p>
                    {/* <p className="text-slate-500 dark:text-slate-400">{selectedOrder.email}</p> */}
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-slate-100 p-4 dark:bg-white/5">
                      <p className="text-slate-500 dark:text-slate-400">Amount</p>
                      <p className="mt-1 font-semibold text-slate-900 dark:text-white">{formatCurrency(selectedOrder.total_amount)}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-100 p-4 dark:bg-white/5">
                      <p className="text-slate-500 dark:text-slate-400">Status</p>
                      <p className="mt-1 font-semibold text-slate-900 dark:text-white">{selectedOrder.order_status}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Update order status</label>
                    <select className={`${adminInputClass} mt-2 w-full px-4 py-3`} value={selectedOrder.order_status} onChange={(event) => handleStatusUpdate(selectedOrder.order_id, event.target.value)}>
                      {["Pending", "Delivered", "Cancelled"].map((item) => (
                        <option key={item} className="text-sm font-semibold text-slate-700 dark:bg-gray-900">
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : null}
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;
