import { Form } from '@remix-run/react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'

export default function LoginRoute() {
  return (
    <div className="py-8">
      <div className="mx-auto max-w-lg space-y-6">
        <div className="mb-8 flex flex-col gap-1">
          <h1 className="text-3xl">Welcome Back</h1>
          <p className="text-fg-muted">Please enter your credentials.</p>
        </div>
        <Form method="post">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <Label>Username</Label>
              <Input placeholder="Username" />
            </div>
            <div className="flex flex-col gap-1">
              <Label>Password</Label>
              <Input placeholder="Password" type="password" />
            </div>
            <Button>Login</Button>
          </div>
        </Form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-canvas px-2 text-fg-muted">
              Or continue with
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Button variant="outline">Google</Button>
        </div>
      </div>
    </div>
  )
}
