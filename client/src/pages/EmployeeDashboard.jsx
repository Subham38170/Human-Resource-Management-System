import { FaClipboardList, FaClock } from 'react-icons/fa';

const EmployeeDashboard = () => {
    // Placeholder Data
    const attendanceStats = {
        present: 15,
        leaves: 2,
        absent: 0
    };

  return (
    <div>
       <h3 className="text-2xl font-bold text-gray-800 mb-6">My Dashboard</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
                <FaClock className="text-blue-500 mr-2" />
                <h4 className="font-semibold text-gray-700">Today's Activity</h4>
            </div>
            <p className="text-sm text-gray-500 mb-4">You checked in at <span className="font-bold text-gray-800">09:00 AM</span></p>
            <button className="w-full bg-red-50 text-red-600 border border-red-200 py-2 rounded-md hover:bg-red-100">Check Out</button>
         </div>

         <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
                <FaClipboardList className="text-green-500 mr-2" />
                <h4 className="font-semibold text-gray-700">Attendance This Month</h4>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
                <p>Present: <span className="font-bold text-gray-800">{attendanceStats.present}</span></p>
                <p>Leaves: <span className="font-bold text-gray-800">{attendanceStats.leaves}</span></p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
