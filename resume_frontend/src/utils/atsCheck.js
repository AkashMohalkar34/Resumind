const ATS_FRIENDLY_TEMPLATES = new Set(["t3", "t4", "t6"]);
const STOPWORDS = new Set([
  "about",
  "across",
  "after",
  "also",
  "and",
  "are",
  "been",
  "best",
  "build",
  "building",
  "but",
  "can",
  "candidate",
  "candidates",
  "collaborate",
  "collaborating",
  "communication",
  "company",
  "create",
  "creating",
  "current",
  "degree",
  "deliver",
  "delivering",
  "detail",
  "details",
  "drive",
  "driven",
  "during",
  "each",
  "ensure",
  "excellent",
  "experience",
  "experienced",
  "familiar",
  "focused",
  "for",
  "from",
  "good",
  "have",
  "help",
  "high",
  "ideal",
  "including",
  "intermediate",
  "into",
  "job",
  "knowledge",
  "looking",
  "maintain",
  "minimum",
  "more",
  "must",
  "need",
  "nice",
  "preferred",
  "plus",
  "our",
  "position",
  "preferred",
  "professional",
  "proficiency",
  "proficient",
  "qualification",
  "qualifications",
  "requirement",
  "requirements",
  "required",
  "responsibilities",
  "responsibility",
  "role",
  "seeking",
  "should",
  "skills",
  "solution",
  "strong",
  "basic",
  "bonus",
  "team",
  "teams",
  "their",
  "them",
  "they",
  "this",
  "those",
  "through",
  "understanding",
  "using",
  "various",
  "well",
  "will",
  "with",
  "within",
  "work",
  "working",
  "years",
  "year",
  "you",
  "your",
]);
const COMPOUND_KEYWORD_PATTERNS = [
  /\bmachine learning\b/gi,
  /\bdata analysis\b/gi,
  /\bdata analytics\b/gi,
  /\bdata science\b/gi,
  /\bproject management\b/gi,
  /\bproduct management\b/gi,
  /\bsoftware development\b/gi,
  /\bweb development\b/gi,
  /\bcloud computing\b/gi,
  /\bartificial intelligence\b/gi,
  /\bspring boot\b/gi,
  /\breact js\b/gi,
  /\bnode js\b/gi,
  /\bnext js\b/gi,
  /\bexpress js\b/gi,
  /\bpower bi\b/gi,
  /\bgoogle cloud\b/gi,
  /\bmicrosoft excel\b/gi,
  /\bproblem solving\b/gi,
  /\bteam leadership\b/gi,
];
const PRIORITY_KEYWORDS = new Set([
  "aws",
  "azure",
  "blender",
  "c++",
  "css",
  "data analysis",
  "data analytics",
  "data science",
  "docker",
  "excel",
  "express",
  "express js",
  "figma",
  "firebase",
  "flask",
  "gcp",
  "git",
  "github",
  "html",
  "java",
  "javascript",
  "jira",
  "kotlin",
  "kubernetes",
  "machine learning",
  "mongodb",
  "mysql",
  "next js",
  "node",
  "node js",
  "pandas",
  "photoshop",
  "php",
  "power bi",
  "project management",
  "python",
  "react",
  "react js",
  "salesforce",
  "sap",
  "spring",
  "spring boot",
  "sql",
  "tableau",
  "tensorflow",
  "typescript",
  "ui ux",
  "unreal engine",
  "vue",
  "web development",
]);
const ROLE_HINTS = [
  "administrator",
  "analyst",
  "architect",
  "consultant",
  "coordinator",
  "designer",
  "developer",
  "engineer",
  "intern",
  "lead",
  "manager",
  "scientist",
  "specialist",
];
const KEYWORD_EQUIVALENTS = {
  "artificial intelligence": ["ai"],
  aws: ["amazon web services"],
  css: ["css3"],
  docker: ["dockerized"],
  "express js": ["express", "expressjs"],
  gcp: ["google cloud", "google cloud platform"],
  github: ["git hub"],
  html: ["html5"],
  javascript: ["js"],
  "machine learning": ["ml"],
  mysql: ["my sql"],
  "next js": ["nextjs", "next.js"],
  node: ["nodejs", "node.js"],
  "node js": ["nodejs", "node.js", "node"],
  photoshop: ["adobe photoshop"],
  python: ["python3"],
  react: ["reactjs", "react.js"],
  "react js": ["reactjs", "react.js", "react"],
  "spring boot": ["springboot"],
  sql: ["postgresql", "mysql", "sql server"],
  tableau: ["tableau desktop"],
  typescript: ["ts"],
  "ui ux": ["ui", "ux", "user interface", "user experience"],
};

