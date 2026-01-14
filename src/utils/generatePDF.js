const puppeteer = require('puppeteer');

module.exports = async (html) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  await page.setContent(html);

  // ⚠️ SEM path → retorna Buffer
  const pdfUint8 = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: {
      top: '15mm',
      bottom: '15mm',
      left: '15mm',
      right: '15mm'
    }
  });

  // 🔥 CONVERSÃO CRÍTICA
  const pdfBuffer = Buffer.from(pdfUint8);

  await browser.close();
  return pdfBuffer;
};
