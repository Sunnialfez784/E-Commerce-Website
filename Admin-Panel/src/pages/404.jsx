import { Link } from 'react-router-dom'

import { ForbiddenIcon } from '../icons'

function Page404() {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-white/50 bg-white/70 p-10 text-center shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur transition-colors duration-300 dark:border-white/10 dark:bg-slate-950/70">
      <ForbiddenIcon className="mt-2 h-12 w-12 text-cyan-500 dark:text-cyan-300" aria-hidden="true" />
      <h1 className="mt-4 text-6xl font-semibold text-slate-900 dark:text-white">404</h1>
      <p className="mt-2 text-slate-700 dark:text-slate-300">
        Page not found. Check the address or{' '}
        <Link className="font-semibold text-cyan-600 hover:underline dark:text-cyan-300" to="/admin/dashboard">
          go back to dashboard
        </Link>
        .
      </p>
    </div>
  )
}

export default Page404
