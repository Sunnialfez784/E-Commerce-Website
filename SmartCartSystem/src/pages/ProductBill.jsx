import React, {useEffect, useState} from "react";
import Navbar from "../components/Navbar";
import logo from "../assets/Nav/shop5.jfif";
import {BASE_URL} from "../apis";
import {useAuth} from "../context/AuthContext";
import {useLocation} from "react-router-dom";
import {Phone, Mail, Printer} from "lucide-react";

const ProductBill = () => {
  const [bill, setBill] = useState(null);
  const {token} = useAuth();
  const {state} = useLocation();
  const order_item_id = state?.order_item_id;

  useEffect(() => {
    if (!order_item_id) return;
    const Invoice = async () => {
      try {
        const res = await fetch(`${BASE_URL}/orders/order-bill`, {
          method: "POST",
          headers: {Authorization: `Bearer ${token}`, "Content-Type": "application/json"},
          body: JSON.stringify({order_item_id}),
        });
        const data = await res.json();
        setBill(data.data || []);
      } catch (error) {
        console.log("Error:", error);
      }
    };
    Invoice();
  }, [token, order_item_id]);

  return (
    <>
      <Navbar />
      <main className="app-shell w-full">
        <div className="page-shell py-6 lg:py-10">
          {bill && (
            <div className="section-surface overflow-hidden">

              <div className="border-b border-slate-200 px-5 py-6 sm:px-8 sm:py-7">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-center gap-4">
                    <img src={logo} alt="logo" className="h-14 w-14 rounded-2xl object-cover sm:h-16 sm:w-16" />
                    <div>
                      <h1 className="text-lg font-semibold tracking-tight text-slate-950 sm:text-xl">Novo Trends Retail Pvt. Ltd.</h1>
                      
                      <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                        <Phone className="h-3.5 w-3.5 shrink-0" />
                        1800 208 9898
                      </p>
                      <p className="flex items-center gap-1.5 text-sm text-slate-500">
                        <Mail className="h-3.5 w-3.5 shrink-0" />
                        cs@novotrends.com
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Tax Invoice</p>
                      <h2 className="text-lg font-semibold text-slate-950">#{bill.invoiceId}</h2>
                    </div>
                    <button
                      onClick={() => window.print()}
                      className="icon-btn"
                      aria-label="Print invoice"
                    >
                      <Printer className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 border-b border-slate-200 bg-slate-50 px-5 py-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-3">
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-slate-950">Order Details</h3>
                  <p className="text-sm text-slate-600">
                    <span className="font-medium text-slate-800">Order ID:</span> {bill.order_item_id}
                  </p>
                  <p className="mt-1.5 text-sm leading-6 text-slate-600">
                    <span className="font-medium text-slate-800">Sold By:</span> {bill.seller_address}
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-slate-950">Billing Address</h3>
                  <div className="text-sm leading-6 text-slate-600">
                    <p>{bill.buyer_address}</p>
                    <p>{bill.buyer_city}</p>
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-slate-950">Shipping Address</h3>
                  <div className="text-sm leading-6 text-slate-600">
                    <p>{bill.buyer_address}</p>
                    <p>{bill.buyer_city}</p>
                  </div>
                </div>
              </div>

              <div className="px-5 py-5 sm:px-8 sm:py-6">
                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="w-full min-w-[480px] border-collapse">
                    <thead>
                      <tr className="bg-slate-950 text-white">
                        <th className="rounded-tl-2xl px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-[0.12em]">Product</th>
                        <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-[0.12em]">Date</th>
                        <th className="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-[0.12em]">Price</th>
                        <th className="rounded-tr-2xl px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-[0.12em]">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-200 transition hover:bg-slate-50">
                        <td className="px-4 py-4 font-medium text-slate-900">{bill.productName}</td>
                        <td className="px-4 py-4 text-slate-500">{bill.bill_date}</td>
                        <td className="px-4 py-4 text-center text-slate-500">₹{bill.totalPrice}</td>
                        <td className="px-4 py-4 text-center font-semibold text-emerald-600">₹{bill.totalPrice}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 flex justify-end">
                  <div className="w-full max-w-xs rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:max-w-sm">
                    <div className="flex justify-between border-b border-slate-200 pb-3">
                      <span className="text-slate-500">Subtotal</span>
                      <span className="font-medium text-slate-700">₹{bill.totalPrice}</span>
                    </div>
                    <div className="flex justify-between pt-4">
                      <span className="text-lg font-semibold text-slate-950">Grand Total</span>
                      <span className="text-xl font-bold text-emerald-600">₹{bill.totalPrice}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 py-4 text-center text-sm text-white">
                Thank you for shopping with Novo Trends ❤️
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default ProductBill;
