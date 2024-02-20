const fs = require('fs');

// Array to store the data from multiple JSON files
const mergedData = [];

// List of JSON files to merge
const filesToMerge = ['indianjadibooti-alovera.json', 'indianjadibooti-basil.json', 'indianjadibooti-chives.json','indianjadibooti-coriender.json','indianjadibooti-dandelions.json','indianjadibooti-dill.json','indianjadibooti-fennel.json','indianjadibooti-fenugreek.json','indianjadibooti-giloy.json','indianjadibooti-lavender.json','indianjadibooti-lemon balm.json','indianjadibooti-mint.json','indianjadibooti-neem.json','indianjadibooti-parsley.json','indianjadibooti-peppermint.json','indianjadibooti-rosemery.json','indianjadibooti-tea tree.json','indianjadibooti-thyme.json','indianjadibooti-tulsi.json','indianjadibooti-wheat grass.json'];

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
