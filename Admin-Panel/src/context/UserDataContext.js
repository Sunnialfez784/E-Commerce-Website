import { createContext,useContext } from "react";

export const UserDataContext = createContext({
  data : [],
  addData : () => {},
  updateData : () => {},
  deleteData : () => {}
})  

export const usersData = () =>{
  return useContext(UserDataContext)
}

export const DataProvider = UserDataContext.Provider