import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { FaUpload } from "react-icons/fa6";
import { matchJobsFromResume } from "../api/ResumeService";
import { getSkillLabel } from "../utils/skillUtils";
import { parseLocalResumeFile } from "../utils/localResumeFile";

const COMMON_SKILLS = [
  "react",
  "javascript",
  "typescript",
  "node",
  "express",
  "html",
  "css",
  "tailwind",
  "python",
  "django",
  "flask",
  "java",
  "spring boot",
  "sql",
  "mysql",
  "postgresql",
  "mongodb",
  "aws",
  "docker",
  "kubernetes",
  "git",
  "rest api",
  "machine learning",
  "data science",
  "tensorflow",
  "pytorch",
  "power bi",
  "tableau",
];

const JOB_CATALOG = [
  {
    title: "Frontend Developer",
    company: "Pixel Forge Studio",
    location: "Remote",
    keywords: ["react", "javascript", "typescript", "html", "css", "tailwind"],
    description: "Build polished interfaces, reusable components, and responsive layouts.",
  },
  {
    title: "React Developer",
    company: "Nimbus Products",
    location: "Bengaluru, India",
    keywords: ["react", "javascript", "typescript", "rest api", "git"],
    description: "Deliver React features, integrate APIs, and refine product UX.",
  },
  {
    title: "Full Stack Engineer",
    company: "North Star Labs",
    location: "Remote",
    keywords: ["react", "node", "express", "sql", "rest api", "docker"],
    description: "Own both frontend and backend features across a fast-moving product team.",
  },
  {
    title: "Java Backend Developer",
    company: "Blue River Systems",
    location: "Pune, India",
    keywords: ["java", "spring boot", "sql", "mysql", "postgresql", "git"],
    description: "Build APIs and business services for enterprise applications.",
  },
  {
    title: "Python Developer",
    company: "Cedar Analytics",
    location: "Remote",
    keywords: ["python", "flask", "django", "sql", "git"],
    description: "Support backend services and internal tools using Python stacks.",
  },
  {
    title: "Data Analyst",
    company: "Insight Grid",
    location: "Hyderabad, India",
    keywords: ["sql", "power bi", "tableau", "excel", "python", "data science"],
    description: "Turn raw data into dashboards, reports, and clear business insights.",
  },
  {
    title: "DevOps Engineer",
    company: "Cloud Harbor",
    location: "Remote",
    keywords: ["aws", "docker", "kubernetes", "linux", "git"],
    description: "Automate deployments, monitor services, and keep infrastructure healthy.",
  },
  {
    title: "Machine Learning Engineer",
    company: "Vector Bloom",
    location: "Remote",
    keywords: ["python", "machine learning", "tensorflow", "pytorch", "data science"],
    description: "Ship ML features and production-ready models.",
  },
];

const normalizeText = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const getSkillStrings = (structuredSkills = []) =>
  structuredSkills
    .map((skill) => getSkillLabel(skill))
    .map((skill) => normalizeText(skill))
    .filter(Boolean);

const extractSkillsFromText = (text) => {
  const normalized = normalizeText(text);
  return COMMON_SKILLS.filter((skill) => normalized.includes(skill));
};

const detectRole = (skills) => {
  const skillSet = new Set(skills);

  if (skillSet.has("machine learning") || skillSet.has("tensorflow") || skillSet.has("pytorch")) {
    return "Machine Learning Engineer";
  }
  if (skillSet.has("react") || skillSet.has("javascript") || skillSet.has("typescript")) {
    return "Frontend Developer";
  }
  if (skillSet.has("java") || skillSet.has("spring boot")) {
    return "Java Backend Developer";
  }
  if (skillSet.has("python") || skillSet.has("flask") || skillSet.has("django")) {
    return "Python Developer";
  }
  if (skillSet.has("aws") || skillSet.has("docker") || skillSet.has("kubernetes")) {
    return "DevOps Engineer";
  }
  if (skillSet.has("sql") || skillSet.has("power bi") || skillSet.has("tableau")) {
    return "Data Analyst";
  }

  return "Full Stack Engineer";
};

const buildSiteSearchLink = (domain, query, location = "") => {
  const searchTerms = [query, location, "jobs"].filter(Boolean).join(" ");
  return `https://www.google.com/search?q=${encodeURIComponent(`site:${domain} ${searchTerms}`)}`;
};

const slugify = (value) => normalizeText(value).replace(/\s+/g, "-");

