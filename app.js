const express = require("express");
const puppeteer = require("puppeteer");
const app = express();
const port = 3000;

app.get("/", async (req, res) => {
  const browser = await puppeteer.launch();
  try {
    const page = await browser.newPage();

    const html = `
  <!DOCTYPE html>
  <html lang="en">
  
  <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Web Components | SSR</title>
  </head>
  
  <body>
  
      <fancy-headline text="Fancy Headline"></fancy-headline> 
  
  </body>
    <script>
    class FancyHeadline extends HTMLElement {

        constructor() {
            super();           
            this.innerHTML = \`
            <template shadowroot="open">
                <style> 
                    h1 { 
                        font-size: 70px; 
                        font-weight: 600; 
                        background-image: 
                        linear-gradient(to left, #007f4b, #53e3a6); 
                        color: transparent; 
                        background-clip: text; 
                        -webkit-background-clip: text; 
                    } 
                </style> 
                <h1 part="header"><slot></slot></h1>
            </template>
            \${this.getAttribute('text')}
            \`
        }
    }

    customElements.define("fancy-headline", FancyHeadline);
    </script>
  </html>
  `;

    await page.setContent(html, {
      waitUntil: ["domcontentloaded"],
    });

    const fullHTML = await page.content();

    res.send(fullHTML);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
  await browser.close();
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
