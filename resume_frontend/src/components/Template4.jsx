import React, { useRef } from "react";
import { exportResumeToPdf } from "../utils/resumeExport";
import { getSkillDetail, getSkillLabel } from "../utils/skillUtils";

const Template4 = ({ data }) => {
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
            <div className="bg-gray-100 min-h-screen py-4 px-2 sm:px-4">
                <div
                    ref={resumeRef}
                    className="bg-white mx-auto shadow-lg rounded-sm text-black"
                    style={{
                        width: "100%",
                        maxWidth: "210mm",
                        minHeight: "297mm",
                        padding: "15mm",
                        boxSizing: "border-box",
                        overflow: "visible",
                    }}
                >
                    {/* HEADER */}
                    <div className="mb-4">
                        <h1 className="text-2xl sm:text-3xl font-bold break-words">
                            {data?.personalInformation?.fullName}
                        </h1>

                        <div className="mt-2 text-[11px] sm:text-xs text-gray-700 space-y-1 break-all">
                            <p>
                                <span className="font-semibold">Email:</span>{" "}
                                {data?.personalInformation?.email}
                            </p>

                            <p>
                                <span className="font-semibold">Phone:</span>{" "}
                                {data?.personalInformation?.phoneNumber}
                            </p>

                            <p className="break-all">
                                <span className="font-semibold">LinkedIn:</span>{" "}
                                {data?.personalInformation?.linkedIn}
                            </p>

                            <p className="break-all">
                                <span className="font-semibold">GitHub:</span>{" "}
                                {data?.personalInformation?.gitHub}
                            </p>
                        </div>
                    </div>

                    {/* SUMMARY */}
                    <Section title="PROFESSIONAL SUMMARY">
                        <p className="text-sm leading-6 text-gray-800">
                            {data?.summary}
                        </p>
                    </Section>

                    {/* EDUCATION */}
                    <Section title="EDUCATION">
                        {data?.education?.map((edu, i) => (
                            <div key={i} className="mb-3">
                                <p className="font-semibold text-sm sm:text-base">
                                    {edu.degree}
                                </p>

                                <p className="text-sm">{edu.university}</p>

                                <p className="text-xs text-gray-600">
                                    {edu.location} | {edu.graduationYear}
                                </p>
                            </div>
                        ))}
                    </Section>

                    {/* SKILLS */}
                    <Section title="SKILLS">
                        <div className="flex flex-wrap gap-2">
                            {data?.personalInformation?.skills?.map((skill, i) => (
                                <span
                                    key={i}
                                    className="text-xs sm:text-sm border border-gray-300 px-2 py-1 rounded bg-gray-50"
                                >
                                    {getSkillLabel(skill)}
                                    {getSkillDetail(skill)
                                        ? ` - ${getSkillDetail(skill)}`
                                        : ""}
                                </span>
                            ))}
                        </div>
                    </Section>

                    {/* EXPERIENCE */}
                    <Section title="EXPERIENCE">
                        {data?.experience?.map((exp, i) => (
                            <div key={i} className="mb-4">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                                    <p className="font-semibold text-sm sm:text-base">
                                        {exp.jobTitle} - {exp.company}
                                    </p>

                                    <p className="text-xs text-gray-600">
                                        {exp.duration}
                                    </p>
                                </div>

                                <ul className="list-disc ml-5 mt-2 text-sm space-y-1">
                                    {exp.responsibilities?.map((r, idx) => (
                                        <li key={idx}>{r}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </Section>

                    {/* PROJECTS */}
                    <Section title="PROJECTS">
                        {data?.projects?.map((p, i) => (
                            <div key={i} className="mb-4">
                                <p className="font-semibold text-sm sm:text-base">
                                    {p.title}
                                </p>

                                <p className="text-sm text-gray-700 mt-1 leading-5">
                                    {p.description}
                                </p>

                                {p.technologiesUsed?.length > 0 && (
                                    <p className="text-xs text-gray-500 mt-1 break-words">
                                        Tech Stack: {p.technologiesUsed.join(", ")}
                                    </p>
                                )}
                            </div>
                        ))}
                    </Section>

                    {/* CERTIFICATIONS */}
                    <Section title="CERTIFICATIONS">
                        <ul className="list-disc ml-5 text-sm space-y-1">
                            {data?.certifications?.map((c, i) => (
                                <li key={i}>
                                    {c.title} - {c.issuingOrganization} ({c.year})
                                </li>
                            ))}
                        </ul>
                    </Section>

                    {/* ACHIEVEMENTS */}
                    <Section title="ACHIEVEMENTS">
                        <ul className="list-disc ml-5 text-sm space-y-2">
                            {data?.achievements?.map((a, i) => (
                                <li key={i}>
                                    <span className="font-medium">
                                        {a.title}
                                    </span>{" "}
                                    ({a.year})
                                    <br />

                                    <span className="text-gray-700">
                                        {a.extraInformation}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </Section>

                    {/* LANGUAGES */}
                    <Section title="LANGUAGES">
                        <div className="flex flex-wrap gap-2">
                            {data?.languages?.map((l, i) => (
                                <span
                                    key={i}
                                    className="text-xs sm:text-sm border border-gray-300 px-2 py-1 rounded"
                                >
                                    {l.name}
                                </span>
                            ))}
                        </div>
                    </Section>

                    {/* INTERESTS */}
                    <Section title="INTERESTS">
                        <div className="flex flex-wrap gap-2">
                            {data?.interests?.map((int, i) => (
                                <span
                                    key={i}
                                    className="text-xs sm:text-sm border border-gray-300 px-2 py-1 rounded"
                                >
                                    {int.name}
                                </span>
                            ))}
                        </div>
                    </Section>
                </div>

                {/* DOWNLOAD BUTTON */}
                <div className="flex justify-center mt-5">
                    <button
                        onClick={handleDownloadPdf}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded text-sm sm:text-base"
                    >
                        Download PDF
                    </button>
                </div>
            </div>
        </>
    );
};

const Section = ({ title, children }) => (
    <div className="mb-5">
        <h2 className="font-bold text-xs sm:text-sm border-b-2 border-black text-black mb-2 pb-1 tracking-wide">
            {title}
        </h2>

        {children}
    </div>
);

export default Template4;