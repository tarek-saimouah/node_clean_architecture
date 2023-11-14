import { injectable } from 'inversify'
import {
  CreateParams,
  ManagerEntity,
  Query,
} from '../../../domain/entities/manager.entity'
import IManagerRepo from '../../../domain/repositories/managerRepo'
import Manager, { Mapper } from '../../models/manager.model'

@injectable()
export default class ManagerRepoImpl implements IManagerRepo {
  async isExists(username: string, id?: string): Promise<boolean> {
    const doc = await Manager.findOne({
      username,
      ...(id && { _id: { $ne: id } }),
    })

    return doc ? true : false
  }

  async updateOne(query: Query): Promise<ManagerEntity | null> {
    const { _id, ...updates } = Mapper.toQuery(query)
    const update = { $set: { ...updates } }
    const updatedDoc = await Manager.findByIdAndUpdate(_id, update, {
      new: true,
    })

    return updatedDoc ? Mapper.toEntity(updatedDoc) : null
  }

  async updateMany(query: Query): Promise<number> {
    const { _id, ...updates } = Mapper.toQuery(query)
    const update = { $set: { ...updates } }
    const result = await Manager.updateMany({ _id }, update)

    return result.matchedCount
  }

  async deleteOne(query: Query): Promise<boolean> {
    const result = await Manager.deleteOne({
      ...Mapper.toQuery(query),
    })

    return result.deletedCount === 1
  }

  async deleteMany(query: Query): Promise<number> {
    const result = await Manager.deleteMany({
      ...Mapper.toQuery(query),
    })

    return result.deletedCount
  }

  async findOne(query: Query, select: Boolean): Promise<ManagerEntity | null> {
    let doc = null

    if (select)
      doc = await Manager.findOne({ ...Mapper.toQuery(query) }).select(
        '+password'
      )
    else doc = await Manager.findOne({ ...Mapper.toQuery(query) })

    return doc ? Mapper.toEntity(doc) : null
  }

  async findById(id: string): Promise<ManagerEntity | null> {
    const doc = await Manager.findById(id)
    return doc ? Mapper.toEntity(doc) : null
  }

  async create(payload: CreateParams): Promise<ManagerEntity> {
    const doc = await Manager.create(Mapper.toDtoCreation(payload))
    return Mapper.toEntity(doc)
  }

  async findAll(query: Query): Promise<ManagerEntity[]> {
    let queryObj = { ...Mapper.toQuery(query) }

    const docs = await Manager.find(queryObj)

    const entities = docs.map((doc) => Mapper.toEntity(doc))

    return entities
  }
}
