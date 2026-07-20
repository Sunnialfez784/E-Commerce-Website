import React, {useContext, useEffect, useState} from "react";
import Navbar from "../components/Navbar";
import Cards from "../components/Cards";
import {BASE_URL} from "../apis";
import Loader from "../components/Loader";
import {useAuth} from "../context/AuthContext";
import {PackageSearch} from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import {toast} from "react-toastify";

const Furniture = () => {
  const [furniture, setFurniture] = useState([]);
  const [loading, setLoading] = useState(false);
  const {token} = useAuth();

  const type = "furniture";

  if (!type) return;

  useEffect(() => {
    setLoading(true);

    fetch(`${BASE_URL}/products/all-products-by-name?productType=furniture`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(({data}) => {
        setFurniture(data || []);
      })
      .catch((err) => toast.error(err))
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <>
      <main className="app-shell w-full text-black">
        <div className="page-shell py-6 lg:py-8">
          <section className="section-surface p-5 sm:p-6">
            <div className="flex items-end justify-between gap-4 border-b border-slate-200 pb-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Catalog</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Furniture</h2>
              </div>
              {!loading && (
                <span className="premium-pill">
                  {furniture.length} {furniture.length === 1 ? "product" : "products"}
                </span>
              )}
            </div>

            {loading ? (
              <Loader />
            ) : furniture.length > 0 ? (
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {furniture.map((item, i) => (
                  <Cards key={i} item={item} />
                ))}
              </div>
            ) : (
              <div className="empty-state mt-6">
                <div className="empty-state-icon">
                  <PackageSearch className="h-7 w-7" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">No furniture items found</h3>
                <p className="max-w-sm text-sm text-slate-500">We couldn't find any products in this category right now. Please check back soon.</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
};

export default Furniture;
