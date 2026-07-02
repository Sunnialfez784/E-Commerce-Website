import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);

  const admin = email === "sunnialfez@gmail.com" && password === "1234";

  useEffect(() => {
    const isAuth = localStorage.getItem("isAuth");

    if (isAuth) {
      navigate("/dashboard");
    }
  }, []);

  const errors = (
    <div role="alert" data-variant="error">
      <strong>Error!</strong> Please Enter the Right email or Password.
    </div>
  );

  const add = (e) => {
    e.preventDefault();

    if (admin) {
      localStorage.setItem("isAuth", "true");
      navigate("/dashboard");
    } else {
      setShowError("/");
    }
  };

  return (
    <>
      {showError && errors}
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <form onSubmit={add} className="bg-[#ffffff] rounded-md shadow-lg p-8 text-black w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Login Form</h1>
          <div className="mb-4">
            <label data-field className="block mb-1 font-medium">
              Email
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mb-3 bg-[#f9f8f8f0] px-3 text-black py-2 shadow-sm border rounded focus:outline-none w-full focus:ring-1 focus:ring-[#82868FDB]" placeholder="you@example.com" required />
            </label>
          </div>

          <div className="mb-4">
            <label data-field className="block mb-1 font-medium">
              Password
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mb-3 bg-[#f9f8f8f0] px-3 text-black py-2 shadow-sm border rounded focus:outline-none w-full focus:ring-1 focus:ring-[#82868FDB]" placeholder="Password" />
            </label>
          </div>

          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
            Submit
          </button>
        </form>
      </div>
    </>
  );
};

export default Login;