const hasText = (value) => typeof value === "string" && value.trim().length > 0;

const skillLabel = (skill) => {
  if (!skill) return "";
  if (typeof skill === "string") return skill.trim();
  return skill.title?.trim() || skill.name?.trim() || skill.skill?.trim() || "";
};

const collapseLetterSpacedWords = (text) =>
  String(text || "").replace(/(?:\b[a-zA-Z]\b(?:\s+|$)){3,}/g, (match) =>
    match.replace(/\s+/g, "")
  );

const normalizeWords = (text) =>
  collapseLetterSpacedWords(text)
    .toLowerCase()
    .replace(/[^a-z0-9+.#\s-]/g, " ")
    .split(/[\s/-]+/)
    .map((word) => word.trim())
    .filter((word) => word.length > 2);

const normalizeKeyword = (value) =>
  collapseLetterSpacedWords(value)
    .toLowerCase()
    .replace(/[^a-z0-9+.#\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const collapseKeyword = (value) =>
  normalizeKeyword(value).replace(/[\s.-]+/g, "");

const uniq = (items) => [...new Set(items.filter(Boolean))];

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getKeywordVariants = (keyword) => {
  const normalizedKeyword = normalizeKeyword(keyword);
  const mappedVariants = KEYWORD_EQUIVALENTS[normalizedKeyword] || [];
  return uniq([normalizedKeyword, ...mappedVariants.map(normalizeKeyword)]);
};

const extractMeaningfulKeywordTokens = (keyword) =>
  normalizeWords(keyword).filter((word) => !STOPWORDS.has(word) && !/^\d+$/.test(word));

const extractTargetKeywords = (text) => {
  const normalizedText = normalizeKeyword(text);
  const compoundMatches = COMPOUND_KEYWORD_PATTERNS.flatMap((pattern) =>
    Array.from(normalizedText.matchAll(pattern), (match) => normalizeKeyword(match[0]))
  );
  const singleWordKeywords = normalizeWords(normalizedText).filter(
    (word) => !STOPWORDS.has(word) && !/^\d+$/.test(word)
  );
  const prioritizedSingles = singleWordKeywords.filter(
    (word) => PRIORITY_KEYWORDS.has(word) || ROLE_HINTS.some((hint) => word.endsWith(hint))
  );
  const prioritizedCompounds = compoundMatches.filter(
    (keyword) =>
      PRIORITY_KEYWORDS.has(keyword) || ROLE_HINTS.some((hint) => keyword.endsWith(hint))
  );
  const fallbackKeywords = singleWordKeywords.filter(
    (word) =>
      !prioritizedSingles.includes(word) &&
      (word.length >= 5 || /[+.#]/.test(word))
  );

  return uniq([...prioritizedCompounds, ...prioritizedSingles, ...fallbackKeywords]).slice(0, 30);
};

const keywordExistsInText = (resumeText, keyword) => {
  const normalizedResumeText = normalizeKeyword(resumeText);
  const collapsedResumeText = collapseKeyword(resumeText);
  const keywordVariants = getKeywordVariants(keyword);

  if (
    keywordVariants.some((variant) => {
      if (!variant) return false;

      if (variant.includes(" ")) {
        return (
          normalizedResumeText.includes(variant) ||
          collapsedResumeText.includes(collapseKeyword(variant))
        );
      }

      const keywordPattern = new RegExp(`\\b${escapeRegExp(variant)}\\b`, "i");
      return (
        keywordPattern.test(normalizedResumeText) ||
        collapsedResumeText.includes(collapseKeyword(variant))
      );
    })
  ) {
    return true;
  }

  return keywordVariants.some((variant) => {
    if (!variant) return false;
    const tokens = extractMeaningfulKeywordTokens(variant);
    if (tokens.length < 2) {
      return false;
    }

    return tokens.every((token) => {
      const tokenPattern = new RegExp(`\\b${escapeRegExp(token)}\\b`, "i");
      return (
        tokenPattern.test(normalizedResumeText) ||
        collapsedResumeText.includes(collapseKeyword(token))
      );
    });
  });
};

const scoreSection = (present, weight, noteIfMissing) => {
  if (!present) {
    return { score: 0, note: noteIfMissing, status: "missing" };
  }
  return { score: weight, note: "Present", status: "good" };
};

export const extractResumeTextFromData = (data) => {
  const personal =
    data?.personalInformation ??
    data?.personal ??
    data?.contact ??
    {};
  const skills = Array.isArray(data?.skills) ? data.skills : [];
  const experience = Array.isArray(data?.experience) ? data.experience : [];
  const education = Array.isArray(data?.education) ? data.education : [];
  const projects = Array.isArray(data?.projects) ? data.projects : [];
  const certifications = Array.isArray(data?.certifications) ? data.certifications : [];
  const languages = Array.isArray(data?.languages) ? data.languages : [];
  const interests = Array.isArray(data?.interests) ? data.interests : [];

  const resumeText = [
    personal.fullName,
    personal.name,
    personal.email,
    personal.phoneNumber,
    personal.phone,
    personal.mobile,
    personal.location,
    personal.address,
    data?.summary,
    data?.objective,
    ...skills.map(skillLabel),
    ...experience.flatMap((exp) => [
      exp.jobTitle,
      exp.role,
      exp.title,
      exp.company,
      exp.companyName,
      exp.location,
      exp.duration,
      Array.isArray(exp.responsibility) ? exp.responsibility.join(" ") : exp.responsibility,
      Array.isArray(exp.responsibilities) ? exp.responsibilities.join(" ") : exp.responsibilities,
      exp.description,
    ]),
    ...education.flatMap((edu) => [
      edu.degree,
      edu.course,
      edu.university,
      edu.college,
      edu.institute,
      edu.location,
    ]),
    ...projects.flatMap((project) => [
      project.title,
      project.name,
      project.description,
      Array.isArray(project.technologiesUsed) ? project.technologiesUsed.join(" ") : project.technologiesUsed,
      Array.isArray(project.technologies) ? project.technologies.join(" ") : project.technologies,
    ]),
    ...certifications.map((cert) =>
      `${cert.title || cert.name || ""} ${cert.issuingOrganization || cert.issuer || ""} ${cert.year || ""}`
    ),
    ...languages.map((language) => language.name || language.language || language),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return {
    personal,
    skills,
    experience,
    education,
    projects,
    certifications,
    languages,
    interests,
    resumeText,
    targetKeywords: [],
  };
};

const buildKeywordAnalysis = (resumeText, targetKeywords, strengths, suggestions, score) => {
  const keywordHits = [];
  const keywordMisses = [];

  if (targetKeywords.length > 0) {
    targetKeywords.forEach((keyword) => {
      if (keywordExistsInText(resumeText, keyword)) {
        keywordHits.push(keyword);
      } else {
        keywordMisses.push(keyword);
      }
    });

    const keywordMatchRatio = keywordHits.length / targetKeywords.length;
    score += Math.round(keywordMatchRatio * 20);

    if (keywordHits.length > 0) {
      strengths.push(`Matched ${keywordHits.length} target keywords.`);
    }
    if (keywordMisses.length > 0) {
      suggestions.push(`Add keywords for: ${keywordMisses.slice(0, 5).join(", ")}.`);
    }
  }

  return { score, keywordHits, keywordMisses };
};

const finalizeATSResult = ({
  score,
  strengths,
  suggestions,
  keywordHits,
  keywordMisses,
  selectedTemplate,
  targetJobTitle,
  sectionChecks,
  templateNote,
  verdict,
}) => ({
  score: Math.max(0, Math.min(100, score)),
  verdict: verdict || (score >= 80 ? "ATS friendly" : score >= 60 ? "Mostly ATS friendly" : "Needs improvement"),
  strengths,
  suggestions,
  templateNote:
    templateNote ||
    (ATS_FRIENDLY_TEMPLATES.has(selectedTemplate)
      ? "This template is designed to be ATS-friendly."
      : "This template is visually rich, so ATS parsers may have more trouble with it."),
  sectionChecks,
  keywordHits,
  keywordMisses,
  targetJobTitle: targetJobTitle.trim(),
});

export const analyzeResumeForATS = (data, selectedTemplate, targetJobTitle = "") => {
  const {
    personal,
    skills,
    experience,
    education,
    projects,
    certifications,
    languages,
    resumeText,
  } = extractResumeTextFromData(data);
  const targetKeywords = extractTargetKeywords(targetJobTitle);
  const fullName = personal.fullName || personal.name || "";
  const email = personal.email || "";
  const phoneNumber = personal.phoneNumber || personal.phone || personal.mobile || "";

  let score = 0;
  const strengths = [];
  const suggestions = [];

  const sectionChecks = [
    {
      name: "Contact",
      ...scoreSection(
        hasText(fullName) && hasText(email) && hasText(phoneNumber),
        20,
        "Add full name, email, and phone number."
      ),
    },
    {
      name: "Summary",
      ...scoreSection(hasText(data?.summary), 15, "Add a professional summary."),
    },
    {
      name: "Skills",
      ...scoreSection(skills.some((skill) => hasText(skillLabel(skill))), 15, "Add a dedicated skills section."),
    },
    {
      name: "Experience",
      ...scoreSection(experience.length > 0, 20, "Add at least one work experience entry."),
    },
    {
      name: "Education",
      ...scoreSection(education.length > 0, 10, "Add an education section."),
    },
    {
      name: "Projects",
      ...scoreSection(projects.length > 0, 7, "Add relevant projects if you have them."),
    },
    {
      name: "Certifications",
      ...scoreSection(certifications.length > 0, 5, "Add certifications if they support the role."),
    },
    {
      name: "Languages",
      ...scoreSection(languages.length > 0, 2, "Languages can help, but they are optional."),
    },
  ];

  sectionChecks.forEach((section) => {
    score += section.score;
  });

  if (hasText(data?.summary) && data.summary.trim().length > 120) {
    strengths.push("Summary has enough detail for parsing.");
  } else if (hasText(data?.summary)) {
    suggestions.push("Expand the summary with role keywords and measurable impact.");
  }

  const skillCount = skills.filter((skill) => hasText(skillLabel(skill))).length;
  if (skillCount >= 8) {
    strengths.push("Skills section is strong.");
    score += 10;
  } else if (skillCount >= 5) {
    score += 7;
  } else if (skillCount < 3) {
    suggestions.push("Add more role-specific skills.");
  }

  const hasResponsibilities = experience.some((exp) => {
    if (Array.isArray(exp?.responsibility)) return exp.responsibility.length > 0;
    if (Array.isArray(exp?.responsibilities)) return exp.responsibilities.length > 0;
    return hasText(exp?.responsibility) || hasText(exp?.responsibilities);
  });
  if (hasResponsibilities) {
    strengths.push("Work experience includes supporting detail.");
    score += 8;
  } else if (experience.length > 0) {
    suggestions.push("Add bullet points under each role.");
  }

  if (hasText(personal.image)) {
    score = Math.max(0, score - 5);
    suggestions.push("Avoid profile photos for maximum ATS compatibility.");
  }

  if (!ATS_FRIENDLY_TEMPLATES.has(selectedTemplate)) {
    score = Math.max(0, score - 10);
    suggestions.push("This template is more visual than an ATS-first layout.");
  } else {
    strengths.push("Selected template is ATS-friendly.");
  }

  const keywordAnalysis = buildKeywordAnalysis(
    resumeText,
    targetKeywords,
    strengths,
    suggestions,
    score
  );

  return finalizeATSResult({
    score: keywordAnalysis.score,
    strengths,
    suggestions,
    keywordHits: keywordAnalysis.keywordHits,
    keywordMisses: keywordAnalysis.keywordMisses,
    selectedTemplate,
    targetJobTitle,
    sectionChecks,
  });
};

const SECTION_PATTERNS = {
  Contact: [
    /\b[\w.+-]+@[\w-]+\.[\w.-]+\b/i,
    /\b(\+?\d[\d\s().-]{7,}\d)\b/i,
  ],
  Summary: [/\b(summary|professional summary|profile|about me|objective)\b/i],
  Skills: [/\b(skills|technical skills|core competencies|key skills)\b/i],
  Experience: [/\b(experience|work experience|employment history|professional experience)\b/i],
  Education: [/\b(education|academic background|qualifications)\b/i],
  Projects: [/\b(projects|project experience|selected projects)\b/i],
  Certifications: [/\b(certifications|certificates|licenses)\b/i],
  Languages: [/\b(languages|language proficiency)\b/i],
};

const detectSectionPresent = (text, patterns) => patterns.some((pattern) => pattern.test(text));

const countSignals = (text, patterns) =>
  patterns.reduce((count, pattern) => count + (pattern.test(text) ? 1 : 0), 0);

export const analyzeResumeTextForATS = (resumeText, selectedTemplate, targetJobTitle = "") => {
  const normalizedText = String(resumeText || "").trim();
  const textLower = normalizedText.toLowerCase();
  const targetKeywords = extractTargetKeywords(targetJobTitle);

  let score = 0;
  const strengths = [];
  const suggestions = [];

  const contactSignals = countSignals(normalizedText, SECTION_PATTERNS.Contact);
  const sectionChecks = [
    {
      name: "Contact",
      score: contactSignals >= 2 ? 20 : contactSignals === 1 ? 12 : 0,
      note:
        contactSignals >= 2
          ? "Present"
          : "Add your email and phone number so recruiters can reach you.",
      status: contactSignals >= 2 ? "good" : "missing",
    },
    {
      name: "Summary",
      ...scoreSection(
        detectSectionPresent(normalizedText, SECTION_PATTERNS.Summary) || normalizedText.length > 220,
        15,
        "Add a professional summary or profile section."
      ),
    },
    {
      name: "Skills",
      ...scoreSection(
        detectSectionPresent(normalizedText, SECTION_PATTERNS.Skills),
        15,
        "Add a dedicated skills section."
      ),
    },
    {
      name: "Experience",
      ...scoreSection(
        detectSectionPresent(normalizedText, SECTION_PATTERNS.Experience),
        20,
        "Add work experience with role titles and bullet points."
      ),
    },
    {
      name: "Education",
      ...scoreSection(
        detectSectionPresent(normalizedText, SECTION_PATTERNS.Education),
        10,
        "Add an education section."
      ),
    },
    {
      name: "Projects",
      ...scoreSection(
        detectSectionPresent(normalizedText, SECTION_PATTERNS.Projects),
        7,
        "Add projects if they support the role you want."
      ),
    },
    {
      name: "Certifications",
      ...scoreSection(
        detectSectionPresent(normalizedText, SECTION_PATTERNS.Certifications),
        5,
        "Add certifications if they help prove job readiness."
      ),
    },
    {
      name: "Languages",
      ...scoreSection(
        detectSectionPresent(normalizedText, SECTION_PATTERNS.Languages),
        2,
        "Languages are optional, but they can help."
      ),
    },
  ];

  sectionChecks.forEach((section) => {
    score += section.score;
  });

  if (normalizedText.length > 350) {
    strengths.push("File has enough content for an ATS scan.");
    score += 6;
  } else if (normalizedText.length > 0) {
    suggestions.push("Upload a text-based resume or searchable PDF for better analysis.");
  } else {
    suggestions.push("The file did not contain readable text.");
  }

  const skillLikeTerms = [
    "react",
    "node",
    "java",
    "python",
    "aws",
    "sql",
    "javascript",
    "typescript",
    "excel",
    "docker",
    "kubernetes",
    "spring boot",
    "html",
    "css",
  ].filter((term) => textLower.includes(term));

  if (skillLikeTerms.length >= 6) {
    strengths.push("Resume includes broad role-relevant terminology.");
    score += 6;
  } else if (skillLikeTerms.length > 0) {
    suggestions.push("Add more role-specific terms from the target job description.");
  }

  if (textLower.includes("photo") || textLower.includes("profile image")) {
    score = Math.max(0, score - 5);
    suggestions.push("Avoid profile photos for maximum ATS compatibility.");
  }

  if (!ATS_FRIENDLY_TEMPLATES.has(selectedTemplate)) {
    score = Math.max(0, score - 10);
    suggestions.push("This template is more visual than an ATS-first layout.");
  } else {
    strengths.push("Selected template is ATS-friendly.");
  }

  const keywordAnalysis = buildKeywordAnalysis(
    textLower,
    targetKeywords,
    strengths,
    suggestions,
    score
  );

  return finalizeATSResult({
    score: keywordAnalysis.score,
    strengths,
    suggestions,
    keywordHits: keywordAnalysis.keywordHits,
    keywordMisses: keywordAnalysis.keywordMisses,
    selectedTemplate,
    targetJobTitle,
    sectionChecks,
    templateNote: ATS_FRIENDLY_TEMPLATES.has(selectedTemplate)
      ? "This uploaded file is being reviewed with an ATS-friendly template baseline."
      : "This uploaded file is being reviewed with a visually rich template baseline.",
  });
};
