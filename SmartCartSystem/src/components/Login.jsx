import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {faEye, faEyeSlash} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {BASE_URL} from "../apis";
import {useAuth} from "../context/AuthContext";
import {AlertCircle, LogIn} from "lucide-react";
import Loader from "./Loader";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [showError, setShowError] = useState("");
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
          email,
          password,
          role: "user",
        }),
      });

      const data = await res.json();

      console.log("API DATA:", data);

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

      console.log("Before Login", accessToken);
      login({
        user,
        accessToken,
      });

      console.log("after Login");

      navigate("/", {replace: true});
    } catch (err) {
      console.log(err);
      setShowError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[#f7f7fb] px-4 py-10 text-black">
      <div className="w-full max-w-md">
        {showError && (
          <div role="alert" className="mb-4 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{showError}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className={`section-surface flex flex-col p-7 sm:p-9 ${loading ? "pointer-events-none select-none" : ""}`}>
          <span className="premium-pill mb-4 self-start">Welcome back</span>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">Log in to your account</h1>
          <p className="mt-1.5 text-sm text-slate-500">Enter your details to continue shopping.</p>

          <div className="mt-6 flex flex-col gap-4">
            <div>
              <label className="premium-label">Email</label>
              <input type="email" placeholder="Enter your email" className="premium-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="relative">
              <label className="premium-label">Password</label>
              <input type={visible ? "text" : "password"} placeholder="Enter your password" className="premium-input pr-11" value={password} onChange={(e) => setPassword(e.target.value)} required />

              <button type="button" onClick={() => setVisible(!visible)} className="absolute right-3.5 top-[2.15rem] text-slate-400 transition hover:text-slate-700" aria-label={visible ? "Hide password" : "Show password"}>
                <FontAwesomeIcon icon={visible ? faEyeSlash : faEye} />
              </button>
            </div>

            <Link to="/sendingemail" className="premium-label ml-3">
              Forgot Password
            </Link>
          </div>

          <button type="submit" className="premium-btn-primary mt-7 w-full py-3.5 text-base">
            <LogIn className="h-4 w-4" />
            Login
          </button>

          <div className="mt-5 flex flex-nowrap items-center justify-center gap-1.5 text-sm text-slate-500 whitespace-nowrap">
            <span>Don't have an account?</span>
            <Link to="/register" className="font-semibold text-slate-950 hover:underline whitespace-nowrap">
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
