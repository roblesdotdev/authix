/* Simple implementation based on @epic-web/remember */

export function singleton<Value>(name: string, value: () => Value): Value {
  const single = globalThis as any
  single.__instances ??= new Map()
  if (!single.__instances.has(name)) {
    single.__instances.set(name, value())
  }
  return single.__instances.get(name)
}
