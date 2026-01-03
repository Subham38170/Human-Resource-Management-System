import { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

const LeavePage = () => {
    const [leaves, setLeaves] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        type: 'Paid',
        startDate: '',
        endDate: '',
        reason: ''
    });

    useEffect(() => {
        fetchLeaves();
    }, []);

    const fetchLeaves = async () => {
        try {
            const { data } = await api.get('/leaves/my-leaves');
            setLeaves(data.data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch leaves');
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
            toast.error('Failed to apply for leave');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">My Leaves</h2>
                <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-700 transition font-medium">Apply Leave</button>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Start Date</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">End Date</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Reason</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaves.map((leave) => (
                            <tr key={leave._id}>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{leave.type}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{new Date(leave.startDate).toLocaleDateString()}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{new Date(leave.endDate).toLocaleDateString()}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${leave.status === 'Approved' ? 'bg-green-100 text-green-800' : leave.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {leave.status}
                                    </span>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{leave.reason}</td>
                            </tr>
                        ))}
                         {leaves.length === 0 && (
                            <tr>
                                <td colSpan="5" className="px-5 py-5 text-center text-gray-500">No leave records found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                    <div className="bg-white p-5 rounded-lg shadow-xl w-96">
                        <h3 className="text-lg font-bold mb-4">Apply for Leave</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Type</label>
                                <select className="w-full border rounded px-3 py-2" value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                                    <option>Paid</option>
                                    <option>Sick</option>
                                    <option>Unpaid</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Start Date</label>
                                <input type="date" className="w-full border rounded px-3 py-2" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} required />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">End Date</label>
                                <input type="date" className="w-full border rounded px-3 py-2" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} required />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Reason</label>
                                <textarea className="w-full border rounded px-3 py-2" value={formData.reason} onChange={(e) => setFormData({...formData, reason: e.target.value})} required></textarea>
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button type="button" onClick={() => setShowModal(false)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded">Cancel</button>
                                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LeavePage;
