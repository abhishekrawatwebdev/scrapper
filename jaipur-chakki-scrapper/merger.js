const fs = require('fs');
const { mergedData } = require('./merged');

// Array to store the data from multiple JSON files
const mergedData = mergedData;

// List of JSON files to merge
const filesToMerge = ['cooking-essentials.json', 'dry-fruits.json', 'edible-oils.json','jaipur-flour.json','masala-spices.json','north-beverages.json','north-cooking-ingredients.json','north-pickles.json','north-spices.json','north-sweet.json','rice-daal.json','salt-sugar.json','snacks-processed-foods.json'];

// Read and merge JSON files
filesToMerge.forEach((filename) => {
  try {
    const data = fs.readFileSync(filename, 'utf8');
    const jsonData = JSON.parse(data);
    mergedData.push(jsonData);
  } catch (error) {
    console.error(`Error reading ${filename}: ${error.message}`);
  }
});

// Merge data as needed - For this example, we'll merge them into a single array
const finalMergedData = [].concat(...mergedData);

// Write the merged data to a new JSON file
const mergedFilename = 'merged.json';
fs.writeFileSync(mergedFilename, JSON.stringify(finalMergedData, null, 2), 'utf8');

console.log(`Merged data written to ${mergedFilename}`);
