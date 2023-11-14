import { Request, Response } from 'express'
import { Types } from '../../di/types'
import { getErrorMessage } from '../../core/utils/errorHandler'
import ResponseMessages from '../../core/utils/constants'
import logger from '../../core/utils/logger'
import utils from '../../core/utils/util'
import IUserRepo from '../../domain/repositories/userRepo'
import { UserEntity } from '../../domain/entities/user.entity'
import OtpService, { SendOtpResponse } from '../otp/otp.service'
import IManagerRepo from '../../domain/repositories/managerRepo'
import { inject, injectable } from 'inversify'

@injectable()
export default class AuthController {
  constructor(
    @inject(Types.IUserRepo)
    private userRepository: IUserRepo,
    @inject(Types.IUserRepo)
    private managerRepository: IManagerRepo,
    @inject(Types.OtpService)
    private otpService: OtpService
  ) {}

  signupUser = async (req: Request, res: Response) => {
    /*
     * POST
     *
     * BASE_URL/auth/user/sign-up
     *
     * user in request body
     */

    const { email, phoneNumber, password } = req.body

    try {
      // check if user exists

      const userEmailExists = await this.userRepository.isExists(email)

      if (userEmailExists) {
        return res.status(409).json({
          success: false,
          message: ResponseMessages.RES_MSG_USER_EMAIL_ALREADY_EXISTS_EN,
        })
      }

      const userPhoneNumberExists = await this.userRepository.isExists(
        undefined,
        phoneNumber
      )

      if (userPhoneNumberExists) {
        return res.status(409).json({
          success: false,
          message: ResponseMessages.RES_MSG_USER_NUMBER_ALREADY_EXISTS_EN,
        })
      }

      // generate password hash
      const hash = await utils.generateHash(password)

      // generate otp code and expiry date
      const otpCode = utils.generateOtpCode()
      const otpExpire = Date.now() + 1000 * 60 * 15 // 15 minutes

      const payload = { ...req.body, password: hash, otpCode, otpExpire }

      const user = await this.userRepository.create(payload)

      if (!user) {
        return res.status(500).json({
          success: false,
          message: ResponseMessages.RES_MSG_AN_ERROR_OCCURRED_EN,
        })
      }

      // send otp code

      const otpResponse: SendOtpResponse =
        await this.otpService.sendVerificationMessage(phoneNumber, otpCode)

      if (!otpResponse.success) {
        return res.status(500).json({
          success: false,
          message: otpResponse.error,
        })
      }

      // execlude user password, otp
      const userResponse = this.generateUserResponse(user)

      res.status(201).json({
        success: true,
        message: ResponseMessages.RES_MSG_USER_CREATED_SUCCESSFULLY_EN,
        user: userResponse,
      })
    } catch (err) {
      const errorMessage = getErrorMessage(err)
      console.error(errorMessage)
      logger.appendErrorLog(req.originalUrl, errorMessage)

      return res.status(500).json({
        success: false,
        message: ResponseMessages.RES_MSG_AN_ERROR_OCCURRED_EN,
      })
    }
  }

  loginUser = async (req: Request, res: Response) => {
    /*
     * POST
     *
     * BASE_URL/auth/user/sign-in
     *
     * phoneNumber, password in request body
     */

    const { phoneNumber, password } = req.body

    try {
      const selectPassword = true
      const user = await this.userRepository.findOne(
        { phoneNumber },
        selectPassword
      )

      // check if user exists
      if (!user) {
        return res.status(404).json({
          success: false,
          message: ResponseMessages.RES_MSG_WRONG_CREDENTIALS_EN,
        })
      }

      // compare password hash
      const match = await utils.compareHash(password, user.password!)

      if (!match) {
        return res.status(404).json({
          success: false,
          message: ResponseMessages.RES_MSG_WRONG_CREDENTIALS_EN,
        })
      }

      // check if verified
      if (!user.verified) {
        return res.status(400).json({
          success: false,
          message: ResponseMessages.RES_MSG_USER_NOT_VERIFIED_EN,
        })
      }

      // generate token
      const userObj = { id: user.id, email: user.email }
      const token = utils.generateUserToken(userObj)

      // execlude user password, otp
      const userResponse = this.generateUserResponse(user)

      res.status(200).json({
        success: true,
        token,
        user: userResponse,
      })
    } catch (err) {
      const errorMessage = getErrorMessage(err)
      console.error(errorMessage)
      logger.appendErrorLog(req.originalUrl, errorMessage)

      return res.status(500).json({
        success: false,
        message: ResponseMessages.RES_MSG_AN_ERROR_OCCURRED_EN,
      })
    }
  }

