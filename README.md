![Zer0cheros](https://www.zer0cheros.fi/_next/image?url=%2Flogo.webp&w=96&q=75)

# simple-react-server

A method for testing your React application against a simple and minimal backend API server. The server is a mix of express package and knex package. Simplifying coding for a more enjoyable experience.

- Don´t use in production!!
- Only for development!!

When you install the package, it automatically creates a 'server.ts' file in your '/src' folder.

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
//simple example of using client and server
import { useState, useEffect } from 'react'
import Client from '@zer0cheros/simple-react-server/client'


function App() {
  const [users, setUsers] = useState([]) //your types here
  const client = new Client('http://localhost:8080')
  useEffect(()=>{
    client.Get('/users').then((res)=>{
      setUsers(res) 
    })
  },[])
  return (
    <div>
      {users.map((user:any)=>(
        <div key={user.id}>
          <h1>{user.name}</h1>
          <h2>{user.email}</h2>
        </div>
      )
      )}
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
