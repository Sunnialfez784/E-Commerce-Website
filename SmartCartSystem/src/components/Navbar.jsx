import React, {useState, useRef, useEffect, useCallback} from "react";
import {Link, NavLink, useLocation} from "react-router-dom";
import Header from "./Header";
import {MdCable, MdOutlineHome} from "react-icons/md";
import {LiaCarSideSolid} from "react-icons/lia";
import {RiMotorbikeLine, RiKey2Line} from "react-icons/ri";
import {GiLaptop, GiLipstick, GiBearHead, GiBlackBook} from "react-icons/gi";
import {FaMobileScreen} from "react-icons/fa6";
import {LuShirt} from "react-icons/lu";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBaseballBatBall, faCouch, faShoePrints} from "@fortawesome/free-solid-svg-icons";
import {IoCamera, IoHeadset} from "react-icons/io5";
import {KeyboardMusic, Speaker, Watch, ChevronLeft, ChevronRight} from "lucide-react";
import {MdOutlineWatch} from "react-icons/md";
import {PiSneakerBold} from "react-icons/pi";
import {FaReact} from "react-icons/fa";
import {FaNode} from "react-icons/fa";

const NAV_ITEMS = [
  {to: "/", label: "Home", Icon: () => <MdOutlineHome className="h-4 w-4 sm:h-5 sm:w-5" />},
  {to: "/cars", label: "Cars", Icon: () => <LiaCarSideSolid className="h-4 w-4 sm:h-5 sm:w-5" />},
  {to: "/bikes", label: "Bikes", Icon: () => <RiMotorbikeLine className="h-4 w-4 sm:h-5 sm:w-5" />},
  {to: "/laptops", label: "Laptops", Icon: () => <GiLaptop className="h-4 w-4 sm:h-5 sm:w-5" />},
  {to: "/mobiles", label: "Mobiles", Icon: () => <FaMobileScreen className="h-4 w-4 sm:h-5 sm:w-5" />},
  {to: "/fashion", label: "Fashion", Icon: () => <LuShirt className="h-4 w-4 sm:h-5 sm:w-5" />},
  {to: "/kids", label: "Kids", Icon: () => <GiBearHead className="h-4 w-4 sm:h-5 sm:w-5" />},
  {to: "/sports", label: "Sports", Icon: () => <FontAwesomeIcon icon={faBaseballBatBall} className="h-3.5 w-3.5 sm:h-4 sm:w-4" />},
  {to: "/furniture", label: "Furniture", Icon: () => <FontAwesomeIcon icon={faCouch} className="h-3.5 w-3.5 sm:h-4 sm:w-4" />},
  {to: "/keychain", label: "Keychain", Icon: () => <RiKey2Line className="h-4 w-4" />},
  {to: "/camera", label: "Camera", Icon: () => <IoCamera className="h-4 w-4" />},
  {to: "/headset", label: "Headset", Icon: () => <IoHeadset className="h-4 w-4" />},
  {to: "/shoes", label: "Shoes", Icon: () => <PiSneakerBold size={16} />},
  {to: "/watch", label: "Watch", Icon: () => <MdOutlineWatch size={18} />},
  {to: "/Speaker", label: "Speaker", Icon: () => <Speaker size={16} strokeWidth={3} />},
  {to: "/instrument", label: "Instruments", Icon: () => <KeyboardMusic size={16} strokeWidth={3} />},
  {to: "/beauty", label: "Beauty", Icon: () => <GiLipstick size={16} />},
  {to: "/books", label: "Books", Icon: () => <GiBlackBook size={16} />},
];

const SCROLL_AMOUNT = 200;

const Navbar = ({isButton = false, isAbout = false, activeTab, setActiveTab}) => {
  const scrollRef = useRef(null);
  const itemRefs = useRef({});
  const location = useLocation();
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, {passive: true});
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      ro.disconnect();
    };
  }, [updateScrollState]);

  useEffect(() => {
    const activeItem = NAV_ITEMS.find(({to}) => (to === "/" ? location.pathname === "/" : location.pathname.startsWith(to)));
    const el = activeItem && itemRefs.current[activeItem.to];
    if (el) {
      el.scrollIntoView({behavior: "smooth", inline: "center", block: "nearest"});
    }
  }, [location.pathname]);

  const scrollBy = (dir) => {
    scrollRef.current?.scrollBy({left: dir * SCROLL_AMOUNT, behavior: "smooth"});
  };

  const navLinkClass = ({isActive}) => `inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors duration-200 whitespace-nowrap sm:gap-2 sm:px-4 sm:py-2 sm:text-sm ${isActive ? "bg-slate-950 text-white shadow-lg shadow-slate-950/15" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/60 bg-white/85 text-black shadow-[0_12px_40px_-20px_rgba(15,23,42,0.35)] backdrop-blur-xl">
      <nav className={`${isAbout ? "flex flex-col items-center" : ""} page-shell py-3 sm:py-4`}>
        <Header />

        <div className={`${isAbout ? "w-auto" : ""} mt-3 rounded-[28px] border border-slate-200 bg-white/90 px-2 py-2 shadow-sm sm:mt-5 sm:px-3 sm:py-2.5`}>
          <div className="relative flex items-center gap-1">
            <button onClick={() => scrollBy(-1)} disabled={!canScrollLeft} aria-label="Scroll left" className={`shrink-0 flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-all duration-200 sm:h-8 sm:w-8 ${canScrollLeft ? "hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300" : "opacity-30 cursor-not-allowed"}`}>
              <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>

            {isAbout ? (
              <ul className="flex flex-1 items-center gap-1 overflow-x-auto font-medium sm:gap-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <li className="shrink-0">
                  <button onClick={() => setActiveTab("frontend")} className={`${activeTab == "frontend" ? `inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors duration-200 whitespace-nowrap sm:gap-2 sm:px-4 sm:py-2 sm:text-sm bg-slate-950 text-white shadow-lg shadow-slate-950/15` : "bg-transparent"} flex items-center gap-2 px-4 py-2 font-semibold`}>
                    <FaReact className="h-4 w-4 sm:h-5 sm:w-5" />
                    Frontend Developer
                  </button>
                </li>

                <li className="shrink-0">
                  <button onClick={() => setActiveTab("backend")} className={`${activeTab == "backend" ? `inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors duration-200 whitespace-nowrap sm:gap-2 sm:px-4 sm:py-2 sm:text-sm bg-slate-950 text-white shadow-lg shadow-slate-950/15` : "bg-transparent"} flex items-center gap-2 px-4 py-2 font-semibold`}>
                    <FaNode className="h-4 w-4 sm:h-5 sm:w-5" />
                    Backend Developer
                  </button>
                </li>
              </ul>
            ) : (
              <ul ref={scrollRef} className="flex flex-1 items-center gap-1 overflow-x-auto font-medium sm:gap-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {NAV_ITEMS.map(({to, label, Icon}) => (
                  <li key={to} className="shrink-0">
                    <NavLink to={to} ref={(el) => (itemRefs.current[to] = el)} className={navLinkClass} end={to === "/"}>
                      <Icon />
                      {label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            )}
            <button onClick={() => scrollBy(1)} disabled={!canScrollRight} aria-label="Scroll right" className={`shrink-0 flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-all duration-200 sm:h-8 sm:w-8 ${canScrollRight ? "hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300" : "opacity-30 cursor-not-allowed"}`}>
              <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
