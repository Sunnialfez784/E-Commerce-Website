import { useState, useEffect, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
  bio: string;
  location: string;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
  blog: string;
  company: string;
  created_at: string;
}

interface GitHubRepo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  topics: string[];
  updated_at: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const TECH_STACK = [
  { name: "MongoDB",      icon: "🍃", color: "from-green-50   to-green-100/50  border-green-300  text-green-700"  },
  { name: "Express.js",   icon: "⚡", color: "from-yellow-50  to-yellow-100/50 border-yellow-300 text-yellow-700" },
  { name: "React",        icon: "⚛️", color: "from-cyan-50    to-cyan-100/50   border-cyan-300   text-cyan-700"   },
  { name: "Node.js",      icon: "🟢", color: "from-lime-50    to-lime-100/50   border-lime-300   text-lime-700"   },
  { name: "TypeScript",   icon: "🔷", color: "from-blue-50    to-blue-100/50   border-blue-300   text-blue-700"   },
  { name: "Tailwind CSS", icon: "🎨", color: "from-teal-50    to-teal-100/50   border-teal-300   text-teal-700"   },
  { name: "Redux",        icon: "🔄", color: "from-purple-50  to-purple-100/50 border-purple-300 text-purple-700" },
  { name: "REST APIs",    icon: "🔗", color: "from-orange-50  to-orange-100/50 border-orange-300 text-orange-700" },
  { name: "JWT Auth",     icon: "🔐", color: "from-red-50     to-red-100/50    border-red-300    text-red-700"    },
  { name: "Git",          icon: "🐙", color: "from-slate-50   to-slate-100/50  border-slate-300  text-slate-700"  },
];

const LANG_COLORS: Record<string, string> = {
  JavaScript: "bg-yellow-400",
  TypeScript: "bg-blue-400",
  CSS:        "bg-purple-400",
  HTML:       "bg-orange-400",
  Python:     "bg-green-400",
  Java:       "bg-red-400",
  default:    "bg-slate-400",
};

const E_COMMERCE_PROJECT = {
  name: "E-Commerce Platform",
  description:
    "A full-stack MERN e-commerce application with complete shopping experience — product listings, cart management, secure checkout, order tracking, and an admin dashboard for inventory & order management.",
  tags: ["MongoDB", "Express", "React", "Node.js", "JWT", "Redux", "Stripe"],
  highlights: [
    "User authentication & authorization with JWT",
    "Product search, filter & pagination",
    "Cart & wishlist with persistent state via Redux",
    "Secure payment integration",
    "Admin dashboard — manage products, orders & users",
    "Responsive UI with Tailwind CSS",
  ],
  icon: "🛒",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days < 1) return "today";
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

// ─── Skeleton primitive ───────────────────────────────────────────────────────
function Sk({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return <div className={`animate-pulse rounded-lg bg-slate-200 ${className}`} style={style} />;
}

// ─── Skeleton Sections ────────────────────────────────────────────────────────
function HeroSkeleton() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center pb-12 pt-4">
      <div className="space-y-5 order-2 lg:order-1">
        <Sk className="h-8 w-52 rounded-full" />
        <div className="space-y-3">
          <Sk className="h-12 sm:h-16 w-full rounded-2xl" />
          <Sk className="h-12 sm:h-16 w-3/4 rounded-2xl" />
          <Sk className="h-4 w-52 rounded-full" />
        </div>
        <div className="space-y-2">
          <Sk className="h-4 w-full rounded-full" />
          <Sk className="h-4 w-5/6 rounded-full" />
          <Sk className="h-4 w-3/5 rounded-full" />
        </div>
        <div className="flex flex-wrap gap-2">
          {[110, 150, 130].map((w, i) => <Sk key={i} className="h-7 rounded-lg" style={{ width: w }} />)}
        </div>
        <div className="flex flex-wrap gap-3">
          <Sk className="h-11 w-36 rounded-xl" />
          <Sk className="h-11 w-28 rounded-xl" />
          <Sk className="h-11 w-28 rounded-xl" />
        </div>
      </div>
      <div className="flex justify-center lg:justify-end order-1 lg:order-2">
        <div className="relative">
          <Sk className="w-52 h-52 sm:w-64 sm:h-64 xl:w-80 xl:h-80 rounded-full" />
          <Sk className="absolute -bottom-4 -right-2 sm:-right-4 h-16 w-24 rounded-2xl" />
          <Sk className="absolute -top-4 -left-2 sm:-left-4 h-16 w-28 rounded-2xl" />
        </div>
      </div>
    </section>
  );
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-16 sm:mb-20">
      {Array.from({ length: 4 }).map((_, i) => <Sk key={i} className="h-24 rounded-2xl" />)}
    </div>
  );
}

