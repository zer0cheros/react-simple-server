import express from 'express';
import {  Request, Response, Application } from 'express';
import knex, {Knex} from 'knex';
import axios, { AxiosInstance } from 'axios';


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


export type PostData = {
  body: {}
}

export type DatabaseProps = {
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
  private app: Application
  private db: Knex
  private routeUrl = '';
  private dbTable: string | null = null;
  private options: { html?: '', json?: '' } = {}; 
  private useDb:boolean = false 
  private postData:PostData = {body:{}}
  
  public constructor(port:number){
    this.app = express();
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
  public POST(url: string, data:PostData): this {
    if (!data || typeof url !== 'string' ) throw new Error("Invalid parameters");
    this.routeUrl = url;
    this.postData = data
    this.setupPostRoute(url, data);
    return this;
  }
  public Get(url: string, useDb?:boolean, option?: { html?: '', json?: '' }): this {
    this.routeUrl = url;
    if (option) {
      this.options = option;
    }
    else if(useDb){
      this.setupRouteDB();
    }
    else {
      this.setupRoute(url);
    }
    return this;
  }
  public DB(tableName: string) {
    this.dbTable = tableName;
    return this.setupRouteDB()
  }
  public ID(tableName: string, id:string) {
    this.dbTable = tableName;
    return this.setupRouteID(id)
  }
private setupRouteDB(): void {
  this.app.get(this.routeUrl, async (req: Request, res: Response) => {
    console.log(this.routeUrl)
    try {
      if (this.dbTable) {
        const data = await this.queryDatabase();
        res.json(data);
      } else {
        res.json(this.defaultJson);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
    this.routeUrl = ''
  });
}
private setupRouteID(id:String): void {
  this.setupRouteID(id)
}

private setupRoute(url:string): void {
  this.app.get(url, async (req: Request, res: Response) => {
    res.json(this.defaultJson)
  });
}
private setupPostRoute(url:string, data:PostData): this {
  console.log(data)
  //saveToDb()
  return this;
}
  private async queryDatabase() {
    const data = await this.db.select('*').from(this.dbTable || '')
    return data
  }
  private async queryDatabaseId(id:string) {
    const data = await this.db.select('*').from(this.dbTable || '').where('id' == id)
    return data
  }
}

//Client

export class Client {
  private app: AxiosInstance
  private routeUrl = '';
  
  constructor(){
    this.app = axios.create({timeout: 25000,headers: {'Content-Type': 'application/json'}})
  }
  public async GET(url:string) {
    this.routeUrl = url;
    const response = await this.app.get(url)
    return response.data
  } 
  public async POST(url:string, data: {}) {
    this.routeUrl = url;
    const response = await this.app.post(url, data)
    return response.data
  } 
}