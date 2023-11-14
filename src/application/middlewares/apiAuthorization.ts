import { NextFunction, Request, Response } from 'express'
import ResponseMessages from '../../core/utils/constants'

import config from '../../config'

const verifyAuthorization = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // check for 'Authorization-Key' header
  const authorizationKey = req.header('Authorization-Key')

  // check if authorizationKey provided
  if (!authorizationKey || authorizationKey !== config.AUTHORIZATION_KEY) {
    return res.status(401).json({
      success: false,
      message: ResponseMessages.RES_MSG_UNAUTHORIZED_CLIENT_EN,
    })
  }

  next()
}

export default verifyAuthorization
