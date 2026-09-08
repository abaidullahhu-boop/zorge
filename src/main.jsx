import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Navigate, RouterProvider, useParams } from 'react-router-dom'
import './assets/styles/index.css'
import App from './App.jsx'
import CareerPage from './pages/CareerPage.jsx'
import DisclaimerPage from './pages/DisclaimerPage.jsx'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage.jsx'
import ProjectPage from './pages/ProjectPage.jsx'
import ProjectPlansPage from './pages/ProjectPlansPage.jsx'
import TermsPage from './pages/TermsPage.jsx'

function RedirectPlansToInventory() {
  const { projectId } = useParams()
  return <Navigate to={`/projects/${projectId}/inventory`} replace />
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: null },
      { path: 'projects/:projectId/inventory', element: <ProjectPlansPage /> },
      { path: 'projects/:projectId/plans', element: <RedirectPlansToInventory /> },
      { path: 'projects/:projectId', element: <ProjectPage /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
  { path: '/careers', element: <CareerPage /> },
  { path: '/privacy-policy', element: <PrivacyPolicyPage /> },
  { path: '/terms', element: <TermsPage /> },
  { path: '/disclaimer', element: <DisclaimerPage /> },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
