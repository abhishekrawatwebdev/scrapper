const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeProducts(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(60000); // Set a 60-second timeout
    await page.goto(url);

    const products = [];
    const productCardSelector = '.product-thumb';

    async function extractProductData(cardHandle) {
        const product = {};
        const card = await cardHandle.asElement(); // Convert the handle to an element

        const nameElement = await card.$('.name a');
        if (nameElement) {
            product.name = await nameElement.evaluate(node => node.textContent.trim());
        }

        const imgElement = await card.$('.image img');
        if (imgElement) {
            product.img = await imgElement.evaluate(node => node.getAttribute('src'));
        }

        const productPageLink = await card.$('.name a');
        if (productPageLink) {
            const productPage = await productPageLink.evaluate(link => link.href);
            await getProductDetails(product, productPage);
        }

        products.push(product);
    }

    async function scrapeCurrentPage() {
        const productCardHandles = await page.$$(productCardSelector);
        for (const cardHandle of productCardHandles) {
            await extractProductData(cardHandle);
        }
    }

    async function getProductDetails(product, productPage) {
        const detailsPage = await browser.newPage();
        await detailsPage.goto(productPage);

        const descriptionElement = await detailsPage.$('.product_extra-242 .block-content p');
        if (descriptionElement) {
            product.description = await descriptionElement.evaluate(node => node.textContent.trim());
        }

        const priceAndWeightElement = await detailsPage.$(".product-price-group");
        if (priceAndWeightElement) {
          const priceElement = await priceAndWeightElement.$(".product-price");
          if (priceElement) {
            product.price = await priceElement.evaluate((node) =>
              node.textContent.trim()
            );
          }

          const weightElement = await priceAndWeightElement.$(".product-stats .product-weight span");
          if (weightElement) {
            product.weight = await weightElement.evaluate((node) =>
              node.textContent.trim()
            );
          }
        }

        await detailsPage.close();
    }

    async function goToNextPage() {
        const nextButton = await page.$('.pagination .next');
        console.log(nextButton, '======NEXT BUTTON=========');
        if (nextButton) {
            const nextUrl = await page.evaluate(nextButton => nextButton.getAttribute('href'), nextButton);
            console.log('Navigating to:', nextUrl); // Debug output
            await page.goto(nextUrl, { waitUntil: 'domcontentloaded' });
            return true;
        } else {
            return false; // No more pages
        }
    }

    let currentPage = 1;
    while (true) {
        console.log(`Scraping products on page ${currentPage}`);
        await scrapeCurrentPage();
        const hasNextPage = await goToNextPage();
        console.log(hasNextPage, '---------next page--------');
        if (!hasNextPage) {
            break;
        }

        currentPage++;
    }

    await browser.close();
    return products;
}

const ecommerceUrl = 'https://www.thenortheaststore.com/Food?fc=75';

scrapeProducts(ecommerceUrl)
    .then(products => {
        console.log(products);
        const jsonData = JSON.stringify(products, null, 2);
        const filePath = 'north-spices.json';

        fs.writeFile(filePath, jsonData, 'utf-8', (err) => {
            if (err) {
                console.error('Error writing JSON file:', err);
            } else {
                console.log('JSON file has been created successfully.');
            }
        });
    })
    .catch(error => {
        console.error('Error scraping products:', error);
    });
