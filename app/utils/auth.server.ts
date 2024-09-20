export async function login({
  username,
  password,
}: {
  username: string
  password: string
}) {
  // TODO
  if (username !== 'demouser' || password !== 'demopassword') return null

  return 'demouser'
}
