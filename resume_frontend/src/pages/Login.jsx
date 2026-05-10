import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { EnvelopeIcon, LockClosedIcon, UserIcon } from "@heroicons/react/24/outline";
import { FaFacebookF, FaGoogle, FaApple } from "react-icons/fa";
import toast from "react-hot-toast";
import { loginUser, saveAuthenticatedUser, signupUser } from "../api/ResumeService";

const initialFormState = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

function Login() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isLogin = mode === "login";
  const redirectPath = location.state?.from || "/home";

  const updateField = (field) => (event) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: event.target.value,
    }));
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setForm(initialFormState);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.email.trim() || !form.password.trim()) {
      toast.error("Email and password are required.");
      return;
    }

    if (!isLogin && !form.fullName.trim()) {
      toast.error("Full name is required.");
      return;
    }

    if (!isLogin && form.password !== form.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const payload = isLogin
        ? {
            email: form.email.trim(),
            password: form.password,
          }
        : {
            fullName: form.fullName.trim(),
            email: form.email.trim(),
            password: form.password,
          };

      const response = isLogin ? await loginUser(payload) : await signupUser(payload);
      saveAuthenticatedUser(response.user);

      toast.success(response.message || (isLogin ? "Login successful" : "Account created successfully"));
      navigate(redirectPath, { replace: true });
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Unable to complete your request right now.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(120,99,255,0.22),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(58,194,255,0.18),_transparent_28%),linear-gradient(135deg,_#091225_0%,_#0b1730_50%,_#111f3e_100%)] px-6 py-10 text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-4rem] top-24 h-56 w-56 rounded-full bg-violet-400/20 blur-3xl" />
        <div className="absolute bottom-10 right-[-3rem] h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1fr_0.95fr]">
        <section className="text-slate-100">
          <p className="inline-flex rounded-full border border-white/10 bg-white/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-slate-300 backdrop-blur">
            Account Access
          </p>
          <h1 className="mt-6 max-w-2xl font-['Georgia','Times_New_Roman',serif] text-6xl font-semibold leading-tight text-slate-50 md:text-6xl">
            Sign in first, then unlock the resume builder.
          </h1>
         

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 shadow-[0_14px_34px_rgba(0,0,0,0.2)] backdrop-blur">
              <p className="text-2xl font-semibold text-cyan-200">MySQL</p>
              <p className="mt-2 text-sm uppercase tracking-[0.16em] text-slate-400">
                stored user accounts
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 shadow-[0_14px_34px_rgba(0,0,0,0.2)] backdrop-blur">
              <p className="text-2xl font-semibold text-cyan-200">Protected</p>
              <p className="mt-2 text-sm uppercase tracking-[0.16em] text-slate-400">
                gated app routes
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 shadow-[0_14px_34px_rgba(0,0,0,0.2)] backdrop-blur">
              <p className="text-2xl font-semibold text-cyan-200">Secure</p>
              <p className="mt-2 text-sm uppercase tracking-[0.16em] text-slate-400">
                hashed passwords
              </p>
            </div>
          </div>

          <div className="mt-10">
            <p className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 text-base leading-7 text-slate-300 shadow-[0_14px_34px_rgba(0,0,0,0.2)] backdrop-blur">
              After login, the app will send you directly to your protected home page.
            </p>
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(26,34,57,0.96),rgba(16,22,38,0.96))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl md:p-8">
          <div className="flex rounded-full border border-white/10 bg-white/5 p-1">
            <button
              type="button"
              onClick={() => switchMode("login")}
              className={`flex-1 rounded-full px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] transition ${
                isLogin ? "bg-cyan-300 text-slate-950" : "text-slate-400"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => switchMode("signup")}
              className={`flex-1 rounded-full px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] transition ${
                !isLogin ? "bg-cyan-300 text-slate-950" : "text-slate-400"
              }`}
            >
              Create Account
            </button>
          </div>

          <div className="mt-8">
            <h2 className="text-3xl font-semibold text-slate-50">
              {isLogin ? "Sign in to your account" : "Create your account"}
            </h2>
            <p className="mt-3 text-base leading-7 text-slate-300">
              {isLogin
                ? "Use your registered email and password to continue."
                : "Your account will be stored in MySQL and used to protect the app pages."}
            </p>
          </div>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            {!isLogin && (
              <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                <UserIcon className="h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Full name"
                  className="w-full bg-transparent text-slate-100 outline-none placeholder:text-slate-500"
                  value={form.fullName}
                  onChange={updateField("fullName")}
                  disabled={loading}
                />
              </label>
            )}

            <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
              <EnvelopeIcon className="h-5 w-5 text-slate-400" />
              <input
                type="email"
                placeholder="Email address"
                className="w-full bg-transparent text-slate-100 outline-none placeholder:text-slate-500"
                value={form.email}
                onChange={updateField("email")}
                disabled={loading}
              />
            </label>

            <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
              <LockClosedIcon className="h-5 w-5 text-slate-400" />
              <input
                type="password"
                placeholder={isLogin ? "Password" : "Create a password"}
                className="w-full bg-transparent text-slate-100 outline-none placeholder:text-slate-500"
                value={form.password}
                onChange={updateField("password")}
                disabled={loading}
              />
            </label>

            {!isLogin && (
              <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                <LockClosedIcon className="h-5 w-5 text-slate-400" />
                <input
                  type="password"
                  placeholder="Confirm password"
                  className="w-full bg-transparent text-slate-100 outline-none placeholder:text-slate-500"
                  value={form.confirmPassword}
                  onChange={updateField("confirmPassword")}
                  disabled={loading}
                />
              </label>
            )}

            {isLogin && (
              <p className="text-right text-sm font-medium text-cyan-200">
                Protected login required for access
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-cyan-300 px-5 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
            </button>
          </form>

          
        

          <div className="mt-6 text-center text-sm text-slate-300">
            {isLogin ? "Need a new account?" : "Already registered?"}{" "}
            <button
              type="button"
              onClick={() => switchMode(isLogin ? "signup" : "login")}
              className="font-semibold text-cyan-200"
            >
              {isLogin ? "Create one" : "Sign in"}
            </button>
          </div>

          <div className="mt-6 text-center">
            <Link to="/login" className="text-xs uppercase tracking-[0.18em] text-slate-500">
              Protected entry route
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Login;
