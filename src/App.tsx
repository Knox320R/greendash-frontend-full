import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import 'react-toastify/dist/ReactToastify.css';
import { WalletProvider } from './hooks/WalletContext';
import routes from './routes';
import Admin from './pages/admin/Admin';
import Loading from './components/Loading';
import { useAuth } from '@/hooks/useAuth';
import Dashboard from './pages/Dashboard';
import { ToastContainer } from 'react-toastify';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { authApi } from './store/auth';
import { AppDispatch } from './store';

function App() {
  const dispatch = useDispatch<AppDispatch>()

  const { user, isLoading, isAuthenticated } = useAuth()
  useEffect(() => {
    dispatch(authApi.getCurrentUser())
  }, [])

  return (
    <WalletProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="flex-1 mt-[70px] min-h-[70vh]">
            {isLoading && <Loading content="Data" />}
            <Routes>
              {
                routes.map(route => (isAuthenticated || route.public) && <Route key={route.path} {...route} />)
              }
              {user?.is_admin && <Route path='/admin' element={<Admin />} />}
              {
                isAuthenticated ?
                  <Route path='/dashboard' element={<Dashboard />} />
                  :
                  <Route path="*" element={<Navigate to="/" replace />} />
              }
            </Routes>
          </main>
          <Footer />
          <ToastContainer/>
        </div>
      </Router>
    </WalletProvider>
  );
}

export default App;
