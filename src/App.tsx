import { useMemo } from 'react'
import { createHashRouter, Navigate, RouterProvider } from 'react-router-dom'
import './App.css'
import { HomePage } from './pages/HomePage.tsx'
import { DetailPage } from './pages/DetailPage.tsx'

const routes = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/bagian/:bagianId',
    element: <DetailPage />,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]

function App() {
  const router = useMemo(() => createHashRouter(routes), [])
  return <RouterProvider router={router} />
}

export default App
