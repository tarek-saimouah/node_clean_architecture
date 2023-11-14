import Joi from 'joi'
import { Request, Response, NextFunction } from 'express'
import { Role } from '../../../core/enums/roles.enum'

const createManager = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    username: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
    role: Joi.string()
      .valid(Role.MANAGER, Role.DIRECTOR, Role.MONITOR)
      .required(),
    phoneNumber: Joi.string()
      .pattern(/^[0-9]+$/, 'numbers')
      .required(),
  })

  const payload = req.body

  const { error } = schema.validate(payload)

  if (error) {
    return res.status(406).json({
      error: `Error in manager data: ${error.message}`,
    })
  } else next()
}

const getManagers = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    username: Joi.string().email(),
    role: Joi.string().valid('Manager', 'Director', 'Monitor'),
    phoneNumber: Joi.string().pattern(/^[0-9]+$/, 'numbers'),
  })

  const query = req.query

  const queryError = schema.validate(query).error

  if (queryError) {
    return res.status(406).json({
      error: `Error in manager data: ${queryError.message}`,
    })
  } else next()
}

const updateManager = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    username: Joi.string().email().required(),
    role: Joi.string()
      .valid(Role.MANAGER, Role.DIRECTOR, Role.MONITOR)
      .required(),
    phoneNumber: Joi.string()
      .pattern(/^[0-9]+$/, 'numbers')
      .required(),
  })

  const querySchema = Joi.object({ id: Joi.string().required() })

  const payload = req.body
  const query = req.params

  const bodyError = schema.validate(payload).error
  const queryError = querySchema.validate(query).error

  if (bodyError || queryError) {
    return res.status(406).json({
      error: `Error in manager data: ${
        bodyError ? bodyError.message : queryError?.message
      }`,
    })
  } else next()
}

export default {
  createManager,
  getManagers,
  updateManager,
}
