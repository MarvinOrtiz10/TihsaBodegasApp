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

  // Fix width: "100%" * 0.X or width: "100%"* 0.X
  content = content.replace(/\bwidth\s*:\s*"100%"\s*\*\s*(0\.\d+)\s*,?/g, (match, p1) => {
    let percent = Math.round(parseFloat(p1) * 100);
    return `width: "${percent}%",`;
  });

  // Fix height: "100%" * 0.X or height: "100%"* 0.X
  content = content.replace(/\bheight\s*:\s*"100%"\s*\*\s*(0\.\d+)\s*,?/g, (match, p1) => {
    let percent = Math.round(parseFloat(p1) * 100);
    return `height: "${percent}%",`;
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed NaN error in: ${filePath}`);
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
