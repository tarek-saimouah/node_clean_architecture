import { ItemEntity } from '../../../domain/entities/item.entity'
import { OrderEntity } from '../../../domain/entities/order.entity'
import { ServiceEntity } from '../../../domain/entities/service.entity'
import { User, Manager } from '../../types'

declare global {
  namespace Express {
    export interface Request {
      user?: User
      manager?: Manager
    }
  }
}
