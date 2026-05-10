const TEXT_EXTENSIONS = [".txt", ".md", ".csv", ".log"];
const JSON_EXTENSIONS = [".json"];
const PDF_EXTENSIONS = [".pdf"];

const normalizeText = (value) =>
  String(value || "")
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

const readFileAsArrayBuffer = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error || new Error("Unable to read file"));
    reader.readAsArrayBuffer(file);
  });

const readFileAsText = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error || new Error("Unable to read file"));
    reader.readAsText(file);
  });

const sanitizePdfString = (value) =>
  value
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\t/g, "\t")
    .replace(/\\\(/g, "(")
    .replace(/\\\)/g, ")")
    .replace(/\\\\/g, "\\");

const extractPdfTextFallback = async (file) => {
  const buffer = await readFileAsArrayBuffer(file);
  const bytes = new Uint8Array(buffer);
  const raw = new TextDecoder("latin1").decode(bytes);

  const parentheticalChunks = [];
  const regex = /\((?:\\.|[^()])*\)/g;
  let match;
  while ((match = regex.exec(raw)) !== null) {
    parentheticalChunks.push(match[0].slice(1, -1));
  }

  const decodedFromStrings = parentheticalChunks
    .map((chunk) => sanitizePdfString(chunk))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  if (decodedFromStrings.length > 120) {
    return decodedFromStrings;
  }

  const printableFallback = raw
    .replace(/[^\x20-\x7E\n\r\t]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return printableFallback;
};

const extractPdfTextWithPdfJs = async (file) => {
  const buffer = await readFileAsArrayBuffer(file);
  const pdfjs = await import("pdfjs-dist/build/pdf.mjs");
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.mjs",
    import.meta.url
  ).toString();

  const pdfDocument = await pdfjs.getDocument({ data: buffer }).promise;
  const pageTexts = [];

  for (let pageNumber = 1; pageNumber <= pdfDocument.numPages; pageNumber += 1) {
    const page = await pdfDocument.getPage(pageNumber);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item) => item.str || "")
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    if (pageText) {
      pageTexts.push(pageText);
    }
  }

  return pageTexts.join("\n\n");
};

const extractPdfText = async (file) => {
  try {
    const pdfText = await extractPdfTextWithPdfJs(file);
    if (pdfText && pdfText.trim().length > 50) {
      return pdfText;
    }
  } catch (error) {
    console.warn("Falling back to basic PDF text extraction.", error);
  }

  return extractPdfTextFallback(file);
};

const extractJsonPayload = (text) => {
  const parsed = JSON.parse(text);

  if (typeof parsed === "string") {
    return { text: normalizeText(parsed), structuredData: null };
  }

  if (parsed && typeof parsed === "object") {
    const structuredData =
      parsed.personalInformation || parsed.summary || parsed.skills || parsed.experience
        ? parsed
        : null;

    const textCandidates = [
      parsed.resumeText,
      parsed.text,
      parsed.content,
      parsed.description,
      parsed.summary,
    ].filter((value) => typeof value === "string" && value.trim().length > 0);

    if (textCandidates.length > 0) {
      return { text: normalizeText(textCandidates.join("\n\n")), structuredData };
    }

    return { text: normalizeText(JSON.stringify(parsed, null, 2)), structuredData };
  }

  return { text: "", structuredData: null };
};

const getExtension = (fileName) => {
  const lower = String(fileName || "").toLowerCase();
  const dotIndex = lower.lastIndexOf(".");
  return dotIndex >= 0 ? lower.slice(dotIndex) : "";
};

export const parseLocalResumeFile = async (file) => {
  if (!file) {
    return { kind: "empty", text: "", structuredData: null, fileName: "" };
  }

  const extension = getExtension(file.name);

  if (JSON_EXTENSIONS.includes(extension) || file.type === "application/json") {
    const text = await readFileAsText(file);
    const payload = extractJsonPayload(text);
    return {
      kind: payload.structuredData ? "structured" : "text",
      text: payload.text,
      structuredData: payload.structuredData,
      fileName: file.name,
    };
  }

  if (TEXT_EXTENSIONS.includes(extension) || file.type.startsWith("text/")) {
    const text = await readFileAsText(file);
    return {
      kind: "text",
      text: normalizeText(text),
      structuredData: null,
      fileName: file.name,
    };
  }

  if (PDF_EXTENSIONS.includes(extension) || file.type === "application/pdf") {
    const text = normalizeText(await extractPdfText(file));
    return {
      kind: "text",
      text,
      structuredData: null,
      fileName: file.name,
    };
  }

  return {
    kind: "unsupported",
    text: "",
    structuredData: null,
    fileName: file.name,
  };
};
