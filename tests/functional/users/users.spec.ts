import { test } from '@japa/runner'

test.group('User', () => {
  test('Criação do usuário', async ({ client }) => {
    const userPayload = {
      email: 'test@test.com',
      username: 'test',
      password: 'test',
      avatar: 'http://avatar.com/avatar/avatar.png',
    }
    const response = await client.post('/users').json(userPayload)
    const { password, avatar, ...expected } = userPayload

    response.assertBodyContains(expected)

    response.assertStatus(201)
  })
})
