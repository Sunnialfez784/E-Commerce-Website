import React, {useEffect, useState} from "react";
import Navbar from "./Navbar";
import {CheckCircleIcon, ClockIcon} from "@heroicons/react/24/solid";
import {useAuth} from "../context/AuthContext";
import {BASE_URL} from "../apis";
import {Link} from "react-router-dom";
import {FaFileInvoice} from "react-icons/fa";
import {PackageSearch} from "lucide-react";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const {token} = useAuth();

  useEffect(() => {
    fetch(`${BASE_URL}/orders/complete-order`, {
      method: "GET",
      headers: {Authorization: `Bearer ${token}`},
    })
      .then((res) => res.json())
      .then(({data}) => setOrders(data || []))
      .catch((err) => console.error(err.errors[0]));
  }, [token]);

  return (
    <>
      <Navbar />
      <main className="app-shell w-full text-black">
        <div className="page-shell py-6 lg:py-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Account</p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">My Orders</h1>
            </div>
            <div className="stat-card">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Total Orders</p>
              <p className="mt-1 text-xl font-bold text-slate-950">{orders.length}</p>
            </div>
          </div>

          {orders.length > 0 ? (
            <div className="mt-6 flex flex-col gap-4">
              {orders.map((order) => {
                const isDelivered = order.order_status === "Delivered";
                return (
                  <div key={order.order_item_id} className="premium-card bg-white p-4 sm:p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-2 sm:h-24 sm:w-24">
                          <img src={order.itemImage} alt={order.itemName} className="h-full w-full object-contain" />
                        </div>
                        <div className="min-w-0">
                          <h2 className="text-base font-semibold text-slate-950 line-clamp-2 sm:text-lg">{order.itemName}</h2>
                          <p className="mt-1 text-lg font-bold tracking-tight text-slate-950">₹{order.itemPrice}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end sm:gap-2">
                        <div className="flex flex-col items-start gap-1 sm:items-end">
                          <span className={`badge ${isDelivered ? "badge-success" : "badge-warning"}`}>
                            {isDelivered ? <CheckCircleIcon className="h-3.5 w-3.5" /> : <ClockIcon className="h-3.5 w-3.5" />}
                            {order.order_status}
                          </span>
                          <p className="text-xs text-slate-500">{order.createdAt}</p>
                          {order.message && <p className="text-xs text-slate-400">{order.message}</p>}
                        </div>

                        <Link to="/invoice" state={{order_item_id: order.order_item_id}} className="icon-btn h-11 w-11 text-rose-700 hover:text-rose-700" aria-label="View invoice">
                          <FaFileInvoice className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-state mt-6">
              <div className="empty-state-icon">
                <PackageSearch className="h-7 w-7" />
              </div>
              <h3 className="text-base font-semibold text-slate-900">No orders yet</h3>
              <p className="max-w-sm text-sm text-slate-500">Once you place an order, you'll be able to track it here.</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default Order;
