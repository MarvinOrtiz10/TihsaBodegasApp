const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Replace numColumns={3} in FlashList/FlatList with dynamic columns
  if (content.includes('numColumns={3}')) {
    // Check if we need to add the columns calculation
    if (!content.includes('const columns = isMovil ?')) {
      // Find where isMovil is declared to inject the columns variable
      content = content.replace(/(const isMovil = Math\.min\(width,\s*height\)\s*<\s*650\s*\?\s*true\s*:\s*false;)/, 
        '$1\n  const columns = isMovil ? (width > height ? 2 : 1) : 3;');
      
      content = content.replace(/(const isMovil = Math\.min\(width,\s*height\)\s*<\s*850\s*\?\s*true\s*:\s*false;)/, 
        '$1\n  const columns = isMovil ? (width > height ? 2 : 1) : 3;');
    }
    
    content = content.replace(/numColumns=\{3\}/g, 'numColumns={columns}');
  }

  // Handle width > 650 ? 3 : 2
  if (content.includes('const numColumns = width > 650 ? 3 : 2;')) {
    content = content.replace(/const numColumns = width > 650 \? 3 : 2;/, 'const numColumns = isMovil ? (width > height ? 2 : 1) : 3;');
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed numColumns in ' + filePath);
  }
}

const files = [
  'screens/Requisitions/Requisitions.js',
  'screens/Requisitions/Receive/ReceiveRequisitions.js',
  'screens/Orders/Picking/Orders.js',
  'screens/Orders/Packing/Orders.js',
  'screens/Orders/Orders.js',
  'screens/Locations/Articles.js',
  'screens/Consults/ConsultArticles.js'
];

files.forEach(f => {
  let fullPath = path.join(__dirname, f);
  if (fs.existsSync(fullPath)) {
    processFile(fullPath);
  } else {
    console.log('Not found: ' + fullPath);
  }
});
