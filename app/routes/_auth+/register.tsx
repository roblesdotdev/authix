import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { Form, Link, useActionData } from '@remix-run/react'
import { redirect, json, type ActionFunctionArgs } from '@vercel/remix'
import { z } from 'zod'
import { FormField } from '~/components/forms'
import { Button } from '~/components/ui/button'
import { emailExists } from '~/utils/auth.server'
import { useIsPending } from '~/utils/misc'

export const RegisterFormSchema = z.object({
  email: z
    .string({ message: 'Email is required' })
    .min(1)
    .email({ message: 'Invalid email address' }),
})

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  const submission = await parseWithZod(formData, {
    schema: RegisterFormSchema.superRefine(async (data, ctx) => {
      const existingUser = await emailExists(data.email)
      if (existingUser) {
        ctx.addIssue({
          path: ['email'],
          code: z.ZodIssueCode.custom,
          message: 'A user already exists with this email',
        })
        return
      }
    }),
    async: true,
  })

  if (submission.status !== 'success') {
    return json({ result: submission.reply() })
  }

  const { email } = submission.value

  // TODO: send email verification
  console.log(email)

  return redirect('/')
}

export default function RegisterRoute() {
  const actionData = useActionData<typeof action>()
  const isPending = useIsPending()
  const [form, fields] = useForm({
    id: 'register-form',
    constraint: getZodConstraint(RegisterFormSchema),
    lastResult: actionData?.result,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: RegisterFormSchema })
    },
    shouldRevalidate: 'onInput',
    shouldValidate: 'onBlur',
  })

  return (
    <div className="py-8">
      <div className="mx-auto max-w-lg space-y-6">
        <div className="mb-8 flex flex-col gap-1">
          <h1 className="text-3xl">Register</h1>
          <p className="text-fg-muted">We need your email to continue.</p>
        </div>
        <Form method="post" {...getFormProps(form)}>
          <div className="flex flex-col gap-4">
            <FormField
              className="flex flex-col gap-2"
              labelProps={{}}
              inputProps={{
                ...getInputProps(fields.email, { type: 'text' }),
                placeholder: 'demo@email.com',
              }}
              errors={fields.email.errors}
            />
            <Button disabled={isPending}>Continue</Button>
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
            Already have an account?{' '}
            <Link className="underline hover:text-fg" to="/login">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
