
//types
export type PostData = {
    body: {type: any}
}

//Client
export default class Client {
  private baseUrl: string;

  constructor(baseUrl: string) {
      this.baseUrl = baseUrl;
  }

  public async Get(url: string): Promise<any> {
      const response = await fetch(`${this.baseUrl}${url}`);
      if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
      }
      const data = await response.json();
      return data;
  }
  public async Post(url: string, data: PostData): Promise<any> {
    const response = await fetch(`${this.baseUrl}${url}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }
    const responseData = await response.json();
    return responseData;
}
  } 
  