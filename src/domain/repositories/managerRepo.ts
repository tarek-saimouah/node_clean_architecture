import { ManagerEntity, CreateParams, Query } from '../entities/manager.entity'

export default interface IManagerRepo {
  create(payload: CreateParams): Promise<ManagerEntity>

  findAll(query: Query): Promise<ManagerEntity[]>

  isExists(username: string, id?: number | string): Promise<boolean>

  findOne(query: Query, select: Boolean): Promise<ManagerEntity | null>

  findById(id: number | string): Promise<ManagerEntity | null>

  deleteOne(query: Query): Promise<boolean>

  deleteMany(query: Query): Promise<number>

  updateOne(query: Query): Promise<ManagerEntity | null>

  updateMany(query: Query): Promise<number>
}
