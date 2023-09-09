import { lazy } from "react"

const MainPage = lazy(() => import('../pages/mainPage'))
const LoginPage = lazy(() => import('../pages/loginPage'))
const RegisterPage = lazy(() => import('../pages/registerPage'))

const ROUTES = [
    {
        path: '/',
        element: <MainPage />
    },
    {
        path: '/login',
        element: <LoginPage />
    },
    {
        path: '/register',
        element: <RegisterPage />
    }
]

export default ROUTES