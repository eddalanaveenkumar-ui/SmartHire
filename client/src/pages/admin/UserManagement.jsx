import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { adminAPI } from '../../services/api';
import { toast } from 'react-hot-toast';
import {
  Users, Search, Ban, Trash2, Shield, UserCheck, UserX,
  Loader2, ChevronLeft, ChevronRight, Mail, Calendar, Filter
} from 'lucide-react';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, pagination.page]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = { page: pagination.page, limit: 20 };
      if (roleFilter !== 'all') params.role = roleFilter;
      if (search) params.search = search;
      const res = await adminAPI.getUsers(params);
      setUsers(res.data.users);
      setPagination(prev => ({ ...prev, ...res.data.pagination }));
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleBan = async (id) => {
    setActionLoading(id);
    try {
      const res = await adminAPI.toggleBan(id);
      setUsers(prev => prev.map(u => u._id === id ? { ...u, isBanned: !u.isBanned } : u));
      toast.success(res.message);
    } catch (error) {
      toast.error('Failed to update user');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure? This will delete all associated data.')) return;
    setActionLoading(id);
    try {
      await adminAPI.deleteUser(id);
      setUsers(prev => prev.filter(u => u._id !== id));
      toast.success('User deleted');
    } catch (error) {
      toast.error('Failed to delete user');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchUsers();
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-gray-600 dark:text-gray-400">{pagination.total} total users</p>
          </div>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <form onSubmit={handleSearch} className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or email..."
                className="input-field pl-10"
              />
            </div>
          </form>
          <div className="flex gap-2">
            {['all', 'candidate', 'recruiter', 'admin'].map(role => (
              <button
                key={role}
                onClick={() => { setRoleFilter(role); setPagination(prev => ({ ...prev, page: 1 })); }}
                className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-colors ${
                  roleFilter === role
                    ? 'bg-primary-500 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
          </div>
        ) : (
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <th className="text-left p-4 text-sm font-medium text-gray-500">User</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-500">Role</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-500">Status</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-500">Joined</th>
                    <th className="text-right p-4 text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, i) => (
                    <motion.tr
                      key={user._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                            user.role === 'admin' ? 'bg-red-500' : user.role === 'recruiter' ? 'bg-green-500' : 'bg-primary-500'
                          }`}>
                            {user.name?.charAt(0)?.toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                          user.role === 'admin' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                          user.role === 'recruiter' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                          'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4">
                        {user.isBanned ? (
                          <span className="flex items-center gap-1 text-red-600 text-sm">
                            <Ban className="w-4 h-4" /> Banned
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-green-600 text-sm">
                            <Shield className="w-4 h-4" /> Active
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleBan(user._id)}
                            disabled={actionLoading === user._id || user.role === 'admin'}
                            className={`p-2 rounded-lg transition-colors ${
                              user.isBanned
                                ? 'hover:bg-green-50 dark:hover:bg-green-900/20 text-green-600'
                                : 'hover:bg-yellow-50 dark:hover:bg-yellow-900/20 text-yellow-600'
                            } disabled:opacity-50`}
                            title={user.isBanned ? 'Unban' : 'Ban'}
                          >
                            {actionLoading === user._id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : user.isBanned ? (
                              <UserCheck className="w-4 h-4" />
                            ) : (
                              <UserX className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDelete(user._id)}
                            disabled={actionLoading === user._id || user.role === 'admin'}
                            className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 transition-colors disabled:opacity-50"
                            title="Delete"
                          >
                            {actionLoading === user._id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-between p-4 border-t border-gray-100 dark:border-gray-800">
                <p className="text-sm text-gray-500">
                  Page {pagination.page} of {pagination.pages}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    disabled={pagination.page === 1}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={pagination.page === pagination.pages}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
