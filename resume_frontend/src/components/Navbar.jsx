import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getAuthenticatedUser, isAuthenticated, logoutUser } from "../api/ResumeService";

const navItems = [
  { label: "Home", to: "/home" },
  { label: "Generate", to: "/generate-resume" },
  { label: "ATS Check", to: "/ats-check" },
  { label: "Job Matcher", to: "/job-matcher" },
  { label: "About Team", to: "/about" },
];

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const authenticated = isAuthenticated();
  const currentUser = getAuthenticatedUser();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const isActive = (to) => location.pathname === to || location.pathname.startsWith(`${to}/`);

  const linkClass = (to) =>
    [
      "rounded-full px-4 py-2 text-sm font-medium transition duration-300 ring-1 ring-inset",
      isActive(to)
        ? "bg-cyan-300 text-slate-950 ring-cyan-200/40 shadow-[0_10px_24px_rgba(34,211,238,0.2)]"
        : "bg-white/5 text-slate-300 ring-white/10 hover:bg-white/10 hover:text-white hover:ring-cyan-200/20",
    ].join(" ");

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[rgba(6,12,24,0.72)] backdrop-blur-xl">
      <div className="mx-auto grid w-full max-w-none items-center gap-5 px-3 py-4 sm:px-4 lg:grid-cols-[1fr_auto_1fr] lg:px-6">
        <div className="flex min-w-0 flex-shrink-0 items-center gap-3 sm:gap-4 lg:justify-self-start">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(56,189,248,0.95),rgba(129,140,248,0.95))] text-sm font-black text-slate-950 shadow-[0_14px_30px_rgba(56,189,248,0.22)]">
            AR
          </div>
          <div className="leading-tight">
            <Link
              to={authenticated ? "/home" : "/login"}
              className="block text-lg font-semibold tracking-tight text-white transition hover:text-cyan-200"
            >
              Ai Resume Generator
            </Link>
          </div>
        </div>

        <nav className="hidden justify-center lg:flex lg:justify-self-center">
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-2 shadow-[0_14px_30px_rgba(0,0,0,0.14)]">
            {authenticated
              ? navItems.map((item) => (
                  <Link key={item.to} to={item.to} className={linkClass(item.to)}>
                    {item.label}
                  </Link>
                ))
              : (
                  <Link
                    to="/login"
                    className="rounded-full bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 ring-1 ring-inset ring-white/10 transition duration-300 hover:bg-white/10 hover:text-white hover:ring-cyan-200/20"
                  >
                    Login
                  </Link>
                )}
          </div>
        </nav>

        <div className="flex flex-shrink-0 items-center gap-3 lg:justify-self-end lg:justify-end">
          <div className="hidden lg:flex">
            {authenticated ? (
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 shadow-[0_14px_30px_rgba(0,0,0,0.14)] transition duration-300 hover:-translate-y-0.5 hover:bg-white/10"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-300/15 text-sm font-semibold text-cyan-100">
                    {(currentUser?.fullName?.[0] || "U").toUpperCase()}
                  </div>
                  <div className="min-w-0 text-left">
                    <p className="truncate text-sm font-semibold text-white">
                      {currentUser?.fullName || "Profile"}
                    </p>
                    <p className="truncate text-xs text-slate-400">Click for account</p>
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="menu dropdown-content mt-4 w-72 rounded-[1.25rem] border border-white/10 bg-[rgba(10,16,30,0.96)] p-3 shadow-[0_22px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl"
                >
                  <li className="pointer-events-none rounded-xl px-3 py-2">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">User name</p>
                    <p className="mt-1 text-sm font-semibold text-white">
                      {currentUser?.fullName || "Signed in user"}
                    </p>
                  </li>
                  <li className="pointer-events-none rounded-xl px-3 py-2">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Email</p>
                    <p className="mt-1 text-sm text-slate-200">
                      {currentUser?.email || "No email available"}
                    </p>
                  </li>
                  <li className="mt-2">
                    <button
                      onClick={handleLogout}
                      className="w-full rounded-xl px-3 py-2 text-left text-sm text-slate-200 transition duration-300 hover:bg-white/8 hover:text-white"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <Link
                to="/login"
                className="rounded-full bg-[linear-gradient(135deg,#7fd0ff,#a8d8ff)] px-4 py-2 text-sm font-semibold text-slate-950 shadow-[0_12px_24px_rgba(127,208,255,0.22)] transition duration-300 hover:-translate-y-0.5 hover:brightness-105"
              >
                Login
              </Link>
            )}
          </div>

          <div className="dropdown  dropdown-end lg:hidden ml-auto  ">
            <div
              tabIndex={0}
              role="button"
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/8 text-white shadow-[0_12px_24px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-white/12"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu dropdown-content mt-4 w-72 rounded-[1.25rem] border border-white/10 bg-[rgba(10,16,30,0.96)] p-3 shadow-[0_22px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl"
            >
              {authenticated
                ? navItems.map((item) => (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        className={`rounded-xl px-3 py-2 text-sm transition duration-300 ${isActive(item.to) ? "bg-cyan-300 text-slate-950" : "text-slate-200 hover:bg-white/8 hover:text-white"}`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))
                : (
                    <li>
                      <Link
                        to="/login"
                        className="rounded-xl px-3 py-2 text-sm text-slate-200 transition duration-300 hover:bg-white/8 hover:text-white"
                      >
                        Login
                      </Link>
                    </li>
                  )}
              {authenticated ? (
                <li className="mt-2">
                  <button
                    onClick={handleLogout}
                    className="rounded-xl px-3 py-2 text-left text-sm text-slate-200 transition duration-300 hover:bg-white/8 hover:text-white"
                  >
                    Logout
                  </button>
                </li>
              ) : null}
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
