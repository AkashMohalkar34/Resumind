import React from "react";
import { Link } from "react-router-dom";

const featureCards = [
    {
        title: "Prompt To Resume",
        description:
            "Write about your experience in plain language and let the app shape it into structured resume sections.",
        eyebrow: "Fast input",
    },
    {
        title: "Editable Final Pass",
        description:
            "Review every generated line, adjust details, and fine-tune the content before exporting.",
        eyebrow: "Human control",
    },
    {
        title: "Visual Template Picks",
        description:
            "Choose a style that fits the role you want, from clean ATS-friendly layouts to polished modern looks.",
        eyebrow: "Flexible output",
    },
];

const stats = [
    { value: "10+", label: "template directions" },
    { value: "1", label: "single prompt to begin" },
    { value: "A4", label: "export-ready layout" },
];

const testimonials = [
    {
        quote:
            "I went from a rough paragraph to a resume I could actually send in the same evening.",
        name: "Uday",
        role: "Student",
    },
    {
        quote:
            "The editing step matters a lot. It feels fast, but I still get full control over the final resume.",
        name: "Rohit Pathade",
        role: "Student",
    },
];

const steps = [
    "Describe your experience, projects, and strengths in your own words.",
    "Review the generated sections and clean up anything you want to personalize.",
    "Pick a template and export a resume that feels intentional and job-ready.",
];

