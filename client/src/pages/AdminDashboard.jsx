import { FaUsers, FaUserClock, FaCalendarMinus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Overview</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm flex items-center border border-gray-100">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-full mr-4">
            <FaUsers size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium">Total Employees</p>
            <p className="text-2xl font-bold text-gray-800">24</p> {/* Placeholder */}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm flex items-center border border-gray-100">
          <div className="p-3 bg-green-100 text-green-600 rounded-full mr-4">
            <FaUserClock size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium">On Time Today</p>
            <p className="text-2xl font-bold text-gray-800">18</p> {/* Placeholder */}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm flex items-center border border-gray-100">
          <div className="p-3 bg-orange-100 text-orange-600 rounded-full mr-4">
            <FaCalendarMinus size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium">Pending Leaves</p>
            <p className="text-2xl font-bold text-gray-800">3</p> {/* Placeholder */}
          </div>
        </div>
      </div>

       <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h4 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h4>
            <div className="flex space-x-4">
                <button 
                    onClick={() => navigate('/employees')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition shadow-sm font-medium"
                >
                    Add Employee
                </button>
                <button 
                    onClick={() => navigate('/payroll')}
                    className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition shadow-sm font-medium"
                >
                    Process Payroll
                </button>
            </div>
       </div>
    </div>
  );
};

export default AdminDashboard;
