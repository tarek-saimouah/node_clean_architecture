import { injectable } from 'inversify'
import config from '../../../config'
import { createClient, RedisClientType } from 'redis'

export interface ICacheDatasource {
  connectDb(): Promise<Boolean>

  setValue(
    key: string,
    value: string,
    expireIn: number | string
  ): Promise<boolean>

  getValue<T>(key: string): Promise<T | null>

  getTtl(key: string): Promise<number | null>

  deleteValue(key: string): Promise<boolean>
}

@injectable()
export class CacheDatasourceImpl implements ICacheDatasource {
  private readonly client: RedisClientType

  constructor() {
    this.client = createClient({
      socket: {
        host: config.CACHE_DB_HOST,
        port: config.CACHE_DB_PORT,
      },
      password: config.CACHE_DB_PASSWORD,
    })
  }

  async setValue(
    key: string,
    value: string,
    expireIn: number
  ): Promise<boolean> {
    const created = await this.client.setEx(key, expireIn, value)
    return Boolean(created)
  }

  async getValue<T>(key: string): Promise<T | null> {
    const value = await this.client.get(key)
    return value ? JSON.parse(value) : null
  }

  async getTtl(key: string): Promise<number | null> {
    const ttl = await this.client.ttl(key)
    return ttl > 0 ? ttl : null
  }

  async deleteValue(key: string): Promise<boolean> {
    const deleted = await this.client.del(key)
    return Boolean(deleted)
  }

  connectDb(): Promise<Boolean> {
    const isConnected = new Promise<Boolean>(async (resolve, reject) => {
      try {
        this.client.on('error', async (error) => {
          console.error('Cache db connection error:', error)
          await this.client.disconnect()
        })

        await this.client.connect()
        resolve(true)
      } catch (err) {
        console.error('Cache db connection error:', err)
        await this.client.disconnect()

        reject(false)
      }
    })

    return isConnected
  }
}
