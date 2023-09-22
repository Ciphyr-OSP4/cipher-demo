import db from './server/model/mongoModel.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// replicate the functionality of __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// change file path and db model name when inserting new data from files
fs.readFile(path.join(__dirname, '/server/data/reviewData.json'), 'utf8', (err, data) => {
  if (err) {
      console.error('Error reading the file:', err);
      return;
  }

  const arrayData = JSON.parse(data);

  db.Review.insertMany(arrayData);
});
