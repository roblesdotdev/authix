import { useInputControl } from '@conform-to/react'
import { useId } from 'react'
import { Checkbox, type CheckboxProps } from '~/components/ui/checkbox'
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

export function CheckboxField({
  labelProps,
  buttonProps,
  errors,
  className,
}: {
  labelProps: JSX.IntrinsicElements['label']
  buttonProps: CheckboxProps & {
    name: string
    form: string
    value?: string
  }
  errors?: ListOfErrors
  className?: string
}) {
  const { key, defaultChecked, ...checkboxProps } = buttonProps
  const fallbackId = useId()
  const checkedValue = buttonProps.value ?? 'on'
  const input = useInputControl({
    key,
    name: buttonProps.name,
    formId: buttonProps.form,
    initialValue: defaultChecked ? checkedValue : undefined,
  })
  const id = buttonProps.id ?? fallbackId
  const errorId = errors?.length ? `${id}-error` : undefined

  return (
    <div className={className}>
      <div className="inline-flex items-center gap-2">
        <Checkbox
          {...checkboxProps}
          id={id}
          aria-invalid={errorId ? true : undefined}
          aria-describedby={errorId}
          checked={input.value === checkedValue}
          onCheckedChange={state => {
            input.change(state.valueOf() ? checkedValue : '')
            buttonProps.onCheckedChange?.(state)
          }}
          onFocus={event => {
            input.focus()
            buttonProps.onFocus?.(event)
          }}
          onBlur={event => {
            input.blur()
            buttonProps.onBlur?.(event)
          }}
          type="button"
        />
        <label
          htmlFor={id}
          {...labelProps}
          className="text-body-xs text-muted-foreground self-center"
        />
      </div>
      <div className="px-4 pb-3 pt-1">
        {errorId ? <ErrorList id={errorId} errors={errors} /> : null}
      </div>
    </div>
  )
}
