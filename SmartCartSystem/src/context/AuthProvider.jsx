import {useCallback, useState} from "react";
import {AuthContext} from "./AuthContext";

export const AuthProvider = ({children}) => {
  const [quantities, setQuantities] = useState({});
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [savedAddresses, setSavedAddresses] = useState([]);

  const setCartQuantity = (product_id, quantity) => {
    setQuantities((prev) => ({
      ...prev,
      [product_id]: Number(quantity),
    }));
  };

  const addBtn = useCallback((product_id) => {
    setQuantities((prev) => ({
      ...prev,

      [product_id]: (prev[product_id] || 1) + 1,
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
    setUser(user);
    setToken(accessToken);
  };

  const logout = () => {
    setUser(null);
    setToken("");
    setRegisteredUsers([]);
    setSavedAddresses([]);
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
        setUser,
        setToken,
        registeredUsers,
        setRegisteredUsers,
        savedAddresses,
        setSavedAddresses,

        login,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
