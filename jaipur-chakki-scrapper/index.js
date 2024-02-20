const puppeteer = require("puppeteer");
const fs = require("fs");

async function scrapeProducts(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  // Wait for product elements to load
  await page.waitForSelector(".product__item");

  const productElements = await page.evaluate(() => {
    const elements = document.querySelectorAll(".product__item");
    const products = [];

    elements.forEach((element) => {
      const product = {};
      product.name = element.querySelector("h6 a").textContent.trim();
      product.img = element
        .querySelector(".product-img a img")
        .getAttribute("src");
      product.productLink = element.querySelector("h6 a").getAttribute("href");
      products.push(product);
    });

    return products;
  });

  const productsWithVariants = [];

  for (const product of productElements) {
    const productPage = await browser.newPage();
    await productPage.goto(product.productLink);

    // Wait for the description and variants to load
    await productPage.waitForSelector(".product__details__tab__desc p");
    await productPage.waitForSelector(".weight-mobile button");

    const description = await productPage.evaluate(() => {
      const descriptionElements = document.querySelectorAll(
        ".product__details__tab__desc p"
      );
      const descriptionText = Array.from(descriptionElements)
        .map((p) => p.textContent.trim())
        .join(" ");
      return descriptionText || "Description not found";
    });

    const variants = await productPage.evaluate(() => {
      const variantButtons = Array.from(
        document.querySelectorAll(".weight-mobile button")
      );
      return variantButtons.map((button) => {
        const weight = button.textContent.trim();
        const price = button.getAttribute("data-price");
        return { weight, price };
      });
    });

    // Create an object to store product data and variants
    const productWithVariants = {
      ...product,
      description,
      variants,
    };

    // Push the product with variants into the array
    productsWithVariants.push(productWithVariants);

    await productPage.close();
  }

  await browser.close();
  return productsWithVariants;
}

const ecommerceUrl = "https://www.jaipurchakki.com/shop/snacks-processed-foods";

scrapeProducts(ecommerceUrl)
  .then((products) => {
    console.log(products);
    const jsonData = JSON.stringify(products, null, 2);
    const filePath = "snacks-processed-foods.json";

    fs.writeFile(filePath, jsonData, "utf-8", (err) => {
      if (err) {
        console.error("Error writing JSON file:", err);
      } else {
        console.log("JSON file has been created successfully.");
      }
    });
  })
  .catch((error) => {
    console.error("Error scraping products:", error);
  });
