import axios, {AxiosInstance} from 'axios';


//types
export type PostData = {
    body: {type: any}
}

//Client
export default class Client {
    private app:AxiosInstance
    private routeUrl = '';
    private postData:PostData = {body:{
      type: undefined
    }}
    constructor(){
      this.app = axios.create({headers: {'Content-Type': 'application/json'}, baseURL:`http://localhost:${5000}`})
    }
    public Get(url:string) {
      this.routeUrl = url;
      this.app.get(url).then((res)=> {return res.data})
    }  
    public async Post(url:string, data:{ body: { type: undefined } }) {
        this.routeUrl = url;
        this.postData = data 
        this.app.post(url, data).then((res)=>  {return res.data})
    } 
  } 
  