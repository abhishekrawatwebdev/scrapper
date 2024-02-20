const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Navigate to the webpage with the city list
  await page.goto('https://www.britannica.com/topic/list-of-cities-and-towns-in-India-2033033'); // Replace with the actual URL

  // Evaluate the page and scrape the city names
  const cityNames = await page.$$eval('ul.topic-list li a', (elements) =>
    elements.map((element) => element.textContent)
  );

  await browser.close();

  // Write the city names to a JSON file
  const citiesJSON = JSON.stringify(cityNames, null, 2);

  // Write the JSON to a file
  fs.writeFileSync('indian_cities.json', citiesJSON);

  console.log('City names have been written to indian_cities.json');
})();
