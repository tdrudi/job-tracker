const request = require('supertest');
const app = require('../app.js');

describe('Contacts API Integration Tests', () => {
  let createdApplicationId;
  let createdContactId;

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

  it('should create a new contact for the application', async () => {
    const newContact = {
      application_id: createdApplicationId,
      first_name: 'Jane',
      last_name: 'Smith',
      role: 'Engineering Recruiter',
      email: 'jane.smith@techcorp.com',
      phone: '555-0199',
      linkedin_url: 'https://linkedin.com/in/janesmith'
    };

    const res = await request(app).post('/contacts').send(newContact);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.first_name).toBe('Jane');
    createdContactId = res.body.id;
  });

  it('should get all contacts', async () => {
    const res = await request(app).get('/contacts');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should get contacts by application ID', async () => {
    const res = await request(app).get(`/contacts/application/${createdApplicationId}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].application_id).toBe(createdApplicationId);
  });

  it('should get a specific contact by ID', async () => {
    const res = await request(app).get(`/contacts/${createdContactId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', createdContactId);
  });

  it('should update a contact using PATCH', async () => {
    const res = await request(app).patch(`/contacts/${createdContactId}`).send({ role: 'Senior Technical Recruiter' });

    expect(res.statusCode).toBe(200);
    expect(res.body.role).toBe('Senior Technical Recruiter');
  });

  it('should delete a contact', async () => {
    const res = await request(app).delete(`/contacts/${createdContactId}`);
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('Contact deleted.');
  });
});