const buildJobSearchQuery = (job, role, skills = []) =>
  [...new Set([job.title, role, ...job.keywords.slice(0, 2), ...skills.slice(0, 2)].filter(Boolean))].join(" ");

const JOB_PLATFORMS = [
  {
    name: "LinkedIn",
    buildUrl: (query, location) =>
      `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(query)}${location ? `&location=${encodeURIComponent(location)}` : ""}`,
  },
  {
    name: "Indeed",
    buildUrl: (query, location) =>
      `https://www.indeed.com/jobs?q=${encodeURIComponent(query)}${location ? `&l=${encodeURIComponent(location)}` : ""}`,
  },
  {
    name: "Foundit",
    buildUrl: (query, location) => {
      const querySlug = slugify(query);
      const locationSlug = slugify(location);
      return `https://www.foundit.in/search/${locationSlug ? `${querySlug}-jobs-in-${locationSlug}` : `${querySlug}-jobs`}`;
    },
  },
  {
    name: "Naukri",
    buildUrl: (query, location) => buildSiteSearchLink("naukri.com", query, location),
  },
  {
    name: "Unstop",
    buildUrl: (query, location) => buildSiteSearchLink("unstop.com/jobs", query, location),
  },
  {
    name: "AccioJob",
    buildUrl: (query, location) => buildSiteSearchLink("acciojob.com/jobs", query, location),
  },
];

const scoreJob = (resumeText, resumeSkills, job) => {
  const normalizedResume = normalizeText(resumeText);
  const matchedKeywords = job.keywords.filter(
    (keyword) => normalizedResume.includes(keyword) || resumeSkills.includes(keyword)
  );

  const keywordScore = Math.round((matchedKeywords.length / job.keywords.length) * 100);
  const roleBonus = matchedKeywords.length >= 2 ? 8 : 0;
  const score = Math.min(100, keywordScore + roleBonus);

  return {
    ...job,
    matchedKeywords,
    match_score: score,
  };
};

const StatCard = ({ label, value, subtext }) => (
  <div className="rounded-[1.1rem] border border-white/10 bg-white/5 px-4 py-4 shadow-[0_12px_30px_rgba(0,0,0,0.18)] backdrop-blur">
    <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">{label}</p>
    <p className="mt-2 text-lg font-semibold text-slate-100">{value}</p>
    {subtext ? <p className="mt-1 text-xs text-slate-400">{subtext}</p> : null}
  </div>
);

const SkillChip = ({ children }) => (
  <span className="rounded-full border border-white/10 bg-white/8 px-3 py-1 text-xs text-slate-200">
    {children}
  </span>
);

const getApplyUrl = (job) =>
  job?.apply_url || job?.platform_links?.[0]?.url || null;

