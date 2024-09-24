import { Form, useLoaderData } from '@remix-run/react'
import {
  type ActionFunctionArgs,
  json,
  type LoaderFunctionArgs,
  redirect,
} from '@vercel/remix'
import { GeneralErrorBoundary } from '~/components/error-boundary'
import { Button } from '~/components/ui/button'
import { requireUserId, SESSION_ID_KEY } from '~/utils/auth.server'
import { db } from '~/utils/db.server'
import { sessionStorage } from '~/utils/session.server'

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireUserId(request)
  const user = await db.user.findUniqueOrThrow({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      _count: {
        select: {
          sessions: {
            where: {
              expirationDate: { gt: new Date() },
            },
          },
        },
      },
    },
  })

  return json({ user })
}

export async function action({ request }: ActionFunctionArgs) {
  const cookieSession = await sessionStorage.getSession(
    request.headers.get('cookie'),
  )
  const sessionId = cookieSession.get(SESSION_ID_KEY)
  const userId = await requireUserId(request)
  const formData = await request.formData()

  const intent = formData.get('intent')
  if (intent !== 'delete-sessions') {
    throw new Response('Invalid request', { status: 400 })
  }

  await db.session.deleteMany({
    where: {
      userId: userId,
      id: { not: sessionId },
    },
  })

  return redirect('/dashboard')
}

export default function DashboardRoute() {
  const { user } = useLoaderData<typeof loader>()
  const numberOfSessions = user._count.sessions - 1 // All sessions - current

  return (
    <div className="py-8">
      <h1>
        Welcome <b>{user.username}</b> to your dashboard.
      </h1>
      <div className="mt-4 rounded-xl border p-6">
        {numberOfSessions > 0 ? (
          <div className="flex flex-col items-start gap-4">
            <p>You have others ({numberOfSessions}) active sessions.</p>
            <Form method="POST">
              <Button
                name="intent"
                value="delete-sessions"
                variant="destructive"
              >
                Delete
              </Button>
            </Form>
          </div>
        ) : (
          <p>This is your only active session.</p>
        )}
      </div>
    </div>
  )
}

export function ErrorBoundary() {
  return <GeneralErrorBoundary />
}
