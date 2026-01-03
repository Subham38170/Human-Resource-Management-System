import { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

const ProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const { data } = await api.get('/employees/me');
            setProfile(data.data);
        } catch (error) {
            console.error(error);
            // If 404, maybe offer to create?
             if (error.response && error.response.status === 404) {
                 toast.info('Please complete your profile.');
             } else {
                 toast.error('Failed to load profile');
             }
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading Profile...</div>;

    if (!profile) {
        return (
            <div className="p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Complete Your Profile</h2>
                <p>You haven't set up your employee profile yet.</p>
                <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">Get Started</button>
                {/* Add Create Profile Form here or modal */}
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="md:flex">
                <div className="md:flex-shrink-0 bg-gray-100 p-8 flex justify-center items-center">
                    <img className="h-32 w-32 rounded-full object-cover" src={profile.profilePicture} alt="Profile" />
                </div>
                <div className="p-8">
                    <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">{profile.jobTitle}</div>
                    <h2 className="block mt-1 text-lg leading-tight font-medium text-black">{profile.firstName} {profile.lastName}</h2>
                    <p className="mt-2 text-gray-500">{profile.department}</p>
                    
                    <div className="mt-6 border-t pt-4">
                        <h3 className="text-gray-700 font-bold mb-2">Contact Information</h3>
                        <p className="text-gray-600">Email: {profile.user.email}</p>
                        <p className="text-gray-600">Phone: {profile.contact?.phone || 'N/A'}</p>
                        <p className="text-gray-600">Address: {profile.contact?.address || 'N/A'}</p>
                    </div>

                    <div className="mt-6 border-t pt-4">
                        <h3 className="text-gray-700 font-bold mb-2">Employment Details</h3>
                        <p className="text-gray-600">Employee ID: {profile.employeeId}</p>
                        <p className="text-gray-600">Joined: {new Date(profile.dateOfJoining).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
