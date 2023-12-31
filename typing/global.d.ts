// import { Payload } from '../src/auth';

export declare global {
  type AnyObject = Record<string, unknown>;

  namespace Express {
    interface Request {
        user: number
    }
  }

  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string;
      PORT: string;

      DB_TYPE: string;
      DB_HOST: string;
      DB_PORT: string;
      DB_USER: string;
      DB_PASSWORD: string;
      DB_NAME: string;

      JWT_SECRET: string;
      JWT_REFRESH_SECRET: string;
    }
  }
  
}