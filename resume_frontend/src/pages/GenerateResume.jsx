import React, { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useFieldArray, useForm } from "react-hook-form";
import { FaPlusCircle } from "react-icons/fa";
import { FaBrain, FaFileArrowUp, FaPaperPlane, FaTrash, FaWandMagicSparkles } from "react-icons/fa6";
import { BiBook } from "react-icons/bi";
import { generateResume } from "../api/ResumeService";
import Resume from "../components/Resume";
import Template2 from "../components/Template2";
import Template3 from "../components/Template3";
import Template4 from "../components/Template4";
import Template5 from "../components/Template5";
import Template6 from "../components/Template6";
import Template7 from "../components/Template7";
import Template8 from "../components/Template8";

const templateCards = [
  { id: "t2", title: "Modern Grid", subtitle: "Clean Sidebar", image: "/images/fullstack_developer.png", component: Template2 },
  { id: "t3", title: "Editorial Edge", subtitle: "Bold Storytelling", image: "/images/Template3.png", component: Template3 },
  { id: "t4", title: "Balanced Pro", subtitle: "Polished Layout", image: "/images/Template4.png", component: Template4 },
  { id: "t5", title: "Minimal Slate", subtitle: "Simple And Sharp", image: "/images/Template5.png", component: Template5 },
  { id: "t6", title: "Classic Focus", subtitle: "Traditional Resume", image: "/images/Template6.png", component: Template6 },
  { id: "t7", title: "Structured Plus", subtitle: "Section Driven", image: "/images/Template7.png", component: Template7 },
  { id: "t8", title: "Creative Pulse", subtitle: "Modern Visual Style", image: "/images/Template8.png", component: Template8 },
];

const sections = [
  { key: "skills", label: "Skills", fields: ["title", "level"] },
  { key: "experience", label: "Experience", fields: ["jobTitle", "company", "location", "duration", "responsibility"] },
  { key: "education", label: "Education", fields: ["degree", "university", "location", "graduationYear"] },
  { key: "certifications", label: "Certifications", fields: ["title", "issuingOrganization", "year"] },
  { key: "projects", label: "Projects", fields: ["title", "description", "technologiesUsed"] },
  { key: "languages", label: "Languages", fields: ["name"] },
  { key: "interests", label: "Interests", fields: ["name"] },
];

const emptyData = {
  personalInformation: { fullName: "", email: "", phoneNumber: "", location: "", linkedin: "", gitHub: "", portfolio: "" },
  summary: "",
  skills: [],
  experience: [],
  education: [],
  certifications: [],
  projects: [],
  languages: [],
  interests: [],
};

const sectionDescriptions = {
  personalInformation: "Add your core contact details and professional links.",
  summary: "Write a short introduction that matches your target role.",
  skills: "Highlight tools, technologies, and strengths recruiters should notice first.",
  experience: "Capture impact, responsibilities, and the story behind your work.",
  education: "List your academic background in a clear, recruiter-friendly format.",
  certifications: "Show certifications that strengthen your credibility for the role.",
  projects: "Feature the work that best demonstrates practical experience.",
  languages: "Include spoken or written languages relevant to your applications.",
  interests: "Add a little personality when it supports your profile.",
};

