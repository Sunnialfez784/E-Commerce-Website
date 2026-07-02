import {useEffect, useState} from "react";
import {DataProvider} from "./UserDataContext";

const ContextProvider = ({children}) => {
  const [userData, setUserData] = useState([]);

  const addData = (data) => {
    setUserData((prev) => [{id: Date.now(), ...data}, ...prev]);
  };

  const updateData = (id, data) => {
    setUserData((prev) => prev.map((prevData) => (prevData.id === id ? {...prevData, ...data} : prevData)));
  };

  const deleteData = (id) => {
    setUserData((prev) => {
      return prev.filter((prevData) => prevData.id !== id);
    });
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));

    if (userData && userData.length > 0) {
      setUserData(userData);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("userData", JSON.stringify(userData));
  }, [userData]);

  return <DataProvider value={{userData, addData, updateData, deleteData}}>{children}</DataProvider>;
};

export default ContextProvider;
