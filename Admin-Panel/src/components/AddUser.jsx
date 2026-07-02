import {useState} from "react";
import {usersData} from "../context/UserDataContext";
import {faEye, faEyeSlash} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const AddUser = ({isEditMode = false, form, setIsOpen}) => {
  const [formData, setFormData] = useState({
    name: isEditMode ? form?.name : "",
    email: isEditMode ? form?.email : "",
    password: isEditMode ? form?.password : "",
    number: isEditMode ? form?.number : "",
  });

  const [errors, setErrors] = useState({});
  const [visible, setVisible] = useState(false);
  const {userData, addData, updateData} = usersData();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%]).{8,}$/


  const validate = () => {
    let newErrors = {};

    if (!formData.name) {
      newErrors.name = "Full name is required";
    }

    const isNameDuplicate = userData.some((u) => u.name === formData.name && (!isEditMode || u.id !== form.id));
    if (isNameDuplicate) {
      alert("name is duplicate");
      return;
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    const isEmailDuplicate = userData.some((u) => u.email === formData.email && (!isEditMode || u.id !== form.id));
    if (isEmailDuplicate) {
      alert("email is duplicate");
      return;
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password = "Your Password are Wick!";
    }

    const isPasswordDuplicate = userData.some((u) => u.password === formData.password && (!isEditMode || u.id !== form.id));
    if (isPasswordDuplicate) {
      alert("Password is duplicate");
      return;
    }

    if (!formData.number) {
      newErrors.number = "Number is required";
    } else if (formData.number.length !== 10) {
      newErrors.number = "Number must be 10 digits";
    }

    const isNumberDuplicate = userData.some((u) => u.number === formData.number && (!isEditMode || u.id !== form.id));
    if (isNumberDuplicate) {
      alert("Number is duplicate");
      return;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const add = (e) => {
    e.preventDefault();

    if (validate()) {
      const userObj = {
        ...formData,
        id: isEditMode ? form.id : Date.now(),
      };

      if (isEditMode) {
        updateData(form.id, userObj);
      } else {
        addData(userObj);
      }
      setIsOpen(false);
    }
  };

  return (
    <div className="flex justify-center p-6 mt-6 mb-6">
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-[#ffffff] p-6 rounded-md shadow-lg w-[470px]">
          <h3 className=" text-black font-medium text-xl mb-4 ">Add User</h3>

          <form onSubmit={add}>
            <label className="text-black mb-1">Name</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              placeholder="Full Name" 
              className="w-full mb-5 bg-[#f9f8f8f0] px-3 text-black py-2 border rounded " />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

            <label className="text-black mb-1">Email</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              placeholder="Email" 
              className="w-full mb-5 bg-[#f9f8f8f0] px-3 text-black py-2 border rounded " />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

            <div className="relative w-full">
              <label className="text-black mb-1">Password</label>
              <input 
                type={visible ? "text" : "password"} 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                placeholder="Password" 
                className="w-full mb-5 bg-[#f9f8f8f0] px-3 text-black py-2 border rounded" />
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

              <span onClick={() => setVisible(!visible)} className="absolute right-2.5 text-black top-12 -translate-y-1/2 cursor-pointer">
                <FontAwesomeIcon icon={visible ? faEyeSlash : faEye} />
              </span>
            </div>

            <label className="text-black mb-1">Phone</label>
            <input 
              type="text" 
              name="number" 
              value={formData.number} 
              onChange={handleChange} 
              placeholder="Mobile Number" 
              className="w-full mb-5 bg-[#f9f8f8f0] px-3 text-black py-2 border rounded " />
            {errors.number && <p className="text-red-500 text-sm">{errors.number}</p>}

            <div className="flex justify-between mt-4">
              <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 bg-gray-400 rounded">
                Cancel
              </button>

              <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
                {isEditMode ? "Edit" : "Add"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
