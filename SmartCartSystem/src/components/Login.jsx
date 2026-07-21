import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {faEye, faEyeSlash} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {BASE_URL} from "../apis";
import {useAuth} from "../context/AuthContext";
import {LogIn} from "lucide-react";
import Loader from "./Loader";
import "react-toastify/dist/ReactToastify.css";
import {toast} from "react-toastify";
import {useGoogleLogin} from "@react-oauth/google";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const {login} = useAuth();

  const googleLoginHandler = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);

        const res = await fetch(`${BASE_URL}/auth/google`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            access_token: tokenResponse.access_token,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Google login failed");
        }

        const accessToken = data?.data?.accessToken;
        const googleUser = data?.data?.user;

        const user = {
          user_id: googleUser?.user_id,
          firstName: googleUser?.firstName,
          lastName: googleUser?.lastName,
          email: googleUser?.email,
          phone: googleUser?.phone,
          gender: googleUser?.gender,
        };

        login({user, accessToken});

        toast.success("Login Successful");
        navigate("/", {replace: true});
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    },

    onError: () => toast.error("Google login failed"),
  });

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/users/login-user`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
          role: "user",
        }),
      });

      const data = await res.json();

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

      login({user, accessToken});

      toast.success("Login Successful");
      setTimeout(() => {
        navigate("/", {replace: true});
      }, 1000);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[#f7f7fb] px-4 py-10 text-black">
      <div className="relative mx-auto w-full max-w-md">
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

          <div className="mt-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs font-medium uppercase tracking-wide text-slate-400">or</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <button
            type="button"
            onClick={() => {
              googleLoginHandler();
            }}
            className="mt-5 flex w-full items-center justify-center gap-3 rounded-full border border-slate-200 bg-white py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition duration-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loading}>
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
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
