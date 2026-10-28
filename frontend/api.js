const BASE_URL = 'http://localhost:5000';

async function request(endpoint, options = {}) {
  const response = await fetch(BASE_URL + endpoint, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(errorBody || 'API request failed');
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

export const API = {
  // --- Applications ---
  getApplications: (filters) => {
  const query = filters ? `?${new URLSearchParams(filters).toString()}` : '';
  return request(`/applications${query}`, { method: 'GET' });
},
  getApplicationById: (id) => request(`/applications/${id}`),
  createApplication: (data) => request('/applications', { method: 'POST', body: JSON.stringify(data) }),
  updateApplication: (id, data) => request(`/applications/${id}`, {method: 'PATCH', body: JSON.stringify(data)}),
  deleteApplication: (id) => request(`/applications/${id}`, { method: 'DELETE' }),

  // --- Contacts ---
  getContacts: (filters) => {
    const query = filters ? `?${new URLSearchParams(filters).toString()}` : '';
    return request(`/contacts${query}`, { method: 'GET' });
  },
  getContactsById: (id) => request(`/contacts/${id}`),
  getContactsByApp: (appId) => request(`/contacts/application/${appId}`),
  createContact: (data) => request('/contacts', { method: 'POST', body: JSON.stringify(data) }),
  updateContact: (id, data) => request(`/contacts/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteContact: (id) => request(`/contacts/${id}`, { method: 'DELETE' }),

  // --- Outreach ---
  getAllOutreach: () => request(`/outreach/`, { method: 'GET' }),
  getOutreachById: (id) => request(`/outreach/${id}`, { method: 'GET' }),
  getOutreachByAppId: (id) => request(`/outreach/application/${id}`, { method: 'GET' }),
  createOutreach: (data) => request(`/outreach/`, { method: 'POST', body: JSON.stringify(data) }),
  updateOutreach: (id, data) => request(`/outreach/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteOutreach: (id) => request(`/outreach/${id}`, { method: 'DELETE' }),

  // --- Interviews & Events ---
  getEvents: (filters) => {
    const query = filters ? `?${new URLSearchParams(filters).toString()}` : '';
    return request(`/events${query}`, { method: 'GET' });
  },
  getEventsById: (id) => request(`/events/${id}`),
  getEventsByApp: (appId) => request(`/events/application/${appId}`),
  createEvent: (data) => request('/events', { method: 'POST', body: JSON.stringify(data) }),
  updateEvent: (id, data) => request(`/events/${id}`, {method: 'PATCH', body: JSON.stringify(data)}),
  deleteEvent: (id) => request(`/events/${id}`, { method: 'DELETE' }),

  // --- Notes ---
  getNotes: () => request('/notes'),
  getNotesByApp: (appId) => request(`/notes/application/${appId}`),
  getNotesById: (id) => request(`/notes/${id}`),
  createNote: (data) => request('/notes', { method: 'POST', body: JSON.stringify(data) }),
  updateNote: (id, data) => request(`/notes/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteNote: (id) => request(`/notes/${id}`, { method: 'DELETE' }),

  // --- Notifications & Reminders ---
  getNotifications: () => request('/notifications'),
  getUpcomingNotifications: () => request('/notifications/upcoming'),
  createNotification: (data) => request('/notifications', { method: 'POST', body: JSON.stringify(data) }),
  updateNotification: (id, data) => request(`/notifications/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteNotification: (id) => request(`/notifications/${id}`, { method: 'DELETE' }),
};