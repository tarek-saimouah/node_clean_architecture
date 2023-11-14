export class ManagerEntity {
  id?: number | string
  password?: string | undefined
  username: string
  role: string
  phoneNumber: string
  createdAt: Date
  updatedAt: Date

  constructor(
    username: string,
    role: string,
    phoneNumber: string,
    createdAt: Date,
    updatedAt: Date,
    password?: string | undefined,
    id?: number | string
  ) {
    this.username = username
    this.role = role
    this.phoneNumber = phoneNumber
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.password = password
    this.id = id
  }
}

export type CreateParams = {
  username: string
  password: string
  role: string
  phoneNumber: string
}

export type Query = {
  id?: number | string
  username?: string
  role?: string
  phoneNumber?: string
  createdAt?: Date
  updatedAt?: Date
}
