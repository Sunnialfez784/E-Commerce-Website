import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

function AccessibleNavigationAnnouncer() {
  const location = useLocation()
  const message = useMemo(() => {
    const path = location.pathname.slice(1)
    return path ? `Navigated to ${path} page.` : ''
  }, [location.pathname])

  return (
    <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">
      {message}
    </span>
  )
}

export default AccessibleNavigationAnnouncer
