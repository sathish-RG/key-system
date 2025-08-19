import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllMembers, fetchAllAdmins, updateUserRole } from '../redux/features/members/memberSlice';
import { Users, ShieldCheck, Mail, Phone, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

// Reusable Toggle Switch Component
const RoleToggle = ({ user, currentUser, onToggle }) => {
  const isCurrentUser = user._id === currentUser?._id;
  
  return (
    <label htmlFor={`toggle-${user._id}`} className="flex items-center cursor-pointer">
      <div className="relative">
        <input 
          id={`toggle-${user._id}`} 
          type="checkbox" 
          className="sr-only" 
          checked={user.role === 'admin'}
          disabled={isCurrentUser}
          onChange={() => onToggle(user, user.role === 'admin' ? 'member' : 'admin')}
        />
        <div className={`block w-14 h-8 rounded-full transition ${user.role === 'admin' ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
        <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${user.role === 'admin' ? 'transform translate-x-6' : ''}`}></div>
      </div>
      <div className={`ml-3 font-medium text-sm ${isCurrentUser ? 'text-gray-400' : 'text-gray-700'}`}>
        Admin
      </div>
    </label>
  );
};

const UserTable = ({ users, currentUser, onRoleChange, userType }) => (
  <table className="min-w-full divide-y divide-gray-200">
    <thead className="bg-gray-50">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined On</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{userType === 'member' ? 'Promote to Admin' : 'Admin Status'}</th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      {users.map((user) => (
        <tr key={user._id}>
          <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
          <td className="px-6 py-4">
            <div className="text-sm text-gray-900 flex items-center gap-2"><Mail size={14} />{user.email}</div>
            <div className="text-sm text-gray-500 flex items-center gap-2 mt-1"><Phone size={14} />{user.phoneNumber}</div>
          </td>
          <td className="px-6 py-4 text-sm text-gray-500">
            <div className="flex items-center gap-2"><Calendar size={14} />{new Date(user.createdAt).toLocaleDateString()}</div>
          </td>
          <td className="px-6 py-4">
            <RoleToggle user={user} currentUser={currentUser} onToggle={onRoleChange} />
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

const AdminMembers = () => {
  const [activeTab, setActiveTab] = useState('members');
  const dispatch = useDispatch();
  
  const { members, admins, loading, error } = useSelector((state) => state.members);
  const { user: currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchAllMembers());
    dispatch(fetchAllAdmins());
  }, [dispatch]);

  const handleRoleChange = (user, newRole) => {
    if (window.confirm(`Are you sure you want to change ${user.name}'s role to ${newRole}?`)) {
      dispatch(updateUserRole({ userId: user._id, role: newRole }))
        .unwrap()
        .then(() => toast.success(`${user.name}'s role updated to ${newRole}.`))
        .catch((err) => toast.error(err));
    }
  };
  
  const TabButton = ({ tabName, label, count, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition ${
        activeTab === tabName ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'
      }`}
    >
      <Icon size={16} />
      {label}
      <span className={`px-2 py-0.5 rounded-full text-xs ${
        activeTab === tabName ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
      }`}>{count}</span>
    </button>
  );

  return (
    <div className="w-full">
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <div className="flex items-center gap-2 mt-4 border-b pb-4">
          <TabButton tabName="members" label="Members" count={members.length} icon={Users} />
          <TabButton tabName="admins" label="Admins" count={admins.length} icon={ShieldCheck} />
        </div>
      </div>

      {error && <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg">Error: {error}</div>}

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <p className="p-6 text-center">Loading users...</p>
        ) : activeTab === 'members' ? (
          <UserTable users={members} currentUser={currentUser} onRoleChange={handleRoleChange} userType="member" />
        ) : (
          <UserTable users={admins} currentUser={currentUser} onRoleChange={handleRoleChange} userType="admin" />
        )}
      </div>
    </div>
  );
};

export default AdminMembers;