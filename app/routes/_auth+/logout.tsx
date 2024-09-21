import { redirect } from '@vercel/remix'
import { sessionStorage } from '~/utils/session.server'

export function loader() {
  return redirect('/')
}

export async function action() {
  const cookieSession = await sessionStorage.getSession()

  return redirect('/', {
    headers: {
      'set-cookie': await sessionStorage.destroySession(cookieSession),
    },
  })
}