const GenerateResume = () => {
  const [data, setData] = useState(emptyData);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("t2");

  const { register, handleSubmit, control, reset } = useForm({ defaultValues: emptyData });
  const sectionArrays = {
    skills: useFieldArray({ control, name: "skills" }),
    experience: useFieldArray({ control, name: "experience" }),
    education: useFieldArray({ control, name: "education" }),
    certifications: useFieldArray({ control, name: "certifications" }),
    projects: useFieldArray({ control, name: "projects" }),
    languages: useFieldArray({ control, name: "languages" }),
    interests: useFieldArray({ control, name: "interests" }),
  };

  const activeTemplate = useMemo(
    () => templateCards.find((template) => template.id === selectedTemplate) || templateCards[0],
    [selectedTemplate]
  );
  const TemplateComponent = activeTemplate.component;

  const onGenerate = async () => {
    if (!description.trim()) {
      toast.error("Please enter a short description first.");
      return;
    }

    try {
      setLoading(true);
      const response = await generateResume(description);
      const nextData = response?.data || emptyData;
      setData(nextData);
      reset(nextData);
      setShowPrompt(false);
      setShowForm(true);
      setShowTemplates(false);
      setShowPreview(false);
      toast.success("Resume generated successfully!", { duration: 2200, position: "top-center" });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error generating resume!");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (formData) => {
    setData(formData);
    setShowForm(false);
    setShowTemplates(true);
    setShowPreview(false);
  };

  const formInputClass =
    "input h-14 rounded-2xl border border-[rgba(164,115,84,0.22)] bg-white text-black placeholder:text-slate-400 shadow-[0_10px_24px_rgba(98,68,44,0.06)] outline-none transition duration-200 focus:border-[var(--accent-ink)] focus:shadow-[0_0_0_4px_rgba(165,75,42,0.12)]";

  const formTextareaClass =
    "textarea w-full rounded-[1.4rem] border border-[rgba(164,115,84,0.22)] bg-white text-black shadow-[0_10px_24px_rgba(98,68,44,0.06)] placeholder:text-slate-400 focus:border-[var(--accent-ink)] focus:shadow-[0_0_0_4px_rgba(165,75,42,0.12)]";

  const sectionTitleClass = "text-[1.5rem] font-semibold text-slate-950 sm:text-[1.7rem] md:text-[1.85rem]";

  const formatFieldLabel = (value) =>
    value
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (char) => char.toUpperCase());

  const renderInput = (name, label, type = "text", extraClassName = "") => (
    <div className="w-full">
      <label className="mb-3 block">
        <span className="label-text text-sm font-semibold uppercase tracking-[0.16em] text-[var(--muted-ink)]">
          {label}
        </span>
      </label>
      <input
        type={type}
        {...register(name)}
        className={`${formInputClass} ${extraClassName}`.trim()}
      />
    </div>
  );

  const sectionShellClass =
    "rounded-[1.9rem] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(252,247,242,0.94))] p-6 shadow-[0_22px_60px_rgba(72,42,22,0.09)] backdrop-blur md:p-7";

  const renderSectionHeader = (title, description, badge) => (
    <div className="mb-6 flex flex-col gap-4 border-b border-[rgba(164,115,84,0.16)] pb-5 md:flex-row md:items-start md:justify-between">
      <div className="max-w-2xl">
        <h3 className={sectionTitleClass}>{title}</h3>
        {description && (
          <p className="mt-2 text-sm leading-7 text-[var(--soft-ink)]">{description}</p>
        )}
      </div>
      {badge && (
        <div className="inline-flex w-fit items-center rounded-full border border-[rgba(164,115,84,0.18)] bg-[rgba(255,250,245,0.95)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-ink)]">
          {badge}
        </div>
      )}
    </div>
  );

  const renderArraySection = (section) => {
    const fields = sectionArrays[section.key];
    return (
      <div className={sectionShellClass}>
        {renderSectionHeader(
          section.label,
          sectionDescriptions[section.key],
          `${fields.fields.length} item${fields.fields.length === 1 ? "" : "s"}`
        )}
        <div className="mb-5 flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => fields.append(section.fields.reduce((acc, key) => ({ ...acc, [key]: "" }), {}))}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--accent-ink)] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-[0_14px_28px_rgba(165,75,42,0.22)] transition hover:translate-y-[-1px] hover:bg-black"
          >
            <FaPlusCircle className="text-sm" /> Add
          </button>
        </div>

        <div className={section.key === "languages" || section.key === "interests" || section.key === "projects" || section.key === "certifications" || section.key === "skills" ? "grid gap-5 md:grid-cols-2" : "space-y-5"}>
          {fields.fields.length === 0 && (
            <div className="rounded-[1.5rem] border border-dashed border-[rgba(164,115,84,0.28)] bg-[rgba(255,248,240,0.85)] p-6 text-sm leading-7 text-[var(--soft-ink)]">
              No {section.label.toLowerCase()} added yet. Use the button above to add your first item.
            </div>
          )}

          {fields.fields.map((field, index) => (
            <div
              key={field.id}
              className="rounded-[1.6rem] border border-[rgba(164,115,84,0.18)] bg-white p-5 shadow-[0_14px_32px_rgba(85,58,36,0.06)]"
            >
              <div className="mb-5 flex flex-col gap-3 border-b border-[rgba(164,115,84,0.12)] pb-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h4 className="mt-1 text-lg font-semibold text-slate-950">
                    Item #{index + 1}
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => fields.remove(index)}
                  className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-red-600 transition hover:bg-red-100"
                >
                  <FaTrash /> Remove
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {section.fields.map((key) => (
                  <div key={key} className={key === "responsibility" || key === "description" ? "md:col-span-2" : ""}>
                    {renderInput(`${section.key}.${index}.${key}`, formatFieldLabel(key))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] overflow-x-hidden bg-[radial-gradient(circle_at_top_left,_rgba(120,99,255,0.18),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(58,194,255,0.16),_transparent_28%),linear-gradient(135deg,_#091225_0%,_#0b1730_50%,_#111f3e_100%)] px-4 py-6 text-slate-100 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-[1.5rem] border border-white/10 bg-white/6 p-4 shadow-[0_18px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl sm:mb-8 sm:rounded-[2rem] sm:p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-400">AI Resume Generator</p>
          <h1 className="mt-3 flex items-start gap-3 font-['Georgia','Times_New_Roman',serif] text-3xl font-semibold text-slate-50 sm:items-center sm:text-4xl md:text-5xl">
            <FaBrain className="text-cyan-200" /> Build, edit, and export your resume
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
            Start with a prompt, get structured resume content, refine each section, and choose the template that fits the role you want.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/ats-check"
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/10 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-100 transition hover:bg-white/15"
            >
              Open ATS Check
            </Link>
            <Link
              to="/job-matcher"
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-cyan-300/90 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-950 transition hover:bg-cyan-200"
            >
              Open Job Matcher
            </Link>
          </div>
        </div>

        {showPrompt && (
          <section className="mx-auto grid w-full gap-8 lg:grid-cols-[1fr_0.95fr]">
            <div className="text-[var(--ink)]">
              <p className="inline-flex rounded-full border border-white/60 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--muted-ink)] backdrop-blur">
                Resume Generator
              </p>
              <h2 className="mt-6 font-['Georgia','Times_New_Roman',serif] text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl">
                Make the resume builder feel premium before the first export.
              </h2>
              <p className="mt-6 max-w-xl text-base leading-7 text-[var(--soft-ink)] sm:text-lg sm:leading-8">
                Start with a detailed prompt. The AI will turn it into resume sections you can edit, style, and export with much less manual work.
              </p>
            </div>

            <div className="rounded-[1.6rem] border border-white/70 bg-white/78 p-4 shadow-[0_24px_80px_rgba(32,24,16,0.14)] backdrop-blur-xl sm:rounded-[2.2rem] sm:p-6 md:p-8">
              <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--muted-ink)]">AI Prompt Studio</p>
                  <h2 className="mt-3 flex items-center gap-3 text-2xl font-semibold text-[var(--ink)] sm:text-3xl">
                    <FaBrain className="text-[var(--accent-ink)]" /> Describe yourself once
                  </h2>
                </div>
                <div className="rounded-full bg-[var(--panel-cool)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--soft-ink)]">
                  Smart Draft
                </div>
              </div>
              <textarea
                disabled={loading}
                className="textarea h-48 w-full rounded-[1.2rem] border border-[var(--accent-border)] bg-white/90 p-4 text-black shadow-sm outline-none placeholder:text-slate-500 focus:border-[var(--accent-ink)] sm:h-56 sm:rounded-[1.6rem] sm:p-5"
                placeholder="Example: I am a Java developer with 5 years of experience in Spring Boot, React, Microservices, MySQL, AWS, and Docker..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  disabled={loading}
                  onClick={onGenerate}
                  className="inline-flex flex-1 items-center justify-center gap-3 rounded-full bg-[var(--accent-ink)] px-6 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? <span className="loading loading-spinner"></span> : <FaPaperPlane />}
                  {loading ? "Generating..." : "Generate Resume"}
                </button>
                <button
                  type="button"
                  onClick={() => setDescription("")}
                  className="inline-flex items-center justify-center gap-3 rounded-full border border-red-300 bg-red-500 px-6 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-white transition hover:bg-red-600"
                >
                  Clear
                </button>
              </div>
            </div>
          </section>
        )}

        {showForm && (
          <section className="mx-auto w-full rounded-[1.6rem] border border-white/70 bg-white/72 p-4 shadow-[0_26px_80px_rgba(44,31,18,0.12)] backdrop-blur-xl sm:rounded-[2.3rem] sm:p-6 md:p-10">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--muted-ink)]">Resume Editor</p>
                <h2 className="mt-3 flex items-start gap-3 font-['Georgia','Times_New_Roman',serif] text-3xl font-semibold text-[var(--ink)] sm:items-center sm:text-4xl">
                  <BiBook className="text-[var(--accent-ink)]" /> Refine every section
                </h2>
              </div>
              <div className="rounded-full border border-[var(--accent-border)] bg-[var(--panel-warm)] px-5 py-3 text-sm font-medium text-[var(--soft-ink)]">
                Review first, then select a template
              </div>
            </div>

            <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-[1.6rem] border border-white/70 bg-[rgba(255,255,255,0.74)] px-5 py-4 shadow-[0_12px_32px_rgba(44,31,18,0.06)]">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-ink)]">Form Flow</p>
                <p className="mt-2 text-base font-semibold text-[var(--ink)]">Edit content section by section</p>
              </div>
              <div className="rounded-[1.6rem] border border-white/70 bg-[rgba(255,255,255,0.74)] px-5 py-4 shadow-[0_12px_32px_rgba(44,31,18,0.06)]">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-ink)]">Best Result</p>
                <p className="mt-2 text-base font-semibold text-[var(--ink)]">Keep role-specific details and measurable outcomes</p>
              </div>
              <div className="rounded-[1.6rem] border border-white/70 bg-[rgba(255,255,255,0.74)] px-5 py-4 shadow-[0_12px_32px_rgba(44,31,18,0.06)]">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-ink)]">Next Step</p>
                <p className="mt-2 text-base font-semibold text-[var(--ink)]">Continue to template selection after review</p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
              <div className={sectionShellClass}>
                {renderSectionHeader("Personal Information", sectionDescriptions.personalInformation, "Profile")}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {renderInput("personalInformation.fullName", "Full Name")}
                  {renderInput("personalInformation.email", "Email", "email")}
                  {renderInput("personalInformation.phoneNumber", "Phone Number", "tel")}
                  {renderInput("personalInformation.linkedin", "LinkedIn URL", "url", "bg-white text-black")}
                  {renderInput("personalInformation.location", "Location")}
                  {renderInput("personalInformation.gitHub", "GitHub URL", "url", "bg-white text-black")}
                  {renderInput("personalInformation.portfolio", "Portfolio URL", "url", "bg-white text-black")}
                </div>
              </div>

              <div className={sectionShellClass}>
                {renderSectionHeader("Summary", sectionDescriptions.summary, "Intro")}
                <textarea
                  {...register("summary")}
                  className={`${formTextareaClass} min-h-44`}
                  rows={6}
                />
              </div>

              <div className="grid gap-6">
                {sections.map(renderArraySection)}
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-3 rounded-full bg-[var(--accent-ink)] px-6 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-white transition hover:bg-black"
                >
                  <FaWandMagicSparkles /> Continue To Template Selection
                </button>
              </div>
            </form>
          </section>
        )}

        {showTemplates && (
          <section className="mx-auto w-full rounded-[1.6rem] border border-white/70 bg-white/72 p-4 shadow-[0_26px_80px_rgba(44,31,18,0.12)] backdrop-blur-xl sm:rounded-[2.3rem] sm:p-6 md:p-10">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--muted-ink)]">Template Gallery</p>
                <h2 className="mt-3 font-['Georgia','Times_New_Roman',serif] text-3xl font-semibold text-[var(--ink)] sm:text-4xl">
                  Pick a resume style that fits your story
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowTemplates(false);
                  setShowForm(true);
                }}
                className="inline-flex items-center justify-center rounded-full border border-[var(--accent-border)] bg-white/80 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--ink)] transition hover:bg-white"
              >
                Back To Editing
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 md:gap-6">
              {templateCards.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => {
                    setSelectedTemplate(template.id);
                    setShowTemplates(false);
                    setShowPreview(true);
                  }}
                  className={`overflow-hidden rounded-[1.8rem] border text-left transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(44,31,18,0.14)] ${
                    selectedTemplate === template.id
                      ? "border-[var(--accent-ink)] shadow-[0_20px_60px_rgba(165,75,42,0.18)]"
                      : "border-white/80 bg-white/80"
                  }`}
                >
                  <div className="h-56 overflow-hidden bg-[#f4eee7] sm:h-64 md:h-72">
                    <img src={template.image} alt={template.title} className="h-full w-full object-cover object-top transition duration-500 hover:scale-[1.03]" />
                  </div>
                  <div className="p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-ink)]">{template.subtitle}</p>
                    <h3 className="mt-2 text-xl font-semibold text-[var(--ink)] sm:text-2xl">{template.title}</h3>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {showPreview && (
          <section className="mx-auto w-full">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--muted-ink)]">Preview</p>
                <h2 className="mt-2 font-['Georgia','Times_New_Roman',serif] text-3xl font-semibold text-[var(--ink)] sm:text-4xl">
                  Your resume is ready to review
                </h2>
              </div>
              <div className="flex flex-wrap gap-3">
                <button type="button" className="inline-flex items-center justify-center gap-3 rounded-full border border-[var(--accent-border)] bg-white px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--ink)] transition hover:bg-[var(--panel-warm)]">
                  <FaFileArrowUp /> Local File
                </button>
                <Link
                  to="/ats-check"
                  className="inline-flex items-center justify-center gap-3 rounded-full border border-[var(--accent-border)] bg-white px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--ink)] transition hover:bg-[var(--panel-warm)]"
                >
                  ATS Check
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setShowTemplates(true);
                    setShowPreview(false);
                  }}
                  className="inline-flex items-center justify-center gap-3 rounded-full bg-[var(--accent-ink)] px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-black"
                >
                  <FaWandMagicSparkles /> Change Template
                </button>
              </div>
            </div>
            <TemplateComponent data={data} />
          </section>
        )}
      </div>
    </div>
  );
};

export default GenerateResume;
