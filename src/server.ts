
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
