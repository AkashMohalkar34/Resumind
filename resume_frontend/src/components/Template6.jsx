import React, { useRef } from "react";
import { TbBackground } from "react-icons/tb";
import { CiLocationOn } from "react-icons/ci";
import { exportResumeToPdf } from "../utils/resumeExport";
import { getSkillDetail, getSkillLabel } from "../utils/skillUtils";

const Template6 = ({ data }) => {
  const resumeRef = useRef(null);

  const handleDownloadPdf = async () => {
    await exportResumeToPdf(
      resumeRef.current,
      data?.personalInformation?.fullName || "resume"
    );
  };

  if (!data) return <div>Loading...</div>;

  return (
    <>
      <div
        ref={resumeRef}
        style={{
          width: "210mm",
          minHeight: "297mm",
          boxSizing: "border-box",
          overflow: "visible",
        }}
        className="resume-sheet bg-white mx-auto p-8 text-black"
      >
        <div className="flex text-center ">
          <div>
            <h1 className=" text-2xl  font-bold sm:text-3xl md:ml-32">
              {data.personalInformation.fullName}
            </h1> <p className="text-center text-sm text-gray-600 md:ml-32">
              <p className="text-center text-gray-600">{data.personalInformation.jobTitle}</p>
            </p>
            
             
              <div className="mt-3 flex justify-center text-center gap-x-4 gap-y-2 text-sm">
                <p>Phone: {data.personalInformation.phoneNumber}</p>
                <p>Email: {data.personalInformation.email}</p>
                <p>Location: {data.personalInformation.location}</p>
              </div>
           
          </div>
        </div>

        <Section className="bg-emerald-100" title="ABOUT ME">
          <p className="text-sm">{data.summary}</p>
        </Section>

        <Section title="EDUCATION">
          {data.education?.map((edu, i) => (
            <div key={i} className="mb-2">
              <p className="font-semibold">
                {edu.university} | {edu.degree}
              </p>
              <p className="text-sm">
                {edu.startYear} - {edu.graduationYear}
              </p>
              <p className="text-sm">{edu.description}</p>
            </div>
          ))}
        </Section>

        <Section title="WORK EXPERIENCE">
          {data.experience?.map((exp, i) => (
            <div key={i} className="mb-3">
              <p className="font-semibold">
                {exp.company} | {exp.jobTitle}
              </p>
              <p className="text-sm">
                {exp.startDate} - {exp.endDate}
              </p>
              <p className="text-sm">{exp.responsibility}</p>
            </div>
          ))}
        </Section>

        <Section title="PROJECTS">
          {data.projects?.map((proj, i) => (
            <div key={i} className="mb-3">
              <p className="font-semibold">{proj.title}</p>
              <p className="text-sm">{proj.description}</p>
              <p className="text-sm">
                Tech Used: {proj.technologiesUsed?.join(", ")}
              </p>
            </div>
          ))}
        </Section>

        <Section title="SKILLS">
          <div className="grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
            {data.personalInformation.skills?.map((skill, i) => (
              <p key={i}>
                • {getSkillLabel(skill)}
                {getSkillDetail(skill) ? ` - ${getSkillDetail(skill)}` : ""}
              </p>
            ))}
          </div>
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
  <div className="mt-6">
    <h2 className="text-center bg-rose-100 font-bold tracking-widest border-y py-2 mb-3">
      {title}
    </h2>
    {children}
  </div>
);

export default Template6;
