const puppeteer = require('puppeteer');
const fs = require('fs');


async function scrapeEcommerceWebsite(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
  
    // async function scrollDown() {
    //     const previousHeight = await page.evaluate('document.body.scrollHeight');
    //     await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
    //     await page.waitForFunction(`document.body.scrollHeight > ${previousHeight}`);
    //   }

    //   for (let i = 0; i < 3; i++) {
    //     await scrollDown();
    //     await page.waitForTimeout(6000);
    //   }

    await page.waitForSelector('.etprobox');

    const products = await page.evaluate(() => {
      const productElements = Array.from(document.querySelectorAll('.etprobox'));
      return productElements.map(element => {
        const product = {};
        product.name = element.querySelector('.etpro-title a').textContent.trim();
        product.image = element.querySelector('.proimg img').src;
        product.discount = element.querySelector('.sticker1 span').textContent.trim();
        product.productLink = element.querySelector('.etpro-imgcontainer a').href;
        return product;
      });
    });

    async function scrapeProductDescription(productLink) {
        const productPage = await browser.newPage();
        await productPage.goto(productLink);
        const productData = {}
        const productDescription = await productPage.evaluate(() => {
          const descriptionElement = document.querySelector('#prodetailstab div p');
          return descriptionElement ? descriptionElement.textContent.trim() : '';
        });

        const variants = await productPage.evaluate(() => {
            const variantElements = Array.from(document.querySelectorAll('.proweight .listbox'));
            return variantElements.map(element => {
                const weightText = element.querySelector('label').textContent.trim();
                const weightParts = weightText.split('\n').map(part => part.trim()).filter(part => part !== ''); // Split and clean the data
                const weight = weightParts[0];
                const mainPrice = weightParts[1];
                const offerPrice = weightParts[2];
                return { weight, mainPrice, offerPrice };
            });
        });
    
        await productPage.close();
    
        return {
            productDescription,
            variants
          };
      }
    
      for (const product of products) {
        const productDescriptionData = await scrapeProductDescription(product.productLink);
        product.details = {...productDescriptionData};
      }
    
    await browser.close();
    return products;
  }




// Usage example
const ecommerceUrl = 'https://www.earthytales.in/spices';
scrapeEcommerceWebsite(ecommerceUrl)
  .then(products => {
    // console.log(products,'products');
    const jsonData = JSON.stringify(products, null, 2);
    const filePath = 'products.json';
    fs.writeFile(filePath, jsonData, 'utf-8', (err) => {
        if (err) {
          console.error('Error writing JSON file:', err);
        } else {
        //   console.log('JSON file has been created successfully.');
        }
      });
  })
  .catch(error => {
    console.error('Error in main scrapeEcommerceWebsite function:', error);
  });