const request = require('supertest');
const app = require('../app.js');
const db = require('../db.js');

describe('Applications API Integration Tests', () => {
  let createdApplicationId;

  beforeAll(async () => {
    await db.initDb();
  });

 afterAll(async () => {
    if (createdApplicationId) {
      await request(app).delete(`/applications/${createdApplicationId}`);
    }
  });

  it('should create a new job application', async () => {
    const newApp = {
      company_name: 'Tech Corp',
      role_title: 'Software Engineer',
      date_applied: '2026-10-28',
      status: 'Applied'
    };

    const res = await request(app).post('/applications').send(newApp);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.company_name).toBe('Tech Corp');

    createdApplicationId = res.body.id;
  });

  it('should get all applications', async () => {
    const res = await request(app).get('/applications');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should get an application by ID with related fields', async () => {
    const res = await request(app).get(`/applications/${createdApplicationId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', createdApplicationId);
    expect(res.body).toHaveProperty('contacts');
    expect(res.body).toHaveProperty('interviews_events');
    expect(res.body).toHaveProperty('notes');
  });

  it('should update an application using PATCH', async () => {
    const updatedData = { role_title: 'Senior Software Engineer', status: 'Interviewing' };
    const res = await request(app).patch(`/applications/${createdApplicationId}`).send(updatedData);
    expect(res.statusCode).toBe(200);
    expect(res.body.role_title).toBe('Senior Software Engineer');
  });

  it('should delete an application', async () => {
    const res = await request(app).delete(`/applications/${createdApplicationId}`);
    expect(res.statusCode).toBe(200);
  });
});