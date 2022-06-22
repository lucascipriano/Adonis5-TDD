import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequestException from 'App/Exceptions/BadRequestException'
import User from 'App/Models/User'

export default class UsersController {
  public async store({ request, response }: HttpContextContract) {
    const userPayload = request.only(['username', 'email', 'password', 'avatar'])
    if (!userPayload.email || !userPayload.username || !userPayload.password) {
      throw new BadRequestException('Dados inválidos', 422)
    }

    const userByEmail = await User.findBy('email', userPayload.email)
    const userByUsername = await User.findBy('username', userPayload.username)
    if (userByEmail) throw new BadRequestException('Email já em uso', 409)
    if (userByUsername) throw new BadRequestException('Usuário já em uso', 409)
    const user = await User.create(userPayload)

    return response.created({ user })
  }
}
