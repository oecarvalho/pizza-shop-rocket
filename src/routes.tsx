import { createBrowserRouter } from "react-router-dom";
import { Dashboard } from "./pages/app/dashboard/dashboard";
import { SignIn } from "./pages/auth/sign-in";
import { AppLayout } from "./_layouts/app";
import { AuthLayout } from "./_layouts/auth";
import { SignUp } from "./pages/auth/sing-up";
import { Orders } from "./pages/app/orders/orders";
import { NotFound } from "./pages/auth/404";

export const router = createBrowserRouter([

    {
        path: '/',
        element: <AppLayout/>,
        errorElement: <NotFound/> ,
        children: [
            {path: '/', element: <Dashboard/>},
            {path: '/orders', element: <Orders/>}

        ]
    },

    {
        path: '/',
        element: <AuthLayout/>,
        children: [
            {path: '/sign-in', element: <SignIn/>},
            {path: '/sign-up', element: <SignUp/>}
        ]
    },
])