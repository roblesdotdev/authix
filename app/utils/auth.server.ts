import { sleep } from './misc'

const demoUser = {
  id: 'cm1bl3vti00010cmhdoyff3om',
  username: 'demouser',
  email: 'demo@user.com',
  password: 'demopassword',
}

export async function login({
  username,
  password,
}: {
  username: string
  password: string
}) {
  // TODO
  await sleep(300)
  if (username !== demoUser.username || password !== demoUser.password)
    return null

  return demoUser
}

export async function emailExists(email: string) {
  if (email === demoUser.email) return true
  return false
}

export async function getUserById(id: string) {
  if (id !== demoUser.id) {
    return null
  }
  return demoUser
}
