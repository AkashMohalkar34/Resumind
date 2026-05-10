export const getSkillLabel = (skill) => {
  if (skill == null) return "";
  if (typeof skill === "string") return skill.trim();

  if (typeof skill === "object") {
    return (
      skill.title?.trim() ||
      skill.name?.trim() ||
      skill.skill?.trim() ||
      skill.label?.trim() ||
      ""
    );
  }

  return String(skill).trim();
};

export const getSkillDetail = (skill) => {
  if (!skill || typeof skill !== "object") return "";
  return skill.level?.trim() || skill.category?.trim() || "";
};

