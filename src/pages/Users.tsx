
import React from 'react';
import Layout from '../components/layout/Layout';
import { Plus } from 'lucide-react';

const Users: React.FC = () => {
  return (
    <Layout activeSection="users">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Users</h1>
            <p className="text-gray-600 mt-1">Manage staff and customer accounts</p>
          </div>
          <button className="flex items-center gap-2 bg-laundry-blue hover:bg-laundry-blue-dark text-white font-medium py-2 px-4 rounded-md transition-colors">
            <Plus size={18} />
            <span>Add User</span>
          </button>
        </div>
        
        <div className="glass-card p-8 min-h-[300px] flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">User management section is under development.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Users;
