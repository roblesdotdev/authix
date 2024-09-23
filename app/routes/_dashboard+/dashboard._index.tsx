import { useLoaderData } from '@remix-run/react'
import { json, type LoaderFunctionArgs } from '@vercel/remix'
import { getUserById, requireUserId } from '~/utils/auth.server'

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireUserId(request)
  const user = await getUserById(userId)

  if (!user) throw new Response('Invalid user', { status: 400 })

  return json({ user })
}

export default function DashboardRoute() {
  const { user } = useLoaderData<typeof loader>()

  return (
    <div className="py-8">
      <h1>Welcome {user.username} to your dashboard.</h1>
    </div>
  )
}
