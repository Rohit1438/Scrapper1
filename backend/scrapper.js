const puppeteer = require("puppeteer");

// async function scrapperChannel(url) {
//   const browser = await puppeteer.launch({ headless: "new" });
//   const page = await browser.newPage();
//   await page.goto(url);

//   const [el] = await page.$x(
//     '//*[@id="container"]/div/div[3]/div[1]/div[2]/div[2]/div/div/div/a/div[2]/div[1]/div[2]'
//   );

//   const text = await el.getProperty("textContent");

//   const name = await text.jsonValue();

//   const [el2] = await page.$x(
//     '//*[@id="container"]/div/div[3]/div[1]/div[2]/div[7]/div[3]/div/div[2]/div[1]/p/text()'
//   );

//   const desc = await el2.getProperty("textContent");
//   desc = await desc.jsonValue();

//   browser.close();
//   console.log(name);
// }
// const cheerio = require("cheerio");
// const request = require("request");

// async function scrapperChannel(url) {
//   let data = [];
//   const response = await request({
//     uri: url,
//     headers: {
//       Accept:
//         "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
//       "Accept-Encoding": "gzip, deflate, br",
//       "Accept-Language": "en-US,en;q=0.9",
//     },
//     gzip: true,
//   });

// let $=cheerio.load(response)
// let title=$('span[class="B_NuCI"]').text().trim()

// console.log(title,"title");
// }

//scrapperChannel('https://www.youtube.com/@ezsnippat')
// scrapperChannel('https://www.amazon.in/s?k=laptoips&crid=30O3F6K4HUD9&sprefix=laptoips%2Caps%2C640&ref=nb_sb_noss_2')




const json2csv = require("json2csv").Parser;
const fs = require("fs");
const zlib = require("zlib");
async function scrapperChannel(url) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(url);

  // Wait for the product elements to load
  await page.waitForSelector("div._1AtVbE.col-12-12", { timeout: 60000 });

  const scrapedData = await page.evaluate(() => {
    let productElements = document.querySelectorAll("div._1AtVbE.col-12-12");

    return [...productElements].map((element) => {
      let titleElement = element.querySelector("div._4rR01T");
      let title = titleElement ? titleElement.innerText.trim() : "";

      let descElement = element.querySelector("div.fMghEO");
      let description = descElement ? descElement.innerText.trim() : "";

      let priceElement = element.querySelector("div._30jeq3._1_WHN1");
      let price = priceElement ? priceElement.innerText.trim() : "";

      let ratingElement = element.querySelector("div._3LWZlK");
      let rating = ratingElement ? ratingElement.innerText.trim() : "";

      let imageElement = element.querySelector("div.CXW8mj img._396cs4");

      let image = imageElement ? imageElement.src.trim() : "";

      // Returning null for products that don't have both title and description
      if (title && description) {
        return {
          title: title,
          price: price,
          description: description,
          rating: rating,
          image: image,
        };
      } else {
        return null;
      }
    });
  });

  const filteredProducts = scrapedData.filter((product) => product !== null);

  console.log(filteredProducts);

  const j2cp = new json2csv();
  const csv = j2cp.parse(filteredProducts);
  fs.writeFileSync("./products.csv", csv, "utf-8");

  await browser.close(); // Make sure to wait for browser close

  return filteredProducts;
}

module.exports = scrapperChannel;
// scrapperChannel(
//   "https://www.flipkart.com/search?q=laptops&sid=6bo%2Cb5g&as=on&as-show=on&otracker=AS_QueryStore_OrganicAutoSuggest_1_8_sc_na_na&otracker1=AS_QueryStore_OrganicAutoSuggest_1_8_sc_na_na&as-pos=1&as-type=RECENT&suggestionId=laptops%7CLaptops&requestId=753afeed-66bf-4512-8b81-9b96cfdbc3c6&as-backfill=on"
// );


