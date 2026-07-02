import {useState} from "react";
import AddUser from "./AddUser";
import AllUsers from "./ShowUsers";
import { useNavigate } from "react-router-dom";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { TbLogout } from "react-icons/tb";

const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate()

  const handleLogout = () =>{
    localStorage.removeItem("isAuth");
    navigate("/", {replace : true});
  }

  return (
    <div>
      <div className="text-black py-4 px-10 items-center w-full flex justify-between h-16 bg-slate-900">
        <div className="flex items-center text-white pl-2">
          <img className="h-10 rounded-full" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPkAbNTgZjnt0bon0Zxv8R7RtuEjQfQmDJAA&s" alt="" /> 
          <h1 className="  text-white font-semibold mx-2 text-2xl">User Dashboard</h1>
        </div>
        <button 
          onClick={handleLogout} className="px-2.5 py-2 text-xs font-medium bg-white"><TbLogout className="text-[18px]" />Logout</button>
      </div>
      <div className="w-full flex mt-7 mb-4 justify-end text-white py-2 px-32">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-black text-white flex justify-center font-semibold px-2 py-2 h-8 rounded">
           <AiOutlineUsergroupAdd className="text-xl" />Add Users
        </button>
      </div>
      {isOpen && <AddUser setIsOpen={setIsOpen} />}
      <AllUsers setIsOpen={setIsOpen} />
    </div>
  );
};

export default Dashboard;