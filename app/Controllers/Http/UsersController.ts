import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequestException from 'App/Exceptions/BadRequestException'
import User from 'App/Models/User'

export default class UsersController {
  public async store({ request, response }: HttpContextContract) {
    const userPayload = request.only(['username', 'email', 'password', 'avatar'])
    const userByemail = await User.findBy('email', userPayload.email)
    if (userByemail) throw new BadRequestException('Email já em uso', 409)
    const user = await User.create(userPayload)

    return response.created({ user })
  }
}
