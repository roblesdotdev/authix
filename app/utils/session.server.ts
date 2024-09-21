import { createCookieSessionStorage } from '@vercel/remix'

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: 'authix_session',
    sameSite: 'lax',
    path: '/',
    httpOnly: true,
    secrets: process.env.SESSION_SECRET.split(','),
    secure: true,
  },
})
