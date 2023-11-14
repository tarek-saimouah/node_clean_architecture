export class OtpService {
  private static INSTANCE: OtpService | null = null

  constructor() {}

  static getInstance() {
    if (!this.INSTANCE) {
      this.INSTANCE = new OtpService()
    }

    return this.INSTANCE
  }

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
