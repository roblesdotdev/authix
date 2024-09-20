import { Link } from '@remix-run/react'
import { GeneralErrorBoundary } from '~/components/error-boundary'
import { Button } from '~/components/ui/button'

export default function Index() {
  return (
    <div className="flex flex-col items-center py-16">
      <div className="flex flex-col gap-1 text-center">
        <h1 className="text-3xl font-medium">Welcome to Authix</h1>
        <p className="text-fg-muted">Working with remix auth.</p>
        <div className="pt-8">
          <Button asChild>
            <Link to="/dashboard">Get Started</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export function ErrorBoundary() {
  return <GeneralErrorBoundary />
}
