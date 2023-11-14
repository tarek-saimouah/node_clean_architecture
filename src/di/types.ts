export const Types = {
  // data sources

  IDBDatasource: Symbol.for('IDBDatasource'),
  ICacheDatasource: Symbol.for('ICacheDatasource'),

  // repositories

  // manager
  IManagerRepo: Symbol.for('IManagerRepo'),
  // user
  IUserRepo: Symbol.for('IUserRepo'),
  // cache
  ICacheRepo: Symbol.for('ICacheRepo'),

  // services
  OtpService: Symbol.for('OtpService'),

  // controllers
  AuthController: Symbol.for('AuthController'),
  UserController: Symbol.for('UserController'),
  ManagerController: Symbol.for('ManagerController'),
}
