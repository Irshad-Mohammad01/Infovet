import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderGit2,
  PlusCircle,
  Edit2,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Star,
  Search,
} from 'lucide-react';
import { fetchAdminProjects, deleteAdminProject } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { normalizeImageUrl } from '../../utils/imageUrl';

const ManageProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');

  const loadProjects = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAdminProjects(search ? { search } : {});
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load projects.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    loadProjects();
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to permanently delete the project "${title}" and all its gallery screenshots?`)) {
      return;
    }
    try {
      await deleteAdminProject(id);
      setSuccess(`Project "${title}" deleted.`);
      loadProjects();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to delete project.');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.25rem' }}>
            Projects / Portfolio
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Manage client case studies, live demo links, technical features, and multi-image screenshot galleries.
          </p>
        </div>

        <Link
          to="/admin/projects/new"
          className="btn btn-primary btn-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <PlusCircle size={16} />
          <span>Add New Project</span>
        </Link>
      </div>

      {success && (
        <div style={{ padding: '0.85rem 1rem', borderRadius: '8px', backgroundColor: 'var(--success-bg)', color: 'var(--success)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
          <CheckCircle2 size={16} />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div style={{ padding: '0.85rem 1rem', borderRadius: '8px', backgroundColor: 'var(--error-bg)', color: 'var(--error)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Filter / Search Bar */}
      <div className="card" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem', border: '1px solid var(--border)' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search projects by title, category, or client..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '2.5rem', height: '38px', fontSize: '0.875rem' }}
            />
          </div>
          <button type="submit" className="btn btn-secondary btn-sm">
            Search
          </button>
        </form>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading projects..." />
      ) : projects.length === 0 ? (
        <div className="card" style={{ padding: '3.5rem 2rem', textAlign: 'center' }}>
          <FolderGit2 size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No Projects Found</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            {search ? 'Try clearing your search query.' : 'Click "Add New Project" to publish your first case study.'}
          </p>
          <Link to="/admin/projects/new" className="btn btn-primary btn-sm">
            Add New Project
          </Link>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--border)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead style={{ backgroundColor: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
              <tr>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: 'var(--text-secondary)', width: '80px' }}>Preview</th>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Title & Client</th>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Category</th>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Status</th>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Featured</th>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: 'var(--text-secondary)', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((proj) => {
                const thumb = normalizeImageUrl(proj.thumbnail_url);
                return (
                  <tr key={proj.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '0.75rem 1.25rem' }}>
                      <div style={{ width: '64px', height: '42px', borderRadius: '6px', overflow: 'hidden', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border)' }}>
                        {thumb ? (
                          <img src={thumb} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                            <FolderGit2 size={16} />
                          </div>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem 1.25rem' }}>
                      <div style={{ fontWeight: 700, color: 'var(--text)' }}>
                        <Link to={`/admin/projects/${proj.id}/edit`} style={{ color: 'inherit', textDecoration: 'none' }}>
                          {proj.title}
                        </Link>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                        Client: {proj.client_name || 'Internal Product'} {proj.completion_date ? `• ${proj.completion_date}` : ''}
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem 1.25rem' }}>
                      <span style={{ fontSize: '0.8rem', backgroundColor: 'var(--bg)', padding: '0.2rem 0.55rem', borderRadius: '4px', border: '1px solid var(--border)', fontWeight: 500 }}>
                        {proj.category}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1.25rem' }}>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          padding: '0.15rem 0.5rem',
                          borderRadius: '999px',
                          backgroundColor: proj.status === 'Completed' ? '#DCFCE7' : '#EFF6FF',
                          color: proj.status === 'Completed' ? '#15803D' : '#2563EB',
                        }}
                      >
                        {proj.status || 'Active'}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1.25rem' }}>
                      {proj.is_featured ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', fontWeight: 700, color: '#F59E0B' }}>
                          <Star size={13} fill="#F59E0B" /> Yes
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>No</span>
                      )}
                    </td>
                    <td style={{ padding: '0.75rem 1.25rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <Link
                          to={`/projects/${proj.slug || proj.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-outline btn-sm"
                          style={{ padding: '0.3rem 0.55rem' }}
                          title="View Live Page"
                        >
                          <ExternalLink size={13} />
                        </Link>
                        <Link
                          to={`/admin/projects/${proj.id}/edit`}
                          className="btn btn-outline btn-sm"
                          style={{ padding: '0.3rem 0.55rem' }}
                          title="Edit Project"
                        >
                          <Edit2 size={13} />
                        </Link>
                        <button
                          onClick={() => handleDelete(proj.id, proj.title)}
                          className="btn btn-outline btn-sm"
                          style={{ padding: '0.3rem 0.55rem', color: 'var(--error)', borderColor: 'var(--error)' }}
                          title="Delete Project"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageProjects;

