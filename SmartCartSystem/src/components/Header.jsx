import React, {useEffect, useState, useRef} from "react";
import Appsile from "../assets/Nav/shop5.jfif";
import {Link, useNavigate} from "react-router-dom";
import {useAuth} from "../context/AuthContext";
import {BASE_URL} from "../apis";
import {Search, ShoppingBag, UserRound, X} from "lucide-react";
import {FaJediOrder} from "react-icons/fa6";
import appsile2 from "../assets/Nav/shop6.png";
import {TiShoppingCart} from "react-icons/ti";

const Header = () => {
  const navigate = useNavigate();
  const {token, logout} = useAuth();
  const [allProducts, setAllProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [dropDown, setDropDown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const mobileDropdownRef = useRef(null);
  const desktopDropdownRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const desktopSearchRef = useRef(null);

  useEffect(() => {
    const refsContainTarget = (refs, target) => refs.some((ref) => ref.current && ref.current.contains(target));

    const handlePointerDown = (e) => {
      if (!refsContainTarget([mobileDropdownRef, desktopDropdownRef], e.target)) {
        setDropDown(false);
      }

      if (!refsContainTarget([mobileSearchRef, desktopSearchRef], e.target)) {
        setSearch("");
        setSearchOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setDropDown(false);
        setSearch("");
        setSearchOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };
        const [product] = await Promise.all([fetch(`${BASE_URL}/products/all-products`, {headers}).then((res) => res.json())]);
        setAllProducts([...(product?.data || [])]);
      } catch (error) {
        console.log("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const filteredProducts = search ? allProducts.filter((item) => item.productName?.toLowerCase().includes(search.toLowerCase())) : [];

  const handleLogout = async () => {
    setLoading(true);
    try {
      if (!token) {
        navigate("/login");
        return;
      }

      await fetch(`${BASE_URL}/users/logout-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.log(err);
    } finally {
      localStorage.removeItem("accessToken");
      logout();
      setLoading(false);
      navigate("/login");
    }
  };

  const closeSearch = () => {
    setSearch("");
    setSearchOpen(false);
  };

  const accountMenu = (
    <ul className="px-1 pb-1 text-sm font-medium text-slate-700">
      <li>
        <Link to="/profile" className="inline-flex w-full cursor-pointer items-center rounded-2xl p-3 transition hover:bg-slate-50" onClick={() => setDropDown(false)}>
          <svg className="w-4 h-4 me-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeWidth="2" d="M7 17v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3Zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
          Account
        </Link>
      </li>
      <li>
        <Link to="/orders" className="inline-flex w-full cursor-pointer items-center rounded-2xl p-3 transition hover:bg-slate-50" onClick={() => setDropDown(false)}>
          <FaJediOrder className="w-4 h-4 me-1.5" />
          Orders
        </Link>
      </li>
      <li>
        <Link to="/addtocard" className="inline-flex w-full cursor-pointer items-center rounded-2xl p-3 transition hover:bg-slate-50" aria-label="Cart">
          <TiShoppingCart className="h-4 w-4 me-2" /> Card
        </Link>
      </li>
      <li>
        <Link to="/about" className="inline-flex w-full cursor-pointer items-center rounded-2xl p-3 transition hover:bg-slate-50" aria-label="About">
          <ShoppingBag className="h-4 w-4 me-2" /> About
        </Link>
      </li>
      <li>
        <button type="button" onClick={handleLogout} className="inline-flex w-full cursor-pointer items-center rounded-2xl p-3 text-rose-600 transition hover:bg-rose-50">
          <svg className="w-4 h-4 me-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H8m12 0-4 4m4-4-4-4M9 4H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h2" />
          </svg>
          Sign out
        </button>
      </li>
    </ul>
  );

  const productResults = (onSelect) =>
    filteredProducts.length > 0 ? (
      filteredProducts.map((item) => (
        <Link key={item._id} to={`/details/${item._id}`} state={item} onClick={onSelect}>
          <div className="flex cursor-pointer items-center gap-3 rounded-2xl p-3 transition hover:bg-slate-50">
            <img src={item.productImage} alt={item.productName} className="h-12 w-12 rounded-xl border border-slate-200 object-contain bg-white" />
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-sm font-semibold text-slate-900">{item.productName}</h2>
              <p className="text-sm text-slate-500">₹{Number(item.productPrice).toLocaleString("en-IN")}</p>
            </div>
          </div>
        </Link>
      ))
    ) : (
      <p className="p-4 text-sm text-slate-500">No product found</p>
    );

  return (
    <div className="w-full space-y-3 sm:space-y-4">
      <div className="flex items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-3 text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
          <img src={Appsile} alt="Novo Trends" className="hidden md:block h-12 w-auto object-contain" />

          <img src={appsile2} alt="Novo Trends" className="md:hidden h-12 w-auto object-contain" />

          <div>
            <div className="hidden md:block">Novo Trends</div>
            <p className="hidden sm:block text-xs font-medium uppercase tracking-[0.24em] text-slate-500">Premium shopping experience</p>
          </div>
        </Link>

        <div className="relative z-50 flex items-center gap-2 overflow-visible lg:hidden">
          <button type="button" onClick={() => setSearchOpen((prev) => !prev)} className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:text-slate-900" aria-label="Toggle search" aria-expanded={searchOpen} aria-haspopup="dialog">
            {searchOpen ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
          </button>

          <div ref={mobileDropdownRef} className="relative z-50 flex items-center overflow-visible">
            <button type="button" onClick={() => setDropDown((prev) => !prev)} className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:text-slate-900" aria-label="Account" aria-expanded={dropDown} aria-haspopup="menu">
              <UserRound className="h-4 w-4" />
            </button>
            {dropDown && <div className="absolute right-0 top-12 z-[60] w-64 rounded-3xl border border-slate-200 bg-white/95 p-2 shadow-2xl shadow-slate-900/10 backdrop-blur pointer-events-auto">{accountMenu}</div>}
          </div>
        </div>
      </div>

      {searchOpen && (
        <div ref={mobileSearchRef} className="relative w-full lg:hidden">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            autoFocus
            type="text"
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") closeSearch();
            }}
            className="premium-input pl-11 pr-4"
            aria-label="Search products"
          />
          {search && <div className="absolute z-50 mt-3 w-full max-h-72 overflow-y-auto rounded-3xl border border-slate-200 bg-white/95 p-2 shadow-2xl shadow-slate-900/10 backdrop-blur">{productResults(closeSearch)}</div>}
        </div>
      )}

      <div className="hidden lg:flex lg:items-center lg:gap-3">
        <div ref={desktopSearchRef} className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            id="ghjkhj"
            type="text"
            placeholder="Search products, brands, categories"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setSearch("");
            }}
            className="premium-input pl-11 pr-4"
            aria-label="Search products"
          />
          {search && <div className="absolute z-50 mt-3 w-full max-h-72 overflow-y-auto rounded-3xl border border-slate-200 bg-white/95 p-2 shadow-2xl shadow-slate-900/10 backdrop-blur">{productResults(() => setSearch(""))}</div>}
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <div ref={desktopDropdownRef} className="relative flex items-center">
            <button type="button" onClick={() => setDropDown((prev) => !prev)} className="premium-btn-secondary min-w-[112px] px-4 py-3" aria-expanded={dropDown} aria-haspopup="menu">
              <UserRound className="h-5 w-5" />
              Account
            </button>
            {dropDown && <div className="absolute right-0 top-12 z-10 mt-2 w-72 rounded-3xl border border-slate-200 bg-white/95 p-2 shadow-2xl shadow-slate-900/10 backdrop-blur">{accountMenu}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
