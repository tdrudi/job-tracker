const request = require('supertest');
const app = require('../app.js');

describe('Notifications API Integration Tests', () => {
  let createdApplicationId;
  let createdNotificationId;

  beforeAll(async () => {
    const appRes = await request(app).post('/applications').send({
        company_name: 'Tech Corp',
        role_title: 'Software Engineer',
        date_applied: '2026-10-28',
        status: 'Applied'
      });
    createdApplicationId = appRes.body.id;
  });

  afterAll(async () => {
    if (createdApplicationId) {
      await request(app).delete(`/applications/${createdApplicationId}`);
    }
  });

  it('should create a new notification', async () => {
    const newNotification = {
      application_id: createdApplicationId,
      title: 'Follow Up Interview',
      message: 'Send thank you note to recruiter.',
      notification_type: 'reminder',
      reminder_date: '2026-12-01T09:00:00Z'
    };

    const res = await request(app).post('/notifications').send(newNotification);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe(newNotification.title);

    createdNotificationId = res.body.id;
  });

  it('should get all notifications', async () => {
    const res = await request(app).get('/notifications');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should get upcoming notifications', async () => {
    const res = await request(app).get('/notifications/upcoming');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should get a specific notification by ID', async () => {
    const res = await request(app).get(`/notifications/${createdNotificationId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', createdNotificationId);
  });

  it('should update a notification using PATCH', async () => {
    const res = await request(app).patch(`/notifications/${createdNotificationId}`).send({ is_read: true });
    expect(res.statusCode).toBe(200);
    expect(res.body.is_read).toBe(true);
  });

  it('should delete a notification', async () => {
    const res = await request(app).delete(`/notifications/${createdNotificationId}`);
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('Notification deleted.');
  });
});