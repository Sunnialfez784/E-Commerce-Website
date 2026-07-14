import React from "react";
import logo from "../../../../SmartCartSystem/src/assets/Nav/shop5.jfif";
import {formatDate} from "../utils/format";
import {Phone, Mail} from "lucide-react";

function Invoice({invoice}) {
  if (!invoice) return null;

  return (
    <main className="w-full min-h-[84vh] bg-[#f7f7fb]">
      <div
        className="bg-white rounded-2xl overflow-hidden"
        style={{
          width: "1200px",
          minHeight: "auto",
        }}>
        <div className="border-b px-8 py-6">
          <div className="flex flex-col lg:flex-row justify-between gap-6">
            <div className="flex items-center gap-4">
              <img src={logo} alt="logo" className="h-14 w-14 shrink-0 rounded-2xl object-cover sm:h-16 sm:w-16" />

              <div className="flex flex-col justify-center">
                <h1 className="text-lg font-semibold leading-none tracking-tight text-slate-950 sm:text-xl">Novo Trends Retail Pvt. Ltd.</h1>

                <div className="mt-2 space-y-1">
                  <p className="flex items-center gap-2 text-sm text-slate-500">
                    <Phone className="h-4 w-4 shrink-0 flex-shrink-0 translate-y-[1px]" strokeWidth={2} />
                    <span className="text-lg">1800 208 9898</span>
                  </p>

                  <p className="flex items-center gap-2 text-sm text-slate-500">
                    <Mail className="h-4 w-4 shrink-0 flex-shrink-0 translate-y-[1px]" strokeWidth={2} />
                    <span className="text-lg">novotrends2@gmail.com</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="border-2 border-dashed border-gray-400 rounded-xl px-6 py-4 h-fit bg-gray-50">
              <p className="text-sm text-gray-500">Tax Invoice</p>

              <h1 className="text-lg font-semibold text-gray-800">#{invoice.invoiceId}</h1>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-8 py-6 border-b bg-gray-50">
          <div>
            <h1 className="mb-2 text-sm font-semibold text-slate-950">Order Details</h1>

            <p className="text-gray-700">
              <span className="font-medium text-slate-800">Order ID:</span> {invoice.order_item_id}
            </p>

            <p className="mt-1.5 text-sm leading-6 text-slate-600">
              <span className="font-medium text-slate-800">Sold By:</span> {invoice.seller_address}
            </p>
          </div>

          <div>
            <h1 className="mb-2 text-sm font-semibold text-slate-950">Billing Address</h1>

            <div className="text-sm leading-6 text-slate-600">
              <p>{invoice.buyer_address}</p>
              <p>{invoice.buyer_city}</p>
            </div>
          </div>

          <div>
            <h1 className="mb-2 text-sm font-semibold text-slate-950">Shipping Address</h1>

            <div className="text-sm leading-6 text-slate-600">
              <p>{invoice.buyer_address}</p>
              <p>{invoice.buyer_city}</p>
            </div>
          </div>
        </div>

        <div className="px-5 py-5 sm:px-8 sm:py-6">
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full min-w-[480px] border-collapse">
              <thead>
                <tr className="bg-slate-950 text-white">
                  <th className="rounded-tl-2xl px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-[0.12em]">Product</th>

                  <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-[0.12em]">Billing Date</th>

                  <th className="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-[0.12em]">Price</th>

                  <th className="rounded-tr-2xl px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-[0.12em]">Total</th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-b border-slate-200 transition hover:bg-slate-50">
                  <td className="px-4 py-4 font-medium text-slate-900">{invoice.productName}</td>

                  <td className="px-4 py-4 text-slate-500">{formatDate(invoice.bill_date)}</td>

                  <td className="px-4 py-4 text-center text-slate-500">₹{invoice.totalPrice}</td>

                  <td className="px-4 py-4 text-center font-semibold text-emerald-600">₹{invoice.totalPrice}</td>
                </tr>
              </tbody>
            </table>

            <div className="mt-6 flex justify-end">
              <div className="w-full max-w-xs rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:max-w-sm">
                <div className="flex justify-between border-b border-slate-200 pb-3">
                  <span className="text-slate-500">Subtotal</span>

                  <span className="font-medium text-slate-700">₹{invoice.totalPrice}</span>
                </div>

                <div className="flex justify-between pt-4">
                  <span className="text-lg font-semibold text-slate-950">Grand Total</span>

                  <span className="text-xl font-bold text-emerald-600">₹{invoice.totalPrice}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-950 py-4 text-center text-xl text-white">Thank you for shopping with Novo Trends ❤️</div>
      </div>
    </main>
  );
}

export default Invoice;
