/**
 * Centralized API service layer for INFOVATE Software Platform.
 * Handles JWT token storage, error formatting, request dispatching, and multipart uploads.
 */

const BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  ''
).replace(/\/$/, '');

const TOKEN_KEY = 'infovate_token';

export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY) || localStorage.getItem('infovet_token');
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
    localStorage.removeItem('infovet_token');
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
    throw new ApiError('Could not reach the Infovate server. Please verify your internet connection or check if the backend is running.', 0);
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
   Company & Software Solutions Public Endpoints
   -------------------------------------------------------------------------- */

export const fetchCompanyProfile = () =>
  request('/api/company/profile');

export const fetchServices = () =>
  request('/api/company/services');

export const fetchServiceDetail = (slug) =>
  request(`/api/company/services/${slug}`);

export const fetchProjects = (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') {
      query.append(key, val);
    }
  });
  const qs = query.toString();
  return request(`/api/company/projects${qs ? `?${qs}` : ''}`);
};

export const fetchProjectDetail = (id_or_slug) =>
  request(`/api/company/projects/${id_or_slug}`);

export const fetchTechnologies = (params = {}) => {
  const query = new URLSearchParams();
  if (params.category) query.append('category', params.category);
  const qs = query.toString();
  return request(`/api/company/technologies${qs ? `?${qs}` : ''}`);
};

export const fetchTestimonials = () =>
  request('/api/company/testimonials');

export const fetchTeamMembers = () =>
  request('/api/company/team');

export const submitProjectInquiry = (payload) =>
  request('/api/company/inquiries', { method: 'POST', body: payload });

/* --------------------------------------------------------------------------
   Company & Software Solutions Admin Endpoints
   -------------------------------------------------------------------------- */

export const fetchCompanyAdminStats = () =>
  request('/api/admin/company/stats', { auth: true });

export const fetchAdminCompanyProfile = () =>
  request('/api/admin/company/profile', { auth: true });

export const updateAdminCompanyProfile = (profileData) =>
  request('/api/admin/company/profile', { method: 'PUT', body: profileData, auth: true });

// Services CMS
export const fetchAdminServices = () =>
  request('/api/admin/company/services', { auth: true });

export const createAdminService = (serviceData) =>
  request('/api/admin/company/services', { method: 'POST', body: serviceData, auth: true });

export const updateAdminService = (id, serviceData) =>
  request(`/api/admin/company/services/${id}`, { method: 'PUT', body: serviceData, auth: true });

export const deleteAdminService = (id) =>
  request(`/api/admin/company/services/${id}`, { method: 'DELETE', auth: true });

// Projects CMS
export const fetchAdminProjects = (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') {
      query.append(key, val);
    }
  });
  const qs = query.toString();
  return request(`/api/admin/company/projects${qs ? `?${qs}` : ''}`, { auth: true });
};

export const fetchAdminProjectDetail = (id) =>
  request(`/api/admin/company/projects/${id}`, { auth: true });

export const createAdminProject = (projectData) =>
  request('/api/admin/company/projects', { method: 'POST', body: projectData, auth: true });

export const updateAdminProject = (id, projectData) =>
  request(`/api/admin/company/projects/${id}`, { method: 'PUT', body: projectData, auth: true });

export const deleteAdminProject = (id) =>
  request(`/api/admin/company/projects/${id}`, { method: 'DELETE', auth: true });

export const addAdminProjectImage = (projectId, imageData) =>
  request(`/api/admin/company/projects/${projectId}/images`, {
    method: 'POST',
    body: imageData,
    auth: true,
  });

export const deleteAdminProjectImage = (imageId) =>
  request(`/api/admin/company/projects/images/${imageId}`, {
    method: 'DELETE',
    auth: true,
  });

// Technologies CMS
export const fetchAdminTechnologies = (params = {}) => {
  const query = new URLSearchParams();
  if (params.category) query.append('category', params.category);
  const qs = query.toString();
  return request(`/api/admin/company/technologies${qs ? `?${qs}` : ''}`, { auth: true });
};

export const createAdminTechnology = (techData) =>
  request('/api/admin/company/technologies', { method: 'POST', body: techData, auth: true });

export const updateAdminTechnology = (id, techData) =>
  request(`/api/admin/company/technologies/${id}`, { method: 'PUT', body: techData, auth: true });

export const deleteAdminTechnology = (id) =>
  request(`/api/admin/company/technologies/${id}`, { method: 'DELETE', auth: true });

// Testimonials CMS
export const fetchAdminTestimonials = () =>
  request('/api/admin/company/testimonials', { auth: true });

export const createAdminTestimonial = (testimonialData) =>
  request('/api/admin/company/testimonials', { method: 'POST', body: testimonialData, auth: true });

export const updateAdminTestimonial = (id, testimonialData) =>
  request(`/api/admin/company/testimonials/${id}`, { method: 'PUT', body: testimonialData, auth: true });

export const deleteAdminTestimonial = (id) =>
  request(`/api/admin/company/testimonials/${id}`, { method: 'DELETE', auth: true });

// Team Members CMS
export const fetchAdminTeam = () =>
  request('/api/admin/company/team', { auth: true });

export const createAdminTeamMember = (memberData) =>
  request('/api/admin/company/team', { method: 'POST', body: memberData, auth: true });

export const updateAdminTeamMember = (id, memberData) =>
  request(`/api/admin/company/team/${id}`, { method: 'PUT', body: memberData, auth: true });

export const deleteAdminTeamMember = (id) =>
  request(`/api/admin/company/team/${id}`, { method: 'DELETE', auth: true });

// Project Inquiries CMS
export const fetchAdminInquiries = (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') {
      query.append(key, val);
    }
  });
  const qs = query.toString();
  return request(`/api/admin/company/inquiries${qs ? `?${qs}` : ''}`, { auth: true });
};

export const fetchAdminInquiryDetail = (id) =>
  request(`/api/admin/company/inquiries/${id}`, { auth: true });

export const updateAdminInquiry = (id, updateData) =>
  request(`/api/admin/company/inquiries/${id}`, { method: 'PATCH', body: updateData, auth: true });

export const deleteAdminInquiry = (id) =>
  request(`/api/admin/company/inquiries/${id}`, { method: 'DELETE', auth: true });

// Media & Asset Uploads
export const fetchAdminMedia = () =>
  request('/api/admin/company/media', { auth: true });

export const uploadProjectImageFile = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return request('/api/uploads/project-image', { method: 'POST', body: formData, auth: true, isFormData: true });
};

export const uploadServiceIconFile = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return request('/api/uploads/service-icon', { method: 'POST', body: formData, auth: true, isFormData: true });
};

export const uploadTeamPhotoFile = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return request('/api/uploads/team-photo', { method: 'POST', body: formData, auth: true, isFormData: true });
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
