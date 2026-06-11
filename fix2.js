const fs = require('fs');

const filesToFix = [
  'screens/Locations/Articles.js',
  'screens/Requisitions/NewPickingRequisition.js',
  'screens/Requisitions/PickingRequisition.js',
  'screens/Requisitions/Receive/PackingReceiveRequisition.js'
];

filesToFix.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    const globalDeclRegex = /const { width, height } = Dimensions\.get\(['"]screen['"]\);/g;
    let match;
    
    const matches = [...content.matchAll(globalDeclRegex)];
    if (matches.length > 0) {
      const globalDeclIndex = matches[0].index;
      const injection = '\nconst isMovil = Math.min(width, height) < 650 ? true : false;\n';
      
      const nextText = content.slice(globalDeclIndex, globalDeclIndex + 200);
      if (!nextText.includes('const isMovil')) {
         content = content.slice(0, globalDeclIndex + matches[0][0].length) + injection + content.slice(globalDeclIndex + matches[0][0].length);
         fs.writeFileSync(file, content, 'utf8');
         console.log('Fixed ' + file);
      }
    }
  } else {
    console.log('Not found: ' + file);
  }
});
