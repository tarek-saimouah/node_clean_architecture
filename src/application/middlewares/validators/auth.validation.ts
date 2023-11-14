import Joi from 'joi'
import { Request, Response, NextFunction } from 'express'

const userSignup = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
    phoneNumber: Joi.string()
      .pattern(/^[0-9]+$/, 'numbers')
      .required(),
  })

  const payload = req.body

  const { error } = schema.validate(payload)

  if (error) {
    return res.status(406).json({
      error: `Error in user data: ${error.message}`,
    })
  } else next()
}

const userLogin = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    phoneNumber: Joi.string()
      .pattern(/^[0-9]+$/, 'numbers')
      .required(),
    password: Joi.string().required(),
  })

  const payload = req.body

  const { error } = schema.validate(payload)

  if (error) {
    return res.status(406).json({
      error: `Error in user data: ${error.message}`,
    })
  } else next()
}

const forgotPassword = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    phoneNumber: Joi.string()
      .pattern(/^[0-9]+$/, 'numbers')
      .required(),
  })

  const payload = req.body

  const { error } = schema.validate(payload)

  if (error) {
    return res.status(406).json({
      error: `Error in user data: ${error.message}`,
    })
  } else next()
}

const managerLogin = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  })

  const payload = req.body

  const { error } = schema.validate(payload)

  if (error) {
    return res.status(406).json({
      error: `Error in manager data: ${error.message}`,
    })
  } else next()
}

export default {
  userSignup,
  userLogin,
  forgotPassword,
  managerLogin,
}
