import { Outlet, useLocation } from 'react-router-dom'
import HomePage from './pages/HomePage'

function App() {
  const { pathname } = useLocation()
  const isProject = pathname.startsWith('/projects/')

  return (
    <>
      {/* Stay mounted so the project sheet can slide over the live page. */}
      <div
        className={`app-home-layer${isProject ? ' is-covered' : ''}`}
        aria-hidden={isProject}
      >
        <HomePage />
      </div>

      <Outlet />
    </>
  )
}

export default App
