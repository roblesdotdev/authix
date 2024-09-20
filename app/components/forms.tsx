import { useId } from 'react'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'

export type ListOfErrors = Array<string | null | undefined> | null | undefined

export function ErrorList({
  id,
  errors,
}: {
  id: string
  errors: ListOfErrors
}) {
  if (!errors) return null
  return (
    <ul id={id}>
      {errors.map(err => (
        <li key={err} className="text-xs text-fg-error">
          {err}
        </li>
      ))}
    </ul>
  )
}

export function FormField({
  labelProps,
  inputProps,
  errors,
  className,
}: {
  labelProps: React.LabelHTMLAttributes<HTMLLabelElement>
  inputProps: React.InputHTMLAttributes<HTMLInputElement>
  errors?: ListOfErrors
  className?: string
}) {
  const fallbackId = useId()
  const id = inputProps.id ?? fallbackId
  const errorId = errors?.length ? `${id}-error` : undefined
  return (
    <div className={className}>
      <Label htmlFor={id} {...labelProps} />
      <Input
        id={id}
        aria-invalid={errorId ? true : undefined}
        aria-describedby={errorId}
        {...inputProps}
      />
      {errorId ? <ErrorList id={errorId} errors={errors} /> : null}
    </div>
  )
}
