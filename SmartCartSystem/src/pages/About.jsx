import React from "react";
import Navbar from "../components/Navbar";

const About = () => {
  const navLinkClass = ({isActive}) => `inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold flex items-center justify-center transition-colors duration-200 whitespace-nowrap sm:gap-2 sm:px-4 sm:py-2 sm:text-sm ${isActive ? "bg-slate-950 text-white shadow-lg shadow-slate-950/15" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`;

  return (
    <div>
      <Navbar isAbout className={navLinkClass} />
    </div>
  );
};

export default About;
