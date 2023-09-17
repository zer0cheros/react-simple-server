const fs = require('fs');
const path = require('path');

const reactSrcPath = path.join(__dirname, './src'); 

const serverCode = `
import Server from 'react-simple-server'

const server = new Server({port:3000})
server.connect('db', {client: "mysql", host: '127.0.0.1', port: 3306, user: 'root', password: 'password'})
server.Get('/')
server.Get('/users', true).DB('users')
server.Get('/test')
server.Get('/user', true).DB('users')
server.start()
`;

fs.writeFileSync(path.join(reactSrcPath, 'server.ts'), serverCode);
console.log('server.ts file created in React src folder');