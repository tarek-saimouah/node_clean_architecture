import Joi from 'joi'
import { Request, Response, NextFunction } from 'express'

const idParam = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({ id: Joi.string().required() })

  const params = req.params

  const paramError = schema.validate(params).error

  if (paramError) {
    return res.status(406).json({
      error: `Error in params data: ${paramError.message}`,
    })
  } else next()
}

const pagingQuery = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    page: Joi.number().integer().min(1),
    size: Joi.number().integer().min(1),
  })

  const query = req.query

  const error = schema.validate(query).error

  if (error) {
    return res.status(406).json({
      error: `Error in query data: ${error.message}`,
    })
  } else next()
}

const startDateEndDateQuery = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema = Joi.object({
    startDate: Joi.date().required(),
    endDate: Joi.date().min(Joi.ref('startDate')).required(),
  })

  const payload = req.query

  const error = schema.validate(payload).error

  if (error) {
    return res.status(406).json({
      error: `Error in report data: ${error.message}`,
    })
  } else next()
}

export default { idParam, pagingQuery, startDateEndDateQuery }
