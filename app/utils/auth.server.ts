import { sleep } from './misc'

export async function login({
  username,
  password,
}: {
  username: string
  password: string
}) {
  // TODO
  await sleep(300)
  if (username !== 'demouser' || password !== 'demopassword') return null

  return 'demouser'
}
