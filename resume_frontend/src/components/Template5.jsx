import React, { useRef } from "react";
import { exportResumeToPdf } from "../utils/resumeExport";
import { getSkillDetail, getSkillLabel } from "../utils/skillUtils";

const Template5 = ({ data }) => {
    const resumeRef = useRef(null);
    const skills = data?.personalInformation?.skills ?? [];

    const handleDownloadPdf = async () => {
        await exportResumeToPdf(
            resumeRef.current,
            data?.personalInformation?.fullName || "resume"
        );
    };

    if (!data) return <div>Loading...</div>;

    return (
        <>
            <div className="bg-gray-200 min-h-screen py-4 px-2 sm:px-4">
                <div
                    ref={resumeRef}
                    className="bg-white mx-auto shadow-lg text-black"
                    style={{
                        width: "100%",
                        maxWidth: "210mm",
                        minHeight: "297mm",
                        padding: "15mm",
                        fontFamily: "Arial, sans-serif",
                        boxSizing: "border-box",
                    }}
                >
                    {/* Header */}
                    <div className="text-center border-b border-gray-300 pb-4">
                        <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-wide break-words">
                            {data?.personalInformation?.fullName}
                        </h1>

                        <p className="text-sm text-gray-600 mt-1">
                            Software Engineer
                        </p>

                        <div className="mt-3 flex flex-col sm:flex-row sm:flex-wrap justify-center items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-700 break-all">
                            <span>{data?.personalInformation?.email}</span>

                            <span>{data?.personalInformation?.phoneNumber}</span>

                            <span>{data?.personalInformation?.location}</span>
                        </div>
                    </div>

                    {/* Summary */}
                    <Section title="SUMMARY">
                        <p className="text-sm leading-6 text-gray-700">
                            {data?.summary}
                        </p>
                    </Section>

                    {/* Work Experience */}
                    <Section title="WORK EXPERIENCE">
                        {data?.experience?.map((exp, i) => (
                            <div key={i} className="mb-5">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                                    <h3 className="font-bold text-sm sm:text-base">
                                        {exp.jobTitle}
                                    </h3>

                                    <span className="text-xs text-gray-600">
                                        {exp.duration}
                                    </span>
                                </div>

                                <p className="text-sm italic text-gray-700">
                                    {exp.company}
                                </p>

                                <ul className="list-disc pl-5 mt-2 text-sm space-y-1 text-gray-700">
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

                    {/* Education */}
                    <Section title="EDUCATION">
                        {data?.education?.map((edu, i) => (
                            <div key={i} className="mb-4">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                                    <h3 className="font-bold text-sm sm:text-base">
                                        {edu.degree}
                                    </h3>

                                    <span className="text-xs text-gray-600">
                                        {edu.graduationYear}
                                    </span>
                                </div>

                                <p className="text-sm text-gray-700">
                                    {edu.university}
                                </p>

                                <p className="text-xs text-gray-600">
                                    {edu.location}
                                </p>
                            </div>
                        ))}
                    </Section>

                    {/* Skills */}
                    <Section title="KEY SKILLS">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
                            {skills.map((s, i) => (
                                <p key={i} className="break-words">
                                    • {getSkillLabel(s)}
                                    {getSkillDetail(s)
                                        ? ` - ${getSkillDetail(s)}`
                                        : ""}
                                </p>
                            ))}
                        </div>
                    </Section>

                    {/* Projects */}
                    <Section title="PROJECTS">
                        {data?.projects?.map((p, i) => (
                            <div key={i} className="mb-4">
                                <h3 className="font-bold text-sm sm:text-base break-words">
                                    {p.title}
                                </h3>

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
                </div>

                {/* Buttons */}
                <div className="mt-6 flex justify-center">
                    <button
                        onClick={handleDownloadPdf}
                        className="w-full sm:w-auto px-5 py-2 bg-blue-600 hover:bg-blue-700 transition text-white rounded"
                    >
                        Download PDF
                    </button>
                </div>
            </div>
        </>
    );
};

const Section = ({ title, children }) => (
    <div className="mt-6">
        <div className="bg-gray-200 px-3 py-2 mb-3">
            <h2 className="text-xs sm:text-sm font-bold tracking-widest text-gray-800">
                {title}
            </h2>
        </div>

        {children}
    </div>
);

export default Template5;