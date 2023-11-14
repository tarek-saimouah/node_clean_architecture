import { NextFunction, Request, Response } from 'express'

import ResponseMessages from '../../core/utils/constants'
import utils from '../../core/utils/util'
import { container } from '../../di/container'
import { Types } from '../../di/types'
import IUserRepo from '../../domain/repositories/userRepo'

const userRepository: IUserRepo = container.get<IUserRepo>(Types.IUserRepo)

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  // check manager token
  const managerToken: string | undefined = req
    .header('admin-access-token')
    ?.replace('Bearer ', '')

  if (managerToken) {
    try {
      const decoded = utils.decodeUserToken(managerToken)
      req.manager = decoded
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: ResponseMessages.RES_MSG_INVALID_TOKEN_EN,
      })
    }
    return next()
  }

  // check user token
  const userToken: string | undefined = req
    .header('x-access-token')
    ?.replace('Bearer ', '')

  if (userToken) {
    try {
      const decoded = utils.decodeUserToken(userToken)
      req.user = decoded

      const user = await userRepository.findById(decoded.id!)

      if (!user) {
        return res.status(401).json({
          success: false,
          message: ResponseMessages.RES_MSG_INVALID_TOKEN_EN,
        })
      }
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: ResponseMessages.RES_MSG_INVALID_TOKEN_EN,
      })
    }
    return next()
  }

  // token not provided
  return res.status(401).json({
    success: false,
    message: ResponseMessages.RES_MSG_INVALID_TOKEN_EN,
  })
}

export default verifyToken
