import { z } from 'zod'

export const envSchema = z.object({
  SESSION_SECRET: z.string().min(1),
  TURSO_DATABASE_URL: z.string().min(1),
  TURSO_AUTH_TOKEN: z.string().min(1),
})

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}

export function initEnv() {
  const parsed = envSchema.safeParse(process.env)

  if (parsed.success === false) {
    console.error(
      '❌ Invalid environment variables:',
      parsed.error.flatten().fieldErrors,
    )

    throw new Error('Invalid environment variables')
  }
}
