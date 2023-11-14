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
// services
import OtpService from '../application/otp/otp.service'
// controllers
import AuthController from '../application/controllers/auth.controller'
import ManagerController from '../application/controllers/manager.controller'
import UserController from '../application/controllers/user.controller'

export const container = new Container({ defaultScope: 'Singleton' })

// data source

container.bind<IDBDatasource>(Types.IDBDatasource).to(DBDatasourceImpl)

container.bind<ICacheDatasource>(Types.ICacheDatasource).to(CacheDatasourceImpl)

// repository interfaces

container.bind<IManagerRepo>(Types.IManagerRepo).to(ManagerRepoImpl)

container.bind<IUserRepo>(Types.IUserRepo).to(UserRepoImpl)

container.bind<ICacheRepo>(Types.ICacheRepo).to(CacheRepoImpl)

// services

container.bind<OtpService>(Types.OtpService).to(OtpService)

// controllers

container.bind<AuthController>(Types.AuthController).to(AuthController)

container.bind<ManagerController>(Types.ManagerController).to(ManagerController)

container.bind<UserController>(Types.UserController).to(UserController)
