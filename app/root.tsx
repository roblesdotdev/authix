import {
  Form,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react'
import { json, type LoaderFunctionArgs, type MetaFunction } from '@vercel/remix'
import '~/styles/global.css'
import { Button } from './components/ui/button'
import { getUserById } from './utils/auth.server'
import { sessionStorage } from './utils/session.server'

export const meta: MetaFunction = () => {
  return [
    { title: 'Authix | Remix auth demo' },
    { name: 'description', content: 'Welcome to Authix, a remix auth demo!' },
  ]
}

export async function loader({ request }: LoaderFunctionArgs) {
  const cookieSession = await sessionStorage.getSession(
    request.headers.get('cookie'),
  )
  const userId = cookieSession.get('userId')
  const user = await getUserById(userId)

  return json({ user })
}

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useLoaderData<typeof loader>()

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen min-w-80 overflow-x-hidden antialiased">
        <header className="h-16">
          <nav className="container flex h-[inherit] w-full items-center justify-between">
            <Link to="/">Authix</Link>
            {data.user ? (
              <Form>
                <Button variant="outline" className="h-auto px-4 py-2 text-xs">
                  Logout
                </Button>
              </Form>
            ) : (
              <Link to="/login">Login</Link>
            )}
          </nav>
        </header>
        <div className="container">{children}</div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}
