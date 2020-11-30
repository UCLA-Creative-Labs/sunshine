var fs = require('fs');
var path = require('path');
const {google} = require('googleapis');
const { info } = require('console');


/* Write .env file */
function env() {
  process.stdout.write('Writing to dotenv file .. ');
  const sheets = `SHEETS_API_KEY=${process.env.SHEETS_API_KEY}`;
  const token = `CONTENTFUL_ACCESS_TOKEN=${process.env.CONTENTFUL_ACCESS_TOKEN}`;
  const id = `SPACE_ID=${process.env.SPACE_ID}`;

  console.log(token)
  fs.writeFileSync(path.resolve(__dirname, '../.env'), `${sheets}\n${token}\n${id}`);
  process.stdout.write('done\n');
}

/* Write notifications file */
function notifications(){
  process.stdout.write('Writing to notifications file .. ');
  const sheets = google.sheets({version: 'v4', auth: `${process.env.AUTHORIZE_SHEETS_API_KEY}`});
  sheets.spreadsheets.values.get({
    spreadsheetId: '11UPoREQxLhipshR4jXAGFuYfGen0WairLoxYvV9p1u4',
    range: 'Notifications!A:B',
  }).then((response) => formatResponse(response));
  
  function formatResponse(response){
    const values = response.data.values;
    if (!values) return;
    const labels = values[0];
    const notifications = values.slice(1).map((row) => {
      const notification = {};
      labels.map((l, i) => {
        notification[l] = row[i];
      });
      return notification;
    });
    fs.writeFileSync(path.resolve(__dirname, '../src/assets/notifications.json'), JSON.stringify(notifications));
  }
  process.stdout.write('done\n');  
}

env();
notifications();