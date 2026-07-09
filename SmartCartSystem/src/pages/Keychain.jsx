import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { BASE_URL } from "../apis";
import Cards from "../components/Cards";
import { useAuth } from "../context/AuthContext";
import {PackageSearch} from "lucide-react";

const Keychain = () => {
  const [keyChain, setKeyChain] = useState([]);
  const [loading, setLoading] = useState(false);
  const {token} = useAuth();

  const type = "keyChain";

  if (!type) return;

  useEffect(() => {
      setLoading(true);
  
      fetch(`${BASE_URL}/products/all-products-by-name?productType=keyChain`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then(({data}) => {
          setKeyChain(data || []);
        })
        .catch((err) => console.error(err))
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
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Keychain</h2>
              </div>
              {!loading && (
                <span className="premium-pill">{keyChain.length} {keyChain.length === 1 ? "product" : "products"}</span>
              )}
            </div>

            {loading ? (
              <Loader />
            ) : keyChain.length > 0 ? (
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {keyChain.map((item, i) => (
                  <Cards key={i} item={item} />
                ))}
              </div>
            ) : (
              <div className="empty-state mt-6">
                <div className="empty-state-icon">
                  <PackageSearch className="h-7 w-7" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">No keychains found</h3>
                <p className="max-w-sm text-sm text-slate-500">We couldn't find any products in this category right now. Please check back soon.</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
};

export default Keychain;
