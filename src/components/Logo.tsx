import { Link } from 'react-router-dom'

export function Logo() {
  return (
    <Link to="/" className="brand" aria-label="Taskflow home">
      <span className="brand-mark" aria-hidden="true">✓</span>
      <span>taskflow</span>
    </Link>
  )
}
