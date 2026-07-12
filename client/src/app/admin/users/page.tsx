'use client';

import { useEffect, useState } from 'react';
import { authHeaders } from '../../../lib/auth';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const AdminUsersPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      const response = await fetch(`${API_BASE}/admin/users`, { headers: authHeaders() });
      const data = await response.json();
      setUsers(data.users || []);
      setLoading(false);
    };
    loadUsers();
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
      <h1 className="text-3xl font-semibold text-slate-900">User management</h1>
      <p className="mt-3 text-slate-600">View customer accounts, roles, and referral balances.</p>
      <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Role</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Wallet</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-6 text-center text-sm text-slate-500">Loading users...</td>
              </tr>
            ) : users.length ? (
              users.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 text-sm text-slate-700">{user.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{user.email}</td>
                  <td className="px-6 py-4 text-sm text-slate-700 uppercase">{user.role}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">₹{user.walletBalance || 0}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-6 text-center text-sm text-slate-500">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsersPage;
