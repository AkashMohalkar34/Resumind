import React, { useRef } from "react";
import { exportResumeToPdf } from "../utils/resumeExport";
import { getSkillDetail, getSkillLabel } from "../utils/skillUtils";

const Template3 = ({ data }) => {
  const resumeRef = useRef(null);
  const skills = data?.personalInformation.skills ?? [];

  const handleDownloadPdf = async () => {
    await exportResumeToPdf(
      resumeRef.current,
      data?.personalInformation?.fullName || "resume"
    );
  };

  if (!data) return <div>Loading...</div>;

  return (
    <>
      {console.log("data in t3 : " , data)}
      <div
        ref={resumeRef}
        style={{
          width: "210mm",
          minHeight: "297mm",
          padding: "20mm",
          boxSizing: "border-box",
          overflow: "visible",
        }}
        className="resume-sheet bg-white mx-auto text-black font-sans"
      >
        <div className="text-center mb-6">
          <h1 className="text-3xl tracking-widest font-semibold">
            {data?.personalInformation?.fullName}
          </h1>
          <p className="text-sm text-gray-600">Software Engineer</p>

          <div className="mt-3 flex flex-wrap justify-center gap-x-6 gap-y-2 border-b border-black pb-1 text-sm">
            <span>Name : {data?.personalInformation?.phoneNumber}</span>
            <span>Email : {data?.personalInformation?.email}</span>
            <span>Location : {data?.personalInformation?.location}</span>
          </div>
        </div>

        <Section title="ABOUT ME">
          <p className="text-sm text-gray-700">{data?.summary}</p>
        </Section>

        <Section title="EDUCATION">
          {data?.education?.map((edu, i) => (
            <div key={i} className="mb-3">
              <p className="font-semibold">
                {edu.university} | {edu.graduationYear}
              </p>
              <p className="text-sm">{edu.degree}</p>
              <p className="text-sm text-gray-600">{edu.location}</p>
            </div>
          ))}
        </Section>

        <Section title="WORK EXPERIENCE">
          {data?.experience?.map((exp, i) => (
            <div key={i} className="mb-4">
              <p className="font-semibold">
                {exp.company} | {exp.duration}
              </p>
              <p className="text-sm italic">{exp.jobTitle}</p>

              <ul className="list-disc pl-5 text-sm mt-1">
                {Array.isArray(exp.responsibility) ? (
                  exp.responsibility.map((r, idx) => <li key={idx}>{r}</li>)
                ) : (
                  <li>{exp.responsibility}</li>
                )}
              </ul>
            </div>
          ))}
        </Section>

        <Section title="SKILLS">
          <div className="grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
            {skills.map((s, i) => (
              <p key={i}>
                • {getSkillLabel(s)}
                {getSkillDetail(s) ? ` - ${getSkillDetail(s)}` : ""}
              </p>
            ))}
          </div>
        </Section>

        <Section title="PROJECTS">
          {data?.projects?.map((p, i) => (
            <div key={i} className="mb-3">
              <p className="font-semibold">{p.title}</p>
              <p className="text-sm">{p.description}</p>
              <p className="text-xs text-gray-600">
                {p.technologiesUsed?.join(", ")}
              </p>
            </div>
          ))}
        </Section>

        <Section title="CERTIFICATIONS">
          {data?.certifications?.map((c, i) => (
            <p key={i} className="text-sm">
              {c.title} - {c.year}
            </p>
          ))}
        </Section>
      </div>

      <div className="mt-5 flex flex-wrap justify-center gap-3 text-center">
        <button onClick={handleDownloadPdf} className="btn btn-primary">
          Download PDF
        </button>
      </div>
    </>
  );
};

const Section = ({ title, children }) => (
  <div className="mb-6">
    <h2 className="tracking-widest text-sm font-bold border-b border-black pb-1 mb-2">
      {title}
    </h2>
    {children}
  </div>
);

export default Template3;
