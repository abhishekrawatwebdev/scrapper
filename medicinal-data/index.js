const puppeteer = require("puppeteer");
const fs = require("fs");

const keywords = [
  "Alovera",
  "Tulsi",
  "Mint",
  "Coriender",
  "Basil",
  "Fenugreek",
  "Fennel",
  "Rosemery",
  "Neem",
  "Giloy",
  "Lemon Balm",
  "Chives",
  "Wheat Grass",
  "Dill",
  "Thyme",
  "Peppermint",
  "Tea Tree",
  "Dandelions",
  "Lavender",
  "Parsley",
];

async function scrapeProductsForKeyword(keyword) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(60000); // Set a 60-second timeout

  const ecommerceUrl = `https://indianjadibooti.com/Jadistore/search?search=${encodeURIComponent(keyword)}&description=true`;
  await page.goto(ecommerceUrl);

  const products = [];
  const productCardSelector = ".product-thumb";

  async function extractProductData(cardHandle) {
    const product = {};
    const card = await cardHandle.asElement();

    const nameElement = await card.$(".name a");
    if (nameElement) {
      product.name = await nameElement.evaluate((node) =>
        node.textContent.trim()
      );
    }

    const productPageLink = await card.$(".name a");
    if (productPageLink) {
      const productPage = await productPageLink.evaluate((link) => link.href);
      await getProductDetails(product, productPage);
    }

    products.push(product);
  }

  async function getProductDetails(product, productPage) {
    const detailsPage = await browser.newPage();
    await detailsPage.goto(productPage);

    const variantElements = await detailsPage.$$(".option-value");
    const variants = [];

    for (const variantElement of variantElements) {
      const weightElement = await variantElement.evaluate((node) => {
        const text = node.textContent.trim();
        return text.split(" [")[0].trim();
      });

      const priceElement = await variantElement.$(".option-price");

      if (weightElement && priceElement) {
        const price = await priceElement.evaluate((node) => node.textContent.trim());
        variants.push({ weight: weightElement, price });
      }
    }

    const productPageLink = await detailsPage.url();
    product.productLink = productPageLink;

    product.variants = variants;

    await detailsPage.close();
  }

  async function scrapeCurrentPage() {
    const productCardHandles = await page.$$(productCardSelector);
    for (const cardHandle of productCardHandles) {
      await extractProductData(cardHandle);
    }
  }

  try {
    console.log(`Scraping products for keyword: ${keyword}...`);
    await scrapeCurrentPage();
  } catch (error) {
    console.error(`Error scraping products for keyword ${keyword}:`, error);
  } finally {
    await browser.close();
  }

  return products;
}

// Loop through keywords and scrape products for each keyword
(async () => {
  for (const keyword of keywords) {
    const products = await scrapeProductsForKeyword(keyword);

    const jsonData = JSON.stringify(products, null, 2);
    const filePath = `indianjadibooti-${keyword.toLowerCase()}.json`;

    fs.writeFile(filePath, jsonData, "utf-8", (err) => {
      if (err) {
        console.error(`Error writing JSON file for keyword ${keyword}:`, err);
      } else {
        console.log(`JSON file for keyword ${keyword} has been created successfully.`);
      }
    });
  }
})();
