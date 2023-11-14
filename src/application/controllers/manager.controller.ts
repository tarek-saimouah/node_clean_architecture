import { Request, Response } from 'express'
import { container } from '../../di/container'
import { Types } from '../../di/types'
import { getErrorMessage } from '../../core/utils/errorHandler'
import ResponseMessages from '../../core/utils/constants'
import logger from '../../core/utils/logger'
import utils from '../../core/utils/util'
import IManagerRepo from '../../domain/repositories/managerRepo'

const repository: IManagerRepo = container.get<IManagerRepo>(Types.IManagerRepo)

const createManager = async (req: Request, res: Response) => {
  /*
   * POST
   *
   * BASE_URL/manager
   *
   * manager in request body
   */

  const { username, password } = req.body
  try {
    // check if manager exists

    const exists = await repository.isExists(username)

    if (exists) {
      return res.status(409).json({
        success: false,
        message: ResponseMessages.RES_MSG_MANAGER_ALREADY_EXISTS_EN,
      })
    }

    const hash = await utils.generateHash(password)
    const payload = { ...req.body, password: hash }

    const manager = await repository.create(payload)

    if (!manager) {
      return res.status(500).json({
        success: false,
        message: ResponseMessages.RES_MSG_AN_ERROR_OCCURRED_EN,
      })
    }

    // execlude manager password
    const managerResponse = { ...manager, password: undefined }

    res.status(201).json({
      success: true,
      message: ResponseMessages.RES_MSG_MANAGER_CREATED_SUCCESSFULLY_EN,
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

const login = async (req: Request, res: Response) => {
  /*
   * POST
   *
   * BASE_URL/manager/sign-in
   *
   * username, password in request body
   */

  const { username, password } = req.body

  try {
    const selectPassword = true
    const manager = await repository.findOne({ username }, selectPassword)

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

const findAllManagers = async (req: Request, res: Response) => {
  /*
   * GET
   *
   * BASE_URL/manager
   *
   */

  try {
    const managers = await repository.findAll({})

    res.status(200).json({
      success: true,
      totalResults: managers.length,
      results: managers,
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

const getManager = async (req: Request, res: Response) => {
  /*
   * GET
   *
   * BASE_URL/manager/{id}
   *
   */

  try {
    const id = req.params.id

    const manager = await repository.findById(id)

    if (!manager) {
      return res.status(404).json({
        success: false,
        message: ResponseMessages.RES_MSG_MANAGER_NOT_FOUND_EN,
      })
    }

    res.status(200).json({
      success: true,
      manager,
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

const deleteManagerById = async (req: Request, res: Response) => {
  /*
   * Delete
   *
   * BASE_URL/manager/{id}
   *
   */

  try {
    const id = req.params.id

    const deleted = await repository.deleteOne({ id })
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: ResponseMessages.RES_MSG_MANAGER_NOT_FOUND_EN,
      })
    }

    res.status(200).json({
      success: true,
      message: ResponseMessages.RES_MSG_MANAGER_DELETED_SUCCESSFULLY_EN,
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

const updateManager = async (req: Request, res: Response) => {
  /*
   * PATCH
   *
   * BASE_URL/manager/{id}
   *
   * updates in req.body
   *
   */

  try {
    const updates = req.body
    const id = req.params.id

    // check if updated username exists
    if (updates.username) {
      const exists = await repository.isExists(updates.username, id)

      if (exists) {
        return res.status(409).json({
          success: false,
          message: ResponseMessages.RES_MSG_MANAGER_ALREADY_EXISTS_EN,
        })
      }
    }

    const updatedManager = await repository.updateOne({ ...updates, id })

    if (!updatedManager) {
      return res.status(404).json({
        success: false,
        message: ResponseMessages.RES_MSG_MANAGER_NOT_FOUND_EN,
      })
    }

    res.status(201).json({
      success: true,
      manager: updatedManager,
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

export default {
  createManager,
  login,
  findAllManagers,
  getManager,
  deleteManagerById,
  updateManager,
}
