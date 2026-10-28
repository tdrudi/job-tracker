const request = require('supertest');
const app = require('../app.js');
const db = require('../db.js');

describe('Events API Integration Tests', () => {
  let createdApplicationId;
  let createdEventId;

  beforeAll(async () => {
    await db.initDb();
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

    if (createdEventId) {
      await request(app).delete(`/events/${createdEventId}`);
    }
  });

  it('should create a new event for the application', async () => {
    const newEvent = {
      application_id: createdApplicationId,
      event_type: 'Technical Interview',
      event_date: '2026-11-15T10:00:00Z',
      location: 'Zoom',
      outcome: 'Scheduled'
    };

    const res = await request(app).post('/events').send(newEvent);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.event_type).toBe('Technical Interview');

    createdEventId = res.body.id;
  });

  it('should get all events', async () => {
    const res = await request(app).get('/events');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should get events by application ID', async () => {
    const res = await request(app).get(`/events/application/${createdApplicationId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('application_id', createdApplicationId);
  });

  it('should get a specific event by ID', async () => {
    const res = await request(app).get(`/events/${createdEventId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', createdEventId);
  });

  it('should update an event using PATCH', async () => {
    const res = await request(app).patch(`/events/${createdEventId}`).send({ outcome: 'Completed' });
    expect(res.statusCode).toBe(200);
    expect(res.body.outcome).toBe('Completed');
  });

  it('should delete an event', async () => {
    const res = await request(app).delete(`/events/${createdEventId}`);
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('Event deleted.');
  });
});