import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const csvPath = path.join(__dirname, '../event-database/GENESIS EVENT DATABASE - Sheet1.csv');
const outputPath = path.join(__dirname, '../src/data/eventDatabase.js');

try {
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const lines = csvContent.split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  
  const events = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Parse CSV line considering quotes
    const columns = [];
    let currentField = '';
    let insideQuotes = false;
    
    for (let charIdx = 0; charIdx < line.length; charIdx++) {
      const char = line[charIdx];
      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === ',' && !insideQuotes) {
        columns.push(currentField.trim());
        currentField = '';
      } else {
        currentField += char;
      }
    }
    columns.push(currentField.trim());
    
    // Skip empty lines or title lines
    if (columns.length < 4 || !columns[1] || columns[0] === 'Sr no.' || columns[1].includes('RANDOM DATA')) {
      continue;
    }
    
    // Map columns: Sr no. | EVENT NAME | EVENT DATE | EVENT LOCATION | EVENT TYPE | TOTAL ATTENDEES | EVENT MEDIA | EVENT SPONSERS
    const srNo = columns[0];
    const name = columns[1];
    const date = columns[2];
    const location = columns[3];
    const type = columns[4];
    const attendees = columns[5] || '';
    const media = columns[6] || '';
    const sponsors = columns[7] || '';
    
    // Skip placeholder rows
    if (!name || name === 'EVENT NAME') continue;
    
    events.push({
      id: srNo.padStart(2, '0'),
      title: name,
      date: date,
      location: location,
      category: type || 'Meetup',
      attendees: attendees,
      media: media,
      sponsors: sponsors
    });
  }
  
  // Write JS file
  const jsContent = `// Auto-generated from GENESIS EVENT DATABASE - Sheet1.csv
export const eventDatabase = ${JSON.stringify(events, null, 2)};
`;
  
  fs.writeFileSync(outputPath, jsContent, 'utf-8');
  console.log(`Successfully converted ${events.length} events to ${outputPath}`);
} catch (err) {
  console.error('Error converting CSV:', err);
}
