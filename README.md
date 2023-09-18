[![Express Logo](https://www.zer0cheros.fi/_next/image?url=%2Flogo.webp&w=96&q=75)

# react-simple-server

A method for testing your React application against a simple and minimal backend API server. The server is a mix of express package and knex package

```ts
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
```

## Installation


```console
$ npm install @zer0cheros/react-simple-server
```

## Features

  * Easy setup
  * Less code
  * Workning upon express 



## People

The teacher behind is [Christian](https://github.com/zer0cheros)

## License

  [MIT](LICENSE)
