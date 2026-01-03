import { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const PayrollPage = () => {
    const { user } = useAuth();
    const [payrolls, setPayrolls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (user) {
            fetchPayrolls();
        }
    }, [user]);

    const fetchPayrolls = async () => {
        try {
            const endpoint = user.role === 'Admin' ? '/payroll/all' : '/payroll/my-slips';
            const { data } = await api.get(endpoint);
            setPayrolls(data.data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch payroll records');
        } finally {
            setLoading(false);
        }
    };

    const handleProcessPayroll = async () => {
        if (!window.confirm('Are you sure you want to process payroll for all employees?')) return;
        
        setProcessing(true);
        try {
            await api.post('/payroll/generate');
            toast.success('Payroll processed successfully');
            fetchPayrolls();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to process payroll');
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Payroll History</h2>
                {user?.role === 'Admin' && (
                    <button 
                        onClick={handleProcessPayroll} 
                        disabled={processing}
                        className={`bg-teal-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-teal-700 transition font-medium ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {processing ? 'Processing...' : 'Process Payroll'}
                    </button>
                )}
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-100">
                 <div className="overflow-x-auto">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr>
                                {user?.role === 'Admin' && (
                                     <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Employee Name</th>
                                )}
                                {user?.role === 'Admin' && (
                                     <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Employee ID</th>
                                )}
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Month / Year</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Basic Salary</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Allowances</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Deductions</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Net Salary</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payrolls.map((slip) => (
                                <tr key={slip._id} className="hover:bg-gray-50 transition">
                                    {user?.role === 'Admin' && (
                                         <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm font-medium">
                                            {slip.employee ? `${slip.employee.firstName} ${slip.employee.lastName}` : 'Unknown'}
                                         </td>
                                    )}
                                    {user?.role === 'Admin' && (
                                         <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-gray-500">
                                            {slip.employee?.employeeId || 'N/A'}
                                         </td>
                                    )}
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{slip.month} {slip.year}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">${slip.basicSalary}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-green-600">+${slip.allowances}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-red-600">-${slip.deductions}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm font-bold text-gray-800">${slip.netSalary}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${slip.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {slip.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                             {payrolls.length === 0 && (
                                <tr>
                                    <td colSpan={user?.role === 'Admin' ? 8 : 6} className="px-5 py-8 text-center text-gray-500">
                                        No payroll records found. <br />
                                        {user?.role === 'Admin' ? 'Click "Process Payroll" to generate slips.' : ''}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PayrollPage;
