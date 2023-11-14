import { Router } from 'express'
import Validator from '../middlewares/validators/user.validation'
import AuthValidator from '../middlewares/validators/auth.validation'
import GeneralValidator from '../middlewares/validators/general.validation'
import verifyToken from '../middlewares/verifyToken'
import AdminRoles from '../middlewares/roles/adminRoles'
import UserController from '../controllers/user.controller'
import { Types } from '../../di/types'
import { container } from '../../di/container'

const controller: UserController = container.get<UserController>(
  Types.UserController
)

const router = Router()

router
  .route('/')
  .get(
    verifyToken,
    AdminRoles.directorAuth,
    Validator.getUsers,
    controller.findAllUsers
  )

router
  .route('/resend-code')
  .patch(Validator.resendOtpCode, controller.resendOtpCode)

router
  .route('/account')
  .delete(verifyToken, AuthValidator.userLogin, controller.deleteUserAccount)

router
  .route('/:id')
  .get(
    verifyToken,
    AdminRoles.directorAuth,
    GeneralValidator.idParam,
    controller.getUser
  )
  .delete(
    verifyToken,
    AdminRoles.managerAuth,
    GeneralValidator.idParam,
    controller.deleteUserById
  )
  .patch(
    verifyToken,
    AdminRoles.directorAuth,
    Validator.updateUser,
    controller.updateUser
  )

router
  .route('/:id/verify-account')
  .patch(Validator.verifyAccount, controller.verifyAccount)

router
  .route('/:id/profile')
  .patch(verifyToken, Validator.updateUserProfile, controller.updateUserProfile)

router
  .route('/:id/reset-password')
  .patch(Validator.resetPassword, controller.resetPassword)

export default router
