const path = require('path');
const fs = require('fs');
process.stdout.write('Writing to dotenv file .. ');
fs.writeFileSync(path.resolve(__dirname, '../.env'), `SHEETS_API_KEY=${process.env.SHEETS_API_KEY}`);
process.stdout.write('done\n');