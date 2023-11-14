import ICacheRepo from '../../domain/repositories/cacheRepo'
import { inject, injectable } from 'inversify'
import { ICacheDatasource } from '../data-sources/cache/cacheDatasource'
import { Types } from '../../di/types'
import Constants from '../../core/utils/constants'

@injectable()
export default class CacheRepoImpl implements ICacheRepo {
  private _cacheDb: ICacheDatasource

  constructor(@inject(Types.ICacheDatasource) cacheDb: ICacheDatasource) {
    this._cacheDb = cacheDb
  }

  async setValue(
    key: string,
    value: string,
    expireIn: number = Constants.ONE_DAY_SECONDS
  ): Promise<boolean> {
    return await this._cacheDb.setValue(key, value, expireIn)
  }

  async getValue<T>(key: string): Promise<any> {
    const value = await this._cacheDb.getValue<T>(key)
    const ttl = await this._cacheDb.getTtl(key)

    return { value, ttl }
  }

  async deleteValue(key: string): Promise<boolean> {
    return await this._cacheDb.deleteValue(key)
  }
}
