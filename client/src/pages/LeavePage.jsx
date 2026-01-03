import { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const LeavePage = () => {
    const { user } = useAuth();
    const [leaves, setLeaves] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        type: 'Paid',
        startDate: '',
        endDate: '',
        reason: ''
    });

    useEffect(() => {
        fetchLeaves();
    }, [user]);

    const fetchLeaves = async () => {
        try {
            const endpoint = user?.role === 'Admin' ? '/leaves/all' : '/leaves/my-leaves';
            const { data } = await api.get(endpoint);
            setLeaves(data.data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch leaves');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/leaves', formData);
            toast.success('Leave applied successfully');
            setShowModal(false);
            fetchLeaves();
            setFormData({ type: 'Paid', startDate: '', endDate: '', reason: '' });
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to apply for leave');
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await api.put(`/leaves/${id}`, { status });
            toast.success(`Leave ${status} successfully`);
            fetchLeaves();
        } catch (error) {
            toast.error('Failed to update leave status');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">{user?.role === 'Admin' ? 'All Leave Requests' : 'My Leaves'}</h2>
                <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-700 transition font-medium">Apply Leave</button>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr>
                                {user?.role === 'Admin' && (
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Employee</th>
                                )}
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Start Date</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">End Date</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Reason</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                {user?.role === 'Admin' && (
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {leaves.map((leave) => (
                                <tr key={leave._id} className="hover:bg-gray-50 transition">
                                    {user?.role === 'Admin' && (
                                        <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                            <div className="flex items-center">
                                                <div className="font-semibold text-gray-900">
                                                     {leave.employee ? `${leave.employee.firstName} ${leave.employee.lastName}` : 'Unknown'}
                                                </div>
                                            </div>
                                        </td>
                                    )}
                                    <td className="px-5 py-5 border-b border-gray-200 text-sm">{leave.type}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 text-sm">{new Date(leave.startDate).toLocaleDateString()}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 text-sm">{new Date(leave.endDate).toLocaleDateString()}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 text-sm max-w-xs truncate" title={leave.reason}>{leave.reason}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            leave.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                                            leave.status === 'Rejected' ? 'bg-red-100 text-red-800' : 
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {leave.status}
                                        </span>
                                    </td>
                                    {user?.role === 'Admin' && (
                                        <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                            {leave.status === 'Pending' && (
                                                <div className="flex space-x-2">
                                                    <button 
                                                        onClick={() => handleStatusUpdate(leave._id, 'Approved')}
                                                        className="text-green-600 hover:text-green-900 font-semibold"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button 
                                                        onClick={() => handleStatusUpdate(leave._id, 'Rejected')}
                                                        className="text-red-600 hover:text-red-900 font-semibold"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            ))}
                            {leaves.length === 0 && (
                                <tr>
                                    <td colSpan={user?.role === 'Admin' ? 7 : 5} className="px-5 py-8 text-center text-gray-500">
                                        No leave records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-800">Apply for Leave</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">&times;</button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Leave Type</label>
                                <select className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                                    <option value="Paid">Paid Leave</option>
                                    <option value="Sick">Sick Leave</option>
                                    <option value="Unpaid">Unpaid Leave</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Start Date</label>
                                    <input type="date" className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} required />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">End Date</label>
                                    <input type="date" className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} required />
                                </div>
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Reason</label>
                                <textarea className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" rows="3" value={formData.reason} onChange={(e) => setFormData({...formData, reason: e.target.value})} required placeholder="Brief reason for leave..."></textarea>
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Submit Request</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LeavePage;
