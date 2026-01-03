import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import ProfilePage from './pages/ProfilePage';
import AttendancePage from './pages/AttendancePage';
import LeavePage from './pages/LeavePage';
import PayrollPage from './pages/PayrollPage';
import EmployeeListPage from './pages/EmployeeListPage';
import { useAuth } from './context/AuthContext';


const DashboardSwitcher = () => {
    const { user } = useAuth();
    return user?.role === 'Admin' ? <AdminDashboard /> : <EmployeeDashboard />;
};

function App() {

  return (
    <Router>
      <AuthProvider>
        <div className="App font-sans text-gray-900 bg-gray-50 min-h-screen">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                 <Route path="/dashboard" element={<DashboardSwitcher />} />
                 <Route path="/profile" element={<ProfilePage />} />
                 <Route path="/attendance" element={<AttendancePage />} />
                 <Route path="/leaves" element={<LeavePage />} />
                 <Route path="/payroll" element={<PayrollPage />} />
                 <Route path="/employees" element={<EmployeeListPage />} />
                 {/* Add other nested routes here later */}
              </Route>

            </Route>


            {/* Redirect root to login */}
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
