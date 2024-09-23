import { redirect } from '@vercel/remix'
import { safeRedirect } from 'remix-utils/safe-redirect'
import { sleep } from './misc'
import { sessionStorage } from './session.server'
export const USER_ID_KEY = 'userId'

const SESSION_EXPIRATION_TIME = 30 * 24 * 60 * 60 * 1000 // 30 days

export const demoUser = {
  id: 'cm1bl3vti00010cmhdoyff3om',
  username: 'demouser',
  email: 'demo@user.com',
  password: 'demopassword',
}

export function getSessionExpirationDate() {
  return new Date(Date.now() + SESSION_EXPIRATION_TIME)
}

export async function getUserId(request: Request) {
  const authSession = await sessionStorage.getSession(
    request.headers.get('cookie'),
  )
  const userId = authSession.get(USER_ID_KEY)
  if (!userId) return null
  const user = await getUserById(userId)
  if (!user) {
    throw redirect('/', {
      headers: {
        'set-cookie': await sessionStorage.destroySession(authSession),
      },
    })
  }
  return user.id
}

export async function requireAnonymous({
  request,
  redirectTo = '/',
}: {
  request: Request
  redirectTo?: string
}) {
  const userId = await getUserId(request)
  if (userId) {
    throw redirect(safeRedirect(redirectTo ?? '/'))
  }
}

export async function requireUserId(
  request: Request,
  { redirectTo }: { redirectTo?: string | null } = {},
) {
  const userId = await getUserId(request)
  if (!userId) {
    const requestUrl = new URL(request.url)
    redirectTo =
      redirectTo === null ? null : `${requestUrl.pathname}${requestUrl.search}`
    const loginParams = redirectTo ? new URLSearchParams({ redirectTo }) : null
    const loginRedirect = ['/login', loginParams?.toString()]
      .filter(Boolean)
      .join('?')
    throw redirect(safeRedirect(loginRedirect))
  }
  return userId
}

export async function requireUser(request: Request) {
  const userId = await requireUserId(request)
  if (userId !== demoUser.id) {
    throw await logout({ request })
  }
  return demoUser
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

export async function logout({
  request,
  redirectTo = '/',
}: {
  request: Request
  redirectTo?: string
}) {
  const authSession = await sessionStorage.getSession(
    request.headers.get('cookie'),
  )
  throw redirect(safeRedirect(redirectTo), {
    headers: { 'set-cookie': await sessionStorage.destroySession(authSession) },
  })
}

export async function getUserById(id: string) {
  if (id !== demoUser.id) {
    return null
  }
  return demoUser
}

export async function emailExists(email: string) {
  if (email === demoUser.email) return true
  return false
}
