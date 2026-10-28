const request = require('supertest');
const app = require('../app');
const db = require('../db');

let createdApplicationId;
let createdContactId;
let createdNoteId;
let createdOutreachId;

beforeAll(async()=> {
  await db.initDb();

   const appRes = await db.query(`
    INSERT INTO applications (company_name, role_title, status, date_applied)
    VALUES ('Tech Corp', 'Software Engineer', 'Applied', '2026-10-01')
    RETURNING id;
  `);
  createdApplicationId = appRes.rows[0].id;

  const contactRes = await db.query(`
    INSERT INTO contacts (application_id, first_name, last_name, email, role)
    VALUES ($1, 'Jane', 'Doe', 'jane@techcorp.com', 'Recruiter')
    RETURNING id;
  `, [createdApplicationId]);
  createdContactId = contactRes.rows[0].id;

  const noteRes = await db.query(`
    INSERT INTO notes (application_id, content)
    VALUES ($1, 'Sent standard LinkedIn connection request and follow-up note.')
    RETURNING id;
  `, [createdApplicationId]);
  createdNoteId = noteRes.rows[0].id;

  const outreachRes = await db.query(`
    INSERT INTO outreach (application_id, contact_id, contact_method, status, note_id)
    VALUES ($1, $2, 'LinkedIn', 'First contact', $3)
    RETURNING id;
  `, [createdApplicationId, createdContactId, createdNoteId]);
  createdOutreachId = outreachRes.rows[0].id;
});

afterAll(async () => {
  if (createdApplicationId) {
      await request(app).delete(`/applications/${createdApplicationId}`);
  }
 if (createdContactId) {
     await request(app).delete(`/contacts/${createdContactId}`);
    }
 if (createdNoteId) {
      await request(app).delete(`/notes/${createdNoteId}`);
    }
 if (createdOutreachId) {
      await request(app).delete(`/outreach/${createdOutreachId}`);
  }
    
});

describe('GET /outreach', () => {
  test('Gets a list of all outreach records with joined details', async () => {
    const res = await request(app).get('/outreach');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toEqual(1);
    expect(res.body[0]).toHaveProperty('id', createdOutreachId);
    expect(res.body[0]).toHaveProperty('first_name', 'Jane');
    expect(res.body[0]).toHaveProperty('note_content');
  });
});

describe('GET /outreach/application/:applicationId', () => {
  test('Gets outreach records for a specific application', async () => {
    const res = await request(app).get(`/outreach/application/${createdApplicationId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toEqual(1);
    expect(res.body[0].application_id).toEqual(createdApplicationId);
  });

  test('Returns empty array for application with no outreach', async () => {
    const res = await request(app).get('/outreach/application/0');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });
});

describe('GET /outreach/:id', () => {
  test('Gets a single outreach record by ID', async () => {
    const res = await request(app).get(`/outreach/${createdOutreachId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toEqual(createdOutreachId);
    expect(res.body.first_name).toEqual('Jane');
  });

  test('Returns 404 for invalid outreach ID', async () => {
    const res = await request(app).get('/outreach/0');
    expect(res.statusCode).toBe(404);
  });
});

describe('POST /outreach', () => {
  test('Creates a new outreach record', async () => {
    const res = await request(app)
      .post('/outreach')
      .send({
        application_id: createdApplicationId,
        contact_id: createdContactId,
        contact_method: 'Email',
        status: 'Followed up'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.contact_method).toBe('Email');
  });
});

describe('PATCH /outreach/:id', () => {
  test('Updates an outreach record', async () => {
    const res = await request(app)
      .patch(`/outreach/${createdOutreachId}`)
      .send({ status: 'Meeting Scheduled' });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('Meeting Scheduled');
    expect(res.body.contact_method).toBe('LinkedIn');
  });
});

describe('DELETE /outreach/:id', () => {
  test('Deletes an outreach record', async () => {
    const res = await request(app).delete(`/outreach/${createdOutreachId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ id: createdOutreachId });

    const checkRes = await request(app).get(`/outreach/${createdOutreachId}`);
    expect(checkRes.statusCode).toBe(404);
  });
});