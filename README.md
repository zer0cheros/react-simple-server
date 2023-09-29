![Zer0cheros](https://www.zer0cheros.fi/_next/image?url=%2Flogo.webp&w=96&q=75)

# simple-react-server

A method for testing your React application against a simple and minimal backend API server. The server is a mix of express package and knex package. Simplifying coding for a more enjoyable experience.

## Server-side
```ts
import Server from '@zer0cheros/simple-react-server'

const server = new Server(8080)

//Config DB with you own credentials
server.connect('db', {client: "mysql", host: '127.0.0.1', port: 3306, user: 'root', password: 'password'})

// When no specific request is made, a default JSON response will be presented.
server.Get('/')

//A query to retrieve all data from the 'users' table in the database
server.Get('/users', true).DB('users')

// A query to retrieve data from the 'users' table in the database, with a specific id
server.Get('/users', false, true).DB('users').ID(4) 

//Starts application
server.start()
```

## Client

```tsx
import { useState, useEffect } from 'react'
import Client from '@zer0cheros/simple-react-serve/client'


function App() {
  const [users, setUsers] = useState([]) //your types here
  useEffect(()=>{
    // Usage
    const users = client.Get('/users')
    // Returns json response from /users
    setUsers(data)
    // Updates the state
  },[])
  return (
    <div>
      {users.map((user)=>(
        <ul>
          <li>{user.name}</li>
          <li>{user.email}</li>
        </ul>
      ))}
    </div>
  )
}

export default App
```
## Installation

```console
$ npm install @zer0cheros/simple-react-server
```
### Recommended for more optimized development.
1. Installing script for setting up automation tools.
```console
$ npm install npm-run-all nodemon -g
```
2. Add this to your package.json
```console
"scripts": {
  "server-build": "tsc ./src/server.ts && move src\\server.js src\\server.cjs",
  "server-run": "nodemon ./src/server.cjs",
  "server-start": "npm-run-all --parallel server-build server-run"
}
```


## Features

  * Easy setup
  * Less code
  * Workning upon express 



## People

The teacher behind is [Christian](https://github.com/zer0cheros)

## License

  [MIT](LICENSE)