const LandingPage = () => {
    return (
        <div className="resume-home min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top_left,_rgba(120,99,255,0.22),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(58,194,255,0.18),_transparent_28%),linear-gradient(135deg,_#091225_0%,_#0b1730_50%,_#111f3e_100%)] text-slate-100">
            <section className="relative isolate">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute left-[-8rem] top-10 h-64 w-64 rounded-full bg-violet-400/20 blur-3xl opacity-70" />
                    <div className="absolute right-[-5rem] top-24 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl opacity-60" />
                    <div className="absolute inset-x-0 top-0 h-full bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_50%)]" />
                </div>

                <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-7xl flex-col justify-center px-4 py-12 sm:px-6 sm:py-14 md:px-10 lg:px-12">
                    <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
                        <div className="relative z-10">
                            <p className="mb-4 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-slate-300 shadow-sm backdrop-blur">
                                AI Resume Studio
                            </p>
                            <h1 className="max-w-4xl font-['Georgia','Times_New_Roman',serif] text-4xl font-semibold leading-tight text-slate-50 sm:text-5xl md:text-6xl lg:text-5xl">
                                Turn raw career notes into a resume that looks sharp from the first screen.
                            </h1>
                           { /*<p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8 md:text-xl">
                                Build a polished resume with a richer workflow: describe yourself,
                                refine the generated details, choose a visual template, and export
                                with confidence.
                            </p> */}

                            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                                <Link
                                    to="/generate-resume"
                                    className="inline-flex items-center justify-center rounded-full bg-cyan-300 px-7 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-slate-950 transition duration-300 hover:-translate-y-0.5 hover:bg-cyan-200"
                                >
                                    Build My Resume
                                </Link>
                                <Link
                                    to="/ats-check"
                                    className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-7 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-slate-200 backdrop-blur transition duration-300 hover:border-cyan-200/30 hover:bg-white/10"
                                >
                                    Open ATS Check
                                </Link>
                                <Link
                                    to="/job-matcher"
                                    className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-7 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-slate-200 backdrop-blur transition duration-300 hover:border-cyan-200/30 hover:bg-white/10"
                                >
                                    Job Matcher
                                </Link>
                                <a
                                    href="#features"
                                    className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-7 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-slate-200 backdrop-blur transition duration-300 hover:border-cyan-200/30 hover:bg-white/10"
                                >
                                    Explore Features
                                </a>
                            </div>

                            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {stats.map((stat) => (
                                    <div
                                        key={stat.label}
                                        className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.18)] backdrop-blur"
                                    >
                                        <p className="text-3xl font-semibold text-cyan-200">
                                            {stat.value}
                                        </p>
                                        <p className="mt-2 text-sm uppercase tracking-[0.18em] text-slate-400">
                                            {stat.label}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative z-10">
                            <div className="relative mx-auto max-w-xl rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(27,36,59,0.98),rgba(17,25,43,0.95))] p-5 shadow-[0_30px_90px_rgba(0,0,0,0.24)] backdrop-blur-xl">
                                <div className="absolute -left-6 top-10 hidden rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-300 shadow-lg md:block">
                                    Prompt in. Resume out.
                                </div>
                                <div className="absolute -right-6 bottom-12 hidden rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-300 shadow-lg md:block">
                                    Human edits stay in the loop.
                                </div>

                                <div className="rounded-[1.6rem] bg-[linear-gradient(180deg,#1b243b_0%,#11192b_100%)] p-6 text-white">
                                    <div className="mb-5 flex items-center justify-between">
                                        <div>
                                            <p className="text-xs uppercase tracking-[0.28em] text-white/60">
                                                Preview
                                            </p>
                                            <p className="mt-2 text-2xl font-semibold">
                                                Resume workspace
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <span className="h-3 w-3 rounded-full bg-[#ff8a5b]" />
                                            <span className="h-3 w-3 rounded-full bg-[#ffd166]" />
                                            <span className="h-3 w-3 rounded-full bg-[#8bd3dd]" />
                                        </div>
                                    </div>

                                    <div className="space-y-4 rounded-[1.35rem] bg-white/[0.04] p-4">
                                        <div className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.06)] p-4 text-slate-100">
                                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted-ink)]">
                                                Prompt
                                            </p>
                                            <p className="mt-3 text-sm leading-7 text-slate-300">
                                                Full-stack developer with strong Spring Boot,
                                                React, SQL, cloud deployment, and product-focused
                                                delivery experience...
                                            </p>
                                        </div>

                                        <div className="grid gap-3 md:grid-cols-[0.9fr_1.1fr]">
                                            <div className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.04)] p-4 text-slate-100">
                                                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted-ink)]">
                                                    Structured sections
                                                </p>
                                                <ul className="mt-3 space-y-2 text-sm text-slate-300">
                                                    <li>Summary</li>
                                                    <li>Experience</li>
                                                    <li>Projects</li>
                                                    <li>Skills</li>
                                                </ul>
                                            </div>
                                            <div className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.04)] p-4 text-slate-100">
                                                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted-ink)]">
                                                    Final polish
                                                </p>
                                                <div className="mt-3 space-y-3">
                                                    <div className="h-3 rounded-full bg-white/10" />
                                                    <div className="h-3 w-5/6 rounded-full bg-white/10" />
                                                    <div className="h-3 w-4/6 rounded-full bg-white/10" />
                                                    <div className="pt-2 text-sm font-medium text-cyan-200">
                                                        Choose template and export
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="features" className="px-4 py-16 sm:px-6 md:px-10 lg:px-12">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-12 max-w-3xl">
                        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-400">
                            Why it feels better
                        </p>
                        <h2 className="mt-4 font-['Georgia','Times_New_Roman',serif] text-3xl font-semibold text-slate-50 sm:text-4xl md:text-5xl">
                            A stronger landing page for a tool that should already feel premium.
                        </h2>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-3">
                        {featureCards.map((feature) => (
                            <article
                                key={feature.title}
                                className="group rounded-[2rem] border border-white/10 bg-white/5 p-7 shadow-[0_18px_60px_rgba(0,0,0,0.18)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-cyan-200/20 hover:shadow-[0_26px_80px_rgba(0,0,0,0.24)]"
                            >
                                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                                    {feature.eyebrow}
                                </p>
                                <h3 className="mt-5 text-2xl font-semibold text-slate-50">
                                    {feature.title}
                                </h3>
                                <p className="mt-4 text-base leading-8 text-slate-300">
                                    {feature.description}
                                </p>
                                <div className="mt-8 h-1 w-16 rounded-full bg-cyan-300 transition-all duration-300 group-hover:w-24" />
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="px-4 py-10 sm:px-6 md:px-10 lg:px-12">
                <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
                    <div className="rounded-[2rem] border border-white/10 bg-[rgba(255,255,255,0.04)] p-8 shadow-[0_18px_60px_rgba(0,0,0,0.18)] backdrop-blur">
                        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-400">
                            Workflow
                        </p>
                        <h2 className="mt-4 font-['Georgia','Times_New_Roman',serif] text-3xl font-semibold text-slate-50 md:text-4xl">
                            Three calm steps from idea to export.
                        </h2>

                        <div className="mt-8 space-y-5">
                            {steps.map((step, index) => (
                                <div key={step} className="flex gap-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-300 text-sm font-semibold text-slate-950">
                                        {index + 1}
                                    </div>
                                    <p className="pt-1 text-base leading-8 text-slate-300">
                                        {step}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

            {    <div className="rounded-[2rem] border border-white/10 bg-[rgba(255,255,255,0.04)] p-8 shadow-[0_18px_60px_rgba(0,0,0,0.18)] backdrop-blur">
                    <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-400">
                        User reactions
                    </p>
                    <div className="mt-8 grid gap-5">
                        {testimonials.map((testimonial) => (
                            <article
                                key={testimonial.name}
                                className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6"
                            >
                                <p className="text-lg leading-8 text-slate-100">
                                    "{testimonial.quote}"
                                </p>
                                <div className="mt-6">
                                    <p className="text-base font-semibold text-cyan-200">
                                        {testimonial.name}
                                    </p>
                                    <p className="text-sm uppercase tracking-[0.18em] text-slate-400">
                                        {testimonial.role}
                                    </p>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>}
                </div>
            </section>

            <section className="px-4 py-16 sm:px-6 md:px-10 lg:px-12">
                <div className="mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(27,36,59,0.98),rgba(17,25,43,0.95))] p-6 text-center shadow-[0_24px_80px_rgba(0,0,0,0.24)] sm:p-8 md:rounded-[2.5rem] md:p-14">
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
                        Start now
                    </p>
                    <h2 className="mt-4 font-['Georgia','Times_New_Roman',serif] text-3xl font-semibold text-slate-50 sm:text-4xl md:text-5xl">
                        Create a resume homepage experience that matches the promise of the product.
                    </h2>
                    <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
                        Your generator is already useful. Now the first impression feels crafted,
                        modern, and much more worth exploring.
                    </p>
                    <div className="mt-10">
                        <Link
                            to="/generate-resume"
                            className="inline-flex items-center justify-center rounded-full bg-cyan-300 px-8 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-slate-950 transition duration-300 hover:-translate-y-0.5 hover:bg-cyan-200"
                        >
                            Launch Resume Builder
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
