import Joi from 'joi'
import { Request, Response, NextFunction } from 'express'

const getUsers = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    firstName: Joi.string(),
    lastName: Joi.string(),
    email: Joi.string().email(),
    phoneNumber: Joi.string().pattern(/^[0-9]+$/, 'numbers'),
    page: Joi.number().integer().min(1),
    size: Joi.number().integer().min(1),
  })

  const query = req.query

  const queryError = schema.validate(query).error

  if (queryError) {
    return res.status(406).json({
      error: `Error in user data: ${queryError.message}`,
    })
  } else next()
}

const updateUser = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    firstName: Joi.string(),
    lastName: Joi.string(),
    email: Joi.string().email(),
  })

  const querySchema = Joi.object({ id: Joi.string().required() })

  const payload = req.body
  const query = req.params

  const bodyError = schema.validate(payload).error
  const queryError = querySchema.validate(query).error

  if (bodyError || queryError) {
    return res.status(406).json({
      error: `Error in user data: ${
        bodyError ? bodyError.message : queryError?.message
      }`,
    })
  } else next()
}

const updateUserProfile = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    firstName: Joi.string(),
    lastName: Joi.string(),
    email: Joi.string().email(),
    fcmToken: Joi.string(),
  })

  const querySchema = Joi.object({ id: Joi.string().required() })

  const payload = req.body
  const query = req.params

  const bodyError = schema.validate(payload).error
  const queryError = querySchema.validate(query).error

  if (bodyError || queryError) {
    return res.status(406).json({
      error: `Error in user data: ${
        bodyError ? bodyError.message : queryError?.message
      }`,
    })
  } else next()
}

const verifyAccount = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    code: Joi.string().required(),
  })

  const querySchema = Joi.object({ id: Joi.string().required() })

  const payload = req.body
  const query = req.params

  const bodyError = schema.validate(payload).error
  const queryError = querySchema.validate(query).error

  if (bodyError || queryError) {
    return res.status(406).json({
      error: `Error in user data: ${
        bodyError ? bodyError.message : queryError?.message
      }`,
    })
  } else next()
}

const resetPassword = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    code: Joi.string().required(),
    password: Joi.string().min(8).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
  })

  const querySchema = Joi.object({ id: Joi.string().required() })

  const payload = req.body
  const query = req.params

  const bodyError = schema.validate(payload).error
  const queryError = querySchema.validate(query).error

  if (bodyError || queryError) {
    return res.status(406).json({
      error: `Error in user data: ${
        bodyError ? bodyError.message : queryError?.message
      }`,
    })
  } else next()
}

const resendOtpCode = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    userId: Joi.string().required(),
  })

  const payload = req.body

  const error = schema.validate(payload).error

  if (error) {
    return res.status(406).json({
      error: `Error in user data: ${error}`,
    })
  } else next()
}

export default {
  getUsers,
  updateUser,
  updateUserProfile,
  verifyAccount,
  resetPassword,
  resendOtpCode,
}
