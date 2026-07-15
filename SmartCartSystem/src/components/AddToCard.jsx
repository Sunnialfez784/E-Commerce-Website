import React, {useEffect, useState} from "react";
import {TrashIcon} from "@heroicons/react/24/solid";
import Navbar from "./Navbar";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {useAuth} from "../context/AuthContext";
import {BASE_URL} from "../apis";
import BillingDetails from "../pages/BillingDetails";
import Loader from "./Loader";
import {Minus, Plus, ShieldCheck, ShoppingBag, Truck} from "lucide-react";

const AddToCard = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const {state} = useLocation();
  const {token, addBtn, minusBtn, getQuantity, setCartQuantity} = useAuth();

  useEffect(() => {
    setLoading(true);
    fetch(`${BASE_URL}/carts/all-cart-item`, {
      method: "GET",
      headers: {Authorization: `Bearer ${token}`},
    })
      .then((res) => res.json())
      .then((res) => {
        const updatedProducts = (res.data || []).map((item) => {
          const currentQty = getQuantity(item.product_id);
          if (!currentQty || currentQty === 1) {
            setCartQuantity(item.product_id, item.itemQuantity ?? item.quantity ?? 1);
          }
          return {...item, checked: false};
        });
        setProducts(updatedProducts);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [token]);

  const handleCheckbox = (id) => {
    setProducts(products.map((item) => (item.cart_item_id === id ? {...item, checked: !item.checked} : item)));
  };

  const subtotal = products.reduce((acc, item) => {
    if (item.checked) {
      const singlePrice = Number(item.itemPrice) / Number(item.itemQuantity || item.quantity || 1);
      return acc + singlePrice * getQuantity(item.product_id);
    }
    return acc;
  }, 0);

  const checkOut = async () => {
    setLoading(true);
    try {
      const productIds = products.filter((p) => p.checked).map((p) => p.product_id);
      const quantities = products.filter((p) => p.checked).map((p) => Number(getQuantity(p.product_id)));

      if (productIds.length === 0) {
        alert("Please select at least one product");
        return;
      }

      if (paymentMethod === "COD") {
        await fetch(`${BASE_URL}/orders/order-items`, {
          method: "POST",
          headers: {Authorization: `Bearer ${token}`, "Content-Type": "application/json"},
          body: JSON.stringify({productIds, quantity: quantities, paymentMethod: "COD"}),
        });
        navigate("/payment", {state: {paymentMethod: "COD", subtotal}});
        return;
      }

      const orderRes = await fetch(`${BASE_URL}/orders/create-order`, {
        method: "POST",
        headers: {Authorization: `Bearer ${token}`, "Content-Type": "application/json"},
        body: JSON.stringify({productIds, quantity: quantities, userAmount: Math.round(subtotal + 40)}),
      });
      const orderData = await orderRes.json();

      if (!orderData.success) { alert(orderData.message); return; }

      const razorpayOrder = orderData.data.order;
      if (!window.Razorpay) { alert("Razorpay SDK failed to load"); return; }

      const options = {
        key: "rzp_test_SsOcmRDBPuYc8e",
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        order_id: razorpayOrder.id,
        name: "Novo Trends",
        description: "Pay by any UPI",
        handler: async function (response) {
          if (!response.razorpay_order_id || !response.razorpay_payment_id || !response.razorpay_signature) {
            alert("Payment verification data missing"); return;
          }
          try {
            const verifyRes = await fetch(`${BASE_URL}/orders/verify-payment`, {
              method: "POST",
              headers: {Authorization: `Bearer ${token}`, "Content-Type": "application/json"},
              body: JSON.stringify({
                amount: razorpayOrder.amount,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                productIds, quantity: quantities,
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              navigate("/orders", {state: {paymentMethod: "RAZORPAY", total: subtotal + 40}});
            } else {
              alert(verifyData.message || "Payment verification failed");
            }
          } catch (error) { console.log(error); }
        },
        theme: {color: "#000000"},
      };
      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/carts/delete-cart-item/${id}`, {
        method: "DELETE",
        headers: {Authorization: `Bearer ${token}`},
      });
      const result = await res.json();
      if (result.success) setProducts(products.filter((item) => item.cart_item_id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) =>
    Number(num).toLocaleString("en-IN", {minimumFractionDigits: 2, maximumFractionDigits: 2});

  return (
    <>
      <Navbar />
      <main className="app-shell w-full text-black">
        <div className="page-shell py-6 lg:py-10">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Checkout</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">Your Cart</h1>
          </div>

          <BillingDetails />

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
            {/* Cart items */}
            <section className="section-surface p-4 sm:p-6">
              <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <h2 className="text-xl font-semibold tracking-tight text-slate-950">Cart Items</h2>
                {!loading && products.length > 0 && (
                  <span className="premium-pill">{products.length} {products.length === 1 ? "item" : "items"}</span>
                )}
              </div>

              {loading ? (
                <Loader />
              ) : (
                <div className="mt-4 max-h-[560px] overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-slate-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300">
                  {products.length > 0 ? (
                    <div className="flex flex-col gap-3">
                      {products.map((item) => (
                        <div
                          key={item.cart_item_id}
                          className="rounded-2xl border border-slate-200 bg-white p-4 transition duration-200 hover:border-slate-300 hover:shadow-[0_8px_20px_-10px_rgba(15,23,42,0.2)]"
                        >
                          {/* Top row: checkbox + image + name */}
                          <div className="flex items-start gap-3">
                            <input
                              type="checkbox"
                              className="mt-1 h-4 w-4 shrink-0 rounded border-slate-300 text-slate-950 focus:ring-slate-950"
                              checked={item.checked}
                              onChange={() => handleCheckbox(item.cart_item_id)}
                            />
                            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-2 sm:h-24 sm:w-24">
                              <img src={item.itemImage} alt={item.itemName} className="h-full w-full object-contain" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="text-sm font-semibold text-slate-950 sm:text-base line-clamp-2">{item.itemName}</h3>
                              <p className="mt-1 text-sm text-slate-500 line-clamp-1">{item.productDetails}</p>
                              <p className="mt-2 text-lg font-bold tracking-tight text-slate-950">
                                ₹{formatNumber((Number(item.itemPrice) / Number(item.itemQuantity || item.quantity || 1)) * getQuantity(item.product_id))}
                              </p>
                            </div>
                          </div>

                          {/* Bottom row: qty + delete */}
                          <div className="mt-3 flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
                            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1 shadow-sm">
                              <button onClick={() => minusBtn(item.product_id)} className="flex h-8 w-8 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100" aria-label="Decrease">
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="min-w-[1.5rem] text-center text-sm font-semibold text-slate-950">{getQuantity(item.product_id)}</span>
                              <button onClick={() => addBtn(item.product_id)} className="flex h-8 w-8 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100" aria-label="Increase">
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>

                            <button onClick={() => deleteProduct(item.cart_item_id)} className="icon-btn" aria-label="Remove item">
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state mt-4">
                      <div className="empty-state-icon">
                        <ShoppingBag className="h-7 w-7" />
                      </div>
                      <h3 className="text-base font-semibold text-slate-900">Your cart is empty</h3>
                      <p className="max-w-sm text-sm text-slate-500">Explore the catalog to find something you'll love.</p>
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* Order summary */}
            <aside className="h-fit lg:sticky lg:top-28">
              <div className="section-surface p-5 sm:p-6">
                <h2 className="text-xl font-semibold tracking-tight text-slate-950">Order Summary</h2>

                <div className="mt-5 space-y-3 border-b border-slate-200 pb-5 text-sm">
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Subtotal</span>
                    <span className="font-medium text-slate-900">₹{formatNumber(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="inline-flex items-center gap-1.5">
                      <Truck className="h-3.5 w-3.5" />
                      Delivery
                    </span>
                    <span className="font-medium text-slate-900">₹40.00</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-5">
                  <span className="text-base font-semibold text-slate-950">Total</span>
                  <span className="text-2xl font-bold tracking-tight text-slate-950">
                    ₹{formatNumber(subtotal > 0 ? subtotal + 40 : 0)}
                  </span>
                </div>

                <div className="mt-6">
                  <p className="premium-label">Payment method</p>
                  <div className="space-y-2.5">
                    <label className={`premium-radio-tile ${paymentMethod === "COD" ? "is-active" : ""}`}>
                      <input type="radio" value="COD" checked={paymentMethod === "COD"} onChange={(e) => setPaymentMethod(e.target.value)} className="h-4 w-4 text-slate-950 focus:ring-slate-950" />
                      <span className="text-sm font-medium text-slate-800">Cash On Delivery</span>
                    </label>
                    <label className={`premium-radio-tile ${paymentMethod === "RAZORPAY" ? "is-active" : ""}`}>
                      <input type="radio" value="RAZORPAY" checked={paymentMethod === "RAZORPAY"} onChange={(e) => setPaymentMethod(e.target.value)} className="h-4 w-4 text-slate-950 focus:ring-slate-950" />
                      <span className="text-sm font-medium text-slate-800">Razorpay</span>
                    </label>
                  </div>
                </div>

                <button onClick={checkOut} disabled={subtotal === 0} className="premium-btn-primary mt-6 w-full py-3.5 text-base">
                  <ShoppingBag className="h-4 w-4" />
                  Go To Checkout
                </button>

                <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-slate-500">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                  Cash on Delivery Available
                </p>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
};

export default AddToCard;
