import { Router } from 'express'
import Controller from '../controllers/user.controller'
import Validator from '../middlewares/validators/user.validation'
import AuthValidator from '../middlewares/validators/auth.validation'
import GeneralValidator from '../middlewares/validators/general.validation'
import verifyToken from '../middlewares/verifyToken'
import AdminRoles from '../middlewares/roles/adminRoles'

const router = Router()

router
  .route('/')
  .get(
    verifyToken,
    AdminRoles.directorAuth,
    Validator.getUsers,
    Controller.findAllUsers
  )

router
  .route('/resend-code')
  .patch(Validator.resendOtpCode, Controller.resendOtpCode)

router
  .route('/account')
  .delete(verifyToken, AuthValidator.userLogin, Controller.deleteUserAccount)

router
  .route('/:id')
  .get(
    verifyToken,
    AdminRoles.directorAuth,
    GeneralValidator.idParam,
    Controller.getUser
  )
  .delete(
    verifyToken,
    AdminRoles.managerAuth,
    GeneralValidator.idParam,
    Controller.deleteUserById
  )
  .patch(
    verifyToken,
    AdminRoles.directorAuth,
    Validator.updateUser,
    Controller.updateUser
  )

router
  .route('/:id/verify-account')
  .patch(Validator.verifyAccount, Controller.verifyAccount)

router
  .route('/:id/profile')
  .patch(verifyToken, Validator.updateUserProfile, Controller.updateUserProfile)

router
  .route('/:id/reset-password')
  .patch(Validator.resetPassword, Controller.resetPassword)

export default router
