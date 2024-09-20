export type ListOfErrors = Array<string | null | undefined> | null | undefined

export function ErrorList({
  errorId,
  errors,
}: {
  errorId: string
  errors: ListOfErrors
}) {
  if (!errors) return null
  return (
    <ul id={errorId}>
      {errors.map(err => (
        <li key={err} className="text-xs text-fg-error">
          {err}
        </li>
      ))}
    </ul>
  )
}
