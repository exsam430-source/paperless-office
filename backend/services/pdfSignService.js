const fs = require('fs/promises');
const path = require('path');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

function base64ToBytes(dataUrl) {
  const base64 = dataUrl.split(',')[1];
  return Buffer.from(base64, 'base64');
}

/**
 * Places PNG signature on selected page.
 * placement:
 * - pageNumber (1-based; default last page)
 * - xPct from left
 * - yPct from bottom
 * - wPct width percentage of page width (default 0.25)
 */
exports.stampPdfWithSignature = async ({
  uploadsDir,
  inputFilename,
  signatureData,
  labelText,
  placement = {}
}) => {
  const inputPath = path.join(uploadsDir, inputFilename);

  const pdfBytes = await fs.readFile(inputPath);
  const pdfDoc = await PDFDocument.load(pdfBytes);

  const pngBytes = base64ToBytes(signatureData);
  const pngImage = await pdfDoc.embedPng(pngBytes);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const pages = pdfDoc.getPages();
  const pageIndex =
    placement.pageNumber && placement.pageNumber >= 1
      ? Math.min(pages.length - 1, placement.pageNumber - 1)
      : pages.length - 1;

  const page = pages[pageIndex];
  const { width: pageW, height: pageH } = page.getSize();

  // signature size
  const wPct = placement.wPct ?? 0.25;
  const targetW = pageW * wPct;
  const scale = targetW / pngImage.width;
  const targetH = pngImage.height * scale;

  // default: bottom-right
  const xPct = placement.xPct ?? 0.70;
  const yPct = placement.yPct ?? 0.05; // from bottom

  const x = Math.max(20, Math.min(pageW - targetW - 20, pageW * xPct));
  const y = Math.max(20, Math.min(pageH - targetH - 40, pageH * yPct));

  page.drawImage(pngImage, {
    x,
    y,
    width: targetW,
    height: targetH
  });

  // label above
  page.drawText(labelText, {
    x,
    y: y + targetH + 8,
    size: 10,
    font,
    color: rgb(0.15, 0.15, 0.15)
  });

  const outBytes = await pdfDoc.save();
  const outputFilename =
    inputFilename.replace(/\.pdf$/i, '') + `-SIGNED-${Date.now()}.pdf`;

  await fs.writeFile(path.join(uploadsDir, outputFilename), outBytes);

  return outputFilename;
};