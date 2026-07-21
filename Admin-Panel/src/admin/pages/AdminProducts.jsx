import {useCallback, useEffect, useMemo, useState} from "react";
import {Card, CardBody} from "@windmill/react-ui";
import AdminPageHeader from "../components/AdminPageHeader";
import AdminPagination from "../components/AdminPagination";
import AdminStateView from "../components/AdminStateView";
import useAdminResource from "../hooks/useAdminResource";
import {adminApi} from "../services/adminApi";
import {formatCurrency, getStatusTone} from "../utils/format";
import {useAdminToast} from "../context/AdminToastContext";
import {AddIcon, EditIcon, TrashIcon, SearchIcon, GridViewIcon, ListViewIcon, PublishIcon, EyeIcon} from "../../icons";
import {adminCardClass, adminInputClass, adminPrimaryButtonClass, adminGhostButtonClass} from "../utils/theme";
import {products} from "../data/mockAdminData";

const categories = ["all", "cars", "bikes", "laptops", "mobiles", "fashion", "toys", "sports", "furniture", "keychain", "camera", "headset", "shoes", "watch", "speaker", "instrument", "beauty", "books"];

function createId() {
  return `PRD-${Math.floor(1000 + Math.random() * 9000)}`;
}

function AdminProducts({searchTerm = ""}) {
  const accessToken = localStorage.getItem("accessToken") || "";

  const fetchOrders = useCallback(() => {
    return adminApi.getProducts(accessToken);
  }, [accessToken]);

  const {data, loading, error, reload} = useAdminResource(fetchOrders);
  const [items, setItems] = useState(null);
  const [search, setSearch] = useState(searchTerm);
  const [category, setCategory] = useState("All");
  const [view, setView] = useState("grid");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setSearch(searchTerm);
    setPage(1);
  }, [searchTerm]);
  const [editingId, setEditingId] = useState(null);
  const [preview, setPreview] = useState("");
  const [form, setForm] = useState({
    productName: "",
    productType: "cars",
    productPrice: "",
    productStock: "",
    productDetails: "",
    productAddress: "",
    imageFile: null,
  });
  const {showToast} = useAdminToast();
  const pageSize = 6;

  const sourceItems = useMemo(() => items ?? data ?? [], [items, data]);

  const filtered = useMemo(() => {
    const query = search.toLowerCase();

    return sourceItems.filter((product) => {
      const matchesSearch = [product.id, product.productName, product.productType].some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(query),
      );

      const matchesCategory = category === "All" || product.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [sourceItems, search, category]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  function updateField(name, value) {
    setForm((current) => ({...current, [name]: value}));
  }

  function handleFile(e) {
    console.log("handleFile Called");

    const file = e.target.files?.[0];

    console.log("Selected File =", file);

    if (!file) return;

    setForm((prev) => ({
      ...prev,
      imageFile: file,
    }));

    const reader = new FileReader();

    reader.onload = () => {
      setPreview(reader.result);
    };

    reader.readAsDataURL(file);
  }

  function resetForm() {
    setForm({
      productName: "",
      productType: "cars",
      productPrice: "",
      productStock: "",
      productDetails: "",
      productAddress: "",
      imageFile: null,
    });

    setPreview("");
    setEditingId(null);
  }

  const session = JSON.parse(localStorage.getItem("ecommerce-admin-session"));

  const handleDelete = async (productId) => {
    try {
      const response = await adminApi.deleteProduct(productId, session.user_id, accessToken);

      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log("SUBMIT CLICKED");

    try {
      const formData = new FormData();

      formData.append("productName", form.productName);
      formData.append("productType", form.productType);
      formData.append("productPrice", form.productPrice);
      formData.append("productDetails", form.productDetails);
      formData.append("productAddress", form.productAddress);
      formData.append("productStock", form.productStock);

      if (form.imageFile) {
        formData.append("productImage", form.imageFile);
      }

      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      console.log("editingId =", editingId);
      if (editingId) {
        formData.append("product_id", editingId);
        console.log("CALLING EDIT API");

        await adminApi.editProduct(formData, accessToken);

        showToast("Product updated successfully", "success");
      } else {
        console.log("CALLING ADD API");
        await adminApi.addProduct(formData, accessToken);

        showToast("Product added successfully", "success");
      }

      reload();
      resetForm();
      console.log("API SUCCESS");
    } catch (error) {
      console.log("ERROR:", error);
      console.log("STATUS:", error.response?.status);
      console.log("DATA:", error.response?.data);
      console.log("ERRORS:", error.response?.data?.errors);
      showToast(error?.response?.data?.message || "Something went wrong", "error");
    }
  };

  function handleEdit(product) {
    console.log("EDIT CLICKED");
    console.log(product);

    const id = product.product_id || product.productId || product.id;

    console.log("FOUND ID =", id);

    setEditingId(id);

    setForm({
      productName: product.productName || "",
      productType: product.productType || "cars",
      productPrice: product.productPrice || "",
      productStock: product.productStock || "",
      productDetails: product.productDetails || "",
      productAddress: product.productAddress || "",
      imageFile: null,
    });

    setPreview(product.productImage || "");
  }

  return (
    <div>
      <AdminPageHeader
        eyebrow="Products"
        title="Product management"
        description="Search, add, edit, preview, and delete products from a responsive grid or table layout."
        actions={[
          <button key="grid" className={`rounded-2xl px-4 py-2 text-sm font-semibold ${view === "grid" ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950" : "bg-white text-slate-700 dark:bg-white/5 dark:text-slate-300"}`} onClick={() => setView("grid")}>
            <GridViewIcon className="mr-2 inline h-4 w-4" /> Grid
          </button>,
          <button key="list" className={`rounded-2xl px-4 py-2 text-sm font-semibold ${view === "list" ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950" : "bg-white text-slate-700 dark:bg-white/5 dark:text-slate-300"}`} onClick={() => setView("list")}>
            <ListViewIcon className="mr-2 inline h-4 w-4" /> List
          </button>,
        ]}
      />

      {(loading || error) && <AdminStateView loading={loading} error={error} onRetry={reload} title="Loading product catalog..." />}

      {!loading && !error && (
        <div className="grid gap-6 xl:grid-cols-[1.25fr_0.95fr]">
          <Card className={adminCardClass}>
            <CardBody className="p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1">
                  <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    className={`${adminInputClass} py-3 pl-10 pr-4`}
                    placeholder="Search products"
                    value={search}
                    onChange={(event) => {
                      setSearch(event.target.value);
                      setPage(1);
                    }}
                  />
                </div>
                <select
                  className={`${adminInputClass} px-4 py-3`}
                  value={category}
                  onChange={(event) => {
                    setCategory(event.target.value);
                    setPage(1);
                  }}>
                  {categories.map((item) => (
                    <option key={item} className="dark:bg-gray-900">
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              {view === "grid" ? (
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {paged.map((product) => (
                    <div key={product.product_id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition-colors duration-300 dark:border-white/10 dark:bg-white/5">
                      <img src={product.productImage} alt={product.productName} className="h-44 w-full rounded-2xl object-cover" />
                      <div className="mt-4 flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-white">{product.productName}</h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{product.productType}</p>
                        </div>
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusTone(product.status)}`}>{product.status}</span>
                      </div>
                      <div className="mt-4 flex items-center justify-between text-sm">
                        <div>
                          <p className="text-slate-500 dark:text-slate-400">Price</p>
                          <p className="font-semibold text-slate-900 dark:text-white">{formatCurrency(product.productPrice)}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 dark:text-slate-400">Stock</p>
                          <p className="font-semibold text-slate-900 dark:text-white">{product.productStock}</p>
                        </div>
                        <div></div>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <button className={`flex-1 ${adminPrimaryButtonClass} px-3 py-2`} onClick={() => handleEdit(product)} type="button">
                          <EditIcon className="mr-2 inline h-4 w-4" /> Edit
                        </button>
                        <button className={`rounded-2xl border px-3 py-2 text-sm font-semibold ${adminGhostButtonClass}`} onClick={() => setPreview(product.image)} type="button">
                          <EyeIcon className="mr-2 inline h-4 w-4" /> Preview
                        </button>
                        <button className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-sm font-semibold text-rose-700 dark:text-rose-300" onClick={() => handleDelete(product.product_id)} type="button">
                          <TrashIcon className="mr-2 inline h-4 w-4" /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-5 overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200 dark:divide-white/10">
                    <thead>
                      <tr className="text-left text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                        <th className="pb-3 pr-4">Product</th>
                        <th className="pb-3 pr-4">Category</th>
                        <th className="pb-3 pr-4">Price</th>
                        <th className="pb-3 pr-4">Stock</th>
                        <th className="pb-3 pr-4">Status</th>
                        <th className="pb-3">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                      {paged.map((product) => (
                        <tr key={product.id} className="text-sm hover:bg-slate-50/80 dark:hover:bg-white/5">
                          <td className="py-3 pr-4">
                            <div className="flex items-center gap-3">
                              <img src={product.productImage} alt={product.productName} className="h-12 w-12 rounded-2xl object-cover" />
                              <div>
                                <p className="font-semibold text-slate-900 dark:text-white">{product.productName}</p>
                                <p className="text-slate-500 dark:text-slate-400">{product.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 pr-4 text-slate-600 dark:text-slate-300">{product.productType}</td>
                          <td className="py-3 pr-4 font-medium text-slate-900 dark:text-white">{formatCurrency(product.productPrice)}</td>
                          <td className="py-3 pr-4 text-slate-900 dark:text-white">{product.productStock}</td>
                          <td className="py-3 pr-4">
                            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusTone(product.status)}`}>{product.status}</span>
                          </td>
                          <td className="py-3">
                            <div className="flex flex-wrap gap-2">
                              <button className="rounded-2xl bg-slate-950 px-3 py-2 text-xs font-semibold text-white dark:bg-white dark:text-slate-950" onClick={() => handleEdit(product)} type="button">
                                <EditIcon className="mr-1 inline h-3.5 w-3.5" /> Edit
                              </button>
                              <button className="rounded-2xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 dark:border-white/10 dark:text-slate-300" onClick={() => setPreview(product.image)} type="button">
                                <EyeIcon className="mr-1 inline h-3.5 w-3.5" /> Preview
                              </button>
                              <button className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-700 dark:text-rose-300" onClick={() => handleDelete(product.productId)} type="button">
                                <TrashIcon className="mr-1 inline h-3.5 w-3.5" /> Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <AdminPagination page={page} totalPages={totalPages} onPageChange={setPage} totalItems={filtered.length} pageSize={pageSize} />
            </CardBody>
          </Card>

          <Card className={`h-fit ${adminCardClass}`}>
            <CardBody className="p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{editingId ? "Edit product" : "Add new product"}</p>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Product form</h3>
                </div>
                <button className={`rounded-2xl border p-2 ${adminGhostButtonClass}`} onClick={resetForm} type="button">
                  <PublishIcon className="h-4 w-4" />
                </button>
              </div>

              <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
                <input className={`${adminInputClass} px-4 py-3`} placeholder="Product Name" value={form.productName} onChange={(e) => updateField("productName", e.target.value)} />

                <div className="grid gap-4 sm:grid-cols-2">
                  <input type="number" className={`${adminInputClass} px-4 py-3`} placeholder="Price" value={form.productPrice} onChange={(e) => updateField("productPrice", e.target.value)} />

                  <input className={`${adminInputClass} px-4 py-3`} type="number" placeholder="Stock" value={form.productStock ?? ""} onChange={(e) => updateField("productStock", e.target.value)} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <select className={`${adminInputClass} px-4 py-3 dark:bg-gray-900`} value={form.productType} onChange={(e) => updateField("productType", e.target.value)}>
                    {categories
                      .filter((item) => item !== "all")
                      .map((item) => (
                        <option key={item} className="dark:bg-gray-900">
                          {item}
                        </option>
                      ))}
                  </select>

                  <input className={`${adminInputClass} px-4 py-3`} placeholder="Product Address" value={form.productAddress} onChange={(e) => updateField("productAddress", e.target.value)} />
                </div>

                <textarea className={`${adminInputClass} px-4 py-3`} placeholder="Product Details" value={form.productDetails} onChange={(e) => updateField("productDetails", e.target.value)} />

                <label className="block rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-4 transition-colors duration-300 dark:border-white/15 dark:bg-white/5">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Upload image</span>
                  <input type="file" accept="image/*" className="mt-3 block w-full text-sm text-slate-500 file:mr-4 file:rounded-2xl file:border-0 file:bg-slate-950 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white dark:file:bg-white dark:file:text-slate-950" onChange={handleFile} />
                </label>

                {preview ? <img src={preview} alt="preview" className="h-52 w-full rounded-3xl object-cover" /> : <div className="flex h-52 items-center justify-center rounded-3xl bg-slate-100 text-sm text-slate-500 dark:bg-white/5">Image preview appears here</div>}

                <button className={`flex w-full items-center justify-center gap-2 ${adminPrimaryButtonClass}`} type="submit">
                  <AddIcon className="h-4 w-4" /> {editingId ? "Update product" : "Add product"}
                </button>
              </form>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
}

export default AdminProducts;