  loginManager = async (req: Request, res: Response) => {
    /*
     * POST
     *
     * BASE_URL/auth/manager/sign-in
     *
     * username, password in request body
     */

    const { username, password } = req.body

    try {
      const selectPassword = true
      const manager = await this.managerRepository.findOne(
        { username },
        selectPassword
      )

      // check if manager exists
      if (!manager) {
        return res.status(404).json({
          success: false,
          message: ResponseMessages.RES_MSG_WRONG_CREDENTIALS_EN,
        })
      }

      // compare password hash
      const match = await utils.compareHash(password, manager.password!)

      if (!match) {
        return res.status(404).json({
          success: false,
          message: ResponseMessages.RES_MSG_WRONG_CREDENTIALS_EN,
        })
      }

      // generate token
      const user = { id: manager.id, username: manager.username }
      const token = utils.generateManagerToken(user)

      // execlude manager password
      const managerResponse = { ...manager, password: undefined }

      res.status(200).json({
        success: true,
        token,
        manager: managerResponse,
      })
    } catch (err) {
      const errorMessage = getErrorMessage(err)
      console.error(errorMessage)
      logger.appendErrorLog(req.originalUrl, errorMessage)

      return res.status(500).json({
        success: false,
        message: ResponseMessages.RES_MSG_AN_ERROR_OCCURRED_EN,
      })
    }
  }

  forgotPassword = async (req: Request, res: Response) => {
    /*
     * POST
     *
     * BASE_URL/auth/forgot-password
     *
     * phoneNumber in req.body
     */

    const phoneNumber = req.body.phoneNumber

    try {
      const query = { phoneNumber }

      const user = await this.userRepository.findOne(query, false)

      if (!user || !user.verified) {
        return res.status(404).json({
          success: false,
          message: ResponseMessages.RES_MSG_USER_NOT_FOUND_EN,
        })
      }

      // user found and verified
      // generate otp code and expiry date
      const otpCode = utils.generateOtpCode()
      const otpExpire = new Date(Date.now() + 1000 * 60 * 15) // 15 minutes

      const saved = await this.userRepository.updateOne({
        id: user.id,
        otpCode,
        otpExpire,
      })

      if (!saved) {
        return res.status(500).json({
          success: false,
          message: ResponseMessages.RES_MSG_AN_ERROR_OCCURRED_EN,
        })
      }

      // send otp code

      const otpResponse: SendOtpResponse =
        await this.otpService.sendVerificationMessage(phoneNumber, otpCode)

      if (!otpResponse.success) {
        return res.status(500).json({
          success: false,
          message: {
            en: otpResponse.error,
            fr: '',
          },
        })
      }

      res.status(200).json({
        success: true,
        message:
          ResponseMessages.RES_MSG_USER_FORGET_PASSWORD_CODE_SENT_SUCCESSFULLY_EN,
        userId: user.id,
      })
    } catch (err) {
      const errorMessage = getErrorMessage(err)
      console.error(errorMessage)
      logger.appendErrorLog(req.originalUrl, errorMessage)

      return res.status(500).json({
        success: false,
        message: ResponseMessages.RES_MSG_AN_ERROR_OCCURRED_EN,
      })
    }
  }

  // helper functions
  private generateUserResponse = (user: UserEntity) => {
    return {
      ...user,
      password: undefined,
      otpCode: undefined,
      otpExpire: undefined,
    }
  }
}
