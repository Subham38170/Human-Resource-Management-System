import { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const EmployeeListPage = () => {
    const { user } = useAuth();
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        if (user.role === 'Admin') {
            fetchEmployees();
        }
    }, [user]);

    const fetchEmployees = async () => {
        try {
            const { data } = await api.get('/employees');
            setEmployees(data.data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch employees');
        }
    };

    if (user.role !== 'Admin') {
        return <Navigate to="/dashboard" />;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Employees</h2>
                <button className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">Add Employee</button>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Employee ID</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Department</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Job Title</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                         {employees.map((emp) => (
                            <tr key={emp._id}>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{emp.employeeId}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 w-8 h-8">
                                            <img className="w-full h-full rounded-full" src={emp.profilePicture} alt="" />
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-gray-900 whitespace-no-wrap">{emp.firstName} {emp.lastName}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{emp.department}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{emp.jobTitle}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{emp.user?.email}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <div className="flex space-x-3">
                                        <button className="text-blue-600 hover:text-blue-900 font-medium">Edit</button>
                                        <button className="text-red-600 hover:text-red-900 font-medium">Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                         {employees.length === 0 && (
                            <tr>
                                <td colSpan="6" className="px-5 py-5 text-center text-gray-500">No employees found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EmployeeListPage;
