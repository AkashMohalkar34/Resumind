import React, { useRef } from "react";
import { exportResumeToPdf } from "../utils/resumeExport";
import { getSkillDetail, getSkillLabel } from "../utils/skillUtils";

const splitResponsibility = (responsibility) => {
    if (Array.isArray(responsibility)) {
        return responsibility.filter(Boolean);
    }

    if (typeof responsibility !== "string" || !responsibility.trim()) {
        return [];
    }

    return responsibility
        .split(/\r?\n|\. |;/)
        .map((point) => point.trim())
        .filter(Boolean);
};

const Template8 = ({ data }) => {
    const resumeRef = useRef(null);

    const handleDownloadPdf = async () => {
        await exportResumeToPdf(
            resumeRef.current,
            data?.personalInformation?.fullName || "resume"
        );
    };

    if (!data) return <div>Loading...</div>;

    const personalInformation = data?.personalInformation ?? {};
    const experience = Array.isArray(data?.experience) ? data.experience : [];
    const education = Array.isArray(data?.education) ? data.education : [];
    const projects = Array.isArray(data?.projects) ? data.projects : [];
    const skills = Array.isArray(data?.personalInformation?.skills)
        ? data.personalInformation.skills
        : [];
    const linkedInUrl = personalInformation.linkedIn || personalInformation.linkedin;
    const githubUrl = personalInformation.gitHub || personalInformation.github;
    const primaryRole =
        personalInformation.role || experience?.[0]?.jobTitle || "Professional Candidate";

    return (
        <>
            <div
                ref={resumeRef}
                className="resume-sheet box-border mx-auto bg-white p-8 font-sans text-gray-800"
            >
                {/* HEADER */}
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-blue-900">
                            {personalInformation.fullName}
                        </h1>
                        <p className="text-lg text-gray-600">
                            {primaryRole}
                        </p>
                    </div>

                    <div className="flex flex-col space-y-1 text-start text-sm">
                        <p>Contact No : {personalInformation.phoneNumber || "-"}</p>
                        <p>
                            Github :{" "}
                            {githubUrl ? (
                                <a
                                    href={githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600"
                                >
                                    Link
                                </a>
                            ) : (
                                "-"
                            )}
                        </p>
                        <p> Location : {personalInformation.location || "-"}</p>

                        <p>
                            Email:{" "}
                            {personalInformation.email ? (
                                <a
                                    href={`mailto:${personalInformation.email}`}
                                    className=""
                                >
                                    {personalInformation.email}
                                </a>
                            ) : (
                                "-"
                            )}
                        </p>

                        <p>
                            LinkedIn :{" "}
                            {linkedInUrl ? (
                                <a
                                    href={linkedInUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600"
                                >
                                    Link
                                </a>
                            ) : (
                                "-"
                            )}
                        </p>
                    </div>
                </div>

                {/* ABOUT */}
                <Section title="SUMMARY">
                    <p className="text-sm leading-relaxed">{data.summary}</p>
                </Section>

                {/* EXPERIENCE */}
                <Section title="EXPERIENCE">
                    {experience.map((exp, i) => (
                        <div key={i} className="mb-5">
                            <div className="flex justify-between">
                                <div>
                                    <p className="font-semibold">{exp.jobTitle}</p>
                                    <p className="text-sm text-gray-600">{exp.company}</p>
                                </div>
                                <p className="text-sm text-gray-500">{exp.duration}</p>
                            </div>

                            <ul className="list-disc ml-5 text-sm mt-2">
                                {splitResponsibility(
                                    exp.responsibility ?? exp.responsibilities
                                ).map((point, idx) => (
                                    <li key={idx}>{point}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </Section>

                {/* EDUCATION */}
                <Section title="EDUCATION">
                    <div className="grid gap-6 sm:grid-cols-2">
                        {education.map((edu, i) => (
                            <div key={i}>
                                <p className="font-semibold">{edu.degree}</p>
                                <p className="text-sm">{edu.university}</p>
                                <p className="text-xs text-gray-500">
                                    {edu.graduationYear}
                                </p>
                            </div>
                        ))}
                    </div>
                </Section>

                {/* SKILLS */}
                <Section title="SKILLS">
                    
                        <div>
                            <ul className="list-disc flex flex-col text-sm">
                                {skills.map((skill, index) => (
                                    <div key={index} className="font-semibold py-2">
                                        {getSkillLabel(skill)}
                                        {getSkillDetail(skill) ? (
                                            <span className="font-thin">
                                                {" "}
                                                - {getSkillDetail(skill)}
                                            </span>
                                        ) : null}
                                    </div>
                                ))}
                            </ul>
                       
                    </div>
                </Section>

                <Section title="PROJECTS">
                    {projects.map((p, i) => (
                        <div key={i} className="mb-3">
                            <p className="font-semibold">{p.title}</p>
                            <p className="text-sm">{p.description}</p>
                            <p className="text-xs text-gray-600">
                                {p.technologiesUsed?.join(", ")}
                            </p>
                        </div>
                    ))}
                </Section>
            </div>

            {/* BUTTON */}
            <div className="mt-5 flex flex-wrap justify-center gap-3 text-center">
                <button onClick={handleDownloadPdf} className="btn btn-primary">
                    Download PDF
                </button>
            </div>
        </>
    );
};

/* SECTION COMPONENT */
const Section = ({ title, children }) => (
    <div className="mt-6">
        <h2 className="bg-blue-900 text-white px-4 py-1 text-sm font-semibold mb-3">
            {title}
        </h2>
        {children}
    </div>
);

export default Template8;
