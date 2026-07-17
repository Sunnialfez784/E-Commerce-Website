import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {faEye, faEyeSlash} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {BASE_URL} from "../apis";
import {useAuth} from "../context/AuthContext";
import {AlertCircle, LogIn} from "lucide-react";
import Loader from "./Loader";
import "react-toastify/dist/ReactToastify.css";
import {ToastContainer, toast} from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  // const [showError, setShowError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const {login} = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/users/login-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
          role: "user",
        }),
      });

      const data = await res.json();

      if (data.success) {
        console.log("SUCCESS BLOCK");
      }

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      const accessToken = data?.data?.accessToken;

      const user = {
        user_id: data?.data?.user_id,
        firstName: data?.data?.firstName,
        lastName: data?.data?.lastName,
        email: data?.data?.email,
        phone: data?.data?.phone,
        gender: data?.data?.gender,
      };

      login({
        user,
        accessToken,
      });

      toast.success("Login Successful");
      setTimeout(() => {
        navigate("/", {replace: true});
      }, 1000);
    } catch (err) {
      toast.error(err.message);
      // setShowError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[#f7f7fb] px-4 py-10 text-black">
      <ToastContainer position="top-center" autoClose={2500} />
      <div className="relative mx-auto w-full max-w-md">
        {/* {showError && (
          <div role="alert" className="mb-4 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{showError}</span>
          </div>
        )} */}

        <form onSubmit={handleLogin} className={`section-surface flex flex-col p-5 sm:p-7 md:p-9 ${loading ? "pointer-events-none select-none" : ""}`}>
          <span className="premium-pill mb-4 self-start">Welcome back</span>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">Log in to your account</h1>
          <p className="mt-1.5 text-sm text-slate-500">Enter your details to continue shopping.</p>

          <div className="mt-6 flex flex-col gap-4">
            <div>
              <label className="premium-label">Email</label>
              <input type="email" placeholder="Enter your email" className="premium-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div>
              <label className="premium-label">Password</label>

              <div className="relative">
                <input type={visible ? "text" : "password"} placeholder="Enter your password" className="premium-input pr-12" value={password} onChange={(e) => setPassword(e.target.value)} required />

                <button type="button" onClick={() => setVisible(!visible)} className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center text-slate-400 hover:text-slate-700" aria-label={visible ? "Hide password" : "Show password"}>
                  <FontAwesomeIcon icon={visible ? faEyeSlash : faEye} className="text-lg" />
                </button>
              </div>
            </div>

            <Link to="/sendingemail" className="premium-label ml-3">
              Forgot Password
            </Link>
          </div>

          <button type="submit" className="premium-btn-primary mt-7 w-full py-3.5 text-base">
            <LogIn className="h-4 w-4" />
            Login
          </button>

          <div className="mt-5 text-center text-xs sm:text-sm text-slate-500">
            <span>Don't have an account? </span>

            <Link to="/register" className="inline font-semibold text-slate-950 hover:underline">
              Create one
            </Link>
          </div>
        </form>
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/40 backdrop-blur-[2px]">
            <Loader isLoader />
          </div>
        )}
      </div>
    </main>
  );
};

export default Login;
