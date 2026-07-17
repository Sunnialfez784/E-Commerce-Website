import React, {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye, faEyeSlash} from "@fortawesome/free-solid-svg-icons";
import {LogIn} from "lucide-react";
import {useLocation, useNavigate} from "react-router-dom";
import {BASE_URL} from "../apis";
import Loader from "../components/Loader";
import "react-toastify/dist/ReactToastify.css";
import {ToastContainer, toast} from "react-toastify";

const ForgotPassword = () => {
  const [visible, setVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const {state} = useLocation();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password) {
      toast.error("Please enter your password");
      return;
    }

    const email = state?.email;

    if (!email) {
      toast.error("User not found");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/users/new-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      console.log("PASSWORD RESPONSE =>", data);

      if (data.success) {
        navigate("/login");
      } else {
        toast.error(data.message || "Password update failed");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <main className="flex min-h-screen w-full items-center justify-center bg-[#f7f7fb] px-4 py-10 text-black">
        <ToastContainer position="top-center" autoClose={2500} />
        <div className="relative w-full max-w-md">
          <form onSubmit={handleSubmit} className={`section-surface flex flex-col p-7 sm:p-9 transition-all duration-200 ${loading ? "blur-sm pointer-events-none select-none" : ""}`}>
            <span className="premium-pill mb-4 self-start">Change Password</span>

            <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">Enter New Password.</h1>

            <p className="mt-1.5 text-sm text-slate-500">Enter your details to continue.</p>

            <div className="mt-6 flex flex-col gap-4">
              <div className="relative">
                <label className="premium-label">New Password</label>

                <input type={visible ? "text" : "password"} placeholder="Set new password" className="premium-input pr-11" value={password} onChange={(e) => setPassword(e.target.value)} required />

                <button type="button" onClick={() => setVisible(!visible)} className="absolute right-3.5 top-[2.45rem] text-slate-400 transition hover:text-slate-700">
                  <FontAwesomeIcon icon={visible ? faEyeSlash : faEye} />
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="premium-btn-primary mt-7 w-full py-3.5 text-base flex items-center justify-center gap-2">
              <LogIn className="h-4 w-4" />
              <span>Continue</span>
            </button>
          </form>
          {loading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/40 backdrop-blur-[2px]">
              <Loader isLoader />
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default ForgotPassword;
