import express from 'express';
import {  Request, Response, Application } from 'express';
import knex, {Knex} from 'knex';

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



type ServerType = {
  port: number;
};

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
export default class Server {
  public readonly defaultJson: {message: string} = {message: "This is a message from simple-react-server"}
  private port:number
  private app: Application
  private db: Knex
  private routeUrl = '';
  private dbTable: string | null = null;
  private options: { html?: '', json?: '' } = {}; 
  private useDb:boolean = false 
  
  public constructor({port}:ServerType){
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

private setupRoute(url:string): void {
  this.app.get(url, async (req: Request, res: Response) => {
    res.json(this.defaultJson)
  });
}
  private async queryDatabase() {
    const data = await this.db.select('*').from(this.dbTable || '')
    return data
  }
 
}