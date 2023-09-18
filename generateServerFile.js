const fs = require('fs');
const path = require('path');

const reactSrcPath = path.join(__dirname, './src');
const serverFilePath = path.join(reactSrcPath, 'server.ts');
const sourceFilePath = path.join(__dirname, 'src/server.ts');
const destinationDir = path.join(__dirname, '../../../src');;
const destinationFilePath = path.join(destinationDir, 'server.ts');

// Check if the 'src' folder exists, and create it if it doesn't.
if (!fs.existsSync(reactSrcPath)) {
  fs.mkdirSync(reactSrcPath);
}
if (!fs.existsSync(destinationDir)) {
  fs.mkdirSync(destinationDir);
}

const serverCode = `
import Server from '@zer0cheros/react-simple-server'

const server = new Server({port: 8080})

//Config DB with you own credentials
server.connect('db', {client: "mysql", host: '127.0.0.1', port: 3306, user: 'root', password: 'password'})

// When no specific request is made, a default JSON response will be presented.
server.Get('/')

//A query to retrieve all data from the 'users' table in the database
server.Get('/users', true).DB('users')

//Starts application
server.start()
`;


fs.writeFileSync(serverFilePath, serverCode);
fs.copyFileSync(sourceFilePath, destinationFilePath)
console.log(`server.ts file created in the 'src' folder.`);
