import { createBrowserRouter } from "react-router";
import Login from "./Features/auth/pages/Login";    
import Register from "./Features/auth/pages/Register";
import Protected from "./Features/auth/components/Protected";
import Home from "./Features/interview/pages/home";
import Interview from "./Features/interview/pages/interview";



export const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },

     {
        path: "/",
        element: <Protected>
                    <Home />
                </Protected>
    },
    
   {
        path:"/interview/:interviewId",
        element: <Protected><Interview /></Protected>
    }
    
])