import { toCanvas } from "html-to-image";
import { jsPDF } from "jspdf";

const sanitizeFileName = (fileName) => {
  const safeName = String(fileName || "resume")
    .replace(/[<>:"/\\|?*\u0000-\u001F]/g, "")
    .trim();

  return safeName || "resume";
};

export const exportResumeToPdf = async (element, fileName = "resume") => {
  if (!element) {
    throw new Error("Resume element not found");
  }

  if (document.fonts?.ready) {
    await document.fonts.ready;
  }

  const exportRoot = document.createElement("div");
  const exportNode = element.cloneNode(true);
  const captureWidth = Math.max(element.scrollWidth, element.clientWidth, 794);

  exportRoot.style.position = "fixed";
  exportRoot.style.left = "-10000px";
  exportRoot.style.top = "0";
  exportRoot.style.zIndex = "-1";
  exportRoot.style.pointerEvents = "none";
  exportRoot.style.background = "#ffffff";
  exportRoot.style.width = `${captureWidth}px`;
  exportRoot.style.padding = "0";
  exportRoot.style.margin = "0";

  exportNode.style.width = `${captureWidth}px`;
  exportNode.style.minHeight = "auto";
  exportNode.style.height = "auto";
  exportNode.style.maxHeight = "none";
  exportNode.style.overflow = "visible";
  exportNode.style.background = "#ffffff";
  exportNode.style.boxShadow = "none";
  exportNode.style.borderRadius = "0";
  exportNode.style.margin = "0";

  exportRoot.appendChild(exportNode);
  document.body.appendChild(exportRoot);

  try {
    await new Promise((resolve) => requestAnimationFrame(resolve));

    const canvas = await toCanvas(exportNode, {
      backgroundColor: "#ffffff",
      cacheBust: true,
      pixelRatio: 2,
      canvasWidth: captureWidth * 2,
      canvasHeight: Math.max(exportNode.scrollHeight, exportNode.clientHeight) * 2,
      style: {
        margin: "0",
      },
    });

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 8;
    const printableWidth = pageWidth - margin * 2;
    const printableHeight = pageHeight - margin * 2;
    const scale = printableWidth / canvas.width;
    const pageHeightInPixels = Math.floor(printableHeight / scale);

    let offsetY = 0;
    let pageIndex = 0;

    while (offsetY < canvas.height) {
      const sliceHeight = Math.min(pageHeightInPixels, canvas.height - offsetY);
      const pageCanvas = document.createElement("canvas");
      const pageContext = pageCanvas.getContext("2d");

      pageCanvas.width = canvas.width;
      pageCanvas.height = sliceHeight;

      if (!pageContext) {
        throw new Error("Unable to create PDF export canvas");
      }

      pageContext.fillStyle = "#ffffff";
      pageContext.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
      pageContext.drawImage(
        canvas,
        0,
        offsetY,
        canvas.width,
        sliceHeight,
        0,
        0,
        canvas.width,
        sliceHeight
      );

      if (pageIndex > 0) {
        pdf.addPage();
      }

      const imageData = pageCanvas.toDataURL("image/png");
      const renderedHeight = sliceHeight * scale;
      pdf.addImage(
        imageData,
        "PNG",
        margin,
        margin,
        printableWidth,
        renderedHeight,
        undefined,
        "FAST"
      );

      offsetY += sliceHeight;
      pageIndex += 1;
    }

    pdf.save(`${sanitizeFileName(fileName)}.pdf`);
  } finally {
    exportRoot.remove();
  }
};

export const exportResumeToWord = (element, fileName = "resume") => {
  if (!element) {
    throw new Error("Resume element not found");
  }

  const html = `
    <html>
      <head>
        <meta charset="utf-8">
        <title>${fileName}</title>
      </head>
      <body>
        ${element.outerHTML}
      </body>
    </html>
  `;

  const blob = new Blob(["\ufeff", html], {
    type: "application/msword",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${sanitizeFileName(fileName)}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
