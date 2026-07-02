import {useContext, useState} from "react";
import {Link, useHistory} from "react-router-dom";
import {Button, Input, Label, WindmillContext} from "@windmill/react-ui";
import {setAdminSession} from "../auth/adminAuth";
import {MoonIcon, SunIcon} from "../../icons";
import {adminInputClass, adminPanelClass, adminPrimaryButtonClass} from "../utils/theme";
import {adminApi} from "../services/adminApi";

function AdminRegister() {
  const {mode, toggleMode} = useContext(WindmillContext);
  const history = useHistory();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    gender: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const {name, value} = event.target;
    setForm((current) => ({...current, [name]: value}));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();
    const email = form.email.trim();
    const password = form.password.trim();
    const phone = form.phone.trim();
    const gender = form.gender.trim();

    if (!firstName || !lastName || !email || !password || !phone || !gender) {
      setError("Fill in all fields to create your admin account.");
      return;
    }

    if (password.length < 8) {
      setError("Use at least 8 characters for the password.");
      return;
    }

    try {
      setLoading(true);

      const data = await adminApi.adminRegister({
        firstName,
        lastName,
        email,
        password,
        phone,
        gender,
        role: "admin",
      });

      console.log(data);

      setAdminSession({
        name: `${firstName} ${lastName}`.trim(),
        firstName,
        lastName,
        email,
        phone,
        gender,
        role: "admin",
      });

      history.replace("/admin/login");
    } catch (error) {
      console.log(error);
      setError("Registration failed");
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

      <div className={`relative mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl overflow-hidden ${adminPanelClass} lg:grid-cols-[0.9fr_1.1fr]`}>
        <section className="relative flex flex-col justify-between p-8 sm:p-12 lg:p-14">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(59,130,246,0.14),rgba(14,165,233,0.08),transparent)]" />

          <div className="relative z-10 max-w-xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-black/30 bg-black/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-black dark:border-cyan-300/30 dark:bg-cyan-400/10 dark:text-white">Admin Access Setup</p>
            <h1 className="mt-6 text-4xl font-semibold leading-tight text-black dark:text-white sm:text-5xl">Create a secure admin account.</h1>
            <p className="mt-5 max-w-lg text-sm leading-6 text-black dark:text-slate-200 sm:text-base">Register a new workspace user with admin access, then move straight into dashboards and orders.</p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                ["8+", "Password Length"],
                ["1", "Single Account Flow"],
                ["RBAC", "Protected Access"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-3xl border border-white/15 bg-white/10 p-4 shadow-lg shadow-black/10">
                  <p className="text-2xl font-semibold text-black dark:text-white">{value}</p>
                  <p className="mt-1 text-sm text-black dark:text-slate-200">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 mt-10 rounded-[1.5rem] border border-white/15 bg-slate-950/45 p-5 text-sm text-slate-200">
            <p className="font-semibold text-white">Already have an account?</p>
            <p className="mt-2">Use the sign-in page to continue with an existing admin session.</p>
          </div>
        </section>

        <section className="flex items-center justify-center bg-white/95 p-6 text-slate-900 transition-colors duration-300 sm:p-10 dark:bg-slate-950/90 dark:text-slate-100">
          <form className="w-full max-w-lg rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] transition-colors duration-300 dark:border-white/10 dark:bg-slate-900" onSubmit={handleSubmit}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-600 dark:text-cyan-300">Admin Register</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">Create your account</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Set up your admin profile and access the control center.</p>
            </div>

            <div className="mt-6 space-y-5">
              <div className="flex gap-3 w-full">
                <Label>
                  <span className="text-slate-700 dark:text-slate-200">First name</span>
                  <Input name="firstName" className={`${adminInputClass} mt-2 p-2 w-[215px]`} value={form.firstName} onChange={handleChange} />
                </Label>

                <Label>
                  <span className="text-slate-700 dark:text-slate-200">Last name</span>
                  <Input name="lastName" className={`${adminInputClass} mt-2 p-2 w-[215px]`} value={form.lastName} onChange={handleChange} />
                </Label>
              </div>

              <div className="flex gap-3 w-full">
                <Label>
                  <span className="text-slate-700 dark:text-slate-200">Email</span>
                  <Input name="email" type="email" className={`${adminInputClass} mt-2 p-2 w-[215px]`} value={form.email} onChange={handleChange} />
                </Label>

                <Label>
                  <span className="text-slate-700 dark:text-slate-200">Password</span>
                  <Input name="password" type="password" className={`${adminInputClass} mt-2 p-2 w-[215px]`} value={form.password} onChange={handleChange} />
                </Label>
              </div>

              <Label>
                <span className="text-slate-700 dark:text-slate-200">Phone</span>
                <Input name="phone" type="tel" className={`${adminInputClass} mt-2 p-2`} value={form.phone} onChange={handleChange} />
              </Label>

              <Label>
                <span className="text-slate-700 dark:text-slate-200">Gender</span>
                <select name="gender" className={`${adminInputClass} mt-2 dark:bg-gray-700`} value={form.gender} onChange={handleChange}>
                  <option value="" className="dark:bg-gray-700">
                    Select gender
                  </option>
                  <option value="female" className="dark:bg-gray-700">
                    Female
                  </option>
                  <option value="male" className="dark:bg-gray-700">
                    Male
                  </option>
                </select>
              </Label>

              {error ? <p className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-600 dark:text-rose-300">{error}</p> : null}

              <Button className={`${adminPrimaryButtonClass} py-3 text-base shadow-lg shadow-slate-950/20 transition hover:scale-[1.01] dark:hover:bg-slate-200`} type="submit" block disabled={loading} onClick={handleSubmit}>
                {loading ? "Creating account..." : "Create Admin Account"}
              </Button>
            </div>

            <div className="mt-8 flex items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span>Role: Admin</span>
              <Link to="/admin/login" className="font-semibold text-cyan-600 transition hover:text-cyan-700 dark:text-cyan-300 dark:hover:text-cyan-200">
                Back to sign in
              </Link>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

export default AdminRegister;
