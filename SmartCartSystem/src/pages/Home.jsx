import React, {useEffect, useState} from "react";
import Navbar from "../components/Navbar";
import Cards from "../components/Cards";

import Laptop1 from "../assets/Home/l1.png";
import Phone1 from "../assets/Home/m1.png";
import Car1 from "../assets/Home/c1.png";
import Bike1 from "../assets/Home/b1.png";
import watch1 from "../assets/Images/w1.png";
import haedPhones1 from "../assets/Images/h1.png";
import mivi1 from "../assets/Images/mivi1.png";
import shoes1 from "../assets/Images/shoes1.png";
import instrument1 from "../assets/Images/instrument1.png";
import fashion from "../assets/Images/fashion.png";
import kids from "../assets/Images/kids.webp";
import sports from "../assets/Images/sports.webp";
import furniture from "../assets/Images/furniture.webp";
import camera from "../assets/Images/camera.webp";
import keychain from "../assets/Images/keychain.webp";
import speaker from "../assets/Images/speaker.webp";
import beauty from "../assets/Images/beauty.webp";
import books from "../assets/Images/books.webp";
import {PackageSearch, ChevronLeft, ChevronRight} from "lucide-react";

import {BASE_URL} from "../apis";
import Loader from "../components/Loader";
import {useAuth} from "../context/AuthContext";
import {data, Link} from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import {ToastContainer, toast} from "react-toastify";

const Home = () => {
  const sliderItems = [
    {
      image: Car1,
      route: "/cars",
    },
    {
      image: Bike1,
      route: "/bikes",
    },
    {
      image: Laptop1,
      route: "/laptops",
    },
    {
      image: Phone1,
      route: "/mobiles",
    },
    {
      image: fashion,
      route: "/fashion",
    },
    {
      image: kids,
      route: "/kids",
    },
    {
      image: sports,
      route: "/sports",
    },
    {
      image: furniture,
      route: "/furniture",
    },
    {
      image: keychain,
      route: "/keychain",
    },
    {
      image: camera,
      route: "/camera",
    },
    {
      image: haedPhones1,
      route: "/headphones",
    },
    {
      image: shoes1,
      route: "/shoes",
    },
    {
      image: watch1,
      route: "/watches",
    },
    {
      image: speaker,
      route: "/speaker",
    },
    {
      image: instrument1,
      route: "/instruments",
    },
    {
      image: beauty,
      route: "/beauty",
    },
    {
      image: books,
      route: "/books",
    },
  ];
  const {token} = useAuth();

  const [currentIndex, setCurrentIndex] = useState(0);
  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + sliderItems.length) % sliderItems.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % sliderItems.length);
  };
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetch(`${BASE_URL}/products/all-products`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setProduct(result.data || []);
      })
      .catch((err) => {
        toast.error(err);
        setProduct([]);
      })
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sliderItems.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <>
      <Navbar isButton />

      <main className="app-shell w-full text-black">
        <ToastContainer position="top-center" autoClose={2500} />
        <div className="page-shell py-6 lg:py-8">
          <section className="section-surface overflow-hidden px-5 py-8 sm:px-8 sm:py-10">
            <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="flex flex-col justify-center">
                <div className="premium-pill mb-4 self-start">Premium shopping destination</div>
                <h1 className="text-3xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">India's Smart Hub</h1>
                <h1 className="mt-1 text-3xl font-semibold leading-tight tracking-tight text-slate-600 sm:text-4xl lg:text-5xl">for Tech &amp; Vehicles</h1>
                <p className="mt-4 max-w-xl text-base leading-7 text-slate-500">A premium storefront for products, accessories, and essentials with a cleaner, more professional shopping experience.</p>
                <Link to={sliderItems[currentIndex].route} className="premium-btn-primary mt-6 self-start px-6 py-3.5 text-base">
                  Shop Now
                </Link>
              </div>

              <div className="flex items-center justify-center">
                <div className="relative w-full max-w-xl rounded-[30px] bg-gradient-to-br from-white to-slate-100 p-4 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.45)]">
                  <div className="absolute left-5 top-5 z-10 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm backdrop-blur">New arrivals</div>

                  <img src={sliderItems[currentIndex].image} alt={sliderItems[currentIndex].category} className="h-[220px] w-full object-contain transition duration-500 ease-in-out hover:scale-[1.02] sm:h-[320px] lg:h-[380px]" />

                  <button onClick={goToPrev} aria-label="Previous slide" className="absolute left-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-600 shadow-sm backdrop-blur transition hover:bg-white hover:text-slate-900 sm:h-9 sm:w-9">
                    <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>

                  <button onClick={goToNext} aria-label="Next slide" className="absolute right-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-600 shadow-sm backdrop-blur transition hover:bg-white hover:text-slate-900 sm:h-9 sm:w-9">
                    <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>

                  <div className="mt-3 flex items-center justify-center gap-1.5">
                    {sliderItems.map((_, i) => (
                      <button key={i} onClick={() => setCurrentIndex(i)} className={`shrink-0 appearance-none border-0 bg-transparent p-0 outline-none rounded-full transition-all duration-300 h-1 w-1 sm:h-1.5 sm:w-1.5 ${i === currentIndex ? "w-4 sm:w-6 bg-slate-950" : "bg-slate-300"}`} aria-label={`Go to slide ${i + 1}`} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="section-surface mt-6 p-5 sm:p-6">
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Catalog</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">All Products</h2>
              </div>
              {!loading && product.length > 0 && <span className="premium-pill">{product.length} products</span>}
            </div>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {loading ? (
                <div className="col-span-full flex justify-center">
                  <Loader />
                </div>
              ) : product.length > 0 ? (
                product.map((item) => <Cards key={item.product_id} item={item} isHome />)
              ) : (
                <div className="col-span-full">
                  <div className="mt-6 flex min-h-[320px] w-full flex-col items-center justify-center rounded-[32px] border border-dashed border-slate-200 bg-slate-50 px-6 text-center">
                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm">
                      <PackageSearch className="h-9 w-9 text-slate-500" />
                    </div>

                    <h3 className="text-3xl font-semibold text-slate-900">No Product found</h3>

                    <p className="mt-4 max-w-md text-lg leading-8 text-slate-500">We couldn't find any products in this category right now. Please check back soon.</p>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default Home;
