const db = require('../db');

class Note {

static async getAll() {
    const result = await db.query(
    `SELECT id, application_id, content, created_at, updated_at 
      FROM notes
      ORDER BY created_at DESC`);
  
    return (result.rows || []);
  }


    static async getById(id) {
    const result = await db.query(
    `SELECT id, application_id, content, created_at, updated_at 
      FROM notes
      WHERE id = $1
      ORDER BY created_at DESC`, [id]);
    return result.rows[0];
  }

  static async getByApplication(id) {
    const result = await db.query(
    `SELECT id, application_id, content, created_at, updated_at 
      FROM notes
      WHERE application_id = $1
      ORDER BY created_at DESC`, [id]);
    return (result.rows || []);
  }

  static async create({ application_id, content }) {
    const result = await db.query(`
      INSERT INTO notes (application_id, content)
      VALUES ($1, $2)
      RETURNING  id, application_id, content, created_at, updated_at`,
    [application_id, content]);
    
    return result.rows[0];
  }

  static async update(id, content) {
    const result = await  db.query(`
      UPDATE notes
      SET content = $1,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING id, application_id, content, created_at, updated_at`,
        [content, id]);
    return result.rows[0];
  }

  static async delete(id) {
      const result = await db.query(`DELETE FROM notes 
        WHERE id = $1 RETURNING id`, [id]);
    return result.rows[0];
  }
};

module.exports = Note;