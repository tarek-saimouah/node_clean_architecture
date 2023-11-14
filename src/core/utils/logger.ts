import filesUtils from './filesUtils'
import Constants from './constants'
import fs from 'fs'
import { getErrorMessage } from './errorHandler'

const LOG_BASE_DIR = Constants.LOG_BASE_DIR

const appendErrorLog = async (apiRoute: string, errorMessage: string) => {
  try {
    const dirCreated = await filesUtils.createLogDirectoryIfNotExists()
    if (!dirCreated) {
      console.error(
        `Failed to append error log, path ${LOG_BASE_DIR} not exists.`
      )
      return
    }

    const errorLog = `${new Date().toISOString()} ${apiRoute}\n${errorMessage}\n`
    fs.appendFile(`${LOG_BASE_DIR}/api.log`, errorLog, (err) => {
      if (err) console.log('Failed to append error log,', err)
    })
  } catch (err: unknown) {
    const errorMessage = getErrorMessage(err)
    console.error('Failed to append error log', errorMessage)
  }
}

export default { appendErrorLog }
