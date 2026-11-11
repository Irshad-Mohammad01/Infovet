/**
 * Centralized API service layer for INFOVET Job Portal.
 * Handles JWT token storage, error formatting, request dispatching, and multipart uploads.
 */

const BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  ''
).replace(/\/$/, '');

const TOKEN_KEY = 'infovet_token';

export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setToken = (token) => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    /* session memory only fallback */
  }
};

export const clearToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
};

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

function extractDetail(payload) {
  const detail = payload?.detail;
  if (!detail) return null;
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) {
    return detail
      .map((item) => {
        const field = item.loc?.filter((part) => part !== 'body').join(' ');
        return field ? `${field}: ${item.msg}` : item.msg;
      })
      .join('. ');
  }
  return null;
}

async function request(path, { method = 'GET', body, auth = false, isFormData = false } = {}) {
  const headers = {};

  if (!isFormData && body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  if (auth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: isFormData ? body : (body === undefined ? undefined : JSON.stringify(body)),
    });
  } catch {
    throw new ApiError('Could not reach the Infovet server. Please verify your internet connection or check if the backend is running.', 0);
  }

  if (response.status === 204) return null;

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    // Automatically clear stale credentials on 401 Unauthorized
    if (response.status === 401 && auth) {
      clearToken();
    }
    throw new ApiError(extractDetail(payload) ?? `Request failed (${response.status}).`, response.status);
  }

  return payload;
}

/* --------------------------------------------------------------------------
   Auth & Profile Endpoints
   -------------------------------------------------------------------------- */

export const registerUser = (userData) =>
  request('/api/auth/register', { method: 'POST', body: userData });

export const loginUser = (email, password) =>
  request('/api/auth/login', { method: 'POST', body: { email, password } });

export const fetchProfile = () =>
  request('/api/auth/me', { auth: true });

export const updateProfile = (profileData) =>
  request('/api/auth/profile', { method: 'PUT', body: profileData, auth: true });

export const changePassword = (current_password, new_password) =>
  request('/api/auth/change-password', {
    method: 'POST',
    body: { current_password, new_password },
    auth: true,
  });

/* --------------------------------------------------------------------------
   Jobs & Categories Endpoints
   -------------------------------------------------------------------------- */

export const fetchCategories = () =>
  request('/api/jobs/categories');

export const fetchJobs = (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') {
      query.append(key, val);
    }
  });
  const qs = query.toString();
  return request(`/api/jobs${qs ? `?${qs}` : ''}`, { auth: true });
};

export const fetchFeaturedJobs = (limit = 6) =>
  request(`/api/jobs/featured?limit=${limit}`, { auth: true });

export const fetchJobDetail = (id_or_slug) =>
  request(`/api/jobs/${id_or_slug}`, { auth: true });

/* --------------------------------------------------------------------------
   Candidate Applications & Bookmarks
   -------------------------------------------------------------------------- */

export const submitApplication = (applicationData) =>
  request('/api/applications', { method: 'POST', body: applicationData, auth: true });

export const fetchMyApplications = () =>
  request('/api/applications/my', { auth: true });

export const fetchApplicationDetail = (id) =>
  request(`/api/applications/${id}`, { auth: true });

export const toggleSaveJob = (jobId) =>
  request(`/api/saved-jobs/${jobId}`, { method: 'POST', auth: true });

export const fetchSavedJobs = () =>
  request('/api/saved-jobs', { auth: true });

/* --------------------------------------------------------------------------
   File Uploads (Resumes & Avatars)
   -------------------------------------------------------------------------- */

export const uploadResume = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return request('/api/uploads/resume', { method: 'POST', body: formData, auth: true, isFormData: true });
};

export const uploadAvatar = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return request('/api/uploads/avatar', { method: 'POST', body: formData, auth: true, isFormData: true });
};

export const uploadPlatformLogo = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return request('/api/uploads/logo', { method: 'POST', body: formData, auth: true, isFormData: true });
};

/* --------------------------------------------------------------------------
   Admin APIs
   -------------------------------------------------------------------------- */

export const adminLogin = (email, password) =>
  request('/api/admin/login', { method: 'POST', body: { email, password } });

export const fetchAdminStats = () =>
  request('/api/admin/stats', { auth: true });

export const fetchAdminJobs = (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') {
      query.append(key, val);
    }
  });
  const qs = query.toString();
  return request(`/api/admin/jobs${qs ? `?${qs}` : ''}`, { auth: true });
};

export const createAdminJob = (jobData) =>
  request('/api/admin/jobs', { method: 'POST', body: jobData, auth: true });

export const updateAdminJob = (id, jobData) =>
  request(`/api/admin/jobs/${id}`, { method: 'PUT', body: jobData, auth: true });

export const deleteAdminJob = (id) =>
  request(`/api/admin/jobs/${id}`, { method: 'DELETE', auth: true });

export const toggleAdminJobStatus = (id) =>
  request(`/api/admin/jobs/${id}/toggle-status`, { method: 'PATCH', auth: true });

export const fetchAdminApplicants = (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') {
      query.append(key, val);
    }
  });
  const qs = query.toString();
  return request(`/api/admin/applicants${qs ? `?${qs}` : ''}`, { auth: true });
};

export const fetchAdminApplicantDetail = (id) =>
  request(`/api/admin/applicants/${id}`, { auth: true });

export const updateAdminApplicationStatus = (id, { status, admin_notes }) =>
  request(`/api/admin/applicants/${id}/status`, {
    method: 'PATCH',
    body: { status, admin_notes },
    auth: true,
  });

export const fetchAdminUsers = (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') {
      query.append(key, val);
    }
  });
  const qs = query.toString();
  return request(`/api/admin/users${qs ? `?${qs}` : ''}`, { auth: true });
};

export const updateAdminUserStatus = (id, { is_active, role }) =>
  request(`/api/admin/users/${id}`, {
    method: 'PATCH',
    body: { is_active, role },
    auth: true,
  });

export const fetchAdminCategories = () =>
  request('/api/admin/categories', { auth: true });

export const createAdminCategory = (catData) =>
  request('/api/admin/categories', { method: 'POST', body: catData, auth: true });

export const updateAdminCategory = (id, catData) =>
  request(`/api/admin/categories/${id}`, { method: 'PUT', body: catData, auth: true });

export const deleteAdminCategory = (id) =>
  request(`/api/admin/categories/${id}`, { method: 'DELETE', auth: true });

export const fetchAdminSettings = () =>
  request('/api/admin/settings', { auth: true });

export const fetchAdminBrandingSettings = () =>
  request('/api/admin/settings/branding', { auth: true });

export const updateAdminBrandingSettings = (settingsData) =>
  request('/api/admin/settings/branding', { method: 'PUT', body: settingsData, auth: true });

/* --------------------------------------------------------------------------
   Public Platform Settings & Branding
   -------------------------------------------------------------------------- */

export const fetchPublicSettings = () =>
  request('/api/settings/public');

/* --------------------------------------------------------------------------
   Contact Endpoint (Preserved)
   -------------------------------------------------------------------------- */

export const sendContactMessage = (payload) =>
  request('/api/contact', { method: 'POST', body: payload });
