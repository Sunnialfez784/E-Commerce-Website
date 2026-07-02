import React from "react";
import errors from '../assets/Home/error5.png'
import {Link} from "react-router-dom";

const Errors = () => {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-[#f7f7fb] px-4 py-10 text-center">
      <img src={errors} alt="Something went wrong" className="h-auto w-full max-w-sm sm:max-w-md" />

      <h1 className="mt-6 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">Something went off track</h1>
      <p className="mt-2 max-w-md text-sm text-slate-500">The page you're looking for isn't available right now. Let's get you back to shopping.</p>

      <Link to="/" className="premium-btn-primary mt-6 px-6 py-3">
        Back to Home
      </Link>
    </main>
  );
};

export default Errors;
