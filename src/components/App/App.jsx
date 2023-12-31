// External Libraries
import CssBaseline from '@mui/material/CssBaseline';
import { HashRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { ToastContainer, Zoom } from 'react-toastify';

// Contexts
import { CompetitorProvider } from '../../contexts/CompetitorContext';
import { UserProvider } from '../../contexts/UserContext';

// Pages
import CreateLeaguePage from '../../pages/CreateLeaguePage';
import DashboardPage from '../../pages/DashboardPage';
import FindLeaguePage from '../../pages/FindLeaguePage.jsx';
import LandingPage from '../../pages/LandingPage.jsx';
import LeagueDetailsPage from '../../pages/LeagueDetailsPage';
import LoginPage from '../../pages/LoginPage.jsx';
import { RegisterPage } from '../../pages/RegisterPage';
import ResetPasswordPage from "../../pages/ResetPasswordPage.jsx";

// Components & Assets
import NavBar from '../NavBar/NavBar';
import PrivateRoute from '../PrivateRoute/PrivateRoute.jsx';

// CSS
import 'react-toastify/dist/ReactToastify.css';
import AboutPage from "../../pages/AboutPage.jsx";
import HelpPage from "../../pages/HelpPage.jsx";

const queryClient = new QueryClient();

function App() {
  return (
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <CompetitorProvider>
            <CssBaseline />
            <Router>
              <NavBar />
              <Routes>
                {/* Unprotected routes */}
                <Route path="/" element={<Navigate replace to="/landing" />} />
                <Route path='/landing' element={<LandingPage />} />
                <Route path='/login' element={<LoginPage />} />
                <Route path='/register' element={<RegisterPage />} />
                <Route path='/password-reset/:accessCode/:email' element={<ResetPasswordPage />} />
                <Route path='/about' element={<AboutPage />} />
                <Route path='/help' element={<HelpPage />} />
                {/* Protected routes */}
                <Route path='/dashboard' element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
                <Route path='/league-detail/:inviteCode' element={<PrivateRoute><LeagueDetailsPage /></PrivateRoute>} />
                <Route path='/find-league' element={<PrivateRoute><FindLeaguePage /></PrivateRoute>} />
                <Route path='/create' element={<PrivateRoute><CreateLeaguePage /></PrivateRoute>} />
              </Routes>
              <ToastContainer
                  position="top-right"
                  transition={Zoom}
                  autoClose={5000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="dark"
              />
            </Router>
          </CompetitorProvider>
        </UserProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
  )
}

export default App;
