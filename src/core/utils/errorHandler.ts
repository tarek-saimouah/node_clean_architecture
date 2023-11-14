export const getErrorMessage = (e: unknown): string => {
  let message: string = ''

  if (typeof e === 'string') {
    message = e.toUpperCase() // works, `e` narrowed to string
  } else if (e instanceof Error) {
    message = e.message // works, `e` narrowed to Error
  }

  return message
}

export const getErrorCode = (e: unknown): string => {
  let code: string = ''
  if (e instanceof Error) {
    code = e.code // works, `e` narrowed to Error
  }

  return code
}
