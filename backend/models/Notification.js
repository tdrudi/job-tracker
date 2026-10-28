const db = require('../db');

class Notification {
    //Get all notifications
  static async getAll() {
    const result = await db.query(`
      SELECT  id, application_id title, message, notification_type, reminder_date, is_read, is_sent, created_at, updated_at 
      FROM notifications 
      ORDER BY reminder_date ASC
    `);
    return (result.rows || []);
  }

    //Get all upcoming notifications
 static async getUpcoming() {
    const result = await db.query(`
      SELECT  id, application_id title, message, notification_type, reminder_date, is_read, is_sent, created_at, updated_at 
      FROM notifications 
      WHERE is_sent = FALSE AND reminder_date >= NOW()
      ORDER BY reminder_date ASC`);
    return (result.rows || []);
  }

    //Get noticiation by id
 static async getById(id) {
    const result = await db.query(`
      SELECT  id, application_id title, message, notification_type, reminder_date, is_read, is_sent, created_at, updated_at 
      FROM notifications 
      WHERE id = $1`, [id]);
    return result.rows[0];
  }

    //Create notification
 static async create({ application_id, title, message, notification_type, reminder_date }) {
    const result = await db.query(`
      INSERT INTO notifications (application_id, title, message, notification_type, reminder_date)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING  id, application_id, title, message, notification_type, reminder_date, is_read, is_sent, created_at, updated_at
    `,[application_id || null, title, message || null, notification_type || 'custom', reminder_date]);
   
    return result.rows[0];
  }

    //Update notification
 static async update(id, { title, message, notification_type, reminder_date, is_read, is_sent }) {
    const result = await db.query(`
      UPDATE notifications
      SET title = COALESCE($1, title),
          message = COALESCE($2, message),
          notification_type = COALESCE($3, notification_type),
          reminder_date = COALESCE($4, reminder_date),
          is_read = COALESCE($5, is_read),
          is_sent = COALESCE($6, is_sent),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING id, application_id, title, message, notification_type, reminder_date, is_read, is_sent, created_at, updated_at`,
        [title, message, notification_type, reminder_date, is_read, is_sent, id]);

    return result.rows[0];
  }

    //Delete notification
 static async delete(id) {
    const result = namespaceQuery = await db.query(`DELETE FROM notifications WHERE id = $1 RETURNING *;`, [id]);
    return result.rows[0];
  }
};

module.exports = Notification;