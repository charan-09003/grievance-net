import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import '/src/index.css'

import Home from '/src/pages/Home'
import Dashboard from '/src/pages/Dashboard'
import Complaint from '/src/pages/Complaint'
import Auth from '/src/pages/Auth'

import { ROUTES } from '/src/utils/routes'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to={ROUTES.HOME} />,
  },
  {
    path: ROUTES.HOME,
    element: <Home />,
  },
  {
    path: ROUTES.DASHBOARD,
    element: <Dashboard />,
  },
  {
    path: ROUTES.AUTH,
    element: <Auth />,
  },
  {
    path: ROUTES.COMPLAINT,
    element: <Complaint />,
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
