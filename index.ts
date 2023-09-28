const express = require('express');
const knex = require('knex');
const axios = require('axios');

//Database
const defaultDatabaseConfig = {
  client: 'mysql',
  connection: {
    host: '127.0.0.1',
    port: 3306,
    user: 'root', 
    password: 'password',  
    database: 'db'
  },
}

//types
 type PostData = {
  body: {type: any}
}

type DatabaseProps = {
  database: string
    config?: {
      client: string;
      host: string;
      port: number;
      user: string;
      password: string;
      database: string;
    } | undefined
}

//Server
export default class Server {
  public readonly defaultJson: {message: string} = {message: "This is a message from simple-react-server"}
  private port:number
  private app:any
  private db:any
  private routeUrl = '';
  private dbTable: string | null = null;
  private options: { html?: '', json?:string } = {}; 
  private useDb:boolean = false 
  private dbId:number = 0;
  
  public constructor(port:number){
    // @ts-ignore
    this.app = express();
    this.app.use(express.urlencoded({extended: true}))
    this.app.use(express.json())
    this.port = port;
    this.db = knex(defaultDatabaseConfig)
  }
  public connect(database: string, config?: {client: string, host: string, port: number, user: string, password: string}): DatabaseProps {
    try {
      this.db = knex({
        client: config!.client,
        connection: {
          host: config!.host,
          port: config!.port,
          user: config!.user,
          password: config!.password,
          database: database
        },
      })
      console.log('connected')
    } catch (error) {
      console.error(error)
    }
    return {database}
  }
  public start(): void {
    this.app.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }
  public Post(url: string, saveToDb?:boolean, databaseTable?:string): this {
    if ( typeof url !== 'string' ) throw new Error("Invalid parameters");
    this.routeUrl = url;
    saveToDb ? this.useDb = true: this.useDb = false
    databaseTable ? this.dbTable = databaseTable : null
    this.setupPostRoute(url);
    return this;
  }
  public Get(url: string, getAll?:boolean, getId?: boolean, option?: { html?: '', json?:string }): this {
    this.routeUrl = url;
    if (option) {
      this.options = option;
    }
    else if(getAll){
      this.setupRouteDB();
    }
    else if (getId) {
      this.setupRouteWithID();
    }
    else{
      this.setupRoute(this.routeUrl)
    }
    return this;
  }
  public DB(tableName: string ): this {
    this.dbTable = tableName;
    return this
  }
  public ID(id:number): this {
    this.dbId = id;
    return this
  }
private setupRouteDB(): void { 
this.app.get(this.routeUrl, async (req, res) => {
  try {
      const data = await this.queryDatabase();
      res.json(data) 
    }
    catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
  this.routeUrl = ''
});
}
private setupRouteWithID(): void{
  this.app.get(this.routeUrl, async (req, res) => {
    try {
        const data = await this.queryDatabaseId(this.dbId);
        res.json(data) 
      }
      catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
    this.routeUrl = ''
  });
}
private setupRoute(url:string): void {
  this.app.get(url, async (req, res) => {
    res.json(this.defaultJson)
  });
}
private setupPostRoute(url:string): void {
  this.app.post (this.routeUrl, async (req, res)=>{
    try {
      if(this.useDb) {
        const data = await this.db.insert(req.body).into(this.dbTable || '')
        res.json(data)
      }
    } catch (error) {
      res.json(error)
    }
  })

}
  private async queryDatabase() {
    const data = await this.db.select('*').from(this.dbTable || '')
    return data

  }
  private async queryDatabaseId(id:number) { 
    const data = await this.db.select('*').from(this.dbTable || '').where("id", id)
    return data
  }
}

//Client
export class Client {
  private app:any
  private routeUrl = '';
  private postData:PostData = {body:{
    type: undefined
  }}
  constructor(){
    this.app = axios.create({headers: {'Content-Type': 'application/json'}, baseURL:`http://localhost:${5000}`})
  }
  public Get(url:string) {
    this.routeUrl = url;
    this.app.get(url).then((res)=> console.log(res.data))
  }  
  public async Post(url:string, data:{}) {
    this.routeUrl = url;
    //this.postData = data 
    this.app.post(url, data).then((res)=> console.log(res.data))
  } 
} 

