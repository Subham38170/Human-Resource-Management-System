import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUser, FaIdCard } from 'react-icons/fa';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    employeeId: '',
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
      toast.error('Please fill in required fields');
      return;
    }

    setLoading(true);
    try {
        const res = await register(formData);
        if (res.success) {
            toast.info('Account created! Pending HR verification.');
            navigate('/login');
        }
    } catch (error) {
        console.error("Register error", error);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 py-10">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 transform transition-all duration-300 hover:shadow-xl">
        <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Join Dayflow</h2>
            <p className="text-gray-500 font-medium">Employee Registration</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-gray-700 text-sm font-semibold mb-1">First Name</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><FaUser /></div>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="John" required />
                </div>
              </div>
              <div className="w-1/2">
                <label className="block text-gray-700 text-sm font-semibold mb-1">Last Name</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="Doe" required />
              </div>
          </div>

          <div>
             <label className="block text-gray-700 text-sm font-semibold mb-1">Employee ID</label>
             <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><FaIdCard /></div>
                <input type="text" name="employeeId" value={formData.employeeId} onChange={handleChange} className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="EMP-001" required />
             </div>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-1">Email Address</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><FaEnvelope /></div>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="example@company.com" required />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-1">Password</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><FaLock /></div>
                <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} className="w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="******" required />
                <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-all ${loading ? 'opacity-70' : ''}`}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

         <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
                Already have an account? <Link to="/login" className="text-blue-600 hover:text-blue-800 font-semibold hover:underline">Login</Link>
            </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
