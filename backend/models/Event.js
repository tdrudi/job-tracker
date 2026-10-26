const db = require('../db');

class Event {
  static async getAll(filters = {}) {
    let query = `
      SELECT id, application_id, event_type, event_date, location, outcome, created_at, updated_at 
      FROM interviews_events`;
    
    let queryParams = [];
    let conditions = [];
    
          // If a search query or status filter is provided
    if (filters.search) {
      queryParams.push(`%${filters.search}%`);
      conditions.push(`(event_type ILIKE $${queryParams.length} OR location ILIKE $${queryParams.length})`);
    }
    
    if (conditions.length > 0) {
      query += ` WHERE ` + conditions.join(' AND ');
    }
    
    query += ` ORDER BY event_date DESC`;
    
          const result = await db.query(query, queryParams);
    return (result.rows || []);
  }

  static async getById(id) {
    const result = await db.query(
        `SELECT id, application_id, event_type, event_date, location, outcome, created_at, updated_at 
        FROM interviews_events
        WHERE id = $1
        ORDER BY event_date ASC`,[id]);
    return result.rows[0];
  }

    static async getByApplication(id) {
    const result = await db.query(
        `SELECT id, application_id, event_type, event_date, location, outcome, created_at, updated_at 
        FROM interviews_events
        WHERE application_id = $1
        ORDER BY event_date ASC`,[id]);
    return result.rows[0];
  }

 static async create({ application_id, event_type, event_date, location, outcome }) {
    const result = await db.query(`
      INSERT INTO interviews_events (application_id, event_type, event_date, location, outcome)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, application_id, event_type, event_date, location, outcome, created_at, updated_at`,
        [application_id || null, event_type, event_date, location || null, outcome || 'Scheduled']);
   
    return result.rows[0];
  }

  static async update(id, { event_type, event_date, location, outcome }) {
    const result = await db.query(`
      UPDATE interviews_events
      SET event_type = COALESCE($1, event_type),
          event_date = COALESCE($2, event_date),
          location = COALESCE($3, location),
          outcome = COALESCE($4, outcome),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING id, application_id, event_type, event_date, location, outcome, created_at, updated_at`,
        [event_type, event_date, location, outcome, id]);
    return result.rows[0];
  }

  static async delete(id) {
      const result = await db.query(`DELETE FROM interviews_events 
        WHERE id = $1
        RETURNING id`, [id]);
    return result.rows[0];
  }
}

module.exports = Event;