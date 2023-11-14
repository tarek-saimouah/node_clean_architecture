import { injectable } from 'inversify'
import {
  CreateParams,
  UserEntity,
  Query,
} from '../../../domain/entities/user.entity'
import IUserRepo from '../../../domain/repositories/userRepo'
import User, { Mapper } from '../../models/user.model'

@injectable()
export default class UserRepoImpl implements IUserRepo {
  async findPaging(
    query: Query,
    offset: number,
    limit: number,
    sort?: {}
  ): Promise<UserEntity[]> {
    let queryObj = { ...Mapper.toQuery(query) }
    const sortObj = sort || { _id: -1 }

    const docs = await User.find(queryObj)
      .skip(offset)
      .limit(limit)
      .sort(sortObj)

    const entities = docs.map((doc) => Mapper.toEntity(doc))

    return entities
  }

  async count(query: Query): Promise<number> {
    let queryObj = { ...Mapper.toQuery(query) }

    const count = await User.countDocuments(queryObj)
    return count
  }

  async isExists(
    email?: string,
    phoneNumber?: string,
    id?: string
  ): Promise<boolean> {
    const doc = await User.findOne({
      ...(email && { email }),
      ...(phoneNumber && { phoneNumber }),
      ...(id && { _id: { $ne: id } }),
    })

    return doc ? true : false
  }

  async updateOne(query: Query): Promise<UserEntity | null> {
    const { _id, ...values } = Mapper.toQuery(query)
    // null props of updates means delete ==> put in $unset
    const updates = {}
    const deleteUpdates = {}

    // remove null values and add them to delete
    for (const [key, value] of Object.entries(values)) {
      if (value === null) {
        deleteUpdates[key] = 1
      } else {
        updates[key] = value
      }
    }

    const update = { $set: { ...updates }, $unset: { ...deleteUpdates } }

    const updatedDoc = await User.findByIdAndUpdate(_id, update, { new: true })

    return updatedDoc ? Mapper.toEntity(updatedDoc) : null
  }

  async updateMany(query: Query): Promise<number> {
    const { _id, ...updates } = Mapper.toQuery(query)
    const update = { $set: { ...updates } }
    const result = await User.updateMany({ _id }, update)

    return result.matchedCount
  }

  async deleteOne(query: Query): Promise<boolean> {
    const result = await User.deleteOne({
      ...Mapper.toQuery(query),
    })

    return result.deletedCount === 1
  }

  async deleteMany(query: Query): Promise<number> {
    const result = await User.deleteMany({
      ...Mapper.toQuery(query),
    })

    return result.deletedCount
  }

  async findOne(query: Query, select: Boolean): Promise<UserEntity | null> {
    let doc = null

    if (select)
      doc = await User.findOne({ ...Mapper.toQuery(query) }).select('+password')
    else doc = await User.findOne({ ...Mapper.toQuery(query) })

    return doc ? Mapper.toEntity(doc) : null
  }

  async findById(id: string): Promise<UserEntity | null> {
    const doc = await User.findById(id)
    return doc ? Mapper.toEntity(doc) : null
  }

  async create(payload: CreateParams): Promise<UserEntity> {
    const doc = await User.create(payload)
    return Mapper.toEntity(doc)
  }

  async findAll(query: Query): Promise<UserEntity[]> {
    let queryObj = { ...Mapper.toQuery(query) }

    const docs = await User.find(queryObj)

    const entities = docs.map((doc) => Mapper.toEntity(doc))

    return entities
  }
}
