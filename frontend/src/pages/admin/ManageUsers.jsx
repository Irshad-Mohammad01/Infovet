import React, { useState, useEffect, useCallback } from 'react';
import {
  Users,
  Search,
  CheckCircle,
  XCircle,
  Shield,
  ShieldCheck,
  User,
  Filter,
} from 'lucide-react';
import { fetchAdminUsers, updateAdminUserStatus } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [error, setError] = useState('');

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAdminUsers({
        q: search || undefined,
        role: roleFilter || undefined,
      });
      setUsers(data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch registered users.');
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadUsers();
  };

  const handleToggleActive = async (userId, currentActive) => {
    try {
      const updated = await updateAdminUserStatus(userId, {
        is_active: !currentActive,
      });
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, is_active: updated.is_active } : u))
      );
    } catch (err) {
      setError(err.message || 'Failed to change user activation state.');
    }
  };

  const handleChangeRole = async (userId, newRole) => {
    try {
      const updated = await updateAdminUserStatus(userId, {
        role: newRole,
      });
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: updated.role } : u))
      );
    } catch (err) {
      setError(err.message || 'Failed to update user role.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>User Management</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
          Inspect registered candidate and administrator accounts ({users.length} registered accounts)
        </p>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: '0.5rem' }}>
          {error}
        </div>
      )}

      {/* Filter Bar */}
      <div
        className="card"
        style={{
          padding: '1rem 1.25rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        <form
          onSubmit={handleSearchSubmit}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '220px', maxWidth: '380px' }}
        >
          <div style={{ position: 'relative', width: '100%' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search user name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '2.25rem', height: '40px' }}
            />
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-secondary)',
              }}
            />
          </div>
          <button type="submit" className="btn btn-outline btn-sm" style={{ height: '40px' }}>
            Search
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            <Filter size={16} /> Filter Role:
          </div>
          <select
            className="form-select"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            style={{ width: 'auto', minWidth: '150px', height: '40px' }}
          >
            <option value="">All Roles</option>
            <option value="customer">Candidate / Customer</option>
            <option value="admin">Administrator</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem 0' }}>
            <LoadingSpinner text="Retrieving accounts..." />
          </div>
        ) : users.length === 0 ? (
          <div style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
            <Users size={36} style={{ color: 'var(--text-secondary)', margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>No user accounts found</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              {search || roleFilter
                ? 'Try adjusting your search criteria.'
                : 'Accounts will appear here once candidates register.'}
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr
                  style={{
                    backgroundColor: '#F8F7FC',
                    borderBottom: '1px solid var(--border-color)',
                    fontSize: '0.8125rem',
                    color: 'var(--text-secondary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  <th style={{ padding: '0.875rem 1.25rem', fontWeight: 600 }}>Account</th>
                  <th style={{ padding: '0.875rem 1rem', fontWeight: 600 }}>Role</th>
                  <th style={{ padding: '0.875rem 1rem', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '0.875rem 1rem', fontWeight: 600 }}>Joined Date</th>
                  <th style={{ padding: '0.875rem 1.25rem', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr
                    key={u.id}
                    style={{
                      borderBottom: '1px solid var(--border-color)',
                      fontSize: '0.875rem',
                      transition: 'background 0.15s ease',
                    }}
                  >
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            backgroundColor: u.role === 'admin' ? 'var(--primary)' : '#E9E5F0',
                            color: u.role === 'admin' ? '#fff' : 'var(--text-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '0.875rem',
                          }}
                        >
                          {u.full_name ? u.full_name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                            {u.full_name}
                          </div>
                          <div style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>
                            {u.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '1rem 1rem' }}>
                      <select
                        className="form-select"
                        value={u.role}
                        onChange={(e) => handleChangeRole(u.id, e.target.value)}
                        style={{
                          fontSize: '0.8125rem',
                          height: '32px',
                          width: 'auto',
                          fontWeight: 600,
                          padding: '0.2rem 1.75rem 0.2rem 0.6rem',
                        }}
                      >
                        <option value="customer">Customer</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>

                    <td style={{ padding: '1rem 1rem' }}>
                      <span className={`badge ${u.is_active ? 'badge-success' : 'badge-neutral'}`}>
                        {u.is_active ? 'Active' : 'Suspended'}
                      </span>
                    </td>

                    <td style={{ padding: '1rem 1rem', color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>
                      {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}
                    </td>

                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                      <button
                        onClick={() => handleToggleActive(u.id, u.is_active)}
                        className={`btn ${u.is_active ? 'btn-outline' : 'btn-primary'} btn-xs`}
                        style={{
                          color: u.is_active ? 'var(--danger)' : undefined,
                          borderColor: u.is_active ? 'rgba(220, 38, 38, 0.3)' : undefined,
                        }}
                      >
                        {u.is_active ? 'Suspend Account' : 'Reactivate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;

