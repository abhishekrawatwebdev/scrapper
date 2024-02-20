const { mergedData } = require("./merged");
const fs = require('fs');


function findMissingNames(jsonData, namesToMatch) {
    const matchingNames = new Set();
    const missingNames = [];
  
    // Iterate through the JSON data and check for matching names
    jsonData.forEach(item => {
      const itemName = item.name;
      namesToMatch.forEach(nameToMatch => {
        if (itemName.includes(nameToMatch)) {
          matchingNames.add(nameToMatch);
        }
      });
    });
  
    // Find missing names by comparing the sets
    namesToMatch.forEach(name => {
      if (!matchingNames.has(name)) {
        missingNames.push(name);
      }
    });
  
    return missingNames;
  }
  
  // Your JSON data
  const jsonData = mergedData
  
  // List of names to match
  const namesToMatch =[
    "Roasted Beans",
    "Filter Coffee Powder",
    "Green Coffee",
    "Roasted Beans",
    "Filter Coffee Powder",
    "Green Coffee",
    "Espresso Beans",
    "Enstant Coffee",
    "Single Orgin Coffee",
    "AreoPress Coffee",
    "Cold Brew Coffee",
    "Black Tea",
    "Green Tea",
    "White Tea",
    "Yellow Tea",
    "Herbal Tea",
    "Jasmine Tea",
    "Masala chai",
    "Peppermint Tea",
    "Darjeeling Tea",
    "Fermented Tea",
    "Hibiscus Tea",
    "Milk Tea",
    "Oolong",
    "Chamomile Tea",
    "Mate",
    "Matcha",
    "Rooibos",
    "Mustard",
    "Wild",
    "Coriander",
    "Organic",
    "Kikad",
    "Neem",
    "Eucalyptus",
    "Sticks",
    "Powdered",
    "Cinnamon extract",
    "Sticks",
    "Powdered",
    "Cinnamon extract",
    "Sticks",
    "Powdered",
    "Cinnamon extract",
    "Sticks",
    "Powdered",
    "Cinnamon extract",
    "Tellicherry",
    "Malabar",
    "Pinhead 1-1.5mm",
    "Pinhead 1.5-2mm",
    "Light berries",
    "Pure",
    "Blended",
    "Organic",
    "Smoked",
    "Andhra",
    "Byadgi(Karnatka)",
    "Kashmiri",
    "Blended",
    "Telanagana",
    "Maharstra",
    "East",
    "Tamil Nadu",
    "Badami",
    "Eagle",
    "Scooter",
    "Single parrot",
    "Double parrot",
    "Green medium",
    "Green extra",
    "Powdered",
    "Wheat",
    "Rice",
    "Ragi",
    "Bajra",
    "jowar",
    "Gram",
    "Maize",
    "Barley",
    "Semolina",
    "Lentils",
    "Faba beans",
    "Dry peas",
    "Dry beans",
    "Chick peas",
    "Cowpeas",
    "Rajma",
    "Pigeon peas",
    "Moong",
    "Soybeans",
    "Horse grams",
    "Unpolished",
    "Peral Millets",
    "Foxtail Millets",
    "Proso Millets",
    "Finger Millets",
    "Little Millets",
    "Barnyard Millets",
    "Kodo Millets",
    "Japanese Millets",
    "Alovera",
    "Tulsi",
    "Mint",
    "Coriender",
    "Basil",
    "Fenugreek",
    "Fennel",
    "Ginger",
    "Rosemery",
    "Turmeric",
    "Neem",
    "Giloy",
    "Lemon Balm",
    "Chives",
    "Wheat Grass",
    "Dill",
    "Thyme",
    "Peepemint",
    "Tea Tree",
    "Dandelions",
    "Lavender",
    "Hibiscus",
    "Parsley"
  ]  
  
  const missingNames = findMissingNames(jsonData, namesToMatch);
fs.writeFileSync('notMatchingData.json', JSON.stringify(missingNames, null, 2), 'utf8');

  console.log("Missing Names:", missingNames);
  