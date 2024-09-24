import { type Password, type User } from '@prisma/client'
import { redirect } from '@vercel/remix'
import bcrypt from 'bcryptjs'
import { safeRedirect } from 'remix-utils/safe-redirect'
import { db } from './db.server'
import { sessionStorage } from './session.server'
export const USER_ID_KEY = 'userId'

const SESSION_EXPIRATION_TIME = 30 * 24 * 60 * 60 * 1000 // 30 days

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
  const user = await db.user.findUnique({ where: { id: userId } })
  if (!user) {
    throw await logout({ request })
  }
  return user
}

export async function login({
  username,
  password,
}: {
  username: User['username']
  password: string
}) {
  const user = await verifyUserPassword({ username }, password)
  if (!user) return null

  return user
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
  const user = await db.user.findUnique({ where: { id } })
  if (!user) {
    return null
  }
  return user
}

export async function emailExists(email: string) {
  const found = await db.user.findUnique({ where: { email } })
  if (found) return true
  return false
}

export async function verifyUserPassword(
  where: Pick<User, 'username'> | Pick<User, 'id'>,
  password: Password['hash'],
) {
  const userWithPassword = await db.user.findUnique({
    where,
    select: { id: true, password: { select: { hash: true } } },
  })

  if (!userWithPassword || !userWithPassword.password) {
    return null
  }

  const isValid = await bcrypt.compare(password, userWithPassword.password.hash)

  if (!isValid) {
    return null
  }

  return { id: userWithPassword.id }
}
