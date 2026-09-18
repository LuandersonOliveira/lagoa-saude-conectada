const express = require('express');
const pool = require('../db');
const { verifyToken, requireAdmin } = require('../middleware/auth');
const { logAction } = require('../utils/audit');

const router = express.Router();
router.use(verifyToken, requireAdmin);

const SAFE_ROLES = ['paciente', 'atendente', 'admin'];
const SAFE_STATUSES = ['ativo', 'inativo', 'pendente'];

// GET /admin/users — lista todos os usuários (SEM cpf/rg — só no endpoint individual)
router.get('/', async (req, res, next) => {
  try {
    const role = req.query.role;
    const email = req.query.email ? String(req.query.email).toLowerCase().trim() : null;

    let sql = `SELECT id, full_name, email, role, account_status,
                      phone, mobile, birth_date, gender, job_role, created_at
               FROM users WHERE 1=1`;
    const params = [];
    if (role && SAFE_ROLES.includes(role)) { sql += ' AND role = ?'; params.push(role); }
    if (email) { sql += ' AND email LIKE ?'; params.push('%' + email + '%'); }
    sql += ' ORDER BY full_name LIMIT 100';

    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// GET /admin/users/:id — perfil completo incluindo CPF/RG (admin only)
router.get('/:id', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, full_name, email, role, account_status,
              phone, mobile, birth_date, gender, blood_type,
              mother_name, father_name,
              cpf, rg,
              cep, street, address_number, neighborhood, city, state,
              job_role, created_at
       FROM users WHERE id = ?`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Usuário não encontrado.' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// PATCH /admin/users/:id — altera account_status e/ou job_role
// Papel (role) só pode ser alterado diretamente no banco de dados.
router.patch('/:id', async (req, res, next) => {
  try {
    const { account_status, job_role } = req.body || {};
    const updates = [];
    const params = [];
    const logParts = [];

    if (account_status !== undefined) {
      if (!SAFE_STATUSES.includes(account_status)) {
        return res.status(400).json({ error: 'Status inválido.' });
      }
      if (req.params.id === req.user.id) {
        return res.status(400).json({ error: 'Você não pode alterar o status da própria conta.' });
      }
      updates.push('account_status=?'); params.push(account_status); logParts.push(`status -> ${account_status}`);
    }
    if (job_role !== undefined) {
      updates.push('job_role=?'); params.push(job_role || null); logParts.push(`cargo -> ${job_role}`);
    }

    if (!updates.length) return res.status(400).json({ error: 'Nada para atualizar.' });

    params.push(req.params.id);
    const [result] = await pool.query(
      `UPDATE users SET ${updates.join(', ')} WHERE id=?`, params
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Usuário não encontrado.' });

    await logAction(req.user.id, 'admin_update_user', 'user', req.params.id, logParts.join('; '));
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
