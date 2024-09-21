import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { Form, Link, useActionData, useSearchParams } from '@remix-run/react'
import {
  type LoaderFunctionArgs,
  redirect,
  json,
  type ActionFunctionArgs,
} from '@vercel/remix'
import { z } from 'zod'
import { GeneralErrorBoundary } from '~/components/error-boundary'
import { ErrorList, FormField } from '~/components/forms'
import { Button } from '~/components/ui/button'
import { getUserById, login } from '~/utils/auth.server'
import { useIsPending } from '~/utils/misc'
import { sessionStorage } from '~/utils/session.server'

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
        if (intent !== null) return { ...data, user: null }

        const user = await login({ ...data })
        if (!user) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Invalid username or password',
          })
          return z.NEVER
        }
        return { ...data, user }
      })
    },
    async: true,
  })

  if (submission.status !== 'success' || !submission.value.user) {
    return json(
      { result: submission.reply({ hideFields: ['password'] }) },
      { status: submission.status === 'error' ? 400 : 200 },
    )
  }

  const { redirectTo, user } = submission.value

  const cookieSession = await sessionStorage.getSession(
    request.headers.get('cookie'),
  )
  cookieSession.set('userId', user.id)

  return redirect(redirectTo ?? '/', {
    headers: {
      'set-cookie': await sessionStorage.commitSession(cookieSession),
    },
  })
}

export async function loader({ request }: LoaderFunctionArgs) {
  const cookieSession = await sessionStorage.getSession(
    request.headers.get('cookie'),
  )
  const userId = cookieSession.get('userId')

  const user = await getUserById(userId)
  if (user) {
    return redirect('/')
  }

  return json({})
}

export default function LoginRoute() {
  const actionData = useActionData<typeof action>()
  const isPending = useIsPending()
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
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
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
            <FormField
              className="flex flex-col gap-2"
              labelProps={{ children: 'Email or username*' }}
              inputProps={{
                ...getInputProps(fields.username, { type: 'text' }),
                placeholder: 'Email or username',
              }}
              errors={fields.username.errors}
            />
            <FormField
              className="flex flex-col gap-2"
              labelProps={{ children: 'Password*' }}
              inputProps={{
                ...getInputProps(fields.password, { type: 'password' }),
                placeholder: 'Password',
              }}
              errors={fields.password.errors}
            />
            <ErrorList id={form.errorId} errors={form.errors} />
            <Button disabled={isPending}>Login</Button>
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
        <div className="py-1">
          <p className="text-center text-fg-muted">
            Don't have an account?{' '}
            <Link className="underline hover:text-fg" to="/register">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export function ErrorBoundary() {
  return <GeneralErrorBoundary />
}
