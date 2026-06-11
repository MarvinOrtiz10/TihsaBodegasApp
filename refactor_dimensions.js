const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function processFile(filePath) {
  if (!filePath.endsWith('.js')) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Fix isMovil checks to use Math.min so it doesn't change when phone rotates
  content = content.replace(/const isMovil = width (<|<=) (\d+) \? true : false;/g, 'const isMovil = Math.min(width, height) $1 $2 ? true : false;');
  
  // Also handle cases without ternary
  content = content.replace(/const isMovil = width (<|<=) (\d+);/g, 'const isMovil = Math.min(width, height) $1 $2;');

  // Handle width: width and height: height
  // We use lookbehind and lookahead to avoid replacing things like borderWidth: width
  content = content.replace(/\bwidth\s*:\s*width\s*,?/g, (match) => {
    return match.replace(/width\s*$/, '"100%"');
  });
  
  content = content.replace(/\bheight\s*:\s*height\s*,?/g, (match) => {
    return match.replace(/height\s*$/, '"100%"');
  });

  // Handle width: width * 0.X
  content = content.replace(/\bwidth\s*:\s*width\s*\*\s*(0\.\d+)\s*,?/g, (match, p1) => {
    let percent = Math.round(parseFloat(p1) * 100);
    return match.replace(/width\s*\*\s*0\.\d+/, `"${percent}%"`);
  });

  // Handle height: height * 0.X
  content = content.replace(/\bheight\s*:\s*height\s*\*\s*(0\.\d+)\s*,?/g, (match, p1) => {
    let percent = Math.round(parseFloat(p1) * 100);
    return match.replace(/height\s*\*\s*0\.\d+/, `"${percent}%"`);
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Refactored: ${filePath}`);
  }
}

const targetDirs = [
  path.join(__dirname, 'screens'),
  path.join(__dirname, 'components')
];

targetDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    walkDir(dir, processFile);
  }
});

console.log('Refactoring complete.');
