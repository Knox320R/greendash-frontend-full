import Home from "./pages/home/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import Dashboard from "./pages/Dashboard";
import Staking from "./pages/Staking";
import Affiliates from "./pages/Affiliates";
import Profile from "./pages/Profile";

export default [
    {
        path: '/',
        public: true,
        element: <Home/>
    },
    {
        path: '/login',
        public: true,
        element: <Login/>
    },
    {
        path: '/register',
        public: true,
        element: <Register/>
    },
    {
        path: '/verify-email',
        public: true,
        element: <VerifyEmail/>
    },
    {
        path: '/dashboard',
        element: <Dashboard/>
    },
    {
        path: '/staking',
        element: <Staking/>
    },
    {
        path: '/affiliates',
        element: <Affiliates/>
    },
    {
        path: '/profile',
        element: <Profile/>
    }
]