import React, { useRef } from "react";
import { exportResumeToPdf } from "../utils/resumeExport";
import { getSkillDetail, getSkillLabel } from "../utils/skillUtils";

const Template2 = ({ data }) => {
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
            {console.log("data in  temp2 : " + data.personalInformation)}
            <div
                ref={resumeRef}
                style={{
                    width: "210mm",
                    minHeight: "297mm",
                    boxSizing: "border-box",
                    overflow: "hidden",
                }}
                className="resume-sheet bg-white mx-auto flex flex-col text-black md:flex-row"
            >
                {/* LEFT COLUMN */}
                <div className="w-full bg-gray-100 p-5 md:w-1/3">

                    {/* NAME */}
                    <h1 className="text-2xl font-bold text-blue-900">
                        {data?.personalInformation?.fullName}
                    </h1>

                    {/* CONTACT */}
                    <Section title="CONTACT">
                        <p>{data?.personalInformation?.location}</p>
                        <p>{data?.personalInformation?.phoneNumber}</p>
                        <p>{data?.personalInformation?.email}</p>
                    </Section>

                    {/* SKILLS */ console.log(data)}
                    <Section title="SKILLS">
                        <ul className="list-disc pl-5 text-sm">
                            {data?.personalInformation.skills?.map((s, i) => (
                                <li key={i}>
                                    {getSkillLabel(s)}
                                    {getSkillDetail(s) ? ` - ${getSkillDetail(s)}` : ""}
                                </li>
                            ))}
                        </ul>
                    </Section>

                    {/* LANGUAGES */}
                    <Section title="LANGUAGES">
                        <ul className="list-disc pl-5 text-sm">
                            {data?.languages?.map((l, i) => (
                                <li key={i}>{l.name}</li>
                            ))}
                        </ul>
                    </Section>

                    {/* INTERESTS */}
                    <Section title="INTERESTS">
                        <ul className="list-disc pl-5 text-sm">
                            {data?.interests?.map((i, idx) => (
                                <li key={idx}>{i.name}</li>
                            ))}
                        </ul>
                    </Section>
                </div>

                {/* RIGHT COLUMN */}
                <div className="w-full p-6 md:w-2/3">

                    {/* SUMMARY */}
                    <Section title="PROFESSIONAL SUMMARY">
                        <p className="text-sm">{data?.summary}</p>
                    </Section>

                    {/* EXPERIENCE */}
                    <Section title="WORK EXPERIENCE">
                        {data?.experience?.map((exp, i) => (
                            <div key={i} className="mb-4">
                                <p className="font-semibold">
                                    {exp.jobTitle} - {exp.company}
                                </p>
                                <p className="text-sm">
                                    {exp.location} | {exp.duration}
                                </p>

                                <ul className="list-disc pl-5 text-sm">
                                    {Array.isArray(exp.responsibility) ? (
                                        exp.responsibility.map((r, idx) => (
                                            <li key={idx}>{r}</li>
                                        ))
                                    ) : (
                                        <li>{exp.responsibility}</li>
                                    )}
                                </ul>
                            </div>
                        ))}
                    </Section>

                    {/* PROJECTS */}
                    <Section title="PROJECTS">
                        {data?.projects?.map((p, i) => (
                            <div key={i} className="mb-3">
                                <p className="font-semibold">{p.title}</p>
                                <p className="text-sm">{p.description}</p>
                                <p className="text-xs">
                                    Tech: {p.technologiesUsed?.join(", ")}
                                </p>
                            </div>
                        ))}
                    </Section>

                    {/* EDUCATION */}
                    <Section title="EDUCATION">
                        {data?.education?.map((edu, i) => (
                            <div key={i}>
                                <p className="font-semibold">
                                    {edu.degree} - {edu.university}
                                </p>
                                <p className="text-sm">
                                    {edu.location} | {edu.graduationYear}
                                </p>
                            </div>
                        ))}
                    </Section>

                    {/* CERTIFICATIONS */}
                    <Section title="CERTIFICATIONS">
                        {data?.certifications?.map((c, i) => (
                            <p key={i} className="text-sm">
                                {c.title} - {c.year}
                            </p>
                        ))}
                    </Section>

                    {/* ACHIEVEMENTS */}
                    <Section title="ACHIEVEMENTS">
                        {data?.achievements?.map((a, i) => (
                            <div key={i}>
                                <p className="font-semibold">
                                    {a.title} ({a.year})
                                </p>
                                <p className="text-sm">{a.extraInformation}</p>
                            </div>
                        ))}
                    </Section>
                </div>
            </div>

            {/* DOWNLOAD */}
            <div className="mt-5 flex flex-wrap justify-center gap-3 text-center">
                <button onClick={handleDownloadPdf} className="btn btn-primary">
                    Download PDF
                </button>
            </div>
        </>
    );
};

const Section = ({ title, children }) => (
    <div className="mb-5">
        <h2 className="text-blue-900 font-bold border-b mb-2">
            {title}
        </h2>
        {children}
    </div>
);

export default Template2;
