import { Router } from 'express'
import Controller from '../controllers/manager.controller'
import Validator from '../middlewares/validators/manager.validation'
import GeneralValidator from '../middlewares/validators/general.validation'
import verifyToken from '../middlewares/verifyToken'
import AdminRoles from '../middlewares/roles/adminRoles'

const router = Router()

router
  .route('/')
  .post(
    verifyToken,
    AdminRoles.managerAuth,
    Validator.createManager,
    Controller.createManager
  )
  .get(
    verifyToken,
    AdminRoles.directorAuth,
    Validator.getManagers,
    Controller.findAllManagers
  )

router
  .route('/:id')
  .get(
    verifyToken,
    AdminRoles.directorAuth,
    GeneralValidator.idParam,
    Controller.getManager
  )
  .delete(
    verifyToken,
    AdminRoles.managerAuth,
    GeneralValidator.idParam,
    Controller.deleteManagerById
  )
  .patch(
    verifyToken,
    AdminRoles.managerAuth,
    Validator.updateManager,
    Controller.updateManager
  )

export default router
