const express = require('express');
const pool = require('../db');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// GET /health-units — catálogo de unidades de saúde para preencher seletores
router.get('/', verifyToken, async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, type, neighborhood FROM health_units ORDER BY name'
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
