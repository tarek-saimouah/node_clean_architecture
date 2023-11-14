import path from 'path'
import dotenv from 'dotenv'
dotenv.config({ path: path.resolve(__dirname, '../.env') })

interface ENV {
  NODE_ENV: string | undefined
  PORT: number | undefined
  CLIENT_URL: string | undefined
  MONGODB_URL: string | undefined
  AUTHORIZATION_KEY: string | undefined
  JWT_SECRET: string | undefined
  CACHE_DB_PORT: number | undefined
  CACHE_DB_HOST: string | undefined
  CACHE_DB_PASSWORD: string | undefined
  SEED_ADMIN_USERNAME: string | undefined
  SEED_ADMIN_PASSWORD: string | undefined
}

const getConfig = (): ENV => {
  return {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT ? Number(process.env.PORT) : undefined,
    CLIENT_URL: process.env.CLIENT_URL,
    MONGODB_URL: process.env.MONGODB_URL,
    AUTHORIZATION_KEY: process.env.AUTHORIZATION_KEY,
    JWT_SECRET: process.env.JWT_SECRET,
    CACHE_DB_PORT: process.env.CACHE_DB_PORT
      ? Number(process.env.CACHE_DB_PORT)
      : undefined,
    CACHE_DB_HOST: process.env.CACHE_DB_HOST,
    CACHE_DB_PASSWORD: process.env.CACHE_DB_PASSWORD,
    SEED_ADMIN_USERNAME: process.env.SEED_ADMIN_USERNAME,
    SEED_ADMIN_PASSWORD: process.env.SEED_ADMIN_PASSWORD,
  }
}

const config = getConfig()

export default config
