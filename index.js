const chromium = require('chrome-aws-lambda');

// exports.handler = async (event, context, callback) => {
//   let result = null;
//   let browser = null;

//   try {
    // browser = await chromium.puppeteer.launch({
    //   args: chromium.args,
    //   defaultViewport: chromium.defaultViewport,
    //   executablePath: await chromium.executablePath,
    //   headless: true,
    //   ignoreHTTPSErrors: true,
    // });

//     let page = await browser.newPage();

//     await page.goto(event.url || 'https://google.com');

//     result = await page.title();
//   } catch (error) {
//     return callback(error);
//   } finally {
//     if (browser !== null) {
//       await browser.close();
//     }
//   }

//   return callback(null, result);
// };
async function html_to_pdf(html){
  const browser = await chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: true,
    ignoreHTTPSErrors: true,
  });
  const page = await browser.newPage()
  // We set the page content as the generated html by handlebars
  await page.setContent(html)
  // We use pdf function to generate the pdf in the same folder as this file.
  const pdf = await page.pdf({ format: 'A4' ,printBackground:true,margin:false})
  await browser.close();
  return pdf
}

exports.handler = async function http (req) {
  console.log('Begin API called')
  const pdf = await html_to_pdf('<h1>Hello miss</h1>')
  return {
    statusCode: 200,
    headers: {
      'content-type': 'application/pdf',
      'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0',
    },
    body: pdf.toString('base64'),
    isBase64Encoded: true
  }
}

