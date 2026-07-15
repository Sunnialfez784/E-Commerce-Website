import {useState, useCallback} from "react";
import {AuthContext} from "./AuthContext";

export const AuthProvider = ({children}) => {
  const [quantities, setQuantities] = useState({});
  const [token, setToken] = useState(localStorage.getItem("accessToken") || "");

  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const [savedAddresses, setSavedAddressesState] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("savedAddresses")) || [];
    } catch {
      return [];
    }
  });

  const setSavedAddresses = (addresses) => {
    setSavedAddressesState((prev) => {
      const next = typeof addresses === "function" ? addresses(prev) : addresses;
      localStorage.setItem("savedAddresses", JSON.stringify(next));
      return next;
    });
  };

  const setCartQuantity = (product_id, quantity) => {
    setQuantities((prev) => ({
      ...prev,
      [product_id]: Number(quantity),
    }));
  };

  const addBtn = useCallback((product_id) => {
    setQuantities((prev) => ({
      ...prev,
      [product_id]: Math.min((prev[product_id] || 1) + 1, 5),
    }));
  }, []);

  const minusBtn = useCallback((product_id) => {
    setQuantities((prev) => ({
      ...prev,
      [product_id]: Math.max((prev[product_id] || 1) - 1, 1),
    }));
  }, []);

  const getQuantity = useCallback(
    (product_id) => {
      return quantities[product_id] || 1;
    },
    [quantities],
  );

  const login = ({user, accessToken}) => {
    localStorage.setItem("user", JSON.stringify(user));

    localStorage.setItem("accessToken", accessToken);

    setUser(user);
    setToken(accessToken);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setToken("");
    setSavedAddressesState([]);
  };

  return (
    <AuthContext.Provider
      value={{
        quantities,
        setCartQuantity,
        addBtn,
        minusBtn,
        getQuantity,

        token,
        user,

        savedAddresses,
        setSavedAddresses,

        login,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
