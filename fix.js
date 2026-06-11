const fs = require('fs');

const filesToFix = [
  'components/CartItem.js',
  'screens/Locations/Articles.js',
  'screens/Requisitions/NewPickingRequisition.js',
  'screens/Requisitions/PickingRequisition.js',
  'screens/Requisitions/Receive/PackingReceiveRequisition.js',
  'components/TableResume.js'
];

filesToFix.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    if (file === 'components/TableResume.js') {
      content = content.replace('const { width } = Dimensions.get("screen");', 'const { width, height } = Dimensions.get("screen");');
      fs.writeFileSync(file, content, 'utf8');
      console.log('Fixed TableResume.js');
      return;
    }

    if (!content.includes('const { width, height } = Dimensions.get("screen");')) {
       const lastImportIndex = content.lastIndexOf('import ');
       const endOfLastImport = content.indexOf('\n', lastImportIndex);
       
       const injection = '\nconst { width, height } = Dimensions.get("screen");\nconst isMovil = Math.min(width, height) < 650 ? true : false;\n';
       
       content = content.slice(0, endOfLastImport) + injection + content.slice(endOfLastImport);
       
       if (!content.match(/import.*Dimensions.*from ['"]react-native['"]/)) {
          content = content.replace(/import {([^}]*)} from ['"]react-native['"]/, 'import {$1, Dimensions } from "react-native"');
       }
       
       fs.writeFileSync(file, content, 'utf8');
       console.log('Fixed ' + file);
    }
  } else {
    console.log('Not found: ' + file);
  }
});
