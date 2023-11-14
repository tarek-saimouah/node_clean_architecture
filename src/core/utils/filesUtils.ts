import fsPromises from 'fs/promises'
import fs from 'fs'
import Constants from './constants'
import { getErrorCode, getErrorMessage } from './errorHandler'

const countDirFiles = async (path: string) => {
  try {
    const dir = await fsPromises.readdir(path)
    return dir.length
  } catch (err: unknown) {
    const errorMessage = getErrorMessage(err)
    console.error(errorMessage)
    throw new Error(errorMessage)
  }
}

const moveFile = async (oldPath: string, newPath: string): Promise<boolean> => {
  try {
    // copy file to destination
    await copyFile(oldPath, newPath)
    // delete file from original
    await deleteFileIfExists(oldPath)
    return Promise.resolve(true)
  } catch (err: unknown) {
    const errorMessage = getErrorMessage(err)
    console.error(errorMessage)
    return Promise.resolve(false)
  }
}

const copyFile = async (src: string, dest: string): Promise<boolean> => {
  try {
    await fsPromises.copyFile(src, dest)
    return Promise.resolve(true)
  } catch (err: unknown) {
    const errorMessage = getErrorMessage(err)
    console.error(errorMessage)
    return Promise.resolve(false)
  }
}

const deleteFileIfExists = async (path: string): Promise<boolean> => {
  try {
    await fsPromises.unlink(path)
    return Promise.resolve(true)
  } catch (err: unknown) {
    const errorMessage = getErrorMessage(err)
    console.error(errorMessage)
    return Promise.resolve(false)
  }
}

const deleteDirectory = async (path: string): Promise<boolean> => {
  try {
    await fsPromises.rm(path, { recursive: true })
    return Promise.resolve(true)
  } catch (err: unknown) {
    const errorMessage = getErrorMessage(err)
    console.error(errorMessage)
    return Promise.resolve(false)
  }
}

const moveFiles = async (
  oldDirPath: string,
  newDirPath: string
): Promise<boolean> => {
  try {
    const files = await fsPromises.readdir(oldDirPath)
    files.forEach(async (file) => {
      const fileFullPath = `${oldDirPath}/${file}`
      const newFileFullPath = `${newDirPath}/${file}`
      // copy file to destination
      await copyFile(fileFullPath, newFileFullPath)
      // delete file from original
      await deleteFileIfExists(fileFullPath)
    })

    return Promise.resolve(true)
  } catch (err: unknown) {
    const errorMessage = getErrorMessage(err)
    console.error(errorMessage)
    return Promise.resolve(false)
  }
}

const emptyFolder = async (dirPath: string): Promise<boolean> => {
  try {
    const files = await fsPromises.readdir(dirPath)
    files.forEach(async (file) => {
      const fileFullPath = `${dirPath}/${file}`
      await deleteFileIfExists(fileFullPath)
    })
    return Promise.resolve(true)
  } catch (err: unknown) {
    const errorMessage = getErrorMessage(err)
    console.error(errorMessage)

    return Promise.resolve(false)
  }
}

const deleteAllImagesInFolder = async (dirPath: string): Promise<boolean> => {
  try {
    const files = await fsPromises.readdir(dirPath)
    files.forEach(async (file) => {
      const extension = getFileExtension(file)

      if (extension === 'png' || extension === 'jpg') {
        const fileFullPath = `${dirPath}/${file}`

        await deleteFileIfExists(fileFullPath)
      }
    })
    return Promise.resolve(true)
  } catch (err: unknown) {
    const errorMessage = getErrorMessage(err)
    console.error(errorMessage)

    return Promise.resolve(false)
  }
}

const createDirectory = async (
  path: string,
  recursive: boolean
): Promise<boolean> => {
  try {
    await fsPromises.mkdir(path, { recursive })
    return Promise.resolve(true)
  } catch (err) {
    if (getErrorCode(err) === 'EEXIST') {
      return Promise.resolve(true)
    }
    console.error(`Failed to create directory: ${path}`)
    return Promise.reject(err)
  }
}

