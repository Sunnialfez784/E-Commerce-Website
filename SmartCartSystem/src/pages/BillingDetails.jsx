import {TrashIcon} from "@heroicons/react/24/solid";
import React, {useEffect, useState} from "react";
import {BASE_URL} from "../apis";
import {useAuth} from "../context/AuthContext";
import {MapPin, Plus, X} from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import {toast} from "react-toastify";

const BillingDetails = () => {
  const [fullName, setFullName] = useState("");
  const [country] = useState("india");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [userAddresses, setUserAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const {token, user, savedAddresses, setSavedAddresses} = useAuth();

  const normalizeAddress = (item) => {
    if (!item?.Address) return null;

    return {
      id: item.Address.id,
      fullName: `${item.firstName || ""} ${item.lastName || ""}`.trim(),
      address: item.Address.address || "",
      city: item.Address.city_state || "", 
      state: item.Address.city_state || "",
      pincode: item.Address.pincode || "",
      country: item.Address.country || "india",
      phone: item.phone || "",
      email: item.email || "",
    };
  };

  const normalizeAddressList = (data) => (Array.isArray(data) ? data.map(normalizeAddress).filter(Boolean) : []);

  useEffect(() => {
    if (!token || !user) return;

    setEmail(user.email || "");
    setFullName(`${user.firstName || ""} ${user.lastName || ""}`);

    setUserAddresses(savedAddresses || []);

    if (savedAddresses?.length > 0) {
      setSelectedAddress((prev) => prev || savedAddresses[0]);
      setShowForm(false);
    } else {
      setSelectedAddress(null);
      setShowForm(true);
    }
  }, [savedAddresses, user, token]);

  // useEffect(() => {
  //   console.log(savedAddresses);
  // }, [savedAddresses]);

  const deleteAddress = async (deleteItem) => {
    if (!window.confirm("Are you Sure ?")) return;

    const addressId = deleteItem?.id;
    if (!addressId) {
      toast.error("Invalid address, cannot delete");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/users/delete-address?id=${addressId}`, {
        method: "DELETE",
        headers: {Authorization: `Bearer ${token}`},
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.message || "Address delete faild!");
        return;
      }

      const updatedAddresses = savedAddresses.filter((item) => item?.id !== addressId);

      setSavedAddresses(updatedAddresses);
      setUserAddresses(updatedAddresses);

      if (selectedAddress?.id === addressId) {
        setSelectedAddress(updatedAddresses[0] || null);
      }

      toast.success("Address delete Sucessfully!");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while deleting address");
    }
  };

  useEffect(() => {
    if (!token) return;

    fetch(`${BASE_URL}/users/get-address`, {
      headers: {Authorization: `Bearer ${token}`},
    })
      .then((res) => res.json())
      .then(({data}) => {
        const cleaned = normalizeAddressList(data);
        setUserAddresses(cleaned);
        setSavedAddresses(cleaned);

        if (cleaned.length > 0) {
          setSelectedAddress(cleaned[0]);
          setShowForm(false);
        } else {
          setSelectedAddress(null);
          setShowForm(true);
        }
      })
      .catch(console.error);
  }, [token]);

  const addUserDetails = async (e) => {
    e.preventDefault();
    setError({});
    let newError = {};
    if (!fullName) newError.fullName = "Full Name required";
    if (!address) newError.address = "Address required";
    if (!city) newError.city = "City required";
    if (!state) newError.state = "State required";
    if (!pincode) newError.pincode = "Pincode required";
    if (Object.keys(newError).length > 0) {
      setError(newError);
      return;
    }
    if (!phone) {
      newError.phone = "Phone required";
    } else if (phone.length !== 10) {
      newError.phone = "Phone must be 10 digits";
    }

    const alreadyExist = userAddresses.some((item) => item?.address?.trim().toLowerCase() === address.trim().toLowerCase() && item?.city?.trim().toLowerCase() === city.trim().toLowerCase() && item?.state?.trim().toLowerCase() === state.trim().toLowerCase() && item?.pincode === pincode && item?.phone === phone);

    if (alreadyExist) {
      toast.error("Address already exists");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/users/user-address`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: fullName.trim().toLowerCase(),
          pincode,
          state: state.trim().toLowerCase(),
          city: city.trim().toLowerCase(),
          address: address.trim().toLowerCase(),
          country: country.trim().toLowerCase(),
          email: user?.email?.trim().toLowerCase(),
          phone,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.errors?.length) {
          toast.error(data.errors.join("\n"));
        } else {
          toast.error(data.message);
        }

        return;
      }

      toast.success("Address added successfully");

      const response = await fetch(`${BASE_URL}/users/get-address`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      const cleaned = normalizeAddressList(result.data);

      setSavedAddresses(cleaned);
      setUserAddresses(cleaned);

      if (cleaned.length > 0) {
        setSelectedAddress(cleaned[cleaned.length - 1]);
      }

      setShowForm(false);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="w-full text-black">
      {selectedAddress && (
        <div className="section-surface flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600">
              <MapPin className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Deliver To</h3>
              <p className="mt-1.5 text-sm text-slate-700">
                {selectedAddress.fullName}, {selectedAddress.address}, {selectedAddress.city}, {selectedAddress.state} – {selectedAddress.pincode}
              </p>
              {selectedAddress.phone && <p className="mt-1 text-sm text-slate-500">{selectedAddress.phone}</p>}
            </div>
          </div>
          <button onClick={() => setShowModal(true)} className="premium-btn-ghost shrink-0 self-start text-slate-950 sm:self-auto">
            Change
          </button>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-[9999] flex items-end justify-center bg-slate-950/50 px-0 backdrop-blur-sm sm:items-center sm:px-4">
          <div className="relative max-h-[90vh] w-full overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:max-w-2xl sm:rounded-3xl sm:p-8">
            <button onClick={() => setShowForm(false)} className="icon-btn absolute right-4 top-4" aria-label="Close">
              <X className="h-4 w-4" />
            </button>

            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-slate-200 sm:hidden" />

            <h2 className="text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">Add Address</h2>
            <p className="mt-1 text-sm text-slate-500">Fill in your delivery details below.</p>

            <form onSubmit={addUserDetails} className="mt-5 flex flex-col gap-4">
              <div>
                <label className="premium-label">Full Name</label>
                <input type="text" placeholder="Full Name" className="premium-input" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                {error.fullName && <p className="premium-field-error">{error.fullName}</p>}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="premium-label">Country</label>
                  <input type="text" value={country} readOnly className="premium-input bg-slate-50 text-slate-500" />
                </div>
                <div>
                  <label className="premium-label">State</label>
                  <select className="premium-select" value={state} onChange={(e) => setState(e.target.value)}>
                    <option value="">Select State</option>
                    <option value="gujarat">Gujarat</option>
                    <option value="goa">Goa</option>
                    <option value="maharashtra">Maharashtra</option>
                  </select>
                  {error.state && <p className="premium-field-error">{error.state}</p>}
                </div>
              </div>

              <div>
                <label className="premium-label">Address</label>
                <input type="text" placeholder="Street Address" className="premium-input" value={address} onChange={(e) => setAddress(e.target.value)} />
                {error.address && <p className="premium-field-error">{error.address}</p>}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="premium-label">Pincode</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="Pincode"
                    className="premium-input"
                    value={pincode}
                    maxLength={6}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");

                      if (value.length <= 6) {
                        setPincode(value);
                      }
                    }}
                  />
                  {error.pincode && <p className="premium-field-error">{error.pincode}</p>}
                </div>
                <div>
                  <label className="premium-label">City</label>
                  <input type="text" placeholder="City" className="premium-input" value={city} onChange={(e) => setCity(e.target.value)} />
                  {error.city && <p className="premium-field-error">{error.city}</p>}
                </div>
              </div>
              <div>
                <label className="premium-label">Phone</label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="+91 xxxxxxxx"
                  className="premium-input"
                  value={phone}
                  maxLength={10}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");

                    if (value.length <= 10) {
                      setPhone(value);
                    }
                  }}
                />
                {error.phone && <p className="premium-field-error">{error.phone}</p>}
              </div>
              <button type="submit" className="premium-btn-primary mt-2 w-full py-3.5 text-base">
                Save Address
              </button>
            </form>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 px-0 backdrop-blur-sm sm:items-center sm:px-4">
          <div className="w-full rounded-t-3xl bg-white p-5 shadow-2xl sm:max-w-md sm:rounded-3xl sm:p-6">
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-slate-200 sm:hidden" />
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold tracking-tight text-slate-950">Select Address</h2>
              <button onClick={() => setShowModal(false)} className="icon-btn" aria-label="Close">
                <X className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={() => {
                setShowForm(true);
                setShowModal(false);
              }}
              className="mb-4 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50">
              <Plus className="h-4 w-4" />
              Add New Address
            </button>

            <div className="max-h-[50vh] space-y-3 overflow-y-auto">
              {userAddresses.map((item, index) => (
                <div key={index} onClick={() => setSelectedAddress(item)} className={`cursor-pointer rounded-2xl border p-4 transition ${selectedAddress?.address === item.address ? "border-slate-950 bg-slate-50 shadow-sm" : "border-slate-200 hover:border-slate-300"}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex gap-3">
                      <input type="radio" checked={selectedAddress?.address === item.address} readOnly className="mt-1 h-4 w-4 shrink-0 text-slate-950 focus:ring-slate-950" />
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900">{item.fullName}</h3>
                        <p className="mt-0.5 text-sm text-slate-500">
                          {item.address}, {item.city}, {item.state} – {item.pincode}
                        </p>
                        {item.phone && <p className="text-sm text-slate-500">{item.phone}</p>}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteAddress(item);
                      }}
                      className="icon-btn h-9 w-9 shrink-0"
                      aria-label="Delete address">
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={() => setShowModal(false)} className="premium-btn-primary mt-5 w-full py-3">
              Deliver Here
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingDetails;
