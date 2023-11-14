import mongoose, { Schema, model } from 'mongoose'
import {
  CreateParams,
  Query,
  UserEntity,
} from '../../domain/entities/user.entity'

export interface IUser {
  _id: string
  firstName: string
  lastName: string
  email: string
  password: string
  phoneNumber: string
  verified: boolean
  otpCode: string
  otpExpire: Date
  createdAt: Date
  updatedAt: Date
}

const schema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true, select: false },
    phoneNumber: { type: String, required: true },
    verified: { type: Boolean, default: false },
    otpCode: String,
    otpExpire: Date,
  },
  { timestamps: true }
)

// create indexes
schema.index({ phoneNumber: 1 }, { unique: true })

const User = model<IUser>('User', schema)

export default User

export const Mapper = {
  toDtoCreation: (payload: CreateParams) => {
    return {
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      otpCode: payload.otpCode,
      otpExpire: payload.otpExpire,
      password: payload.password,
      phoneNumber: payload.phoneNumber,
    }
  },

  toQuery: (query: Query) => {
    return {
      ...(query.firstName && { firstName: query.firstName }),
      ...(query.lastName && { lastName: query.lastName }),
      ...(query.email && { email: query.email }),
      ...(query.password && { password: query.password }),
      ...(query.otpCode !== undefined && { otpCode: query.otpCode }),
      ...(query.otpExpire !== undefined && { otpExpire: query.otpExpire }),
      ...(query.phoneNumber && { phoneNumber: query.phoneNumber }),
      ...(query.verified !== undefined && { verified: query.verified }),
      ...(query.id && { _id: new mongoose.Types.ObjectId(query.id) }),
      ...(query.createdAt && { createdAt: query.createdAt }),
    }
  },

  toEntity: (model: IUser): UserEntity =>
    new UserEntity(
      model.firstName,
      model.lastName,
      model.email,
      model.phoneNumber,
      model.verified,
      model.createdAt,
      model.updatedAt,
      model.otpCode,
      model.otpExpire,
      model.password,
      model._id.toString()
    ),
}
