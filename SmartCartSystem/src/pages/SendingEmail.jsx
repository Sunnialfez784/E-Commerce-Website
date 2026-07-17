import React, {useState} from "react";
import {LogIn} from "lucide-react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../context/AuthContext";
import {BASE_URL} from "../apis";
import Loader from "../components/Loader";
import "react-toastify/dist/ReactToastify.css";
import {ToastContainer, toast} from "react-toastify";

const SendingEmail = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.warn("Please enter your email");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/users/send-email`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email,
        }),
      });

      const data = await res.json();

      if (data.success) {
        navigate("/forgotpassword", {
          state: {
            email,
          },
        });
      } else {
        toast.error(data.message || "Email not found");
      }
    } catch (error) {
      toast.error(error);
      // toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[#f7f7fb] px-4 py-10 text-black">
      <ToastContainer position="top-center" autoClose={2500} />
      <div className="relative w-full max-w-md">
        <form onSubmit={handleSubmit} className={`section-surface flex flex-col p-7 sm:p-9 transition-all duration-200 ${loading ? "pointer-events-none select-none" : ""}`}>
          <span className="premium-pill mb-4 self-start">Send Email</span>

          <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">Email Send</h1>

          <p className="mt-1.5 text-sm text-slate-500">Enter your email to receive OTP.</p>

          <div>
            <label className="premium-label mt-4">Email</label>

            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className="premium-input" required />
          </div>

          <button type="submit" disabled={loading} className="premium-btn-primary mt-7 w-full py-3.5 text-base flex items-center justify-center">
            <LogIn className="h-4 w-4" />
            <span>Continue</span>
          </button>
        </form>
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/40 backdrop-blur-[2px]">
            <Loader isLoader />
          </div>
        )}

        <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm font-medium text-blue-900">Use the same email address that you used while creating your account.</p>

          <p className="mt-1 text-xs leading-5 text-blue-700">Your information is secure. We'll use this email only to send a verification OTP and help you recover your account.</p>
        </div>
      </div>
    </main>
  );
};

export default SendingEmail;
