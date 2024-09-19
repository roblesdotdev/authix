import { useLoaderData } from '@remix-run/react'
import { json } from '@vercel/remix'

export async function loader() {
  return json({
    message: process.env.TEST_MESSAGE,
  })
}

export default function Index() {
  const data = useLoaderData<typeof loader>()
  return (
    <div className="flex flex-col items-center py-8">
      <div className="flex flex-col gap-1 text-center">
        <h1 className="text-3xl font-medium">Welcome to Authix</h1>
        <p className="text-neutral-400">Working with remix auth.</p>
      </div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
