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

function App() {
  const is_admin = useSelector((store: RootState) => store.auth?.user?.is_admin)
  const isAuthenticated = useSelector((store: RootState) => store.auth?.isAuthenticated)

  return (
    <WalletProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="flex-1 mt-[70px]">
            <Routes>
              {
                routes.map(route => (isAuthenticated || route.public) && <Route {...route} />)
              }
              {is_admin && <Route path='/admin' element={<Admin />} />}
            </Routes>
          </main>
          <Footer />
          <ToastContainer />
        </div>
      </Router>
    </WalletProvider>
  );
}

export default App;
