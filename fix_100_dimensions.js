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

  // Fix width: width,
  content = content.replace(/\bwidth\s*:\s*width(\s*,?)/g, 'width: "100%"$1');
  
  // Fix height: height,
  content = content.replace(/\bheight\s*:\s*height(\s*,?)/g, 'height: "100%"$1');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed 100% dimensions in: ${filePath}`);
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

console.log('Fixing complete.');
