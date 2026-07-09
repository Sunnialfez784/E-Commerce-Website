import React, {useState} from "react";
import {LogIn} from "lucide-react";
import {useLocation, useNavigate} from "react-router-dom";
import {BASE_URL} from "../apis";
import Loader from "../components/Loader";

const SendingOtp = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const {state} = useLocation();
  const [loading, setLoading] = useState(false);

  const handleOtpChange = (e) => {
    // const value = e.target.value;

    // if (/^\d*$/.test(value) && value.length <= 6) {
    //   setOtp(value);
    // }
  };

  const handleSubmit = async (e) => {
    // e.preventDefault();

    // if (otp.length !== 6) {
    //   alert("Please enter valid 6 digit OTP");
    //   return;
    // }

    // try {
    //   setLoading(true);
    //   const res = await fetch(`${BASE_URL}/users/check-otp`, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       otp,
    //     }),
    //   });

    //   const data = await res.json();

    //   console.log("OTP RESPONSE =>", data);

    //   if (data.success) {
    //     navigate("/forgotpassword", {state});
    //   } else {
    //     alert(data.message || "Wrong OTP!");
    //   }
    // } catch (error) {
    //   console.log(error);
    //   alert("Wrong OTP!");
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <>
      <main className="flex min-h-screen w-full items-center justify-center bg-[#f7f7fb] px-4 py-10 text-black">
        <div className="relative w-full max-w-md">
          <form onSubmit={handleSubmit} className={`section-surface flex flex-col p-7 sm:p-9 transition-all duration-200 ${loading ? "pointer-events-none select-none" : ""}`}>
            <span className="premium-pill mb-4 self-start">Verify OTP</span>

            <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">Enter OTP</h1>

            <p className="mt-1.5 text-sm text-slate-500">Enter the six digit OTP sent to your email.</p>

            <div>
              <label className="premium-label mt-4">OTP</label>

              <input type="text" value={otp} onChange={handleOtpChange} placeholder="Enter 6 digit OTP" inputMode="numeric" maxLength={6} className="premium-input text-center text-lg font-semibold tracking-[0.5em]" required />
            </div>
            <button type="submit" disabled={otp.length !== 6} className="premium-btn-primary mt-7 w-full py-3.5 text-base disabled:opacity-50">
              <LogIn className="h-4 w-4" />
              <span>Verify OTP</span>
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

export default SendingOtp;
