import {useContext, useState} from "react";
import {Link, useHistory} from "react-router-dom";
import {Button, Input, Label, WindmillContext} from "@windmill/react-ui";
import {setAdminSession} from "../auth/adminAuth";
import {MoonIcon, SunIcon} from "../../icons";
import {adminInputClass, adminPanelClass, adminPrimaryButtonClass} from "../utils/theme";
import {adminApi} from "../services/adminApi";

function AdminLogin() {
  const {mode, toggleMode} = useContext(WindmillContext);
  const history = useHistory();
  const [form, setForm] = useState({email: "", password: ""});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const {name, value} = e.target;
    setForm((current) => ({...current, [name]: value}));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const email = form.email.trim();
    const password = form.password.trim();

    if (!email || !password) {
      setError("Enter admin credentials to continue.");
      return;
    }

    try {
      setLoading(true);

      const data = await adminApi.adminLogin({
        email,
        password,
      });

      console.log(data);

      setAdminSession({
        firstName: data?.data?.firstName,
        lastName: data?.data?.lastName,
        email: data?.data?.email,
        role: "admin",
        token: data?.data?.accessToken,
        user_id :data?.data?.user_id
      });

      console.log("FULL RESPONSE", data);
      console.log("TOKEN", data.token);
      console.log("ACCESS TOKEN", data?.data?.accessToken);

      history.replace("/admin/dashboard");
    } catch (error) {
      console.log(error);
      setError(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.22),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(99,102,241,0.2),_transparent_35%),linear-gradient(180deg,_#e2e8f0_0%,_#f8fafc_100%)] px-4 py-10 text-slate-900 transition-colors duration-300 dark:bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.22),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(99,102,241,0.2),_transparent_35%),linear-gradient(180deg,_#020617_0%,_#0f172a_100%)] dark:text-slate-100 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute -left-20 top-14 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />

      <button type="button" onClick={toggleMode} aria-label={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"} className="absolute right-6 top-6 z-20 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 shadow-lg shadow-slate-950/10 backdrop-blur transition hover:bg-white dark:border-white/10 dark:bg-slate-950/80 dark:text-slate-200 dark:hover:bg-slate-900">
        {mode === "dark" ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
        {mode === "dark" ? "Light mode" : "Dark mode"}
      </button>

      <div className={`relative mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl overflow-hidden ${adminPanelClass} lg:grid-cols-[1.15fr_0.85fr]`}>
        <section className="relative flex flex-col justify-between p-8 sm:p-12 lg:p-14">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(6,182,212,0.14),rgba(59,130,246,0.08),transparent)]" />

          <div className="relative z-10 max-w-xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-black/30 bg-black/10 dark:border-cyan-300/30 dark:bg-cyan-400/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-black">Admin Control Center</p>
            <h1 className="mt-6 text-4xl font-semibold leading-tight text-black dark:text-white sm:text-5xl">Run your store with precision and speed.</h1>
            <p className="mt-5 max-w-lg text-sm leading-6 text-black dark:text-slate-200 sm:text-base">Monitor KPIs, process orders, manage catalog updates, and keep operations healthy from a single secure workspace.</p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                ["24/7", "Live Monitoring"],
                ["RBAC", "Protected Access"],
                ["Realtime", "Live Signals"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-3xl border border-white/15 bg-white/10 p-4 shadow-lg shadow-black/10">
                  <p className="text-2xl font-semibold text-black dark:text-white">{value}</p>
                  <p className="mt-1 text-sm text-black dark:text-slate-200">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 mt-10 rounded-[1.5rem] border border-white/15 bg-slate-950/45 p-5 text-sm text-slate-200">
            <p className="font-semibold text-white">Demo credentials prefilled</p>
            <p className="mt-2">Use the provided admin email and password to continue. Session is stored locally for protected routes.</p>
          </div>
        </section>

        <section className="flex items-center justify-center bg-white/95 p-6 text-slate-900 transition-colors duration-300 sm:p-10 dark:bg-slate-950/90 dark:text-slate-100">
          <form className="w-full max-w-md rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] transition-colors duration-300 dark:border-white/10 dark:bg-slate-900" onSubmit={handleSubmit}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-600 dark:text-cyan-300">Admin Sign In</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">Welcome back</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Sign in to continue to the operations dashboard.</p>
            </div>


            <div className="mt-6 space-y-5">
              <Label>
                <span className="text-slate-700 dark:text-slate-200">Email</span>
                <Input name="email" className={`${adminInputClass} mt-2 p-2`} value={form.email} onChange={handleChange} />
              </Label>

              <Label>
                <span className="text-slate-700 dark:text-slate-200">Password</span>
                <Input name="password" type="password" className={`${adminInputClass} mt-2 p-2`} value={form.password} onChange={handleChange} />
              </Label>

              {error ? <p className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-600 dark:text-rose-300">{error}</p> : null}

              <Button className={`${adminPrimaryButtonClass} py-3 text-base shadow-lg shadow-slate-950/20 transition hover:scale-[1.01] dark:hover:bg-slate-200`} type="submit" block disabled={loading}>
                {loading ? "Signing in..." : "Enter Admin Panel"}
              </Button>
            </div>

            <div className="mt-8 flex items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span>Role: Admin</span>
              <Link to="/admin/register" className="font-semibold text-cyan-600 transition hover:text-cyan-700 dark:text-cyan-300 dark:hover:text-cyan-200">
                Create an account
              </Link>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

export default AdminLogin;
