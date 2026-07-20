// server/models/reportStore.js
import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connectionString = process.env.DATABASE_URL;
export let pool = null;
let useLocalDb = false;
const localDbPath = path.join(__dirname, '..', '..', 'tmp', 'reports_db.json');

// Ensure tmp directory exists
try {
  const tmpDir = path.dirname(localDbPath);
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
  }
} catch (e) {
  console.warn('⚠️ Warning: failed to create tmp directory for local database fallback:', e);
}

if (!connectionString) {
  console.warn('⚠️ Warning: DATABASE_URL is not set. Falling back to local file storage at:', localDbPath);
  useLocalDb = true;
} else {
  pool = new pg.Pool({
    connectionString,
    max: 1, // 优化 Serverless 环境下的连接池大小
    ssl: connectionString ? { rejectUnauthorized: false } : false
  });

  // Initialize database table on startup
  pool.query(`
    CREATE TABLE IF NOT EXISTS omniora_reports (
      omniora_order_id VARCHAR(255) PRIMARY KEY,
      omniora_payload TEXT NOT NULL,
      omniora_emailed INTEGER DEFAULT 0,
      omniora_first_sent_at BIGINT,
      omniora_last_sent_at BIGINT,
      omniora_ts BIGINT
    )
  `).catch(err => {
    console.error('❌ Database table initialization failed, falling back to local file storage:', err);
    useLocalDb = true;
  });
}

// Local DB helper functions
function readLocalDb() {
  try {
    if (fs.existsSync(localDbPath)) {
      return JSON.parse(fs.readFileSync(localDbPath, 'utf8'));
    }
  } catch (e) {
    console.error('❌ Failed to read local fallback database:', e);
  }
  return {};
}

function writeLocalDb(data) {
  try {
    fs.writeFileSync(localDbPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.error('❌ Failed to write local fallback database:', e);
  }
}

// Query lead by Email
export async function getLeadByEmail(email) {
  const targetEmail = (email || '').trim().toLowerCase();
  if (!targetEmail) return null;

  const db = readLocalDb();
  const keys = Object.keys(db).filter(k => k.startsWith('lead:'));
  for (const k of keys) {
    const row = db[k];
    const payload = JSON.parse(row.omniora_payload || row.payload || '{}');
    if ((payload.email || '').trim().toLowerCase() === targetEmail) {
      return payload;
    }
  }
  return null;
}
export async function getLeadById(leadId) {
  if (useLocalDb || !pool) {
    console.log(`[localDb] fetching lead for leadId=${leadId}`);
    const db = readLocalDb();
    const row = db[`lead:${leadId}`];
    return row ? JSON.parse(row.omniora_payload || row.payload) : null;
  }

  try {
    const res = await pool.query('SELECT omniora_payload FROM omniora_reports WHERE omniora_order_id = $1', [`lead:${leadId}`]);
    const row = res.rows[0];
    return row ? JSON.parse(row.omniora_payload) : null;
  } catch (err) {
    console.error(`❌ getLeadById error for leadId=${leadId}, falling back to local storage:`, err);
    const db = readLocalDb();
    const row = db[`lead:${leadId}`];
    return row ? JSON.parse(row.omniora_payload || row.payload) : null;
  }
}

// Save lead
export async function saveLead(leadId, payload) {
  const ts = Date.now();
  const db = readLocalDb();
  db[`lead:${leadId}`] = {
    omniora_order_id: `lead:${leadId}`,
    omniora_payload: JSON.stringify(payload),
    omniora_ts: ts
  };
  writeLocalDb(db);

  if (pool) {
    try {
      await pool.query(
        `INSERT INTO omniora_reports (omniora_order_id, omniora_payload, omniora_ts)
         VALUES ($1, $2, $3)
         ON CONFLICT (omniora_order_id)
         DO UPDATE SET omniora_payload = EXCLUDED.omniora_payload, omniora_ts = EXCLUDED.omniora_ts`,
        [`lead:${leadId}`, JSON.stringify(payload), ts]
      );
    } catch (e) {
      console.error('❌ saveLead database query failed:', e);
    }
  }
}

// Query report by Order ID (Async)
export async function getReportByOrderId(orderId) {
  if (useLocalDb || !pool) {
    console.log(`[localDb] fetching report for orderId=${orderId}`);
    const db = readLocalDb();
    const row = db[orderId];
    return row ? JSON.parse(row.omniora_payload || row.payload) : {};
  }

  try {
    const res = await pool.query('SELECT omniora_payload FROM omniora_reports WHERE omniora_order_id = $1', [orderId]);
    const row = res.rows[0];
    return row ? JSON.parse(row.omniora_payload) : {};
  } catch (err) {
    console.error(`❌ getReportByOrderId error for orderId=${orderId}, falling back to local storage:`, err);
    const db = readLocalDb();
    const row = db[orderId];
    return row ? JSON.parse(row.omniora_payload || row.payload) : {};
  }
}

// Save or update report in database (Async)
export async function saveOrUpdateReport(orderId, payload, emailed = false, firstSentAt = null, lastSentAt = null) {
  const ts = Date.now();
  const emailedInt = emailed ? 1 : 0;

  // Always save to local fallback DB for safety/development
  try {
    const db = readLocalDb();
    db[orderId] = {
      omniora_order_id: orderId,
      omniora_payload: JSON.stringify(payload),
      omniora_emailed: emailedInt,
      omniora_first_sent_at: firstSentAt || ts,
      omniora_last_sent_at: lastSentAt || ts,
      omniora_ts: ts
    };
    writeLocalDb(db);
  } catch (e) {
    console.error('❌ Local database write failed:', e);
  }

  if (useLocalDb || !pool) {
    return;
  }

  try {
    await pool.query(
      `INSERT INTO omniora_reports (omniora_order_id, omniora_payload, omniora_emailed, omniora_first_sent_at, omniora_last_sent_at, omniora_ts)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (omniora_order_id)
       DO UPDATE SET
         omniora_payload = EXCLUDED.omniora_payload,
         omniora_emailed = EXCLUDED.omniora_emailed,
         omniora_last_sent_at = EXCLUDED.omniora_last_sent_at,
         omniora_ts = EXCLUDED.omniora_ts`,
      [orderId, JSON.stringify(payload), emailedInt, firstSentAt || ts, lastSentAt || ts, ts]
    );
    console.log(`✅ [DB] Successfully saved report for orderId=${orderId}`);
  } catch (err) {
    console.error(`❌ saveOrUpdateReport database error for orderId=${orderId}:`, err);
  }
}

export function getDbStatus() {
  return {
    useLocalDb,
    localDbPath,
    hasPool: !!pool
  };
}
