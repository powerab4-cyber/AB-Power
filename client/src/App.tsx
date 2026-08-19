import { Suspense, lazy, useEffect } from 'react'
import type { ComponentType, ReactNode } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useAuth } from './auth/context'

const lazyPage = (loader: () => Promise<{ [key: string]: unknown }>, name: string) =>
  lazy(() => loader().then((m) => ({ default: m[name] as ComponentType })))

const LandingPage = lazyPage(() => import('./pages/LandingPage'), 'LandingPage')
const LoginPage = lazyPage(() => import('./pages/LoginPage'), 'LoginPage')
const SignupPage = lazyPage(() => import('./pages/SignupPage'), 'SignupPage')
const StorePage = lazyPage(() => import('./pages/StorePage'), 'StorePage')
const CheckoutPage = lazyPage(() => import('./pages/CheckoutPage'), 'CheckoutPage')
const AccountPage = lazyPage(() => import('./pages/AccountPage'), 'AccountPage')
const DashboardLayout = lazyPage(() => import('./pages/dashboard/DashboardLayout'), 'DashboardLayout')
const OverviewPage = lazyPage(() => import('./pages/dashboard/OverviewPage'), 'OverviewPage')
const UsersPage = lazyPage(() => import('./pages/dashboard/UsersPage'), 'UsersPage')
const ProductsPage = lazyPage(() => import('./pages/dashboard/ProductsPage'), 'ProductsPage')
const ProductFormPage = lazyPage(() => import('./pages/dashboard/ProductFormPage'), 'ProductFormPage')
const OrdersPage = lazyPage(() => import('./pages/dashboard/OrdersPage'), 'OrdersPage')
const ProfilePage = lazyPage(() => import('./pages/dashboard/ProfilePage'), 'ProfilePage')

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  return null
}

function Protected({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

function AdminOnly({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/account" replace />
  return <>{children}</>
}

function GuestOnly({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (user) return <Navigate to="/" replace />
  return <>{children}</>
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/store" element={<StorePage />} />
          <Route path="/checkout/:productId" element={<CheckoutPage />} />
          <Route
            path="/login"
            element={
              <GuestOnly>
                <LoginPage />
              </GuestOnly>
            }
          />
          <Route
            path="/signup"
            element={
              <GuestOnly>
                <SignupPage />
              </GuestOnly>
            }
          />
          <Route
            path="/account"
            element={
              <Protected>
                <AccountPage />
              </Protected>
            }
          />
          <Route
            path="/dashboard"
            element={
              <AdminOnly>
                <DashboardLayout />
              </AdminOnly>
            }
          >
            <Route index element={<OverviewPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="products/new" element={<ProductFormPage />} />
            <Route path="products/:id/edit" element={<ProductFormPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  )
}

export default App
