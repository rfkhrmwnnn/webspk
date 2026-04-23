const pool = require('../config/db');

class AlternativesController {
  static async getAll(req, res) {
    try {
      const result = await pool.query(`
        SELECT 
          a.id, a.nik, a.name, a.address,
          COALESCE(
            json_agg(
              json_build_object('criteria_id', e.criteria_id, 'value', e.value)
            ) FILTER (WHERE e.id IS NOT NULL), '[]'
          ) as evaluations
        FROM alternatives a
        LEFT JOIN evaluations e ON a.id = e.alternative_id
        GROUP BY a.id
        ORDER BY a.id ASC
      `);
      res.status(200).json({ success: true, data: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async create(req, res) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const { nik, name, address, evaluations } = req.body;
      
      const altResult = await client.query(
        'INSERT INTO alternatives (nik, name, address) VALUES ($1, $2, $3) RETURNING *',
        [nik, name, address]
      );
      const alternativeId = altResult.rows[0].id;

      if (evaluations && evaluations.length > 0) {
        for (const ev of evaluations) {
          await client.query(
            'INSERT INTO evaluations (alternative_id, criteria_id, value) VALUES ($1, $2, $3)',
            [alternativeId, ev.criteria_id, ev.value]
          );
        }
      }

      await client.query('COMMIT');
      res.status(201).json({ success: true, data: altResult.rows[0] });
    } catch (error) {
      await client.query('ROLLBACK');
      res.status(500).json({ success: false, message: error.message });
    } finally {
      client.release();
    }
  }

  static async update(req, res) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const { id } = req.params;
      const { nik, name, address, evaluations } = req.body;

      const altResult = await client.query(
        'UPDATE alternatives SET nik = $1, name = $2, address = $3 WHERE id = $4 RETURNING *',
        [nik, name, address, id]
      );

      if (altResult.rows.length === 0) {
        throw new Error('Alternative not found');
      }

      if (evaluations) {
        // Delete old evaluations
        await client.query('DELETE FROM evaluations WHERE alternative_id = $1', [id]);
        
        // Insert new ones
        for (const ev of evaluations) {
          await client.query(
            'INSERT INTO evaluations (alternative_id, criteria_id, value) VALUES ($1, $2, $3)',
            [id, ev.criteria_id, ev.value]
          );
        }
      }

      await client.query('COMMIT');
      res.status(200).json({ success: true, data: altResult.rows[0] });
    } catch (error) {
      await client.query('ROLLBACK');
      res.status(500).json({ success: false, message: error.message });
    } finally {
      client.release();
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await pool.query('DELETE FROM alternatives WHERE id = $1 RETURNING *', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Alternative not found' });
      }
      res.status(200).json({ success: true, message: 'Deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = AlternativesController;
