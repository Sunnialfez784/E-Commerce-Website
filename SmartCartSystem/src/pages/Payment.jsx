import React from "react";
import Navbar from "../components/Navbar";
import {useLocation, useNavigate} from "react-router-dom";
import {BASE_URL} from "../apis";
import {useAuth} from "../context/AuthContext";
import {Banknote, ShieldCheck, Truck} from "lucide-react";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const subTotal = Number(location?.state?.subtotal || 0);

  const {token} = useAuth();

  const deliveryFee = 40;
  const totalAmount = subTotal + deliveryFee;

  const formatNumber = (num) => {
    return Number(num).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleOrder = async () => {
    try {
      console.log({
        price: Number(subTotal),
        payment: "COD",
      });

      const res = await fetch(`${BASE_URL}/orders/order-payment`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userOrderAmount: Math.round(totalAmount),
        }),
      });

      const data = await res.json();

      console.log(data);

      if (data.success) {
        alert("Order placed successfully");
        navigate("/orders");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  return (
    <>
      <main className="app-shell w-full text-black">
        <div className="page-shell flex justify-center py-6 lg:py-10">
          <div className="w-full max-w-md">
            <div className="section-surface p-6 sm:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Checkout</p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Payment Method</h1>

              <div className="mt-6 rounded-2xl border border-slate-950 bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-950 text-white">
                    <Banknote className="h-4 w-4" />
                  </span>
                  <div className="flex flex-1 items-center justify-between gap-3">
                    <h2 className="text-base font-semibold text-slate-950">Cash On Delivery</h2>
                    <input type="radio" checked readOnly className="h-4 w-4 text-slate-950 focus:ring-slate-950" />
                  </div>
                </div>
                <p className="mt-2.5 pl-12 text-sm text-slate-500">Pay when your order arrives at your doorstep.</p>
              </div>

              <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
                <h2 className="text-base font-semibold text-slate-950">Order Summary</h2>

                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal</span>
                    <span className="font-medium text-slate-900">₹{formatNumber(subTotal)}</span>
                  </div>

                  <div className="flex justify-between text-slate-500">
                    <span className="inline-flex items-center gap-1.5">
                      <Truck className="h-3.5 w-3.5" />
                      Delivery Fee
                    </span>
                    <span className="font-medium text-slate-900">₹{formatNumber(deliveryFee)}</span>
                  </div>
                </div>

                <div className="my-4 h-px bg-slate-200" />

                <div className="flex justify-between">
                  <span className="text-base font-semibold text-slate-950">Total</span>
                  <span className="text-xl font-bold tracking-tight text-slate-950">₹{formatNumber(totalAmount)}</span>
                </div>
              </div>

              <button onClick={handleOrder} className="premium-btn-primary mt-6 w-full py-3.5 text-base">
                Place Order
              </button>

              <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-slate-500">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                Secure checkout, protected order tracking
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Payment;
