/**
 * Daily Workflow Batch Helper
 * Lightweight utility to automate repetitive file organization and batch text formatting.
 */

const fs = require('fs');
const path = require('path');

function formatSlug(text) {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

function batchRenameFiles(directoryPath, prefix = 'asset') {
  if (!fs.existsSync(directoryPath)) {
    console.error(`Directory not found: ${directoryPath}`);
    return;
  }

  const files = fs.readdirSync(directoryPath);
  let count = 1;

  files.forEach((file) => {
    const ext = path.extname(file);
    const baseName = path.basename(file, ext);
    const cleanName = `${prefix}-${String(count).padStart(3, '0')}-${formatSlug(baseName)}${ext}`;

    const oldPath = path.join(directoryPath, file);
    const newPath = path.join(directoryPath, cleanName);

    if (fs.lstatSync(oldPath).isFile()) {
      fs.renameSync(oldPath, newPath);
      console.log(`Renamed: ${file} -> ${cleanName}`);
      count++;
    }
  });

  console.log(`Done! Processed ${count - 1} files.`);
}

const targetDir = process.argv[2];
const customPrefix = process.argv[3] || 'item';

if (targetDir) {
  batchRenameFiles(targetDir, customPrefix);
} else {
  console.log('Usage: node index.js <directory-path> [prefix]');
}

module.exports = { formatSlug, batchRenameFiles };
