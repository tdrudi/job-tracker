const request = require('supertest');
const app = require('../app.js');
const db = require('../db.js');

describe('Notes API Integration Tests', () => {
  let createdApplicationId;
  let createdNoteId;

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
    if (createdNoteId) {
      await request(app).delete(`/notes/${createdNoteId}`);
    }
  });

  it('should create a new note for the application', async () => {
    const newNote = {
      application_id: createdApplicationId,
      content: 'Discussed initial system architecture and tech stack.'
    };

    const res = await request(app).post('/notes').send(newNote);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.content).toBe(newNote.content);

    createdNoteId = res.body.id;
  });

  it('should get all notes', async () => {
    const res = await request(app).get('/notes');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should get notes by application ID', async () => {
    const res = await request(app).get(`/notes/application/${createdApplicationId}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].application_id).toBe(createdApplicationId);
  });

  it('should get a specific note by ID', async () => {
    const res = await request(app).get(`/notes/${createdNoteId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', createdNoteId);
  });

  it('should update a note using PATCH', async () => {
    const res = await request(app).patch(`/notes/${createdNoteId}`).send({ content: 'Updated note: Follow up scheduled for next week.' });
    expect(res.statusCode).toBe(200);
    expect(res.body.content).toContain('Updated note');
  });

  it('should delete a note', async () => {
    const res = await request(app).delete(`/notes/${createdNoteId}`);
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('Note deleted.');
  });
});