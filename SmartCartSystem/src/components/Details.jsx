import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import {useAuth} from "../context/AuthContext";
import Navbar from "./Navbar";
import {BASE_URL} from "../apis";
import Loader from "./Loader";
import {Heart, Minus, Plus, ShieldCheck, ShoppingBag, Star, Truck} from "lucide-react";
import Cards from "./Cards";
import "react-toastify/dist/ReactToastify.css";
import {ToastContainer, toast} from "react-toastify";

const Details = () => {
  const {state} = useLocation();
  const [loading, setLoading] = useState(false);
  const {addBtn, minusBtn, getQuantity, token} = useAuth();
  const [relatedProducts, setRelatedProducts] = useState([]);

  if (!state) {
    return <h1 className="p-10 text-center text-lg font-semibold text-slate-700">No Product Found</h1>;
  }

  const count = getQuantity(state.product_id);

  const formatNumber = (num) => Number(num).toLocaleString("en-IN", {minimumFractionDigits: 2, maximumFractionDigits: 2});

  const addToCart = async () => {
    const latestQuantity = Number(getQuantity(state.product_id));
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/carts/add-product-to-cart`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({product_id: state.product_id, quantity: latestQuantity}),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Product added successfully, Go to the cart Item!");
      } else {
        toast.error(data.errors[0]);
      }
    } catch (error) {
      toast.error("Product not added");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        let url = "";

        if (state.productType === "shoes") {
          url = `${BASE_URL}/products/all-products-by-name?productType=shoes`;
        } else if (state.productType === "cars") {
          url = `${BASE_URL}/products/all-products-by-name?productType=cars`;
        } else if (state.productType === "mobiles") {
          url = `${BASE_URL}/products/all-products-by-name?productType=mobiles`;
        } else if (state.productType === "beauty") {
          url = `${BASE_URL}/products/all-products-by-name?productType=beauty`;
        } else if (state.productType === "bikes") {
          url = `${BASE_URL}/products/all-products-by-name?productType=bikes`;
        } else if (state.productType === "camera") {
          url = `${BASE_URL}/products/all-products-by-name?productType=camera`;
        } else if (state.productType === "fashion") {
          url = `${BASE_URL}/products/all-products-by-name?productType=fashion`;
        } else if (state.productType === "furniture") {
          url = `${BASE_URL}/products/all-products-by-name?productType=furniture`;
        } else if (state.productType === "headset") {
          url = `${BASE_URL}/products/all-products-by-name?productType=headset`;
        } else if (state.productType === "instrument") {
          url = `${BASE_URL}/products/all-products-by-name?productType=instrument`;
        } else if (state.productType === "keychain") {
          url = `${BASE_URL}/products/all-products-by-name?productType=keyChain`;
        } else if (state.productType === "laptops") {
          url = `${BASE_URL}/products/all-products-by-name?productType=laptops`;
        } else if (state.productType === "speaker") {
          url = `${BASE_URL}/products/all-products-by-name?productType=speaker`;
        } else if (state.productType === "sports") {
          url = `${BASE_URL}/products/all-products-by-name?productType=sports`;
        } else if (state.productType === "toys") {
          url = `${BASE_URL}/products/all-products-by-name?productType=toys`;
        } else if (state.productType === "watch") {
          url = `${BASE_URL}/products/all-products-by-name?productType=watch`;
        } else if (state.productType === "speaker") {
          url = `${BASE_URL}/products/all-products-by-name?productType=speaker`;
        } else if (state.productType === "instrument") {
          url = `${BASE_URL}/products/all-products-by-name?productType=instrument`;
        } else if (state.productType === "beauty") {
          url = `${BASE_URL}/products/all-products-by-name?productType=beauty`;
        } else if (state.productType === "books") {
          url = `${BASE_URL}/products/all-products-by-name?productType=books`;
        }

        console.log("PRODUCT TYPE =>", state.productType);
        console.log("API URL =>", url);

        const res = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();

        console.log("RELATED API RESPONSE =>", data);

        if (data.success) {
          const products = data.products || data.data || [];

          const related = products.filter((product) => product.product_id !== state.product_id);

          console.log("FILTERED PRODUCTS =>", related);

          setRelatedProducts(related);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchRelatedProducts();
  }, [state]);

  return (
    <>
      <Navbar />
      <main className="app-shell">
        <ToastContainer position="top-center" autoClose={2500} hideProgressBar={false} closeOnClick pauseOnHover={false} pauseOnFocusLoss={false} draggable newestOnTop />
        {loading ? (
          <Loader />
        ) : (
          <div className="page-shell py-6 lg:py-10">
            <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8">
              <section className="section-surface p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col gap-4 xl:flex-row xl:gap-6">
                  <div className="flex gap-2 overflow-x-auto pb-1 xl:flex-col xl:overflow-visible xl:pb-0 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
                    {[state.productImage, state.productImage, state.productImage].map((image, index) => (
                      <div key={index} className="flex h-16 w-16 shrink-0 cursor-pointer items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-2 shadow-sm transition hover:border-slate-300 sm:h-20 sm:w-20">
                        <img src={image} alt={state.productName} className="h-full w-full object-contain" />
                      </div>
                    ))}
                  </div>

                  <div className="relative flex-1 overflow-hidden rounded-[28px] bg-gradient-to-br from-slate-50 via-white to-amber-50 p-5 shadow-inner sm:p-8">
                    <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm backdrop-blur">
                      <ShieldCheck className="h-4 w-4 text-emerald-500" />
                      Verified listing
                    </div>
                    <img src={state.productImage} alt="Product" className="mx-auto max-h-[280px] w-full object-contain transition duration-500 hover:scale-[1.03] sm:max-h-[380px] lg:max-h-[440px]" />
                  </div>
                </div>
              </section>

              <aside className="section-surface h-fit p-5 sm:p-6 lg:sticky lg:top-28 lg:p-8">
                <div className="space-y-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="premium-pill">Premium pick</span>
                    <span className="premium-pill">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      4.8 rating
                    </span>
                    <span className="premium-pill">In stock</span>
                  </div>

                  <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl lg:text-4xl">{state.productName}</h1>
                    <p className="mt-3 text-sm leading-7 text-slate-500">{state.productDetails}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    <div className="stat-card">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 sm:text-[11px]">Price</p>
                      <p className="mt-1 text-base font-semibold text-slate-950 sm:text-lg">₹{formatNumber(state.productPrice)}</p>
                    </div>
                    <div className="stat-card">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 sm:text-[11px]">Qty</p>
                      <p className="mt-1 text-base font-semibold text-slate-950 sm:text-lg">{count}</p>
                    </div>
                    <div className="stat-card">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 sm:text-[11px]">Total</p>
                      <p className="mt-1 text-base font-semibold text-slate-950 sm:text-lg">₹{formatNumber(state.productPrice * count)}</p>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Quantity</p>
                        <p className="text-sm text-slate-500">Adjust before checkout.</p>
                      </div>
                      <div className="flex items-center rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">
                        <button onClick={() => minusBtn(state.product_id)} className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-700 hover:bg-slate-100" aria-label="Decrease">
                          <Minus className="h-4 w-4" />
                        </button>
                        <div className="min-w-10 px-3 text-center text-lg font-semibold text-slate-950">{count}</div>
                        <button onClick={() => addBtn(state.product_id)} className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-700 hover:bg-slate-100" aria-label="Increase">
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button onClick={addToCart} className="premium-btn-primary flex-1 py-4 text-base">
                      <ShoppingBag className="h-5 w-5" />
                      Add to Cart
                    </button>
                    <button type="button" className="premium-btn-secondary flex-1 py-4 text-base">
                      <Heart className="h-5 w-5" />
                      Save
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                      <Truck className="h-5 w-5 shrink-0 text-slate-500" />
                      <div>
                        <p className="text-sm font-semibold text-slate-950">Fast delivery</p>
                        <p className="text-xs text-slate-500">Ships in 2–4 days.</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                      <ShieldCheck className="h-5 w-5 shrink-0 text-slate-500" />
                      <div>
                        <p className="text-sm font-semibold text-slate-950">Secure checkout</p>
                        <p className="text-xs text-slate-500">Protected payment.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        )}
      </main>
      <div className="w-full max-w-[1360px] mx-auto px-5 lg:px-8 py-10">
        <h2 className="mb-6 text-2xl font-bold text-slate-950">Related Products</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((item) => (
            <Cards key={item.product_id} item={item} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Details;
