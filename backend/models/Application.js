const db = require('../db');
const ExpressError = require('../../expressError');

class Application {
  // Get all applications
  static async getAll(filters = {}) {
    try {
      let query = `
            SELECT id, company_name, role_title, status, date_applied, salary_range, job_url, created_at, updated_at
            FROM applications`;
    
      let queryParams = [];
      let conditions = [];

      // If a search query or status filter is provided
      if (filters.search) {
        queryParams.push(`%${filters.search}%`);
        conditions.push(`(company_name ILIKE $${queryParams.length} OR role_title ILIKE $${queryParams.length} OR status ILIKE $${queryParams.length})`);
      }

      if (conditions.length > 0) {
        query += ` WHERE ` + conditions.join(' AND ');
      }

      query += ` ORDER BY created_at DESC`;

      const result = await db.query(query, queryParams);
      
      return (result.rows || []);
    } catch {
      throw new ExpressError('No applications found.');
    }
  }

  // Get application by ID with related contacts, interviews/events, and notes
  static async getById(id) {
    try {
      const appResult = await db.query(`
              SELECT id, company_name, role_title, status, date_applied, salary_range, job_url, created_at, updated_at 
              FROM applications
              WHERE id = $1`, [id]);
          
      if (appResult.rows.length === 0) return null;

      const contactsResult = await db.query(`
              SELECT  id, application_id, first_name, last_name, role, email, phone, linkedin_url, created_at, updated_at
              FROM contacts
              WHERE application_id = $1
              ORDER BY created_at DESC`, [id]);
        
      const eventsResult = await db.query(`
              SELECT id, application_id, event_type, event_date, location, outcome, created_at, updated_at  
              FROM interviews_events
              WHERE application_id = $1
              ORDER BY event_date ASC`, [id]);
        
      const notesResult = await db.query(
        `SELECT id, application_id, content, created_at, updated_at 
              FROM notes
              WHERE application_id = $1
              ORDER BY created_at DESC`, [id]);

      return {
        ...appResult.rows[0],
        contacts: contactsResult.rows || [],
        interviews_events: eventsResult.rows || [],
        notes: notesResult.rows || [],
      };
    } catch {
      throw new ExpressError(`Application with id ${id} not found.`);
    }
  }

  // Create new application
  static async create({ company_name, role_title, status, date_applied, salary_range, job_url }) {
    try {
      const result = await db.query(`
      INSERT INTO applications (company_name, role_title, status, date_applied, salary_range, job_url)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, company_name, role_title, status, date_applied, salary_range, job_url, created_at, updated_at`,
        [company_name, role_title, status || 'Applied', date_applied, salary_range || null, job_url || null,]);
    
      return result.rows[0];
    } catch {
      throw new ExpressError('Application could not be created.');
    }
  }

  // Update existing application
  static async update(id, { company_name, role_title, status, date_applied, salary_range, job_url }) {
    try {
        const result = await db.query(`
      UPDATE applications
      SET company_name = COALESCE($1, company_name),
          role_title = COALESCE($2, role_title),
          status = COALESCE($3, status),
          date_applied = COALESCE($4, date_applied),
          salary_range = COALESCE($5, salary_range),
          job_url = COALESCE($6, job_url),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING id, company_name, role_title, status, date_applied, salary_range, job_url, id, created_at, updated_at`,
        [company_name, role_title, status, date_applied, salary_range, job_url, id]);
      return result.rows[0];
    } catch {
      throw new ExpressError('Application could not be updated.');
    }
  }

  // Delete application
  static async delete(id) {
    try {
      const result = await db.query(`DELETE FROM applications WHERE id = $1 RETURNING id`, [id]);
      return result.rows[0];
    } catch {
      throw new ExpressError('Application could not be deleted.');
    }
  }
}

module.exports = Application;