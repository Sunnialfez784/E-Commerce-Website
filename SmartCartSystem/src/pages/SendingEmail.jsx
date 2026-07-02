import React, {useState} from "react";
import {LogIn} from "lucide-react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../context/AuthContext";
import {BASE_URL} from "../apis";

const SendingEmail = () => {
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      alert("Please enter your email");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/users/send-otp`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email,
        }),
      });

      const data = await res.json();

      console.log("OTP RESPONSE =>", data);

      if (data.success) {
        navigate("/sendingotp", {
          state: {
            email,
          },
        });
      } else {
        alert(data.message || "Email not found");
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[#f7f7fb] px-4 py-10 text-black">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="section-surface flex flex-col p-7 sm:p-9">
          <span className="premium-pill mb-4 self-start">Send Email</span>

          <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">Email Send</h1>

          <p className="mt-1.5 text-sm text-slate-500">Enter your email to receive OTP.</p>

          <div>
            <label className="premium-label mt-4">Email</label>

            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className="premium-input" required />
          </div>

          <button type="submit" className="premium-btn-primary mt-7 w-full py-3.5 text-base">
            <LogIn className="h-4 w-4" />
            Send OTP
          </button>
        </form>
      </div>
    </main>
  );
};

export default SendingEmail;
