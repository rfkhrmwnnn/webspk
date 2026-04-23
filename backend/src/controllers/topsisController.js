const pool = require('../config/db');
const TopsisService = require('../services/topsisService');

class TopsisController {
  static async calculate(req, res) {
    try {
      const { customWeights } = req.body; // For What-If Analysis

      // 1. Fetch Criteria
      const criteriaResult = await pool.query('SELECT * FROM criteria ORDER BY id ASC');
      let criteria = criteriaResult.rows;

      // Apply custom weights if provided
      if (customWeights && Array.isArray(customWeights)) {
        criteria = criteria.map(c => {
          const custom = customWeights.find(cw => cw.id === c.id);
          return custom ? { ...c, weight: custom.weight } : c;
        });
      }

      // 2. Fetch Alternatives with Evaluations
      const altResult = await pool.query(`
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
      const alternatives = altResult.rows;

      // 3. Calculate TOPSIS
      const result = TopsisService.calculate(alternatives, criteria);

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  }
}

module.exports = TopsisController;
