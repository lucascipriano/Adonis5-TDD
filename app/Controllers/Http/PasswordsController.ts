import Mail from '@ioc:Adonis/Addons/Mail'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class PasswordsController {
  public async forgotPassword({ response, request }: HttpContextContract) {
    const { email } = request.only(['email'])
    await Mail.send((message) => {
      message
        .from('no-replay@apilucas.com')
        .to(email)
        .subject('Recuperação de senha')
        .text('Clique no link a baixo para redefinir a senha')
    })
    return response.noContent()
  }
}
