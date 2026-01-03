import { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

const AttendancePage = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const { data } = await api.get('/attendance/my-history');
            setHistory(data.data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load attendance history');
        } finally {
            setLoading(false);
        }
    };

    const handleCheckIn = async () => {
        try {
            await api.post('/attendance/check-in');
            toast.success('Checked in successfully!');
            fetchHistory();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Check-in failed');
        }
    };

    const handleCheckOut = async () => {
        try {
            await api.post('/attendance/check-out');
            toast.success('Checked out successfully!');
            fetchHistory();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Check-out failed');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Attendance</h2>
                <div className="space-x-4">
                    <button onClick={handleCheckIn} className="bg-green-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-green-700 transition font-medium">Check In</button>
                    <button onClick={handleCheckOut} className="bg-red-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-red-700 transition font-medium">Check Out</button>
                </div>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Check In</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Check Out</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Duration (Hrs)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.map((record) => (
                            <tr key={record._id}>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    {new Date(record.date).toLocaleDateString()}
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <span className={`relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight`}>
                                        <span aria-hidden className="absolute inset-0 bg-green-200 opacity-50 rounded-full"></span>
                                        <span className="relative">{record.status}</span>
                                    </span>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    {record.checkIn ? new Date(record.checkIn).toLocaleTimeString() : '-'}
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    {record.checkOut ? new Date(record.checkOut).toLocaleTimeString() : '-'}
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    {record.workDuration || '-'}
                                </td>
                            </tr>
                        ))}
                        {history.length === 0 && (
                            <tr>
                                <td colSpan="5" className="px-5 py-5 text-center text-gray-500">No attendance records found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AttendancePage;
