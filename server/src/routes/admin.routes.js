const express = require('express');
const crypto = require('crypto');
const pool = require('../db');
const { verifyToken, requireAdmin } = require('../middleware/auth');
const { logAction } = require('../utils/audit');

const router = express.Router();
// Toda rota abaixo exige login E papel de admin — é a fronteira de
// privilégio mais sensível do app, então fica isolada num único arquivo.
router.use(verifyToken, requireAdmin);

const VALID_STATUS = ['pendente', 'confirmado', 'cancelado', 'concluido'];
// kind (rota/JSON) -> { table, entityType (p/ log) }
const ENTITY_MAP = {
  appointments: { table: 'appointments', entityType: 'appointment' },
  exams: { table: 'exams', entityType: 'exam' },
};

router.get('/appointments', async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const [rows] = await pool.query(
      'SELECT a.*, u.full_name AS user_name, u.email AS user_email FROM appointments a JOIN users u ON u.id = a.user_id ORDER BY a.scheduled_at DESC LIMIT ?',
      [limit]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.get('/exams', async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const [rows] = await pool.query(
      'SELECT e.*, u.full_name AS user_name, u.email AS user_email FROM exams e JOIN users u ON u.id = e.user_id ORDER BY e.scheduled_at DESC LIMIT ?',
      [limit]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// PATCH /admin/:kind/:id — confirmar, cancelar e/ou reagendar (admin pode agir
// sobre o agendamento de QUALQUER usuário; diferente das rotas /me/*, que só
// deixam cada usuário mexer no próprio registro).
router.patch('/:kind/:id', async (req, res, next) => {
  try {
    const entity = ENTITY_MAP[req.params.kind];
    if (!entity) return res.status(404).json({ error: 'Tipo inválido.' });

    const { status, scheduled_at } = req.body || {};
    const updates = [];
    const params = [];
    const logParts = [];

    if (status !== undefined) {
      if (!VALID_STATUS.includes(status)) {
        return res.status(400).json({ error: 'Status inválido.' });
      }
      updates.push('status=?');
      params.push(status);
      logParts.push(`status -> ${status}`);
    }
    if (scheduled_at) {
      updates.push('scheduled_at=?');
      params.push(scheduled_at);
      logParts.push(`reagendado para ${scheduled_at}`);
    }
    if (!updates.length) {
      return res.status(400).json({ error: 'Nada para atualizar.' });
    }

    params.push(req.params.id);
    const [result] = await pool.query(
      `UPDATE ${entity.table} SET ${updates.join(', ')} WHERE id=?`,
      params
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Registro não encontrado.' });
    }

    await logAction(req.user.id, 'admin_update', entity.entityType, req.params.id, logParts.join('; '));
    res.json({ id: req.params.id });
  } catch (err) {
    next(err);
  }
});

// Busca por e-mail (parcial) para localizar o histórico de um usuário
router.get('/users', async (req, res, next) => {
  try {
    const email = String(req.query.email || '').toLowerCase().trim();
    const [rows] = await pool.query(
      'SELECT id, full_name, email, phone FROM users WHERE email LIKE ? ORDER BY full_name LIMIT 20',
      ['%' + email + '%']
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.get('/history', async (req, res, next) => {
  try {
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ error: 'userId é obrigatório.' });

    const [[user]] = await pool.query(
      'SELECT id, full_name, email, phone FROM users WHERE id = ?',
      [userId]
    );
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });

    const [appointments] = await pool.query(
      'SELECT * FROM appointments WHERE user_id = ? ORDER BY scheduled_at DESC',
      [userId]
    );
    const [exams] = await pool.query(
      'SELECT * FROM exams WHERE user_id = ? ORDER BY scheduled_at DESC',
      [userId]
    );

    res.json({ user, appointments, exams });
  } catch (err) {
    next(err);
  }
});

router.get('/diseases', async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM diseases ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.post('/diseases', async (req, res, next) => {
  try {
    const { name, region, alert_level, description } = req.body || {};
    if (!name) return res.status(400).json({ error: 'Nome é obrigatório.' });

    const validLevels = ['baixo', 'medio', 'alto'];
    const level = validLevels.includes(alert_level) ? alert_level : 'baixo';

    const id = crypto.randomUUID();
    await pool.query(
      'INSERT INTO diseases (id, name, region, alert_level, description) VALUES (?,?,?,?,?)',
      [id, name, region || null, level, description || null]
    );
    await logAction(req.user.id, 'create', 'disease', id, `"${name}" (${level})`);
    res.status(201).json({ id });
  } catch (err) {
    next(err);
  }
});

router.delete('/diseases/:id', async (req, res, next) => {
  try {
    await pool.query('DELETE FROM diseases WHERE id = ?', [req.params.id]);
    await logAction(req.user.id, 'delete', 'disease', req.params.id, null);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

// GET /admin/audit-log — histórico de ações administrativas
router.get('/audit-log', async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 50, 200);
    const [rows] = await pool.query(
      `SELECT al.*, u.full_name AS actor_name, u.email AS actor_email
       FROM audit_log al JOIN users u ON u.id = al.actor_id
       ORDER BY al.created_at DESC LIMIT ?`,
      [limit]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
