const puppeteer = require('puppeteer');

module.exports = async () => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    await page.setContent(`
    <html>
      <body>
        <h1>PDF funcionando!</h1>
        <p>Gerado no backend 🚀</p>
      </body>
    </html>
  `);

    // ⚠️ SEM path → retorna Buffer
    const pdfUint8 = await page.pdf({
        format: 'A4',
        printBackground: true,
    });

    // 🔥 CONVERSÃO CRÍTICA
    const pdfBuffer = Buffer.from(pdfUint8);

    await browser.close();
    return pdfBuffer;
};
