const fs = require('fs');
const path = require('path');

const reactSrcPath = path.join(__dirname, './src');
const serverFilePath = path.join(reactSrcPath, 'server.ts');

// Check if the 'src' folder exists, and create it if it doesn't.
if (!fs.existsSync(reactSrcPath)) {
  fs.mkdirSync(reactSrcPath);
}

const serverCode = `
import Server from '@zer0cheros/simple-react-server'

const server = new Server({port: 8080})
server.connect('db', {client: "mysql", host: '127.0.0.1', port: 3306, user: 'root', password: 'password'})
server.Get('/')
server.Get('/users', true).DB('users')
server.Get('/test')
server.Get('/user', true).DB('users')
server.start()
`;

fs.writeFileSync(serverFilePath, serverCode);
console.log(`server.ts file created in the 'src' folder.`);
