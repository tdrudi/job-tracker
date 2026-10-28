const db = require('../db');
const ExpressError = require('../../');

class Outreach {

    // Get all outreach records
  static async getAll() {
    const result = await db.query(`
      SELECT o.id, o.application_id, o.contact_id, o.contact_method, o.follow_up, o.status, o.note_id, 
             o.created_at, o.updated_at,
             c.first_name, c.last_name, c.email, c.phone, c.linkedin_url, c.role as contact_role,
             n.content as note_content
      FROM outreach o
      LEFT JOIN contacts c ON o.contact_id = c.id
      LEFT JOIN notes n ON o.note_id = n.id
      ORDER BY o.created_at DESC;
    `);
    return (result.rows || []);
  }

  // Get single outreach record by ID with joined details
  static async getById(id) {
    const result = await db.query(`
      SELECT o.id, o.application_id, o.contact_id, o.contact_method, o.follow_up, o.status, o.note_id, 
             o.created_at, o.updated_at,
             c.first_name, c.last_name, c.email, c.phone, c.linkedin_url, c.role as contact_role,
             n.content as note_content
      FROM outreach o
      LEFT JOIN contacts c ON o.contact_id = c.id
      LEFT JOIN notes n ON o.note_id = n.id
      WHERE o.id = $1;
    `, [id]);

    const record = result.rows[0];
    if (!record) throw new ExpressError('Outreach record not found', 404);
    return record;
  }

// Get all outreach records for a specific application ID with joined details
    static async getByApplicationId(applicationId) {
        try {
            const result = await db.query(`
            SELECT o.id, o.application_id, o.contact_id, o.contact_method, o.follow_up, o.status, o.note_id, 
                    o.created_at, o.updated_at,
                    c.first_name, c.last_name, c.email, c.phone, c.linkedin_url, c.role as contact_role,
                    n.content as note_content
            FROM outreach o
            LEFT JOIN contacts c ON o.contact_id = c.id
            LEFT JOIN notes n ON o.note_id = n.id
            WHERE o.application_id = $1
            ORDER BY o.created_at DESC;
            `, [applicationId]);

            return (result.rows || []);
    } catch (err) {
        console.error("GET BY APPLICATION ID ERROR:", err);
        throw new ExpressError('Could not retrieve outreach records for application.', 500);
    }
    }
    
     // Create new outreach entry
  static async create({ application_id, contact_id, contact_method, follow_up, status, note_id }) {
    try {
      const result = await db.query(`
        INSERT INTO outreach (application_id, contact_id, contact_method, follow_up, status, note_id)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, application_id, contact_id, contact_method, follow_up, status, note_id, created_at, updated_at`,
          [application_id, contact_id, contact_method || null, follow_up || null, status || 'First contact', note_id || null]);

      return result.rows[0];
    } catch (err) {
      throw new ExpressError('Outreach record could not be created.', 500);
    }
  }


    //Update existing outreach record
    static async update(id, {application_id, contact_id, contact_method, follow_up, status, note_id }) {
  try {
    const result = await db.query(`
      UPDATE outreach
      SET application_id = COALESCE($1, application_id),
          contact_id = COALESCE($2, contact_id),
          contact_method = COALESCE($3, contact_method),
          follow_up = COALESCE($4, follow_up),
          status = COALESCE($5, status),
          note_id = COALESCE($6, note_id),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING id, application_id, contact_id, contact_method, follow_up, status, note_id, created_at, updated_at`,
        [application_id, contact_id, contact_method, follow_up, status, note_id, id]);

      const record = result.rows[0];
    return record;
  } catch (err) {
    throw new ExpressError('Outreach record could not be updated.');
  }
}

  // Delete outreach record
  static async delete(id) {
    try {
      const result = await db.query(`
        DELETE FROM outreach
        WHERE id = $1
        RETURNING id`, [id]);

      return result.rows[0];
    } catch (err) {
      throw new ExpressError('Outreach record could not be deleted.', 500);
    }
  }
}

module.exports = Outreach;