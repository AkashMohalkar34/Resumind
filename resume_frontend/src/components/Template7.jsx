import React, { useRef } from "react";
import { exportResumeToPdf } from "../utils/resumeExport";
import { getSkillDetail, getSkillLabel } from "../utils/skillUtils";

const TemplateExact = ({ data }) => {
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
            {console.log("Template 7" , data)}
            <div
                ref={resumeRef}
                className="resume-sheet box-border mx-auto bg-white font-sans"
            >
                {/* HEADER */}
                <div className="bg-[#2f3e4d] text-center py-10">
                    <h1 className="text-4xl tracking-widest text-[#e7c98b] font-light">
                        {data.personalInformation.fullName}
                    </h1>
                    <p className="text-xs text-[#e7c98b] tracking-[3px] mt-2 uppercase">
                        {data.experience[0].jobTitle}
                    </p>
                </div>

                {/* MAIN */}
                <div className="grid grid-cols-1 text-black md:grid-cols-3">
                    {/* LEFT SIDE */}
                    <div className="col-span-1 bg-[#efefef] p-6 text-xs">
                        {/* CONTACT */}
                        <LeftSection title="CONTACT">
                            <p>{data.personalInformation.phoneNumber}</p>
                            <p>{data.personalInformation.email}</p>
                            <p>{data.personalInformation.website}</p>
                        </LeftSection>

                        {/* EDUCATION */}
                        <LeftSection title="EDUCATION">
                            {data.education?.map((edu, i) => (
                                <div key={i} className="mb-4">
                                    <p className="font-semibold">{edu.university}</p>
                                    <p>{edu.degree}</p>
                                    <p className="text-[10px] text-gray-600">
                                        {edu.startYear}-{edu.graduationYear}
                                    </p>
                                </div>
                            ))}
                        </LeftSection>

                        {/* SKILLS */}
                        <LeftSection title="SKILLS">
                            <ul className="list-disc text-black ml-4 space-y-1">
                                {data.personalInformation.skills?.map((skill, index) => (
                                    <li key={skill.id ?? index}>
                                        {getSkillLabel(skill)}
                                        {getSkillDetail(skill) ? ` - ${getSkillDetail(skill)}` : ""}
                                    </li>
                                ))}
                            </ul>
                        </LeftSection>

                        {/* LANGUAGE */}
                        <LeftSection title="LANGUAGE">
                            {data.languages?.map((lang) => (
                                <p key={lang.id}>• {lang.name}</p>
                            ))}
                        </LeftSection>

                        <LeftSection title="INTEREST">

                            <ul className="list-disc pl-6">
                                {data.interests.map((interest, index) => (
                                    <li key={index}>{interest.name}</li>
                                ))}
                            </ul>
                        </LeftSection>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="col-span-2 p-6 text-xs">
                        {/* SUMMARY */}
                        <RightSection title="SUMMARY">
                            <p className="leading-relaxed">{data.summary}</p>
                        </RightSection>

                        {/* EXPERIENCE */}
                        <RightSection title="WORK EXPERIENCE">
                            <div className="relative ml-2">
                                {/* vertical line */}
                                <div className="absolute left-1 top-0 bottom-0 w-[1px] bg-gray-400"></div>

                                {data.experience?.map((exp, i) => (
                                    <div key={i} className="relative pl-6 mb-6">
                                        {/* dot */}
                                        <div className="absolute left-[-3px] top-1 w-2 h-2 bg-[#2f3e4d] rounded-full"></div>

                                        <p className="text-[10px] text-gray-500">
                                            ({exp.startDate} - {exp.endDate})
                                        </p>

                                        <p className="font-bold uppercase">
                                            {exp.jobTitle}
                                        </p>

                                        <p>{exp.company}</p>

                                        <ul className="list-disc ml-4 mt-1">
                                            <li>{exp.responsibility}</li>
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </RightSection>

                        {/* PROJECTS */}
                        <RightSection title="PROJECTS">
                            <div className=" ">
                                {data.projects?.map((proj, i) => (
                                    <div key={i} className="mb-3">
                                        <p className="font-semibold">
                                            {proj.title}
                                        </p>
                                        <p className="text-sm">
                                            {proj.description}
                                        </p>
                                        <p className="text-sm">
                                            Tech Used: {proj.technologiesUsed?.join(", ")}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </RightSection>

                        <RightSection title="ACHIEVEMENTS">
                            <div className="mb-3">
                                {data.achievements.map((ach, index) => (
                                    <div
                                        key={index}
                                        className="mb-3"
                                    >
                                        <h2 className="font-semibold">{ach.title}</h2>
                                        <p className="text-sm ml-3">{ach.year}</p>
                                        <p className=" text-sm ml-3">
                                            {ach.extraInformation}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </RightSection>
                    </div>
                </div>
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

/* LEFT SECTION */
const LeftSection = ({ title, children }) => (
    <div className="mb-6">
        <h2 className="tracking-widest text-[11px] font-bold mb-2">
            {title}
        </h2>
        {children}
    </div>
);

/* RIGHT SECTION */
const RightSection = ({ title, children }) => (
    <div className="mb-6">
        <h2 className="tracking-widest text-[11px] font-bold mb-3">
            {title}
        </h2>
        {children}
    </div>
);

export default TemplateExact;