function ReposSkeleton() {
  return (
    <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => <Sk key={i} className="h-36 rounded-2xl" />)}
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function AnimatedSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
    >
      {children}
    </div>
  );
}

function SectionLabel({ text, emoji }: { text: string; emoji: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-lg sm:text-xl">{emoji}</span>
      <h2 className="font-syne font-bold text-xl sm:text-2xl text-slate-900">{text}</h2>
      <div className="flex-1 h-px bg-gradient-to-r from-slate-300 to-transparent ml-2" />
    </div>
  );
}

function StatCard({ value, label }: { value: number | string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 px-3 sm:px-6 py-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-300 group cursor-default shadow-sm">
      <span className="text-2xl sm:text-3xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors font-mono tracking-tight">
        {value}
      </span>
      <span className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-widest font-medium text-center">{label}</span>
    </div>
  );
}

function TechBadge({ name, icon, color }: { name: string; icon: string; color: string }) {
  return (
    <div className={`flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border bg-gradient-to-br ${color} hover:scale-105 transition-transform duration-200 cursor-default`}>
      <span className="text-sm sm:text-base leading-none">{icon}</span>
      <span className="text-xs sm:text-sm font-semibold tracking-wide">{name}</span>
    </div>
  );
}

function RepoCard({ repo }: { repo: GitHubRepo }) {
  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col gap-3 p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-100 h-full shadow-sm"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-indigo-400 group-hover:text-indigo-600 transition-colors shrink-0">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8Z" />
            </svg>
          </span>
          <span className="font-semibold text-slate-800 group-hover:text-slate-900 transition-colors text-sm truncate">
            {repo.name}
          </span>
        </div>
        <span className="text-xs text-slate-400 shrink-0">{timeAgo(repo.updated_at)}</span>
      </div>
      {repo.description && (
        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{repo.description}</p>
      )}
      <div className="flex items-center gap-3 sm:gap-4 mt-auto pt-1 flex-wrap">
        {repo.language && (
          <div className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${LANG_COLORS[repo.language] ?? LANG_COLORS.default}`} />
            <span className="text-xs text-slate-500">{repo.language}</span>
          </div>
        )}
        <span className="text-xs text-slate-500">⭐ {repo.stargazers_count}</span>
        <span className="text-xs text-slate-500">🍴 {repo.forks_count}</span>
      </div>
    </a>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AboutPage() {
  const [user, setUser]       = useState<GitHubUser | null>(null);
  const [repos, setRepos]     = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGitHub() {
      try {
        const [userRes, reposRes] = await Promise.all([
          fetch("https://api.github.com/users/hardipsolanki22"),
          fetch("https://api.github.com/users/hardipsolanki22/repos?sort=updated&per_page=6"),
        ]);
        const userData: GitHubUser    = await userRes.json();
        const reposData: GitHubRepo[] = await reposRes.json();
        setUser(userData);
        setRepos(Array.isArray(reposData) ? reposData : []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchGitHub();
  }, []);

  const joinYear = user ? new Date(user.created_at).getFullYear() : null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@300;400&display=swap');
        .font-syne    { font-family: 'Syne', sans-serif; }
        .font-mono-dm { font-family: 'DM Mono', monospace; }
        @keyframes shimmer    { 0%{background-position:0% 50%} 100%{background-position:200% 50%} }
        @keyframes spin-slow  { to { transform: rotate(360deg); } }
        @keyframes float-anim { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        .spin-slow  { animation: spin-slow  10s linear      infinite; }
        .float-anim { animation: float-anim  6s ease-in-out infinite; }
        .gradient-text {
          background: linear-gradient(135deg, #6366f1, #0891b2, #7c3aed);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }
      `}</style>

      <div className="text-slate-800 w-full" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">

          {/* ── HERO ── */}
          {loading ? <HeroSkeleton /> : (
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center min-h-[60vh] pb-12">

              {/* Left */}
              <div className="space-y-5 sm:space-y-7 order-2 lg:order-1">
                <div className="inline-flex items-center gap-2.5 text-xs font-mono-dm text-indigo-600 uppercase tracking-widest border border-indigo-200 bg-indigo-50 px-4 py-2 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                  MERN Stack Developer
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <h1 className="font-syne font-extrabold text-4xl sm:text-5xl xl:text-7xl leading-[0.95] tracking-tight text-slate-900">
                    {user?.name?.split(" ")[0] ?? "Hardip"}{" "}
                    <span className="gradient-text">
                      {user?.name?.split(" ").slice(1).join(" ") ?? "Solanki"}
                    </span>
                  </h1>
                  <p className="font-mono-dm text-slate-500 text-xs sm:text-sm tracking-wide">
                    @{user?.login} · GitHub since {joinYear}
                  </p>
                </div>

                <p className="text-slate-600 text-sm sm:text-[15px] leading-relaxed max-w-md">
                  {user?.bio ?? "Passionate full-stack developer crafting scalable web applications with the MERN stack."}
                </p>

                {/* Meta pills */}
                <div className="flex flex-wrap gap-2">
                  {user?.location && (
                    <span className="flex items-center gap-1.5 text-xs text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
                      📍 {user?.location}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5 text-xs text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
                    💼 Open to opportunities
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
                    🚀 Building cool stuff
                  </span>
                </div>

                {/* CTAs */}
                <div className="flex flex-wrap gap-3 pt-2">
                  <a
                    href={user?.html_url ?? "https://github.com/hardipsolanki22"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-200"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                    </svg>
                    View GitHub
                  </a>
                  {user?.blog && (
                    <a
                      href={user?.blog?.startsWith("http") ? user?.blog : `https://${user?.blog}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-slate-700 font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5 shadow-sm"
                    >
                      🌐 Portfolio
                    </a>
                  )}
                  <a
                    href="mailto:hardipsolanki22@gmail.com"
                    className="flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 text-slate-700 font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5 shadow-sm"
                  >
                    ✉️ Contact
                  </a>
                </div>
              </div>

              {/* Right — Avatar */}
              <div className="flex justify-center lg:justify-end order-1 lg:order-2">
                <div className="relative float-anim">
                  {/* Spinning ring */}
                  <div
                    className="absolute inset-[-18px] rounded-full spin-slow opacity-70"
                    style={{ background: "conic-gradient(from 0deg, #6366f1, #0891b2, #7c3aed, #6366f1)", padding: "2px" }}
                  >
                    <div className="w-full h-full rounded-full bg-slate-50" />
                  </div>
                  <div className="relative w-52 h-52 sm:w-64 sm:h-64 xl:w-80 xl:h-80 rounded-full overflow-hidden border-4 border-slate-50 shadow-2xl shadow-indigo-200">
                    <img src={user?.avatar_url} alt={user?.name ?? "Avatar"} className="w-full h-full object-cover" />
                  </div>
                  {/* Repos badge */}
                  <div className="absolute -bottom-4 -right-2 sm:-right-4 bg-white border border-slate-200 rounded-2xl px-3 sm:px-4 py-2 sm:py-2.5 shadow-lg">
                    <p className="font-mono-dm text-[10px] text-slate-400 uppercase tracking-widest">Repos</p>
                    <p className="font-syne font-bold text-xl sm:text-2xl text-slate-900 leading-tight">{user?.public_repos}</p>
                  </div>
                  {/* Followers badge */}
                  <div className="absolute -top-4 -left-2 sm:-left-4 bg-white border border-slate-200 rounded-2xl px-3 sm:px-4 py-2 sm:py-2.5 shadow-lg">
                    <p className="font-mono-dm text-[10px] text-slate-400 uppercase tracking-widest">Followers</p>
                    <p className="font-syne font-bold text-xl sm:text-2xl text-slate-900 leading-tight">{user?.followers}</p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ── STATS ── */}
          {loading ? <StatsSkeleton /> : (
            <AnimatedSection>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-16 sm:mb-20">
                <StatCard value={user?.public_repos ?? "—"} label="Repositories" />
                <StatCard value={user?.followers    ?? "—"} label="Followers"    />
                <StatCard value={user?.following    ?? "—"} label="Following"    />
                <StatCard value={joinYear ? `${new Date().getFullYear() - joinYear}yr` : "—"} label="On GitHub" />
              </div>
            </AnimatedSection>
          )}

          {/* ── ABOUT ME ── */}
          <AnimatedSection>
            <section className="mb-16 sm:mb-20">
              <SectionLabel text="About Me" emoji="👤" />
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 sm:gap-8 mt-6 sm:mt-8">
                <div className="md:col-span-3 space-y-4 text-slate-600 text-sm sm:text-[15px] leading-relaxed">
                  <p>
                    I'm <span className="text-slate-900 font-semibold">Hardip Solanki</span>, a dedicated MERN Stack Developer
                    who loves building full-featured web applications from database to deployment. My stack of choice —
                    MongoDB, Express.js, React, and Node.js — gives me the power to own every layer of the product.
                  </p>
                  <p>
                    I enjoy writing clean, maintainable code with TypeScript and designing intuitive interfaces with
                    Tailwind CSS. I'm passionate about performance, developer experience, and turning ideas into polished products.
                  </p>
                  <p>
                    Currently focused on sharpening my backend architecture skills and diving deeper into cloud deployments.
                    Always up for interesting projects and collaborations.
                  </p>
                </div>
                <div className="md:col-span-2 flex flex-col gap-1">
                  {[
                    { label: "Speciality", value: "Full-Stack MERN"  },
                    { label: "Focus",      value: "Scalable Web Apps" },
                    { label: "Education",  value: "Computer Science"  },
                    { label: "Status",     value: "Open to Work 🟢"   },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between items-center py-3 border-b border-slate-200">
                      <span className="font-mono-dm text-[10px] sm:text-xs text-slate-400 uppercase tracking-widest">{item.label}</span>
                      <span className="text-xs sm:text-sm text-slate-700 font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </AnimatedSection>

          {/* ── FEATURED PROJECT ── */}
          <AnimatedSection>
            <section className="mb-16 sm:mb-20">
              <SectionLabel text="Featured Project" emoji="🚀" />
              <div className="mt-6 sm:mt-8 relative rounded-2xl sm:rounded-3xl border border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6 sm:p-8 md:p-10 overflow-hidden shadow-sm">
                <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-indigo-100/50 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full bg-purple-100/50 blur-3xl pointer-events-none" />
                <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
                  <div className="space-y-4 sm:space-y-5">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl sm:text-4xl">{E_COMMERCE_PROJECT.icon}</span>
                      <div>
                        <h3 className="font-syne font-bold text-xl sm:text-2xl text-slate-900">{E_COMMERCE_PROJECT.name}</h3>
                        <p className="font-mono-dm text-xs text-indigo-600 tracking-widest mt-0.5">MERN Stack Application</p>
                      </div>
                    </div>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{E_COMMERCE_PROJECT.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {E_COMMERCE_PROJECT.tags.map((tag) => (
                        <span key={tag} className="text-xs font-medium px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700 shadow-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <a
                      href={user?.html_url ?? "https://github.com/hardipsolanki22"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors group"
                    >
                      View on GitHub
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </a>
                  </div>
                  <div className="space-y-2.5 sm:space-y-3">
                    <p className="font-mono-dm text-xs text-slate-400 uppercase tracking-widest mb-3 sm:mb-4">Key Features</p>
                    {E_COMMERCE_PROJECT.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-3 text-xs sm:text-sm text-slate-600">
                        <span className="mt-0.5 text-emerald-500 shrink-0">✓</span>
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </AnimatedSection>

          {/* ── TECH STACK ── */}
          <AnimatedSection>
            <section className="mb-16 sm:mb-20">
              <SectionLabel text="Tech Stack" emoji="⚙️" />
              <div className="mt-6 sm:mt-8 flex flex-wrap gap-2 sm:gap-3">
                {TECH_STACK.map((tech, i) => (
                  <div key={tech.name} style={{ animationDelay: `${i * 60}ms` }}>
                    <TechBadge {...tech} />
                  </div>
                ))}
              </div>
            </section>
          </AnimatedSection>

          {/* ── REPOS ── */}
          <AnimatedSection>
            <section className="mb-16 sm:mb-20">
              <SectionLabel text="Recent Repositories" emoji="📦" />
              {loading ? <ReposSkeleton /> : repos.length > 0 ? (
                <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {repos.map((repo, i) => (
                    <AnimatedSection key={repo.id} delay={i * 80}>
                      <RepoCard repo={repo} />
                    </AnimatedSection>
                  ))}
                </div>
              ) : (
                <p className="mt-8 text-slate-500 text-sm">No repositories found.</p>
              )}
            </section>
          </AnimatedSection>

          {/* ── CONTACT CTA ── */}
          <AnimatedSection>
            <section>
              <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-gradient-to-br from-indigo-50/60 via-white to-emerald-50/60 p-8 sm:p-10 md:p-14 text-center relative overflow-hidden shadow-sm">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/30 via-transparent to-emerald-50/30 pointer-events-none" />
                <p className="font-mono-dm text-xs text-slate-400 uppercase tracking-widest mb-3 sm:mb-4">Let's Connect</p>
                <h2 className="font-syne font-extrabold text-3xl sm:text-4xl md:text-5xl text-slate-900 mb-3 sm:mb-4 leading-tight">
                  Got a project in mind?
                </h2>
                <p className="text-slate-500 text-sm sm:text-base mb-6 sm:mb-8 max-w-lg mx-auto">
                  I'm always open to discussing new opportunities, interesting projects, or just chatting about tech.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                  <a
                    href="mailto:hardipsolanki22@gmail.com"
                    className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-200"
                  >
                    ✉️ Send me an email
                  </a>
                  <a
                    href={user?.html_url ?? "https://github.com/hardipsolanki22"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 text-slate-700 font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5 shadow-sm"
                  >
                    🐙 GitHub Profile
                  </a>
                </div>
              </div>
            </section>
          </AnimatedSection>

          {/* ── Footer ── */}
          <footer className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3 text-slate-400 text-xs font-mono-dm">
            <span>© {new Date().getFullYear()} {user?.name ?? "Hardip Solanki"}. All rights reserved.</span>
            <span>Built with React · TypeScript · Tailwind CSS</span>
          </footer>
        </div>
      </div>
    </>
  );
}