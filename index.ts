import * as express from 'express';
import {Application, Request, Response} from 'express';
import knex, {Knex} from 'knex';
import cors from 'cors';


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

//DatabaseProps
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
  private app:Application
  private db:Knex
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
    this.app.use(cors({origin: '*'}))
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
this.app.get(this.routeUrl, async (req:Request, res:Response) => {
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


