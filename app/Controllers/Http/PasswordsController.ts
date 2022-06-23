import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class PasswordsController {
  public async forgotPassword({ response }: HttpContextContract) {
    return response.noContent()
  }
}
