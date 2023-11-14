import { Request, Response } from 'express'
import { Types } from '../../di/types'
import { getErrorMessage } from '../../core/utils/errorHandler'
import ResponseMessages from '../../core/utils/constants'
import logger from '../../core/utils/logger'
import utils from '../../core/utils/util'
import IUserRepo from '../../domain/repositories/userRepo'
import { UserEntity } from '../../domain/entities/user.entity'
import OtpService, { SendOtpResponse } from '../otp/otp.service'
import { inject, injectable } from 'inversify'

@injectable()
export default class UserController {
  constructor(
    @inject(Types.IUserRepo)
    private repository: IUserRepo,
    @inject(Types.OtpService)
    private otpService: OtpService
  ) {}

  findAllUsers = async (req: Request, res: Response) => {
    /*
     * GET
     *
     * BASE_URL/user
     *
     * page, size in req.query
     *
     */

    try {
      const { page = 1, size = 50, ...query } = req.query

      const count = await this.repository.count(query)
      const totalPages = Math.ceil(count / +size)

      if (count === 0) {
        return res.status(200).json({
          success: true,
          totalPages: 0,
          page: 0,
          pageResults: 0,
          totalResults: 0,
          results: [],
        })
      }

      if (page > totalPages) {
        return res.status(400).json({
          success: false,
          message: ResponseMessages.RES_MSG_PAGE_OUT_OF_BOUNDS_EN,
        })
      }

      const { limit, offset } = utils.computeLimitAndOffset(+page, +size)

      const users = await this.repository.findPaging(query, offset, limit)

      const responseUsers = users.map((user) => this.generateUserResponse(user))

      res.status(200).json({
        success: true,
        totalPages,
        page: +page,
        pageResults: users.length,
        totalResults: count,
        results: responseUsers,
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

  getUser = async (req: Request, res: Response) => {
    /*
     * GET
     *
     * BASE_URL/user/{id}
     *
     */

    try {
      const id = req.params.id

      const user = await this.repository.findById(id)

      if (!user) {
        return res.status(404).json({
          success: false,
          message: ResponseMessages.RES_MSG_USER_NOT_FOUND_EN,
        })
      }

      res.status(200).json({
        success: true,
        user,
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

  deleteUserById = async (req: Request, res: Response) => {
    /*
     * Delete
     *
     * BASE_URL/user/{id}
     *
     */

    try {
      const id = req.params.id

      const deleted = await this.repository.deleteOne({ id })

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: ResponseMessages.RES_MSG_USER_NOT_FOUND_EN,
        })
      }

      res.status(200).json({
        success: true,
        message: ResponseMessages.RES_MSG_USER_DELETED_SUCCESSFULLY_EN,
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

  updateUser = async (req: Request, res: Response) => {
    /*
     * PATCH
     *
     * BASE_URL/user/{id}
     *
     * updates in req.body
     *
     */

    try {
      const updates = req.body
      const id = req.params.id

      // check if updated email exists
      if (updates.email) {
        const exists = await this.repository.isExists(
          updates.email,
          undefined,
          id
        )

        if (exists) {
          return res.status(409).json({
            success: false,
            message: ResponseMessages.RES_MSG_USER_EMAIL_ALREADY_EXISTS_EN,
          })
        }
      }

      const updatedUser = await this.repository.updateOne({ ...updates, id })

      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: ResponseMessages.RES_MSG_USER_NOT_FOUND_EN,
        })
      }

      res.status(201).json({
        success: true,
        message: ResponseMessages.RES_MSG_USER_UPDATED_SUCCESSFULLY_EN,
        user: updatedUser,
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

  updateUserProfile = async (req: Request, res: Response) => {
    /*
     * PATCH
     *
     * BASE_URL/user/{id}/profile
     *
     * updates in req.body
     *
     */

    try {
      const updates = req.body
      const id = req.params.id
      const requesterId = req.user?.id

      if (requesterId !== id) {
        return res.status(400).json({
          success: false,
          message: ResponseMessages.RES_MSG_UNAUTHORIZED_CLIENT_EN,
        })
      }

      // check if updated email exists
      if (updates.email) {
        const exists = await this.repository.isExists(
          updates.email,
          undefined,
          id
        )

        if (exists) {
          return res.status(409).json({
            success: false,
            message: ResponseMessages.RES_MSG_USER_EMAIL_ALREADY_EXISTS_EN,
          })
        }
      }

      const updatedUser = await this.repository.updateOne({ ...updates, id })

      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: ResponseMessages.RES_MSG_USER_NOT_FOUND_EN,
        })
      }

      res.status(201).json({
        success: true,
        message: ResponseMessages.RES_MSG_USER_UPDATED_SUCCESSFULLY_EN,
        user: updatedUser,
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

  verifyAccount = async (req: Request, res: Response) => {
    /*
     * PATCH
     *
     * BASE_URL/user/{id}/verify-account
     *
     * code in req.body
     *
     */

    try {
      const code = req.body.code
      const id = req.params.id

      const user = await this.repository.findById(id)

      if (!user) {
        return res.status(404).json({
          success: false,
          message: ResponseMessages.RES_MSG_USER_NOT_FOUND_EN,
        })
      }

      // check for expiration
      if (!user.otpExpire || new Date() > new Date(user.otpExpire)) {
        // reset code and expire
        const updates = { id, otpCode: null, otpExpire: null }
        await this.repository.updateOne(updates)

        return res.status(400).json({
          success: false,
          message: ResponseMessages.RES_MSG_USER_OTP_WRONG_EN,
        })
      }

      // check for code match
      const match = user.otpCode === code

      if (!match) {
        // wrong code
        return res.status(400).json({
          success: false,
          message: ResponseMessages.RES_MSG_USER_OTP_WRONG_EN,
        })
      }

      const updates = { id, verified: true, otpCode: null, otpExpire: null }

      const updatedUser = await this.repository.updateOne({ ...updates, id })

      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: ResponseMessages.RES_MSG_USER_NOT_FOUND_EN,
        })
      }

      // generate token
      const userObj = { id: user.id, email: user.email }
      const token = utils.generateUserToken(userObj)

      res.status(201).json({
        success: true,
        message: ResponseMessages.RES_MSG_USER_UPDATED_SUCCESSFULLY_EN,
        token,
        user: updatedUser,
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

  resendOtpCode = async (req: Request, res: Response) => {
    /*
     * POST
     *
     * BASE_URL/user/resend-code
     *
     * userId in req.body
     */

    const userId = req.body.userId

    try {
      const user = await this.repository.findById(userId)

      if (!user) {
        return res.status(404).json({
          success: false,
          message: ResponseMessages.RES_MSG_USER_NOT_FOUND_EN,
        })
      }

      // generate otp code and expiry date
      const otpCode = utils.generateOtpCode()
      const otpExpire = new Date(Date.now() + 1000 * 60 * 15) // 15 minutes

      const saved = await this.repository.updateOne({
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
        await this.otpService.sendVerificationMessage(user.phoneNumber, otpCode)

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
        message: ResponseMessages.RES_MSG_USER_CODE_SENT_SUCCESSFULLY_EN,
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

  resetPassword = async (req: Request, res: Response) => {
    /*
     * PATCH
     *
     * BASE_URL/user/{id}/reset-password
     *
     * code, password in req.body
     */

    const { code, password } = req.body
    const id = req.params.id

    try {
      const user = await this.repository.findById(id)

      if (!user || !user.verified) {
        return res.status(404).json({
          success: false,
          message: ResponseMessages.RES_MSG_USER_NOT_FOUND_EN,
        })
      }

      // check for expiration
      if (!user.otpExpire || new Date() > new Date(user.otpExpire)) {
        // reset code and expire
        const updates = { id: user.id, otpCode: null, otpExpire: null }

        await this.repository.updateOne(updates)

        return res.status(400).json({
          success: false,
          message: ResponseMessages.RES_MSG_USER_OTP_WRONG_EN,
        })
      }

      // check for code match
      const match = user.otpCode === code

      if (!match) {
        // wrong code
        return res.status(400).json({
          success: false,
          message: ResponseMessages.RES_MSG_USER_OTP_WRONG_EN,
        })
      }

      // generate password hash
      const hash = await utils.generateHash(password)

      const updates = {
        id: user.id,
        password: hash,
        otpCode: null,
        otpExpire: null,
      }

      const updated = await this.repository.updateOne(updates)

      if (!updated) {
        return res.status(500).json({
          success: false,
          message: ResponseMessages.RES_MSG_AN_ERROR_OCCURRED_EN,
        })
      }

      res.status(201).json({
        success: true,
        message: ResponseMessages.RES_MSG_USER_UPDATED_SUCCESSFULLY_EN,
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

  deleteUserAccount = async (req: Request, res: Response) => {
    /*
     * DELETE
     *
     * BASE_URL/user/account
     *
     * phoneNumber, password in request body
     */

    const { phoneNumber, password } = req.body
    const decodedUser = req.user

    try {
      const selectPassword = true
      const user = await this.repository.findOne(
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

      // check if requester user is same found user

      if (user.id !== decodedUser?.id) {
        return res.status(404).json({
          success: false,
          message: ResponseMessages.RES_MSG_WRONG_CREDENTIALS_EN,
        })
      }

      const deleted = await this.repository.deleteOne({ id: user.id })

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: ResponseMessages.RES_MSG_USER_NOT_FOUND_EN,
        })
      }

      res.status(200).json({
        success: true,
        message: ResponseMessages.RES_MSG_USER_DELETED_SUCCESSFULLY_EN,
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
