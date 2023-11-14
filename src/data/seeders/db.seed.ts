import mongoose from 'mongoose'
import config from '../../config'
import { Role } from '../../core/enums/roles.enum'
import Manager from '../models/manager.model'
import bcrypt from 'bcrypt'

const url: string = config.MONGODB_URL || ''

async function seedAdmin() {
  console.log('seeding admin account...')

  const query = { username: config.SEED_ADMIN_USERNAME }

  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(config.SEED_ADMIN_PASSWORD!, salt)

  const data = {
    username: config.SEED_ADMIN_USERNAME,
    password: hash,
    role: Role.MANAGER,
    phoneNumber: '0999999999',
  }

  await Manager.updateOne(query, data, {
    upsert: true,
  })

  console.log('admin account seeded successfully.')
}

async function main() {
  let connection = null
  try {
    console.log('Connecting to db...')
    connection = await mongoose.connect(url)
    console.log('Connected to db successfully.')

    await seedAdmin()

    console.log('🌱  The seed command has been executed.')
  } catch (err) {
    console.log('error seeding db', err)
  } finally {
    await connection?.disconnect()
  }
}

main()
