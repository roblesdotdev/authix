import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'
import { type MetaFunction } from '@vercel/remix'
import '~/styles/global.css'

export const meta: MetaFunction = () => {
  return [
    { title: 'Authix | Remix auth demo' },
    { name: 'description', content: 'Welcome to Authix, a remix auth demo!' },
  ]
}

export function Layout({ children }: { children: React.ReactNode }) {
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
            <Link to="/login">Login</Link>
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
