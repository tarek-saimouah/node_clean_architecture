import { UserEntity, CreateParams, Query } from '../entities/user.entity'

export default interface IUserRepo {
  create(payload: CreateParams): Promise<UserEntity>

  findAll(query: Query): Promise<UserEntity[]>

  findPaging(
    query: Query,
    offset: number,
    limit: number,
    sort?: {}
  ): Promise<UserEntity[]>

  count(query: Query): Promise<number>

  isExists(
    email?: string,
    phoneNumber?: string,
    id?: number | string
  ): Promise<boolean>

  findOne(query: Query, select: Boolean): Promise<UserEntity | null>

  findById(id: number | string): Promise<UserEntity | null>

  deleteOne(query: Query): Promise<boolean>

  deleteMany(query: Query): Promise<number>

  updateOne(query: Query): Promise<UserEntity | null>

  updateMany(query: Query): Promise<number>
}
