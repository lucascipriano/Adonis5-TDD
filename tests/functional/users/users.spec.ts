import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { UserFactory } from 'Database/factories'

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
      password: 'test22',
      avatar: 'http://avatar.com/avatar/avatar.png',
    }
    const response = await client.post('/users').json(userPayload)
    const { password, avatar, ...expected } = userPayload

    response.assertBodyContains({ user: expected })

    response.assertStatus(201)
    assert.notExists(response.body().user.password, 'Passowrd Defined')
  })
  test('Erro 409 caso email esteja em uso', async ({ client, assert }) => {
    const { email } = await UserFactory.create()
    const response = await client.post('/users').json({
      username: 'test',
      email,
      password: 'password',
      avatar: 'https://avatar.com/avatar/avatar',
    })
    response.assertStatus(409)

    assert.exists(response.body().message)
    assert.exists(response.body().code)
    assert.exists(response.body().status)
    assert.exists(response.body().message, 'email')
    assert.equal(response.body().code, 'BAD_REQUEST')
    assert.equal(response.body().status, 409)
  })
  test('Erro 409 caso usuário esteja em uso', async ({ client, assert }) => {
    const { username } = await UserFactory.create()
    const response = await client.post('/users').json({
      username,
      email: 'test@test.com',
      password: 'password',
      avatar: 'https://avatar.com/avatar/avatar',
    })
    response.assertStatus(409)

    assert.exists(response.body().message)
    assert.exists(response.body().code)
    assert.exists(response.body().status)
    assert.exists(response.body().message, 'username')
    assert.equal(response.body().code, 'BAD_REQUEST')
    assert.equal(response.body().status, 409)
  })
  test('Retornar 422 quando não informar os dados obrigatórios', async ({ client, assert }) => {
    const response = await client.post('/users').json({})

    assert.equal(response.body().code, 'BAD_REQUEST')
    assert.equal(response.body().status, 422)
  })
})
