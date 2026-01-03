import { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { FaCheck, FaTimes, FaEdit, FaTrash } from 'react-icons/fa';

const EmployeeListPage = () => {
    const { user } = useAuth();
    const [employees, setEmployees] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentEmpId, setCurrentEmpId] = useState(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        employeeId: '',
        jobTitle: '',
        department: ''
    });

    useEffect(() => {
        if (user?.role === 'Admin') {
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

    const handleVerify = async (id, status) => {
        try {
            await api.put(`/employees/${id}/verify`, { status });
            toast.success(`User ${status === 'active' ? 'Approved' : 'Rejected'}`);
            fetchEmployees();
        } catch (error) {
             toast.error('Verification failed');
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const openAddModal = () => {
        setIsEditing(false);
        setCurrentEmpId(null);
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            employeeId: '',
            jobTitle: '',
            department: ''
        });
        setShowModal(true);
    };

    const openEditModal = (emp) => {
        setIsEditing(true);
        setCurrentEmpId(emp._id);
        setFormData({
            firstName: emp.firstName,
            lastName: emp.lastName,
            email: emp.user?.email || '',
            password: '', // Leave blank to keep unchanged
            employeeId: emp.employeeId,
            jobTitle: emp.jobTitle,
            department: emp.department
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEditing) {
                // Update
                 const dataToSend = { ...formData };
                 if (!dataToSend.password) delete dataToSend.password;

                await api.put(`/employees/${currentEmpId}`, dataToSend);
                toast.success('Employee updated successfully');
            } else {
                // Create
                await api.post('/employees', formData);
                toast.success('Employee added successfully');
            }
            setShowModal(false);
            fetchEmployees();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.error || 'Operation failed');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this employee? This action cannot be undone.')) {
            try {
                await api.delete(`/employees/${id}`);
                toast.success('Employee deleted successfully');
                fetchEmployees();
            } catch (error) {
                console.error(error);
                toast.error('Failed to delete employee');
            }
        }
    };

    if (user?.role !== 'Admin') {
        return <Navigate to="/dashboard" />;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">Employees & Verification</h2>
                <button 
                    onClick={openAddModal}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition"
                >
                    Add Employee
                </button>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name/ID</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Dept/Role</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                             {employees.map((emp) => (
                                <tr key={emp._id} className="hover:bg-gray-50 transition">
                                    <td className="px-5 py-4 border-b border-gray-200 text-sm">
                                        <div className="flex items-center">
                                            <div className="ml-0">
                                                <p className="text-gray-900 font-semibold">{emp.firstName} {emp.lastName}</p>
                                                <p className="text-gray-500 text-xs">{emp.employeeId}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 border-b border-gray-200 text-sm">
                                        <p className="text-gray-900">{emp.department}</p>
                                        <p className="text-gray-500 text-xs">{emp.jobTitle}</p>
                                    </td>
                                    <td className="px-5 py-4 border-b border-gray-200 text-sm text-gray-600">{emp.user?.email}</td>
                                    <td className="px-5 py-4 border-b border-gray-200 text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            emp.user?.status === 'active' ? 'bg-green-100 text-green-800' : 
                                            emp.user?.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {emp.user?.status || 'Active'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 border-b border-gray-200 text-sm">
                                        <div className="flex items-center space-x-3">
                                            {emp.user?.status === 'pending' && (
                                                <>
                                                    <button onClick={() => handleVerify(emp._id, 'active')} title="Approve" className="text-green-600 hover:text-green-900"><FaCheck /></button>
                                                    <button onClick={() => handleVerify(emp._id, 'rejected')} title="Reject" className="text-red-600 hover:text-red-900"><FaTimes /></button>
                                                    <span className="text-gray-300">|</span>
                                                </>
                                            )}
                                            <button 
                                                onClick={() => openEditModal(emp)}
                                                className="text-blue-600 hover:text-blue-900 font-medium transition"
                                                title="Edit"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(emp._id)}
                                                className="text-red-600 hover:text-red-900 font-medium transition"
                                                title="Delete"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Employee Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-800">{isEditing ? 'Edit Employee' : 'Add New Employee'}</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                &times;
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                    <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                    <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" required disabled={isEditing} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Password {isEditing && '(Leave blank to keep)'}</label>
                                    <input type="password" name="password" value={formData.password} onChange={handleInputChange} className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" required={!isEditing} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
                                    <input type="text" name="employeeId" value={formData.employeeId} onChange={handleInputChange} className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                                    <input type="text" name="jobTitle" value={formData.jobTitle} onChange={handleInputChange} className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" required />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                    <select name="department" value={formData.department} onChange={handleInputChange} className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" required>
                                        <option value="">Select Department</option>
                                        <option value="Engineering">Engineering</option>
                                        <option value="HR">HR</option>
                                        <option value="Sales">Sales</option>
                                        <option value="Marketing">Marketing</option>
                                        <option value="Finance">Finance</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mt-8 flex justify-end space-x-3">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50">Cancel</button>
                                <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
                                    {loading ? (isEditing ? 'Updating...' : 'Adding...') : (isEditing ? 'Update Employee' : 'Add Employee')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeeListPage;