const JobMatcher = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const analyzeFile = async (file) => {
    if (!file) return;

    setLoading(true);
    try {
      const parsed = await parseLocalResumeFile(file);

      if (parsed.kind === "unsupported") {
        throw new Error("Unsupported file type. Please upload a PDF, TXT, MD, CSV, or JSON file.");
      }

      const resumeText = parsed.text || "";
      const structuredSkills = Array.isArray(parsed.structuredData?.skills)
        ? getSkillStrings(parsed.structuredData.skills)
        : [];
      const preferredLocation = parsed.structuredData?.personalInformation?.location || "";
      const textSkills = extractSkillsFromText(resumeText);
      const skills = [...new Set([...structuredSkills, ...textSkills])];
      const role = detectRole(skills);

      try {
        const liveResponse = await matchJobsFromResume({
          resumeText,
          role,
          skills,
          location: preferredLocation,
        });

        if (Array.isArray(liveResponse?.jobs) && liveResponse.jobs.length > 0) {
          setResult({
            role,
            location: preferredLocation,
            skills,
            jobs: liveResponse.jobs,
            note: `Live job results loaded from multiple platforms for "${liveResponse.query || role}".`,
            source: "live",
          });

          toast.success("Live jobs matched from supported platforms", { duration: 1600, position: "top-center" });
          return;
        }
      } catch (liveError) {
        console.warn("Falling back to local job matcher.", liveError);
      }

      const jobs = JOB_CATALOG.map((job) => scoreJob(resumeText, skills, job))
        .filter((job) => job.match_score > 0)
        .sort((left, right) => right.match_score - left.match_score);

      const fallbackJobs = JOB_CATALOG.slice(0, 8).map((job) => scoreJob(resumeText, skills, job));
      const finalJobs = (jobs.length > 0 ? jobs : fallbackJobs).map((job) => {
        const searchQuery = buildJobSearchQuery(job, role, skills);
        return {
          ...job,
          search_query: searchQuery,
          platform_links: JOB_PLATFORMS.map((platform) => ({
            name: platform.name,
            url: platform.buildUrl(searchQuery, preferredLocation || job.location),
          })),
        };
      });

      setResult({
        role,
        location: preferredLocation,
        skills,
        jobs: finalJobs,
        note:
          jobs.length > 0
            ? "Ranked results are ready. Open any match on the platform you prefer."
            : "No strong match was found, so we are showing broader suggestions and linking them across multiple job platforms.",
        source: "local",
      });

      toast.success("Jobs matched from your resume", { duration: 1600, position: "top-center" });
    } catch (error) {
      const message = error?.message || "Unable to match jobs right now.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setFileName(file.name);
    setResult(null);
    await analyzeFile(file);
  };

  const handleMatch = async () => {
    if (!selectedFile) {
      toast.error("Upload a resume first.");
      return;
    }

    await analyzeFile(selectedFile);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(120,99,255,0.22),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(58,194,255,0.18),_transparent_28%),linear-gradient(135deg,_#091225_0%,_#0b1730_50%,_#111f3e_100%)] px-5 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-[1.2rem] border border-white/10 bg-white/5 px-4 py-3 shadow-[0_12px_35px_rgba(0,0,0,0.18)] backdrop-blur">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Matched Jobs</p>
            <p className="text-sm text-slate-300">Style is built with ranked recommendations</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/home"
              className="rounded-full border border-cyan-200/30 bg-cyan-200/10 px-4 py-2 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-200/20"
            >
              Home
            </Link>
            <Link
              to="/generate-resume"
              className="rounded-full border border-cyan-200/30 bg-cyan-200/10 px-4 py-2 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-200/20"
            >
              Resume Builder
            </Link>
          </div>
        </header>

        <section className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(27,36,59,0.98),rgba(17,25,43,0.95))] p-5 shadow-[0_28px_80px_rgba(0,0,0,0.26)] backdrop-blur-xl lg:p-6">
          <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[1.6rem] border border-white/10 bg-[radial-gradient(circle_at_top_right,rgba(127,208,255,0.18),transparent_28%),linear-gradient(180deg,rgba(35,46,72,0.96),rgba(22,31,50,0.96))] p-5 shadow-[0_18px_45px_rgba(0,0,0,0.22)]">
              <div className="flex items-start justify-between gap-4">
                <div className="max-w-xl">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-cyan-200/80">Job Matcher</p>
                  <h1 className="mt-3 font-['Georgia','Times_New_Roman',serif] text-3xl font-semibold leading-tight text-slate-50 sm:text-4xl">
                    Your strongest matches are ready.
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                    Upload a resume and we will first try live multi-platform job search through the backend, then fall back to local ranked suggestions if live search is not configured.
                  </p>
                </div>
                <div className="hidden rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-right sm:block">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">Mode</p>
                  <p className="mt-1 text-sm font-semibold text-slate-100">Ranked + Visual</p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <StatCard label="Skills detected" value={result?.skills?.length ?? 0} />
                <StatCard label="Jobs shown" value={result?.jobs?.length ?? 0} />
                <StatCard label="Detected role" value={result?.role || "Waiting"} />
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <label className="inline-flex cursor-pointer items-center gap-3 rounded-full bg-cyan-300 px-5 py-3 text-xs font-bold text-slate-950 shadow-[0_10px_25px_rgba(34,211,238,0.25)] transition hover:brightness-110">
                  <FaUpload />
                  Upload Resume
                  <input
                    type="file"
                    accept=".pdf,.docx,.txt,.md,.csv,.json,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,application/json"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
                <button
                  type="button"
                  onClick={handleMatch}
                  disabled={loading}
                  className="rounded-full border border-white/10 bg-white/10 px-5 py-3 text-xs font-semibold text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? "Matching..." : "Match Again"}
                </button>
                <span className="text-sm text-slate-400">{fileName || "No file selected"}</span>
              </div>
            </div>

            <div className="rounded-[1.6rem] border border-white/10 bg-[linear-gradient(180deg,rgba(22,31,51,0.96),rgba(15,22,39,0.96))] p-5 shadow-[0_18px_45px_rgba(0,0,0,0.22)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-white">Detected Skills</p>
                  <p className="mt-1 text-xs leading-6 text-slate-400">
                    These skills shape the ranking and the top recommendations.
                  </p>
                </div>
                <span className="rounded-full border border-cyan-200/20 bg-cyan-200/10 px-3 py-1 text-[11px] font-semibold text-cyan-100">
                  Live
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {result?.skills?.length ? (
                  result.skills.slice(0, 12).map((skill) => <SkillChip key={skill}>{skill}</SkillChip>)
                ) : (
                  <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 px-4 py-6 text-sm text-slate-400">
                    Upload a resume to see detected skills.
                  </div>
                )}
              </div>

              <div className="mt-5 flex gap-3">
                <Link
                  to="/home"
                  className="inline-flex flex-1 items-center justify-center rounded-full border border-white/10 bg-white/10 px-4 py-3 text-xs font-semibold text-white transition hover:bg-white/15"
                >
                  Back to Home
                </Link>
                <Link
                  to="/generate-resume"
                  className="inline-flex flex-1 items-center justify-center rounded-full border border-white/10 bg-white/10 px-4 py-3 text-xs font-semibold text-white transition hover:bg-white/15"
                >
                  Resume Builder
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-[1.6rem] border border-white/10 bg-white/5 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.18)] backdrop-blur">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-white">Top Job Matches</p>
              <p className="text-xs text-slate-400">
                {result?.source === "live"
                  ? "Live results coming from backend-powered web search across supported platforms."
                  : "Fallback ranked results based on the resume uploaded in this page."}
              </p>
            </div>
            <span className="rounded-full bg-sky-200/90 px-3 py-1 text-xs font-bold text-slate-950">
              {result?.jobs?.length || 0} results
            </span>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-2">
            {result?.jobs?.length ? (
              result.jobs.map((job, index) => (
                <article
                  key={`${job.title}-${index}`}
                  className="group rounded-[1.15rem] border border-white/10 bg-[linear-gradient(180deg,rgba(34,44,69,0.98),rgba(21,30,49,0.98))] p-4 shadow-[0_16px_38px_rgba(0,0,0,0.2)] transition duration-300 hover:-translate-y-1 hover:border-cyan-200/25 hover:shadow-[0_20px_45px_rgba(0,0,0,0.28)]"
                >
                  {(() => {
                    const applyUrl = getApplyUrl(job);
                    const company = job.company || "Not specified";
                    const location = job.location || "Not specified";
                    const vacancies = job.vacancies || "Not specified";

                    return (
                      <>
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-[11px] uppercase tracking-[0.2em] text-sky-200/80">
                        {typeof job.match_score === "number" ? `${job.match_score}% match` : "Live result"}
                      </p>
                      <h3 className="text-base font-semibold leading-6 text-slate-50">
                        {job.title}
                      </h3>
                    </div>
                    <div className="flex flex-wrap justify-end gap-2">
                      {job.platform_links?.map((platform) => (
                        <a
                          key={`${job.title}-${platform.name}`}
                          href={platform.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-2 text-xs font-semibold text-slate-100 transition hover:bg-white/14"
                        >
                          {platform.name}
                        </a>
                      ))}
                    </div>
                  </div>

                  <p className="mt-2 text-xs text-slate-300">Company: {company}</p>
                  <p className="mt-1 text-xs text-slate-300">Location: {location}</p>
                  <p className="mt-1 text-xs text-slate-300">Vacancies: {vacancies}</p>

                  {job.matchedKeywords?.length ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {job.matchedKeywords.slice(0, 4).map((keyword) => (
                        <SkillChip key={keyword}>{keyword}</SkillChip>
                      ))}
                    </div>
                  ) : null}

                  <div className="mt-4">
                    {applyUrl ? (
                      <a
                        href={applyUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex rounded-full border border-cyan-200/20 bg-cyan-200/10 px-4 py-2 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-200/18"
                      >
                        Apply
                      </a>
                    ) : (
                      <span className="inline-flex rounded-full border border-cyan-200/20 bg-cyan-200/10 px-4 py-2 text-xs font-semibold text-cyan-100">
                        Apply
                      </span>
                    )}
                  </div>

                      </>
                    );
                  })()}
                </article>
              ))
            ) : (
              <div className="md:col-span-2 rounded-[1.15rem] border border-dashed border-white/15 bg-white/5 p-8 text-center text-sm text-slate-400">
                Upload a resume to see ranked job matches here.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default JobMatcher;
