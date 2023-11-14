import { NextFunction, Request, Response } from 'express'
import IManagerRepo from '../../../domain/repositories/managerRepo'
import { container } from '../../../di/container'
import { Types } from '../../../di/types'
import ResponseMessages from '../../../core/utils/constants'
import logger from '../../../core/utils/logger'
import { getErrorMessage } from '../../../core/utils/errorHandler'
import { Role } from '../../../core/enums/roles.enum'

const managerRepository: IManagerRepo = container.get<IManagerRepo>(
  Types.IManagerRepo
)

const managerAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // check requester manager role, just 'Manager' can perform this operation
    if (!req.manager) {
      return res.status(401).json({
        success: false,
        message: ResponseMessages.RES_MSG_UNAUTHORIZED_CLIENT_EN,
      })
    }

    const manager = await managerRepository.findById(req.manager.id!!)

    if (!manager) {
      return res.status(401).json({ error: 'Unauthorized client.' })
    }

    if (manager.role !== Role.MANAGER) {
      return res.status(403).json({
        success: false,
        message: ResponseMessages.RES_MSG_UNAUTHORIZED_CLIENT_EN,
      })
    }

    // requester manager is authorized
    next()
  } catch (err: unknown) {
    const errorMessage = getErrorMessage(err)
    console.error(errorMessage)
    logger.appendErrorLog(req.originalUrl, errorMessage)

    return res.status(500).json({
      success: false,
      message: ResponseMessages.RES_MSG_UNAUTHORIZED_CLIENT_EN,
    })
  }
}

const directorAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // check requester manager role, just 'Manager'. 'Director' can perform this operation
    if (!req.manager) {
      return res.status(401).json({
        success: false,
        message: ResponseMessages.RES_MSG_UNAUTHORIZED_CLIENT_EN,
      })
    }

    const manager = await managerRepository.findById(req.manager.id!!)

    if (!manager) {
      return res.status(401).json({
        success: false,
        message: ResponseMessages.RES_MSG_UNAUTHORIZED_CLIENT_EN,
      })
    }

    if (manager.role !== Role.MANAGER && manager.role !== Role.DIRECTOR) {
      return res.status(403).json({
        success: false,
        message: ResponseMessages.RES_MSG_UNAUTHORIZED_CLIENT_EN,
      })
    }

    // requester manager is authorized
    next()
  } catch (err: unknown) {
    const errorMessage = getErrorMessage(err)
    console.error(errorMessage)
    logger.appendErrorLog(req.originalUrl, errorMessage)

    return res.status(500).json({
      success: false,
      message: ResponseMessages.RES_MSG_UNAUTHORIZED_CLIENT_EN,
    })
  }
}

const MonitorAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // check requester manager role, just 'Manager', 'Director', 'Monitor' can perform this operation
    if (!req.manager) {
      return res.status(401).json({
        success: false,
        message: ResponseMessages.RES_MSG_UNAUTHORIZED_CLIENT_EN,
      })
    }

    const manager = await managerRepository.findById(req.manager.id!!)

    if (!manager) {
      return res.status(401).json({ error: 'Unauthorized client.' })
    }

    if (
      manager.role !== Role.MANAGER &&
      manager.role !== Role.DIRECTOR &&
      manager.role !== Role.MONITOR
    ) {
      return res.status(403).json({
        success: false,
        message: ResponseMessages.RES_MSG_UNAUTHORIZED_CLIENT_EN,
      })
    }

    // requester manager is authorized
    next()
  } catch (err: unknown) {
    const errorMessage = getErrorMessage(err)
    console.error(errorMessage)
    logger.appendErrorLog(req.originalUrl, errorMessage)

    return res.status(500).json({
      success: false,
      message: ResponseMessages.RES_MSG_UNAUTHORIZED_CLIENT_EN,
    })
  }
}

export default {
  managerAuth,
  directorAuth,
  MonitorAuth,
}
