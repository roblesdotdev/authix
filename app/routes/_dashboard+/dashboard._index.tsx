import { useLoaderData } from '@remix-run/react'
import { json, type LoaderFunctionArgs } from '@vercel/remix'
import { requireUser } from '~/utils/auth.server'

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUser(request)

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
