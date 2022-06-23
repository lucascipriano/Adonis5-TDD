import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { UserFactory } from 'Database/factories'
import Mail from '@ioc:Adonis/Addons/Mail'
test.group('Password', (group) => {
  // Iniciar migration e no final deletar, para não dar ruim
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })
  test('Envio de email para redefinir a senha', async ({ assert, client }) => {
    const user = await UserFactory.create()
    const mailer = Mail.fake()

    await client.post('/forgot-password').json({
      email: user.email,
      resetPasswordUrl: 'url',
    })
    assert.isTrue(mailer.exists({ to: [{ address: user.email }] }))
    assert.isTrue(mailer.exists({ from: { address: 'no-replay@apilucas.com' } }))
    assert.isTrue(mailer.exists({ subject: 'Recuperação de senha' }))
    // assert.isTrue(mailer.exists((mail) => mail.html!.includes(user.username)))
    Mail.restore()
  })
})
