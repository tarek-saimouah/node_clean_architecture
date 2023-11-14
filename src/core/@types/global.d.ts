import { User } from '../types'

namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string
    PORT: number
    CLIENT_URL: string
    AUTHORIZATION_KEY: string
    JWT_SECRET: string
    CACHE_DB_HOST: string
    CACHE_DB_PORT: number
    CACHE_DB_PASSWORD: string
    CACHE_DB_HOST: string
    CACHE_DB_PORT: number
    CACHE_DB_PASSWORD: string
    SEED_ADMIN_USERNAME: string
    SEED_ADMIN_PASSWORD: string
  }
}

declare global {
  export interface Error {
    code: string
  }
}
