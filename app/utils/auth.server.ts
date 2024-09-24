import { type Password, type User } from '@prisma/client'
import { redirect } from '@vercel/remix'
import bcrypt from 'bcryptjs'
import { safeRedirect } from 'remix-utils/safe-redirect'
import { db } from './db.server'
import { sessionStorage } from './session.server'

export const SESSION_ID_KEY = 'sessionId'
const SESSION_EXPIRATION_TIME = 30 * 24 * 60 * 60 * 1000 // 30 days

export function getSessionExpirationDate() {
  return new Date(Date.now() + SESSION_EXPIRATION_TIME)
}

export async function getUserId(request: Request) {
  const authSession = await sessionStorage.getSession(
    request.headers.get('cookie'),
  )
  const sessionId = authSession.get(SESSION_ID_KEY)
  if (!sessionId) return null
  const session = await db.session.findUnique({
    select: { userId: true },
    where: { id: sessionId },
  })
  if (!session) {
    throw redirect('/', {
      headers: {
        'set-cookie': await sessionStorage.destroySession(authSession),
      },
    })
  }
  return session.userId
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
  const session = await db.session.create({
    select: { id: true, expirationDate: true },
    data: {
      userId: user.id,
      expirationDate: getSessionExpirationDate(),
    },
  })
  return session
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
  const sessionId = authSession.get(SESSION_ID_KEY)
  if (sessionId) {
    void db.session.deleteMany({ where: { id: sessionId } }).catch(() => {})
  }
  throw redirect(safeRedirect(redirectTo), {
    headers: { 'set-cookie': await sessionStorage.destroySession(authSession) },
  })
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

export async function getUserById(id: User['id']) {
  const user = await db.user.findUnique({
    select: { id: true, username: true },
    where: { id },
  })
  if (!user) return null
  return user
}
