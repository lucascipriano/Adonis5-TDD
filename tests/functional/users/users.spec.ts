import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'

test.group('User', (group) => {
  // Iniciar migration e no final deletar, para não dar ruim
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })
  test('Criação do usuário', async ({ client, assert }) => {
    const userPayload = {
      email: 'test@test.com',
      username: 'test',
      password: 'test',
      avatar: 'http://avatar.com/avatar/avatar.png',
    }
    const response = await client.post('/users').json(userPayload)
    const { password, avatar, ...expected } = userPayload

    response.assertBodyContains({ user: expected })

    response.assertStatus(201)
    assert.exists(response.body().user.password, 'existe')
  })
})
