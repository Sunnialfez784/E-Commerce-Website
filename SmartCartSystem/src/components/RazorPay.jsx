import React from "react";
import {CreditCard} from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import {toast} from "react-toastify";

const RazorPay = () => {
  const handlePayment = () => {
    const options = {
      key: "rzp_test_Srv0THzCTUJ4E8",

      amount: 50000,

      currency: "INR",

      name: "Novo Trends",

      description: "Dummy Payment Testing",

      image: "https://cdn.razorpay.com/logos/GhRQcyean79PqE_medium.png",

      handler: function (response) {
        toast.success("Payment Success:", response);

        toast.success("Payment Successful");
      },

      prefill: {
        name: "Test User",
        email: "test@example.com",
        contact: "9999999999",
      },

      notes: {
        address: "Razorpay Test Payment",
      },

      theme: {
        color: "#000000",
      },
    };

    const razor = new window.Razorpay(options);

    razor.on("payment.failed", function (response) {
      toast.error(response.error);

      toast.error("Payment Failed");
    });

    razor.open();
  };

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[#f7f7fb] px-4">
      <div className="section-surface flex flex-col items-center p-9 text-center">
        <span className="premium-pill mb-4">Secure payment</span>
        <h1 className="text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">Complete your payment</h1>
        <p className="mt-2 max-w-xs text-sm text-slate-500">You'll be redirected to Razorpay's secure checkout to finish this transaction.</p>

        <button onClick={handlePayment} className="premium-btn-primary mt-6 px-8 py-3.5 text-base">
          <CreditCard className="h-4 w-4" />
          Open Razorpay
        </button>
      </div>
    </main>
  );
};

export default RazorPay;
