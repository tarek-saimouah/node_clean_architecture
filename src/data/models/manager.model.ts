import mongoose, { Schema, model } from 'mongoose'
import {
  CreateParams,
  Query,
  ManagerEntity,
} from '../../domain/entities/manager.entity'

export interface IManager {
  _id: string
  username: string
  password: string
  role: string
  phoneNumber: string
  createdAt: Date
  updatedAt: Date
}

const schema = new Schema<IManager>(
  {
    username: { type: String, required: true },
    password: { type: String, required: true, select: false },
    role: { type: String, required: true },
    phoneNumber: { type: String, required: true },
  },
  { timestamps: true }
)

const Manager = model<IManager>('Manager', schema)

export default Manager

export const Mapper = {
  toDtoCreation: (payload: CreateParams) => {
    return {
      username: payload.username,
      password: payload.password,
      role: payload.role,
      phoneNumber: payload.phoneNumber,
    }
  },

  toQuery: (query: Query) => {
    return {
      ...(query.username && { username: query.username }),
      ...(query.role && { role: query.role }),
      ...(query.phoneNumber && { phoneNumber: query.phoneNumber }),
      ...(query.id && { _id: new mongoose.Types.ObjectId(query.id) }),
      ...(query.createdAt && { createdAt: query.createdAt }),
    }
  },

  toEntity: (model: IManager): ManagerEntity =>
    new ManagerEntity(
      model.username,
      model.role,
      model.phoneNumber,
      model.createdAt,
      model.updatedAt,
      model.password,
      model._id.toString()
    ),
}
