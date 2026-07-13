import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {faEye, faEyeSlash} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {BASE_URL} from "../apis";
import {UserPlus} from "lucide-react";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState({});

  const navigate = useNavigate();

  const addUser = (e) => {
    setError({});
    e.preventDefault();

    if (!firstName || !lastName || !password || !email || !phone || !gender) {
      setError({
        firstName: !firstName && "Firstname required",
        lastName: !lastName && "Name required",
        password: !password && "Password required",
        email: !email && "Email required",
        phone: !phone && "Phone required",
        gender: !gender && "Gender required",
      });
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(email)) {
      setError({email: "Invalid email format"});
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%]).{8,}$/;
    if (!passwordRegex.test(password)) {
      setError({password: "Weak password"});
      return;
    }

    const phoneRegex = /^(\+91[\-\s]?)?[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      setError({phone: "Invalid phone number"});
      return;
    }

    // const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
    // const userExists = users.some((user) => user.email.toLowerCase() === email.toLowerCase() || user.phone === phone);

    // if (userExists) {
    //   alert("User already exists with this email");
    //   return;
    // }

    // const newUser = {
    //   id: Date.now(),
    //   firstName: firstName.trim(),
    //   lastName: lastName.trim(),
    //   password,
    //   email: email.trim().toLowerCase(),
    //   phone: phone.trim(),
    //   gender,
    // };

    // localStorage.setItem("registeredUsers", JSON.stringify([...users, newUser]));

    fetch(`${BASE_URL}/users/register-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName,
        lastName,
        password,
        email,
        phone,
        gender,
        role: "user",
      }),
    })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message);
        }

        setFirstName("");
        setLastName("");
        setPassword("");
        setEmail("");
        setPhone("");
        setGender("");

        alert("Registration successful");
        navigate("/login", {replace: true});

        console.log("BASE_URL =", BASE_URL);
        console.log("ENV =", import.meta.env.VITE_BASE_URL);
      })
      .catch((err) => {
        console.log(err);
      });

    // console.log({firstName, lastName, email, password, phone, role});
  };

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[#f7f7fb] px-4 py-10 text-black">
      <form onSubmit={addUser} className="section-surface flex w-full max-w-xl flex-col p-7 sm:p-9">
        <span className="premium-pill mb-4 self-start">Create account</span>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">Join Novo Trends</h1>
        <p className="mt-1.5 text-sm text-slate-500">Sign up to start your premium shopping experience.</p>

        <div className="mt-6 flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="premium-label">First Name</label>
              <input type="text" placeholder="First name" className="premium-input" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              {error.firstName && <p className="premium-field-error">{error.firstName}</p>}
            </div>
            <div>
              <label className="premium-label">Last Name</label>
              <input type="text" placeholder="Last name" className="premium-input" value={lastName} onChange={(e) => setLastName(e.target.value)} />
              {error.lastName && <p className="premium-field-error">{error.lastName}</p>}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="premium-label">Email</label>
              <input type="email" placeholder="example@email.com" className="premium-input" value={email} onChange={(e) => setEmail(e.target.value)} />
              {error.email && <p className="premium-field-error">{error.email}</p>}
            </div>

            <div>
              <label className="premium-label">Number</label>
              <input type="text" placeholder="+91xxxxxxxxxx" className="premium-input" value={phone} onChange={(e) => setPhone(e.target.value)} />
              {error.phone && <p className="premium-field-error">{error.phone}</p>}
            </div>
          </div>

          <div>
            <label className="premium-label">Gender</label>
            <div className="flex flex-wrap items-center gap-3">
              <label className={`premium-radio-tile ${gender === "male" ? "is-active" : ""}`}>
                <input type="radio" name="gender" value="male" checked={gender === "male"} onChange={(e) => setGender(e.target.value)} className="h-4 w-4 text-slate-950 focus:ring-slate-950" />
                <span className="text-sm font-medium text-slate-800">Male</span>
              </label>

              <label className={`premium-radio-tile ${gender === "female" ? "is-active" : ""}`}>
                <input type="radio" name="gender" value="female" checked={gender === "female"} onChange={(e) => setGender(e.target.value)} className="h-4 w-4 text-slate-950 focus:ring-slate-950" />
                <span className="text-sm font-medium text-slate-800">Female</span>
              </label>
              {error.gender && <p className="premium-field-error">{error.gender}</p>}
            </div>
          </div>

          <div>
            <label className="premium-label">Password</label>

            <div className="relative">
              <input type={visible ? "text" : "password"} placeholder="Enter your password" className="premium-input pr-12" value={password} onChange={(e) => setPassword(e.target.value)} required />

              <button type="button" onClick={() => setVisible(!visible)} className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center text-slate-400 hover:text-slate-700" aria-label={visible ? "Hide password" : "Show password"}>
                <FontAwesomeIcon icon={visible ? faEyeSlash : faEye} className="text-lg" />
              </button>
            </div>
          </div>
        </div>

        <button type="submit" className="premium-btn-primary mt-7 w-full py-3.5 text-base">
          <UserPlus className="h-4 w-4" />
          Submit
        </button>

        <div className="mt-5 text-center flex gap-1 justify-center text-xs sm:text-sm text-slate-500">
          Already have an account?
          <Link to="/login" className="inline font-semibold text-slate-950 hover:underline">
            Log in.
          </Link>
        </div>
      </form>
    </main>
  );
};

export default Register;
