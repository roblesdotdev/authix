import { type ActionFunctionArgs, redirect } from '@vercel/remix'
import { logout } from '~/utils/auth.server'

export function loader() {
  return redirect('/')
}

export async function action({ request }: ActionFunctionArgs) {
  return logout({ request })
}
