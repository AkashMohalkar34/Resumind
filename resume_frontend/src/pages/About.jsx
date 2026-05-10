import React from "react";
import { Link } from "react-router-dom";

const teamMembers = [
  {
    name: "Akash Mohalkar",
    role: "Java Developer (Team Leader)",
    description:
      "Leads the team architecture, backend coordination, and overall project direction.",
    accent: "from-cyan-300/30 to-sky-500/20",
  },
  {
    name: "Paudmal Nikhil",
    role: "Python Developer",
    description:
      "Works on Python-based logic, automation, and integration support across the project.",
    accent: "from-indigo-300/30 to-violet-500/20",
  },
  {
    name: "Pradip Khendake",
    role: "Python Developer",
    description:
      "Focuses on backend implementation, features, and supporting the resume workflow.",
    accent: "from-emerald-300/30 to-teal-500/20",
  },
  {
    name: "Sandip Pangavhne",
    role: "Software Developer",
    description:
      "Supports UI, feature development, and smooth end-to-end product delivery.",
    accent: "from-amber-300/30 to-orange-500/20",
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.16),transparent_32%),radial-gradient(circle_at_top_right,rgba(99,102,241,0.18),transparent_28%),linear-gradient(180deg,#040814_0%,#081121_45%,#0a1629_100%)] px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[rgba(9,15,28,0.82)] shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <div className="border-b border-white/10 px-6 py-8 sm:px-10 sm:py-10">
            <div className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100">
              About Team
            </div>
            <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <h1 className="text-4xl font-black tracking-tight ">
                  Meet the team behind the project under the guidance of Dr. M.D. Nirmal.
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                  We are a four-person team building the resume generator,
                  ATS checker, and job matcher experience with a focus on clean
                  design, practical features, and a smooth user journey.
                </p>
                <div className="mt-5 inline-flex flex-col gap-2 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-5 py-4 text-sm shadow-[0_14px_35px_rgba(34,211,238,0.08)] sm:text-base">
                  <p className="font-semibold text-cyan-100">
                    Guide: <span className="font-black text-white">Dr. M.D. Nirmal.</span>
                  </p>
                  <p className="text-slate-200">
                    Computer Engineering
                  </p>
                </div>
              </div>
              <Link
                to="/home"
                className="inline-flex items-center justify-center rounded-full bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition duration-300 hover:-translate-y-0.5 hover:brightness-110"
              >
                Back to Home
              </Link>
            </div>
          </div>

          <div className="grid gap-6 px-6 py-8 sm:px-10 lg:grid-cols-[1fr_1.6fr]">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200">
                Team Vision
              </p>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                We want to make resume building simpler, faster, and more
                effective for students and job seekers. Our work combines
                modern UI, resume intelligence, and job matching into one
                seamless workflow.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.04)] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    Team Size
                  </p>
                  <p className="mt-2 text-2xl font-black text-white">4</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.04)] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    Focus
                  </p>
                  <p className="mt-2 text-2xl font-black text-white">Web App</p>
                </div>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {teamMembers.map((member) => (
                <article
                  key={member.name}
                  className="group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-[rgba(255,255,255,0.04)] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.16)] transition duration-300 hover:-translate-y-1 hover:border-cyan-200/30 hover:bg-[rgba(255,255,255,0.06)]"
                >
                  <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${member.accent}`} />
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(56,189,248,0.95),rgba(129,140,248,0.95))] text-lg font-black text-slate-950 shadow-[0_14px_30px_rgba(56,189,248,0.18)]">
                      {member.name
                        .split(" ")
                        .map((part) => part[0])
                        .slice(0, 2)
                        .join("")}
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-xl font-bold text-white">{member.name}</h2>
                      <p className="mt-1 text-sm font-semibold text-cyan-200">{member.role}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-300">
                    {member.description}
                  </p>
                </article>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default About;
