const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  fs.readdirSync(dir).forEach(file => {
    let full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) results = results.concat(walk(full));
    else if (full.endsWith('.js')) results.push(full);
  });
  return results;
}

let files = walk('screens').concat(walk('components'));
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let original = content;
  if (content.includes('Math.min(width, height)')) {
    let hasDimensions = content.includes('const { width, height } = Dimensions.get(') || content.includes('const { width,height } = Dimensions.get(') || content.includes('const {width, height} = Dimensions.get(');
    
    if (!hasDimensions) {
      content = content.replace(/const\s*{\s*width\s*}\s*=\s*Dimensions\.get\("screen"\);/g, 'const { width, height } = Dimensions.get("screen");');
      content = content.replace(/const\s*{\s*width\s*}\s*=\s*Dimensions\.get\('screen'\);/g, "const { width, height } = Dimensions.get('screen');");
    }
  }
  if (content !== original) {
    fs.writeFileSync(f, content, 'utf8');
    console.log('Fixed height in ' + f);
  }
});
