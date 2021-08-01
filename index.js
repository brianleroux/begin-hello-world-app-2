// const puppeteer = require('puppeteer')
const chromium = require('chrome-aws-lambda')
async function html_to_pdf(html){
  const browser = browser = await chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: chromium.headless
  });
  const page = await browser.newPage()
  // We set the page content as the generated html by handlebars
  await page.setContent(html)
  // We use pdf function to generate the pdf in the same folder as this file.
  const pdf = await page.pdf({ format: 'A4' ,printBackground:true,margin:false})
  console.log(pdf)
  await browser.close();
  return pdf
}

exports.handler = async function http(req) {

  let html = `
<!doctype html>
<html lang=en>
  <head>
    <meta charset=utf-8>
    <title>Hi!</title>
    <link rel="stylesheet" href="https://static.begin.app/starter/default.css">
    <link href="data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=" rel="icon" type="image/x-icon">
  </head>
  <body>

    <h1 class="center-text">
      <!-- ↓ Change "Hello world!" to something else and head on back to Begin! -->
      Hello world!
    </h1>

    <p class="center-text">
      Your <a href="https://begin.com" class="link" target="_blank">Begin</a> app is ready to go!
    </p>

  </body>
</html>`
const pdf = await html_to_pdf('<h1>ded</h1>')
// console.log(pdf)
  return {
    headers: {
      'content-type': 'application/pdf',
      // 'content-disposition': 'attachment; filename=test.pdf'
    },
    statusCode: 200,

    body: pdf.toString("base64"),
    isBase64Encoded: true
  }
}

// Other example responses

/* Forward requester to a new path
exports.handler = async function http (req) {
  return {
    statusCode: 302,
    headers: {'location': '/about'}
  }
}
*/

/* Respond with successful resource creation, CORS enabled
let arc = require('@architect/functions')
exports.handler = arc.http.async (http)
async function http (req) {
  return {
    statusCode: 201,
    json: { ok: true },
    cors: true,
  }
}
*/
