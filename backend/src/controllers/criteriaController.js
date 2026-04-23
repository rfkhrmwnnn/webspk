const pool = require('../config/db');

class CriteriaController {
  static async getAll(req, res) {
    try {
      const result = await pool.query('SELECT * FROM criteria ORDER BY id ASC');
      res.status(200).json({ success: true, data: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async create(req, res) {
    try {
      const { code, name, weight, type } = req.body;
      const result = await pool.query(
        'INSERT INTO criteria (code, name, weight, type) VALUES ($1, $2, $3, $4) RETURNING *',
        [code, name, weight, type]
      );
      res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const { code, name, weight, type } = req.body;
      const result = await pool.query(
        'UPDATE criteria SET code = $1, name = $2, weight = $3, type = $4 WHERE id = $5 RETURNING *',
        [code, name, weight, type, id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Criteria not found' });
      }
      res.status(200).json({ success: true, data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await pool.query('DELETE FROM criteria WHERE id = $1 RETURNING *', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Criteria not found' });
      }
      res.status(200).json({ success: true, message: 'Deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = CriteriaController;
