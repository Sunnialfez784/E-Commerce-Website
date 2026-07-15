import React, {useEffect, useState} from "react";
import {PiUserCircle} from "react-icons/pi";
import {useAuth} from "../context/AuthContext";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye, faEyeSlash} from "@fortawesome/free-solid-svg-icons";
import {BASE_URL} from "../apis";
import Navbar from "./Navbar";
import {Mail, Phone, User} from "lucide-react";

const Profile = () => {
  const {user, setUser} = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [visible, setVisible] = useState(false);

  const {token} = useAuth();

  console.log(user, "hello");
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setGender(user.gender || "");
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      const response = await fetch(`${BASE_URL}/users/edit-user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: user.user_id,
          firstName,
          lastName,
          email,
          phone,
          gender,
        }),
      });

      const data = await response.json();

      console.log("UPDATED DATA:", data);

      if (!response.ok) {
        throw new Error(data.errors[0]);
      }

      const updatedUser = {
        ...user,
        firstName,
        lastName,
        email,
        phone,
        gender,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      
      setUser(updatedUser);
      alert("Profile Updated Successfully");
      
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  return (
    <>
      <Navbar />

      <main className="app-shell w-full text-black">
        <div className="page-shell py-6 lg:py-10">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Account</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">Your Profile</h1>
          </div>

          <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
            <section className="section-surface h-fit p-6 sm:p-7">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-950 text-white shadow-lg shadow-slate-950/20">
                  <PiUserCircle className="h-16 w-16" />
                </div>

                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Hello</p>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
                  {firstName} {lastName}
                </h2>

                <div className="mt-6 w-full space-y-3 border-t border-slate-200 pt-6 text-left">
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <Mail className="h-4 w-4 shrink-0 text-slate-500" />
                    <p className="truncate text-sm text-slate-700">{email || "No email added"}</p>
                  </div>
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <Phone className="h-4 w-4 shrink-0 text-slate-500" />
                    <p className="truncate text-sm text-slate-700">{phone || "No phone added"}</p>
                  </div>
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <User className="h-4 w-4 shrink-0 text-slate-500" />
                    <p className="truncate text-sm capitalize text-slate-700">{gender || "Gender not set"}</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="section-surface p-6 sm:p-7">
              <h2 className="text-lg font-semibold tracking-tight text-slate-950">Personal information</h2>
              <p className="mt-1 text-sm text-slate-500">Update your details to keep your account current.</p>

              <div className="mt-6 flex flex-col gap-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="premium-label">First Name</label>
                    <input type="text" placeholder="First name" className="premium-input" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                  </div>

                  <div>
                    <label className="premium-label">Last Name</label>
                    <input type="text" placeholder="Last name" className="premium-input" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="premium-label">Email</label>
                    <input type="email" placeholder="example@email.com" className="premium-input" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>

                  <div>
                    <label className="premium-label">Number</label>
                    <input type="text" placeholder="+91xxxxxxxxxx" className="premium-input" value={phone} onChange={(e) => setPhone(e.target.value)} />
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
                  </div>
                </div>

                <button type="button" onClick={handleUpdate} className="premium-btn-primary mt-2 w-full py-3.5 text-base sm:w-auto sm:self-start sm:px-8">
                  Update Information
                </button>
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
};

export default Profile;
