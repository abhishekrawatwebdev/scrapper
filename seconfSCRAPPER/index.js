const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeProducts(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage({new: true});
    await page.goto(url);

    async function scrollDown() {
        const previousHeight = await page.evaluate('document.body.scrollHeight');
        await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
        await page.waitForFunction(`document.body.scrollHeight > ${previousHeight}`);
      }

      for (let i = 0; i < 2; i++) {
        await scrollDown();
        await page.waitForTimeout(2000);
      }

    await page.waitForSelector('.etprobox', { timeout: 30000 });

    const productElements = await page.evaluate(() => {
        const elements = document.querySelectorAll('.etprobox');
        const products = [];

        elements.forEach(element => {
            const product = {};
            product.name = element.querySelector('.etpro-title a').textContent.trim();
            product.img = element.querySelector('.etpro-imgcontainer img').src;
            product.productLink = element.querySelector('.etpro-imgcontainer a').href;
            products.push(product);
        });

        return products;
    });

    const fetchProductData =async (link) =>{
        const productPage = await browser.newPage();
        await productPage.goto(link);
        const productDescription = await productPage.evaluate(() => {
          const descriptionElement = document.querySelector('#prodetailstab div p');
          return descriptionElement ? descriptionElement.textContent.trim() : '';
        });

        const variants = await productPage.evaluate(() => {
            const variantElements = Array.from(document.querySelectorAll('.proweight .listbox'));
            return variantElements.map(element => {
                const weightText = element.querySelector('label').textContent.trim();
                const weightParts = weightText.split('\n').map(part => part.trim()).filter(part => part !== '');
                const weight = weightParts[0];
                const mainPrice = weightParts[1];
                return { weight, mainPrice };
            });
        });
    
        await productPage.close();
    
        return {
            productDescription,
            variants
          };
    }

    for (const product of productElements) {
        const productDescriptionData = await fetchProductData(product.productLink);
        product.details = {...productDescriptionData};
      }
    await browser.close();
    return productElements;
}

const ecommerceUrl = 'https://www.earthytales.in/breakfast-cereals';


scrapeProducts(ecommerceUrl)
    .then(products => {
        console.log(products);
    const jsonData = JSON.stringify(products, null, 2);
    const filePath = 'breakfast.json';

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