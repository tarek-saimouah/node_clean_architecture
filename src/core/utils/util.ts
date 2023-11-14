import bcrypt from 'bcrypt'
import Jwt, { Secret } from 'jsonwebtoken'
import config from '../../config'
import { Manager, User } from '../types'

// hash utils
export const generateHash = async (input: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(input, salt)

  return hash
}

export const compareHash = async (
  input: string,
  hash: string
): Promise<boolean> => {
  const match = await bcrypt.compare(input, hash)
  return match
}

// token utils
export const generateManagerToken = (manager: Manager): string => {
  const token = Jwt.sign(manager, config.JWT_SECRET as Secret, {
    expiresIn: '12h',
  })
  return token
}

export const generateUserToken = (user: User): string => {
  const token = Jwt.sign(user, config.JWT_SECRET as Secret, {})
  return token
}

export const decodeManagerToken = (token: string): Manager => {
  return Jwt.verify(token, config.JWT_SECRET as Secret) as Manager
}

export const decodeUserToken = (token: string): User => {
  return Jwt.verify(token, config.JWT_SECRET as Secret) as User
}

export const decodeToken = (token: string): boolean => {
  return Jwt.verify(token, config.JWT_SECRET as Secret) ? true : false
}

// math utils

export const generateOtpCode = () => {
  // 5 numbers code
  let randomCode = Math.round(Math.random() * 100000).toString()

  // if code less than 5 number add padding with 0
  if (randomCode.length < 5) {
    randomCode = randomCode.padStart(5, '1')
  }

  return randomCode
}

export const computeLimitAndOffset = (page: number, size: number = 50) => {
  const limit = size
  const offset = page > 0 ? (page - 1) * limit : 0

  return { limit, offset }
}

// string utils

const generateRandomId = () => {
  return Math.floor(Math.random() * Date.now()).toString(16)
}

export default {
  generateHash,
  compareHash,
  generateManagerToken,
  generateUserToken,
  decodeManagerToken,
  decodeUserToken,
  decodeToken,
  generateOtpCode,
  computeLimitAndOffset,
  generateRandomId,
}
