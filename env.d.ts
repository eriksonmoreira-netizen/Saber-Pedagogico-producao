
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      API_KEY: string;
      GOOGLE_CLIENT_ID: string;
      [key: string]: string | undefined;
    }
  }
  var google: any;
}

export {};
