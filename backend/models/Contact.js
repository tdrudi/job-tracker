const db = require('../db');

class Contact {

  static async getAll(filters = {}) {
    let query =`SELECT id, application_id, first_name, last_name, role, company, email, phone, linkedin_url, created_at, updated_at
      FROM contacts`;
    
    let queryParams = [];
    let conditions = [];
    
    // If a search query or status filter is provided
    if (filters.search) {
      queryParams.push(`%${filters.search}%`);
      conditions.push(`(first_name ILIKE $${queryParams.length} 
        OR last_name ILIKE $${queryParams.length} 
        OR role ILIKE $${queryParams.length}
        OR company ILIKE $${queryParams.length})`);
      }
    
    if (conditions.length > 0) {
      query += ` WHERE ` + conditions.join(' AND ');
    }
    
    query += ` ORDER BY created_at DESC`;
    
    const result = await db.query(query, queryParams);
    return (result.rows || []);
  }
  
  static async getById(id) {
    const result = await db.query(
        `SELECT id, application_id, first_name, last_name, role, company, email, phone, linkedin_url, created_at, updated_at
        FROM contacts
        WHERE id = $1
        ORDER BY created_at DESC`, [id]);
      
    return result.rows[0];
  }

  static async getByApplication(id) {
    const result = await db.query(
        `SELECT id, application_id, first_name, last_name, role, company, email, phone, linkedin_url, created_at, updated_at
        FROM contacts
        WHERE application_id = $1
        ORDER BY created_at DESC`, [id]);
      
    return (result.rows || []);
  }

  static async create({ application_id, first_name, last_name, role, company, email, phone, linkedin_url }) {
    const result = await db.query(`
      INSERT INTO contacts (application_id, first_name, last_name, role, company, email, phone, linkedin_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, application_id, first_name, last_name, role, company, email, phone, linkedin_url, created_at, updated_at`,
      [application_id, first_name, last_name, role || null, company || null, email || null, phone || null, linkedin_url || null,]);
 
    return result.rows[0];
  }

  static async update(id, { first_name, last_name, role, company, email, phone, linkedin_url } ) {
    const result = await db.query(`
      UPDATE contacts
      SET first_name = COALESCE($1, first_name),
          last_name = COALESCE($2, last_name),
          role = COALESCE($3, role),
          company = COALESCE($4, company),
          email = COALESCE($5, email),
          phone = COALESCE($6, phone),
          linkedin_url = COALESCE($7, linkedin_url),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $8
      RETURNING id, application_id, first_name, last_name, role, company, email, phone, linkedin_url, created_at, updated_at`,
    [first_name, last_name, role, company, email, phone, linkedin_url, id]);
    
    return result.rows[0];
  }

 static async delete(id) {
   const result = await db.query(`
    DELETE FROM contacts 
      WHERE id = $1
      RETURNING id`, [id]);
   
    return result.rows[0];
  }
};

module.exports = Contact;