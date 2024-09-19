import { GeneralErrorBoundary } from '~/components/error-boundary'

export async function loader() {
  throw new Response('Not found', { status: 404 })
}

export default function NotFound() {
  return <h1>This should not be seen</h1>
}

export function ErrorBoundary() {
  return <GeneralErrorBoundary />
}
