import { injectable } from 'inversify'

@injectable()
export default class OtpService {
  constructor() {}

  async sendVerificationMessage(
    phoneNumber: string,
    code: string
  ): Promise<SendOtpResponse> {
    try {
      return { success: true, error: null }
    } catch (err) {
      throw err
    }
  }
}

export type SendOtpResponse = { success: boolean; error?: string | null }
