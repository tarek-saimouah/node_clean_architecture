import { Router } from 'express'
import Validator from '../middlewares/validators/manager.validation'
import GeneralValidator from '../middlewares/validators/general.validation'
import verifyToken from '../middlewares/verifyToken'
import AdminRoles from '../middlewares/roles/adminRoles'
import ManagerController from '../controllers/manager.controller'
import { Types } from '../../di/types'
import { container } from '../../di/container'

const controller: ManagerController = container.get<ManagerController>(
  Types.ManagerController
)

const router = Router()

router
  .route('/')
  .post(
    verifyToken,
    AdminRoles.managerAuth,
    Validator.createManager,
    controller.createManager
  )
  .get(
    verifyToken,
    AdminRoles.directorAuth,
    Validator.getManagers,
    controller.findAllManagers
  )

router
  .route('/:id')
  .get(
    verifyToken,
    AdminRoles.directorAuth,
    GeneralValidator.idParam,
    controller.getManager
  )
  .delete(
    verifyToken,
    AdminRoles.managerAuth,
    GeneralValidator.idParam,
    controller.deleteManagerById
  )
  .patch(
    verifyToken,
    AdminRoles.managerAuth,
    Validator.updateManager,
    controller.updateManager
  )

export default router
