import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { WalletProvider } from './hooks/WalletContext';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import routes from './routes';
import Admin from './pages/admin/Admin';
import Loading from './components/Loading';

function App() {
  const is_admin = useSelector((store: RootState) => store.auth?.user?.is_admin)
  const isLoading = useSelector((store: RootState) => store.auth?.isLoading)
  const isAuthenticated = useSelector((store: RootState) => store.auth?.isAuthenticated)

  return (
    <WalletProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="flex-1 mt-[70px]">
            {
              isLoading ?
                <Loading content="Data" />
                :
                <Routes>
                  {
                    routes.map(route => (isAuthenticated || route.public) && <Route key={route.path} {...route} />)
                  }
                  {is_admin && <Route path='/admin' element={<Admin />} />}
                </Routes>
            }
          </main>
          <Footer />
          <ToastContainer />
        </div>
      </Router>
    </WalletProvider>
  );
}

export default App;
