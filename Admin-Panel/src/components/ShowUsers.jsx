import {useState} from "react";
import {usersData} from "../context/UserDataContext";
import AddUser from "./AddUser";
import { PiShieldWarningLight } from "react-icons/pi";
import {PencilSquareIcon, TrashIcon, EyeIcon, EyeSlashIcon} from "@heroicons/react/24/solid";

const ShowUsers = () => {
  const {userData, deleteData} = usersData();
  const [isEditMode, setIsEditMode] = useState(false);
  const [visibleId, setVisibleId] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const [form, setForm] = useState({
    id: null,
    name: "",
    email: "",
    password: "",
    number: "",
  });

  const togglePassword = (id) => {
    setVisibleId(visibleId === id ? null : id);
  };

  const handleUpdateData = (user) => {
    setForm(user);
    setIsEditMode(true);
  };

  return (
    <>
      <div className="px-28">
        <div className="overflow-hidden rounded-md border border-gray-200">
          <table className="text-black min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="font-semibold text-[13px] border-b-2">
                <th className="w-48 text-[#5c5a5a]">Name</th>
                <th className="w-60 text-[#5c5a5a]">Email</th>
                <th className="w-60 text-[#5c5a5a]">Password</th>
                <th className="w-60 text-[#5c5a5a]">Phone</th>
                <th className="w-48 text-[#5c5a5a]">Action</th>
              </tr>
            </thead>

            <tbody className="font-medium text-[14px]">
              {userData.map((user) => (
                <tr key={user.id} className="border-b-2 text-[13px] hover:bg-[#ebebeb]">
                  <td className="flex gap-1 items-center">{user.name}</td>
                  <td>{user.email}</td>
                  <td className="flex gap-2">
                    {visibleId === user.id ? user.password : "********"}
                    <button onClick={() => togglePassword(user.id)}>{visibleId === user.id ? <EyeSlashIcon className="w-5 h-5 text-gray-600" /> : <EyeIcon className="w-5 h-5 text-gray-600" />}</button>
                  </td>
                  <td>+91 {user.number}</td>
                  <td className="flex gap-2">
                    <button onClick={() => handleUpdateData(user)} className="w-6 h-6 rounded bg-green-50">
                      <PencilSquareIcon className="w-4 h-4 text-green-700" />
                    </button>

                    <button commandfor="demo-dialog" command="show-modal" onClick={() => setSelectedUserId(user.id)}>
                      <TrashIcon className="w-5 text-red-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <dialog id="demo-dialog" closedby="any" className="rounded-lg w-[350px] backdrop-blur-sm bg-white text-black backdrop:bg-black/10">
          <form method="dialog">
            <header>
              <h3 className="text-lg font-semibold">Delete User</h3>
              <div className="w-full h-[1px] bg-gray-200"></div>
              <div className="w-full flex flex-col justify-center items-center gap-2 py-4">
                <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center mb-3">

                <PiShieldWarningLight className="text-[20px] text-white rounded-full" />
                </div>
                <p className="text-center text-sm">Are you sure You want to Delete this User? This action cannot be undone. </p>
              </div>
              <div className="w-full h-[1px] bg-gray-200"></div>
            </header>

            <footer className="flex gap-3 mt-4">
              <button type="button" commandfor="demo-dialog" command="close" className=" text-xs border-[1.6px]  font-medium px-3 py-2 rounded-[3px]">
                Cancel
              </button>
              
              <button onClick={() => deleteData(selectedUserId)} className="py-2 px-3 bg-red-600  rounded-[3px] text-white font-medium text-xs" value="confirm">
                Delete
              </button>
            </footer>
          </form>
        </dialog>
      </div>
      {isEditMode && <AddUser form={form} setIsOpen={setIsEditMode} isEditMode={true} />}
    </>
  );
};

export default ShowUsers;
