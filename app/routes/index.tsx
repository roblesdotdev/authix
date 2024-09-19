import { GeneralErrorBoundary } from '~/components/error-boundary'

export default function Index() {
  return (
    <div className="flex flex-col items-center py-8">
      <div className="flex flex-col gap-1 text-center">
        <h1 className="text-3xl font-medium">Welcome to Authix</h1>
        <p className="text-neutral-400">Working with remix auth.</p>
      </div>
    </div>
  )
}

export function ErrorBoundary() {
  return <GeneralErrorBoundary />
}
