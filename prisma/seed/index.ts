import { createPassword, createUser } from './utils'
import { db } from '~/utils/db.server'

async function seed() {
  // Clean
  await db.user.deleteMany()

  // insert fake user
  await db.user.create({
    data: createUser(),
  })

  // create demo user
  await db.user.create({
    data: {
      email: 'demo@user.com',
      username: 'demouser',
      password: {
        create: createPassword('demopassword'),
      },
    },
  })
}

seed()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
