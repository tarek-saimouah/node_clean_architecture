import 'reflect-metadata'
import { Container } from 'inversify'
import { Types } from './types'

// data sources
import {
  IDBDatasource,
  DBDatasourceImpl,
} from '../data/data-sources/db-datasource/dbDatasource'
import {
  ICacheDatasource,
  CacheDatasourceImpl,
} from '../data/data-sources/cache/cacheDatasource'

// domain repos
import IManagerRepo from '../domain/repositories/managerRepo'
import IUserRepo from '../domain/repositories/userRepo'
import ICacheRepo from '../domain/repositories/cacheRepo'
// data repos
import ManagerRepoImpl from '../data/repositories/mongodb/managerRepoImpl'
import UserRepoImpl from '../data/repositories/mongodb/userRepoImpl'
import CacheRepoImpl from '../data/repositories/cacheRepoImpl'

export const container = new Container()

// data source

container
  .bind<IDBDatasource>(Types.IDBDatasource)
  .to(DBDatasourceImpl)
  .inSingletonScope()

container
  .bind<ICacheDatasource>(Types.ICacheDatasource)
  .to(CacheDatasourceImpl)
  .inSingletonScope()

// repository interfaces

container
  .bind<IManagerRepo>(Types.IManagerRepo)
  .to(ManagerRepoImpl)
  .inSingletonScope()

container.bind<IUserRepo>(Types.IUserRepo).to(UserRepoImpl).inSingletonScope()

container
  .bind<ICacheRepo>(Types.ICacheRepo)
  .to(CacheRepoImpl)
  .inSingletonScope()
