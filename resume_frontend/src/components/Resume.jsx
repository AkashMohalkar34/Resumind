import React, { useRef } from "react";
import { FaEnvelope, FaLinkedin, FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import { exportResumeToPdf } from "../utils/resumeExport";
import { getSkillDetail, getSkillLabel } from "../utils/skillUtils";

const Resume = ({ data }) => {
    const resumeRef = useRef(null);

    const personalInformation = data?.personalInformation ?? {};
    const skills = data?.skills ?? [];
    const experience = data?.experience ?? [];
    const education = data?.education ?? [];
    const certifications = data?.certifications ?? [];
    const projects = data?.projects ?? [];
    const achievements = data?.achievements ?? [];
    const languages = data?.languages ?? [];
    const interests = data?.interests ?? [];

    const fullName = personalInformation.fullName || "Your Name";
    const linkedInUrl = personalInformation.linkedin || personalInformation.linkedIn;
    const roleLine = experience?.[0]?.jobTitle || "Professional Candidate";

    const handleDownloadPdf = async () => {
        await exportResumeToPdf(resumeRef.current, fullName || "resume");
    };

    const splitResponsibility = (responsibility) => {
        if (Array.isArray(responsibility)) {
            return responsibility.filter(Boolean);
        }

        if (typeof responsibility !== "string" || !responsibility.trim()) {
            return [];
        }

        return responsibility
            .split(/\n|\. |;/)
            .map((point) => point.trim())
            .filter(Boolean);
    };

    const contactItems = [
        { icon: <FaPhone />, text: personalInformation.phoneNumber },
        { icon: <FaEnvelope />, text: personalInformation.email },
        { icon: <FaMapMarkerAlt />, text: personalInformation.location },
        { icon: <FaLinkedin />, text: linkedInUrl },
    ].filter((item) => item.text);

    return (
        <>
            <div
                ref={resumeRef}
                style={{
                    width: "210mm",
                    height: "297mm",
                    maxWidth: "100%",
                    boxSizing: "border-box",
                    overflow: "hidden",
                }}
                className="resume-sheet mx-auto border border-[#d9dde1] bg-white p-6 text-black shadow-[0_18px_48px_rgba(20,28,36,0.1)]"
            >
                <header className="border-b border-[#d8dde3] pb-4 text-center">
                    <h1 className="font-['Georgia','Times_New_Roman',serif] text-[2rem] font-semibold tracking-[0.02em] text-black">
                        {fullName}
                    </h1>
                    <p className="mt-1 text-base text-[#5f7486]">{roleLine}</p>

                    {contactItems.length > 0 && (
                        <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[12px] text-black">
                            {contactItems.map((item, index) => (
                                <div key={`${item.text}-${index}`} className="flex items-center gap-2">
                                    <span className="text-[#5f7486]">{item.icon}</span>
                                    <span>{item.text}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </header>

                {data?.summary && (
                    <Section title="About Me">
                        <p className="text-[12px] leading-5 text-black">{data.summary}</p>
                    </Section>
                )}

                {education.length > 0 && (
                    <Section title="Education">
                        {education.map((edu, index) => (
                            <EntryBlock
                                key={`${edu.degree}-${index}`}
                                title={`${edu.university || ""}${edu.degree ? ` | ${edu.degree}` : ""}`.trim()}
                                subtitle={[edu.startYear, edu.graduationYear].filter(Boolean).join(" - ")}
                                detail={edu.description || edu.location}
                            />
                        ))}
                    </Section>
                )}

                {experience.length > 0 && (
                    <Section title="Work Experience">
                        {experience.map((exp, index) => (
                            <EntryBlock
                                key={`${exp.company}-${index}`}
                                title={`${exp.company || ""}${exp.jobTitle ? ` | ${exp.jobTitle}` : ""}`.trim()}
                                subtitle={[exp.startDate, exp.endDate, exp.duration].filter(Boolean).join(" - ")}
                                bullets={splitResponsibility(exp.responsibility)}
                            />
                        ))}
                    </Section>
                )}

                {projects.length > 0 && (
                    <Section title="Projects">
                        {projects.map((project, index) => (
                            <EntryBlock
                                key={`${project.title}-${index}`}
                                title={project.title}
                                detail={project.description}
                                footer={project.technologiesUsed?.length ? `Tech Used: ${project.technologiesUsed.join(", ")}` : ""}
                            />
                        ))}
                    </Section>
                )}

                {skills.length > 0 && (
                    <Section title="Skills">
                        <div className="grid gap-x-4 gap-y-1.5 text-[12px] text-black sm:grid-cols-2 lg:grid-cols-3">
                            {skills.map((skill, index) => (
                                <p key={`${getSkillLabel(skill)}-${index}`}>
                                    - {getSkillLabel(skill)}
                                    {getSkillDetail(skill) ? ` - ${getSkillDetail(skill)}` : ""}
                                </p>
                            ))}
                        </div>
                    </Section>
                )}

                {certifications.length > 0 && (
                    <Section title="Certifications">
                        {certifications.map((certification, index) => (
                            <EntryBlock
                                key={`${certification.title}-${index}`}
                                title={certification.title}
                                subtitle={certification.year}
                                detail={certification.issuingOrganization}
                            />
                        ))}
                    </Section>
                )}

                {languages.length > 0 && (
                    <Section title="Languages">
                        <div className="grid gap-x-4 gap-y-1.5 text-[12px] sm:grid-cols-2">
                            {languages.map((language, index) => (
                                <p key={`${language.name}-${index}`}>{language.name}</p>
                            ))}
                        </div>
                    </Section>
                )}

                {interests.length > 0 && (
                    <Section title="Interests">
                        <div className="grid gap-x-4 gap-y-1.5 text-[12px] sm:grid-cols-2">
                            {interests.map((interest, index) => (
                                <p key={`${interest.name}-${index}`}>{interest.name}</p>
                            ))}
                        </div>
                    </Section>
                )}

                {achievements.length > 0 && (
                    <Section title="Achievements">
                        {achievements.map((achievement, index) => (
                            <EntryBlock
                                key={`${achievement.title}-${index}`}
                                title={achievement.title}
                                subtitle={achievement.year}
                                detail={achievement.extraInformation}
                            />
                        ))}
                    </Section>
                )}
            </div>

            <div className="mt-5 flex flex-wrap justify-center gap-3">
                <button
                    onClick={handleDownloadPdf}
                    className="rounded-full bg-[var(--accent-ink)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-black"
                >
                    Download PDF
                </button>
            </div>
        </>
    );
};

const Section = ({ title, children }) => (
    <section className="mt-4">
        <h2 className="mb-2.5 border-y border-[#d8dde3] bg-[#eef3f6] py-1.5 text-center text-[11px] font-bold uppercase tracking-[0.24em] text-black">
            {title}
        </h2>
        <div className="space-y-2.5">{children}</div>
    </section>
);

const EntryBlock = ({ title, subtitle, detail, footer, bullets = [] }) => (
    <div className="rounded-lg border border-[#e3e7eb] bg-white p-3">
        {title && <p className="text-[13px] font-semibold text-black">{title}</p>}
        {subtitle && <p className="text-[11px] text-[#6b7280]">{subtitle}</p>}
        {detail && <p className="mt-1.5 text-[12px] leading-5 text-black">{detail}</p>}
        {bullets.length > 0 && (
            <ul className="mt-1.5 space-y-1 pl-4 text-[12px] leading-5 text-black">
                {bullets.map((bullet, index) => (
                    <li key={`${bullet}-${index}`} className="list-disc">
                        {bullet}
                    </li>
                ))}
            </ul>
        )}
        {footer && <p className="mt-1.5 text-[11px] text-[#4b5563]">{footer}</p>}
    </div>
);

export default Resume;
