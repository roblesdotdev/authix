import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { Form, useActionData, useSearchParams } from '@remix-run/react'
import { redirect, json, type ActionFunctionArgs } from '@vercel/remix'
import { z } from 'zod'
import { GeneralErrorBoundary } from '~/components/error-boundary'
import { ErrorList } from '~/components/forms'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { login } from '~/utils/auth.server'

export const LoginFormSchema = z.object({
  username: z.string({ message: 'Username is required' }).min(1),
  password: z.string({ message: 'Password is required' }).min(1),
  redirectTo: z.string().optional(),
  remember: z.boolean().optional(),
})

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()

  const submission = await parseWithZod(formData, {
    schema: intent => {
      return LoginFormSchema.transform(async (data, ctx) => {
        if (intent !== null) return { ...data }

        const user = await login({ ...data })
        if (!user) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Invalid username or password',
          })
          return z.NEVER
        }
        return { ...data }
      })
    },
    async: true,
  })

  if (submission.status !== 'success') {
    return json({ result: submission.reply({ hideFields: ['password'] }) })
  }

  const { redirectTo } = submission.value

  return redirect(redirectTo ?? '/')
}

export default function LoginRoute() {
  const actionData = useActionData<typeof action>()
  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get('redirectTo')
  const [form, fields] = useForm({
    id: 'login-form',
    constraint: getZodConstraint(LoginFormSchema),
    defaultValue: { redirectTo },
    lastResult: actionData?.result,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: LoginFormSchema })
    },
    shouldRevalidate: 'onBlur',
  })
  return (
    <div className="py-8">
      <div className="mx-auto max-w-lg space-y-6">
        <div className="mb-8 flex flex-col gap-1">
          <h1 className="text-3xl">Welcome Back</h1>
          <p className="text-fg-muted">Please enter your credentials.</p>
        </div>
        <Form method="post" {...getFormProps(form)}>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor={fields.username.id}>Username*</Label>
              <Input
                placeholder="Username"
                {...getInputProps(fields.username, { type: 'text' })}
              />
              <ErrorList
                errorId={fields.username.errorId}
                errors={fields.username.errors}
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor={fields.password.id}>Password*</Label>
              <Input
                placeholder="Password"
                {...getInputProps(fields.password, { type: 'password' })}
              />
              <ErrorList
                errorId={fields.password.errorId}
                errors={fields.password.errors}
              />
            </div>
            <ErrorList errorId={form.errorId} errors={form.errors} />
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

export function ErrorBoundary() {
  return <GeneralErrorBoundary />
}
