export class UserEntity {
  id?: number | string
  firstName: string
  lastName: string
  email: string
  password?: string | undefined
  phoneNumber: string
  verified: boolean
  otpCode?: string | undefined
  otpExpire?: Date | undefined
  createdAt: Date
  updatedAt: Date

  constructor(
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    verified: boolean,
    createdAt: Date,
    updatedAt: Date,
    otpCode?: string | undefined,
    otpExpire?: Date | undefined,
    password?: string | undefined,
    id?: number | string
  ) {
    this.firstName = firstName
    this.lastName = lastName
    this.email = email
    this.phoneNumber = phoneNumber
    this.verified = verified
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.otpCode = otpCode
    this.otpExpire = otpExpire
    this.password = password
    this.id = id
  }
}

export type CreateParams = {
  firstName: string
  lastName: string
  email: string
  otpCode: string
  otpExpire: string
  password: string
  phoneNumber: string
}

export type Query = {
  id?: number | string
  firstName?: string
  lastName?: string
  email?: string
  password?: string
  otpCode?: string | null
  otpExpire?: Date | null
  phoneNumber?: string
  verified?: boolean
  createdAt?: Date
  updatedAt?: Date
}
