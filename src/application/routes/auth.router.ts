import { Router } from 'express'
import Controller from '../controllers/auth.controller'
import AuthValidator from '../middlewares/validators/auth.validation'

const router = Router()

router
  .route('/user/sign-up')
  .post(AuthValidator.userSignup, Controller.signupUser)

router
  .route('/user/sign-in')
  .post(AuthValidator.userLogin, Controller.loginUser)

router
  .route('/forgot-password')
  .patch(AuthValidator.forgotPassword, Controller.forgotPassword)

router
  .route('/manager/sign-in')
  .post(AuthValidator.managerLogin, Controller.loginManager)

export default router
