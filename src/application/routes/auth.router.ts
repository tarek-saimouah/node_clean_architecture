import { Router } from 'express'
import { container } from '../../di/container'
import { Types } from '../../di/types'
import AuthController from '../controllers/auth.controller'
import AuthValidator from '../middlewares/validators/auth.validation'

const controller: AuthController = container.get<AuthController>(
  Types.AuthController
)

const router = Router()

router
  .route('/user/sign-up')
  .post(AuthValidator.userSignup, controller.signupUser)

router
  .route('/user/sign-in')
  .post(AuthValidator.userLogin, controller.loginUser)

router
  .route('/forgot-password')
  .patch(AuthValidator.forgotPassword, controller.forgotPassword)

router
  .route('/manager/sign-in')
  .post(AuthValidator.managerLogin, controller.loginManager)

export default router
