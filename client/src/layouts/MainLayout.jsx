import { useState } from 'react';
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaSignOutAlt, FaHome, FaUsers, FaCalendarAlt, FaMoneyBillWave, FaBars, FaTimes, FaClipboardList } from 'react-icons/fa';

const MainLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isAdmin = user?.role === 'Admin';

    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: FaHome },
        { path: '/employees', label: 'Employees', icon: FaUsers, adminOnly: true },
        { path: '/attendance', label: 'Attendance', icon: FaClipboardList },
        { path: '/leaves', label: 'Leaves', icon: FaCalendarAlt },
        { path: '/payroll', label: 'Payroll', icon: FaMoneyBillWave },
    ];

    // Helper to get current page title
    const getPageTitle = () => {
        const currentItem = navItems.find(item => item.path === location.pathname);
        if (currentItem) return currentItem.label;
        if (location.pathname === '/profile') return 'Profile';
        return 'Admin Portal';
    };

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            {/* Sidebar (Mobile overlay + Desktop static) */}
            <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 flex flex-col`}>
                <div className="flex items-center justify-between h-16 px-6 bg-slate-950 border-b border-slate-800">
                    <h1 className="text-xl font-bold tracking-wider text-blue-400">Dayflow</h1>
                    <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
                        <FaTimes />
                    </button>
                </div>
                
                <nav className="flex-1 mt-6 px-3 space-y-1">
                    {navItems.map((item) => {
                        if (item.adminOnly && !isAdmin) return null;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link 
                                key={item.path} 
                                to={item.path} 
                                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors group ${
                                    isActive 
                                    ? 'bg-blue-600 text-white shadow-md' 
                                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                }`}
                            >
                                <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 bg-slate-950 border-t border-slate-800">
                    <div className="flex items-center">
                        <div className="min-w-[2.5rem] h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold shadow-sm">
                             {user?.email?.[0]?.toUpperCase() || <FaUser />}
                        </div>
                        <div className="ml-3 overflow-hidden">
                            <p className="text-sm font-medium text-white truncate" title={user?.email}>{user?.email}</p>
                            <p className="text-xs text-slate-400 truncate">{user?.role}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Navbar */}
                <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200 shadow-sm z-10">
                    <div className="flex items-center">
                        <button className="md:hidden text-gray-500 hover:text-gray-700 mr-4" onClick={() => setSidebarOpen(true)}>
                            <FaBars size={20} />
                        </button>
                        <h2 className="text-xl font-semibold text-gray-800">
                             {getPageTitle()}
                        </h2>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        <button onClick={handleLogout} className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                            <FaSignOutAlt className="mr-2" /> Logout
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
            
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden" 
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}
        </div>
    );
};

export default MainLayout;