const createLogDirectoryIfNotExists = async (): Promise<boolean> => {
  const path = Constants.LOG_BASE_DIR

  try {
    await fsPromises.mkdir(path, { recursive: true })
    return Promise.resolve(true)
  } catch (err) {
    if (getErrorCode(err) === 'EEXIST') {
      return Promise.resolve(true)
    }
    console.error(`Failed to create directory: ${path}`)
    return Promise.resolve(false)
  }
}

const isDirExists = async (path: string): Promise<boolean> => {
  try {
    if (fs.existsSync(path)) return Promise.resolve(true)
    else return Promise.resolve(false)
  } catch (err: unknown) {
    const errorMessage = getErrorMessage(err)
    console.error(errorMessage)
    return Promise.resolve(false)
  }
}

const isFileExists = async (path: string): Promise<boolean> => {
  try {
    if (fs.existsSync(path)) return Promise.resolve(true)
    else return Promise.resolve(false)
  } catch (err: unknown) {
    const errorMessage = getErrorMessage(err)
    console.error(errorMessage)
    return Promise.resolve(false)
  }
}

const renameDir = async (
  oldPath: string,
  newPath: string
): Promise<boolean> => {
  try {
    await fsPromises.rename(oldPath, newPath)
    return Promise.resolve(true)
  } catch (err: unknown) {
    const errorMessage = getErrorMessage(err)
    console.error(errorMessage)
    return Promise.resolve(false)
  }
}

const renameFile = async (
  oldPath: string,
  newPath: string
): Promise<boolean> => {
  try {
    await fsPromises.rename(oldPath, newPath)
    return Promise.resolve(true)
  } catch (err: unknown) {
    const errorMessage = getErrorMessage(err)
    console.error(errorMessage)
    return Promise.resolve(false)
  }
}

const writeImageFile = async (path: string, data: string): Promise<boolean> => {
  try {
    await fsPromises.writeFile(path, data)
    return Promise.resolve(true)
  } catch (err: unknown) {
    const errorMessage = getErrorMessage(err)
    console.error(errorMessage)
    return Promise.resolve(false)
  }
}

const getFileExtension = (fileName: string) => {
  return fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length)
}

const getFileNameFromUrl = (url: string) => {
  const fileName = url.substring(url.lastIndexOf('/') + 1, url.length)
  return fileName
}

const getFileDirectoryPathFromUrl = (url: string) => {
  const dirPath = url.substring(0, url.lastIndexOf('/'))
  return dirPath
}

// json data utils

const writeJsonData = async (path: string, data: {}) => {
  try {
    const dataString = JSON.stringify(data, null, 2)
    await fsPromises.writeFile(path, dataString)
    return Promise.resolve(true)
  } catch (err: unknown) {
    const errorMessage = getErrorMessage(err)
    console.error(errorMessage)
    return Promise.resolve(false)
  }
}

const readJsonData = async (path: string) => {
  try {
    const data = (await fsPromises.readFile(path)).toString()
    const parsed = JSON.parse(data)
    return Promise.resolve(parsed)
  } catch (err: unknown) {
    const errorMessage = getErrorMessage(err)
    console.error(errorMessage)
    return Promise.resolve(false)
  }
}

export default {
  countDirFiles,
  moveFile,
  moveFiles,
  deleteFileIfExists,
  deleteDirectory,
  copyFile,
  emptyFolder,
  deleteAllImagesInFolder,
  createDirectory,
  isDirExists,
  renameDir,
  renameFile,
  getFileExtension,
  getFileNameFromUrl,
  getFileDirectoryPathFromUrl,
  writeJsonData,
  readJsonData,
  isFileExists,
  createLogDirectoryIfNotExists,
  writeImageFile,
}
