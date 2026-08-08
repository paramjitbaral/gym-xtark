const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const inputDir = path.join(__dirname, 'frames');
const outputDir = path.join(__dirname, 'frames-optimized');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

const files = fs.readdirSync(inputDir).filter(file => file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png'));

async function processImages() {
  console.log(`Found ${files.length} images. Resizing to 1080p and converting to WebP...`);
  
  let processed = 0;
  for (let file of files) {
    const inputPath = path.join(inputDir, file);
    
    // Create new filename replacing the extension with .webp
    const ext = path.extname(file);
    const newFilename = file.substring(0, file.length - ext.length) + '.webp';
    const outputPath = path.join(outputDir, newFilename);
    
    await sharp(inputPath)
      .resize({ width: 1920 }) // Resize from 2560x1440 down to 1920x1080 (Maintains aspect ratio)
      .webp({ quality: 75, effort: 4 }) 
      .toFile(outputPath);
      
    processed++;
    if (processed % 50 === 0) {
      console.log(`Processed ${processed} / ${files.length} images...`);
    }
  }
  
  console.log('Conversion complete! New images are in the "frames-optimized" directory.');
}

processImages().catch(err => {
  console.error("Error during conversion:", err);
});
