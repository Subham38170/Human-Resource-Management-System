import { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

const PayrollPage = () => {
    const [payrolls, setPayrolls] = useState([]);

    useEffect(() => {
        fetchPayrolls();
    }, []);

    const fetchPayrolls = async () => {
        try {
            const { data } = await api.get('/payroll/my-slips');
            setPayrolls(data.data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch payroll records');
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Payroll History</h2>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Month / Year</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Basic Salary</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Allowances</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Deductions</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Net Salary</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payrolls.map((slip) => (
                            <tr key={slip._id}>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{slip.month} {slip.year}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">${slip.basicSalary}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-green-600">+${slip.allowances}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-red-600">-${slip.deductions}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm font-bold">${slip.netSalary}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${slip.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {slip.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                         {payrolls.length === 0 && (
                            <tr>
                                <td colSpan="6" className="px-5 py-5 text-center text-gray-500">No payroll records found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PayrollPage;
