import React, { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { FaArrowRotateRight, FaCircleCheck, FaPaperPlane } from "react-icons/fa6";
import { analyzeResumeForATS, analyzeResumeTextForATS } from "../utils/atsCheck";
import { parseLocalResumeFile } from "../utils/localResumeFile";

const featurePills = ["PDF Parsing", "Heuristic Feedback", "ATS Scoring", "Keyword Review"];
const workflowSteps = ["Upload resume", "Paste job description", "Generate report"];
const ATS_BASELINE_TEMPLATE = "t6";

const emptyAnalysis = {
  score: null,
  verdict: "",
  strengths: [],
  suggestions: [],
  keywordHits: [],
  keywordMisses: [],
  templateNote: "",
};

const formatKeywordParagraph = (keywords, emptyMessage, prefix) => {
  if (!keywords?.length) return emptyMessage;
  return `${prefix}${keywords.join(", ")}.`;
};

const limitKeywords = (keywords, count = 8) => (Array.isArray(keywords) ? keywords.slice(0, count) : []);

function ATSResumeAnalyzer() {
  const [jobDescription, setJobDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [parsedResume, setParsedResume] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [fileError, setFileError] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(emptyAnalysis);

  const hasAnalysis = analysis.score !== null;
  const fileLabel = selectedFileName || "No file chosen";
  const weakPdfExtraction =
    selectedFile?.type === "application/pdf" &&
    !parsedResume &&
    resumeText.trim().length > 0 &&
    resumeText.trim().length < 500;

  const stats = useMemo(
    () => [
      { label: "Strengths", value: analysis.strengths?.length || 0 },
      { label: "Suggestions", value: analysis.suggestions?.length || 0 },
      { label: "Keyword hits", value: analysis.keywordHits?.length || 0 },
    ],
    [analysis]
  );

  const loadResumeFile = async (file) => {
    if (!file) return;
    setLoading(true);
    setFileError("");

    try {
      const parsed = await parseLocalResumeFile(file);
      if (parsed.kind === "unsupported") {
        throw new Error("Unsupported file type. Please upload a PDF, TXT, MD, CSV, or JSON file.");
      }

      setSelectedFile(file);
      setSelectedFileName(file.name);
      setResumeText(parsed.text || "");
      setParsedResume(parsed.structuredData || null);
      toast.success(`Loaded ${file.name}`, { duration: 1800, position: "top-center" });
    } catch (error) {
      const message = error?.message || "Unable to read the selected file.";
      setFileError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await loadResumeFile(file);
  };

  const handleAnalyze = () => {
    if (!selectedFile) {
      toast.error("Upload a resume first.");
      return;
    }

    if (!parsedResume && !resumeText.trim()) {
      toast.error("The selected file does not contain readable resume text.");
      return;
    }

    try {
      const result = parsedResume
        ? analyzeResumeForATS(parsedResume, ATS_BASELINE_TEMPLATE, jobDescription)
        : analyzeResumeTextForATS(resumeText, ATS_BASELINE_TEMPLATE, jobDescription);

      setAnalysis(result);
      toast.success("ATS analysis generated", { duration: 1600, position: "top-center" });
    } catch (error) {
      console.error("ATS analysis failed", error);
      toast.error("Unable to generate ATS report right now.");
    }
  };

  const handleRefreshFile = async () => {
    if (!selectedFile) {
      toast.error("Choose a file first.");
      return;
    }
    await loadResumeFile(selectedFile);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(120,99,255,0.22),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(58,194,255,0.18),_transparent_28%),linear-gradient(135deg,_#091225_0%,_#0b1730_50%,_#111f3e_100%)] text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8rem] top-10 h-64 w-64 rounded-full bg-violet-400/20 blur-3xl opacity-70" />
        <div className="absolute right-[-5rem] top-24 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl opacity-60" />
        <div className="absolute inset-x-0 top-0 h-full bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_50%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-12 md:px-10 lg:px-12">
        <section className="max-w-5xl">
          <p className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-slate-300 shadow-sm backdrop-blur">
            AI Resume Screening
          </p>
          <h1 className="mt-5 max-w-4xl font-['Georgia','Times_New_Roman',serif] text-5xl font-semibold tracking-tight text-slate-50 md:text-6xl">
            ATS Resume Analyzer
          </h1>
          <p className="mt-4 max-w-4xl text-lg leading-8 text-slate-300">
            Upload a resume and compare it with a job description to get heuristic ATS feedback, keyword matching, and section-level improvement tips.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/generate-resume"
              className="inline-flex items-center justify-center rounded-full bg-cyan-300 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-950 transition hover:bg-cyan-200"
            >
              Open Resume Generator
            </Link>
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            {featurePills.map((pill) => (
              <span key={pill} className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 shadow-sm backdrop-blur">
                {pill}
              </span>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(27,36,59,0.98),rgba(17,25,43,0.95))] p-6 shadow-[0_26px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl md:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.35fr_0.95fr]">
            <div className="space-y-3">
              <label className="block text-lg font-semibold text-slate-50">Job Description</label>
              <textarea
                value={jobDescription}
                onChange={(event) => setJobDescription(event.target.value)}
                placeholder="Paste the complete job description..."
                className="min-h-[360px] w-full resize-none rounded-[1.2rem] border border-white/10 bg-white/5 px-4 py-4 text-base leading-8 text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-200/40 focus:ring-2 focus:ring-cyan-200/20"
              />
              <div className="flex flex-wrap gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="inline-flex items-center gap-3 rounded-full bg-cyan-300 px-6 py-4 text-sm font-semibold text-slate-950 shadow-[0_18px_35px_rgba(34,211,238,0.2)] transition hover:-translate-y-0.5 hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <FaPaperPlane />
                  Generate ATS Report
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[1.2rem] border border-white/10 bg-white/5 p-4">
                <label className="block text-lg font-semibold text-slate-50">Upload Resume File</label>
                <div className="mt-4 flex items-center gap-3 rounded-xl border border-white/10 bg-[rgba(255,255,255,0.04)] p-3">
                  <label className="inline-flex cursor-pointer items-center rounded-md bg-cyan-300 px-3 py-2 text-sm font-medium text-slate-950 transition hover:bg-cyan-200">
                    Choose File
                    <input
                      type="file"
                      accept=".pdf,.txt,.md,.csv,.json,application/pdf,text/plain,application/json"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                  <span className="truncate text-sm text-slate-300">{fileLabel}</span>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-300">Supported formats: PDF, TXT, MD, CSV, and JSON.</p>
              </div>

              <div className="rounded-[1.2rem] border border-white/10 bg-[rgba(255,255,255,0.04)] p-4 shadow-[0_18px_45px_rgba(0,0,0,0.08)]">
                <h3 className="text-xl font-semibold text-slate-50">Workflow</h3>
                <ol className="mt-4 space-y-2 text-[1rem] leading-7 text-slate-300">
                  {workflowSteps.map((step, index) => (
                    <li key={step} className="flex gap-3">
                      <span className="min-w-5 text-slate-500">{index + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {fileError ? (
                <div className="rounded-[1.2rem] border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-100">
                  {fileError}
                </div>
              ) : null}

              {weakPdfExtraction ? (
                <div className="rounded-[1.2rem] border border-amber-300/30 bg-amber-400/10 p-4 text-sm leading-7 text-amber-100">
                  This PDF may not contain enough machine-readable text for reliable ATS keyword matching. If keywords that are visibly present in the resume still appear as missing, try uploading a text-based PDF or export the resume again before re-running the analysis.
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleRefreshFile}
            disabled={!selectedFile || loading}
            className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FaArrowRotateRight />
            Re-scan file
          </button>
          <div className="flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
            {loading ? "Reading file..." : "PDF, TXT, MD, CSV, JSON supported"}
          </div>
        </div>

        <section className="mt-8 grid gap-5 lg:grid-cols-2">
          <article className="rounded-[1.4rem] border border-white/10 bg-white/5 p-5 shadow-[0_20px_55px_rgba(0,0,0,0.18)] backdrop-blur">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-50">Resume Feedback</h2>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  {hasAnalysis ? "Your strengths, weaknesses, and improvements appear here." : "Run the ATS check to surface section-level resume feedback."}
                </p>
              </div>
              <span className="rounded-full bg-cyan-300/15 px-4 py-2 text-sm font-semibold text-cyan-100">Heuristic Review</span>
            </div>

            <div className="mt-5 border-t border-white/10 pt-5">
              <div className="grid gap-3 sm:grid-cols-3">
                {stats.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.04)] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{item.label}</p>
                    <p className="mt-2 text-3xl font-black text-slate-50">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.04)] p-4">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Strengths</h3>
                  <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-300">
                    {analysis.strengths?.length > 0 ? analysis.strengths.map((item, index) => <li key={index}>- {item}</li>) : <li>Your strengths, if any, will appear here.</li>}
                  </ul>
                </div>
                <div className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.04)] p-4">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Improvements</h3>
                  <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-300">
                    {analysis.suggestions?.length > 0 ? analysis.suggestions.map((item, index) => <li key={index}>- {item}</li>) : <li>Your resume improvements will appear here.</li>}
                  </ul>
                </div>
              </div>
            </div>
          </article>

          <article className="rounded-[1.4rem] border border-white/10 bg-white/5 p-5 shadow-[0_20px_55px_rgba(0,0,0,0.18)] backdrop-blur">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-50">ATS Match Result</h2>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  {hasAnalysis ? "ATS-style score, template note, and keyword gaps appear here." : "Upload a resume and job description to calculate ATS-style fit."}
                </p>
              </div>
              <span className="rounded-full bg-cyan-300/15 px-4 py-2 text-sm font-semibold text-cyan-100">ATS Screening</span>
            </div>

            <div className="mt-5 rounded-[1.4rem] bg-[linear-gradient(135deg,#faefe3_0%,#eef8fb_54%,#ffe6d4_100%)] p-5 shadow-[0_22px_55px_rgba(0,0,0,0.08)]">
              <div className="flex items-center gap-3">
                <FaCircleCheck className="text-2xl text-[var(--accent-ink)]" />
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-ink)]">ATS verdict</p>
              </div>
              <h3 className="mt-4 text-3xl font-semibold text-black">{analysis.verdict || "Waiting for analysis"}</h3>
              <p className="mt-3 max-w-md text-sm leading-7 text-[var(--soft-ink)]">
                {analysis.templateNote || "The score is calculated from your uploaded resume and the pasted job description."}
              </p>
              <div className="mt-5 h-3 overflow-hidden rounded-full bg-white">
                <div className="h-full rounded-full bg-[var(--accent-ink)] transition-all duration-500" style={{ width: `${analysis.score ?? 0}%` }} />
              </div>
              <p className="mt-3 text-sm text-black">
                Score: <span className="font-semibold text-black">{analysis.score ?? 0}/100</span>
              </p>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.04)] p-4">
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Matched Keywords</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  {formatKeywordParagraph(
                    limitKeywords(analysis.keywordHits),
                    "No matched keywords yet.",
                    "The resume currently matches these keywords: "
                  )}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.04)] p-4">
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Missing Keywords</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  {formatKeywordParagraph(
                    limitKeywords(analysis.keywordMisses),
                    "No missing keywords yet.",
                    "The main keywords still missing from the resume are: "
                  )}
                </p>
              </div>
            </div>
          </article>
        </section>

        <div className="mt-8 hidden md:block">
          <p className="text-sm text-slate-400">
            Tip: paste the full job description before generating the report so the heuristic ATS score and keyword gaps are more useful.
          </p>
        </div>
      </div>
    </main>
  );
}

export default ATSResumeAnalyzer;
