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
    ssl: connectionString ? { rejectUnauthorized: false } : false
  });

  // Initialize database table on startup
  pool.query(`
    CREATE TABLE IF NOT EXISTS maber_reports (
      maber_order_id VARCHAR(255) PRIMARY KEY,
      maber_payload TEXT NOT NULL,
      maber_emailed INTEGER DEFAULT 0,
      maber_first_sent_at BIGINT,
      maber_last_sent_at BIGINT,
      maber_ts BIGINT
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

// Query report by Order ID (Async)
export async function getReportByOrderId(orderId) {
  if (useLocalDb || !pool) {
    console.log(`[localDb] fetching report for orderId=${orderId}`);
    const db = readLocalDb();
    const row = db[orderId];
    return row ? JSON.parse(row.maber_payload || row.payload) : {};
  }

  try {
    const res = await pool.query('SELECT maber_payload FROM maber_reports WHERE maber_order_id = $1', [orderId]);
    const row = res.rows[0];
    return row ? JSON.parse(row.maber_payload) : {};
  } catch (err) {
    console.error(`❌ getReportByOrderId error for orderId=${orderId}, falling back to local storage:`, err);
    const db = readLocalDb();
    const row = db[orderId];
    return row ? JSON.parse(row.maber_payload || row.payload) : {};
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
      maber_order_id: orderId,
      maber_payload: JSON.stringify(payload),
      maber_emailed: emailedInt,
      maber_first_sent_at: firstSentAt || (db[orderId]?.maber_first_sent_at) || (db[orderId]?.firstSentAt) || null,
      maber_last_sent_at: lastSentAt || ts,
      maber_ts: ts
    };
    writeLocalDb(db);
    console.log(`[localDb] saved report for orderId=${orderId}`);
  } catch (e) {
    console.error('❌ Failed to write local fallback during save:', e);
  }

  if (useLocalDb || !pool) {
    return;
  }

  try {
    await pool.query(`
      INSERT INTO maber_reports (maber_order_id, maber_payload, maber_emailed, maber_first_sent_at, maber_last_sent_at, maber_ts)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT(maber_order_id) DO UPDATE SET
        maber_payload = EXCLUDED.maber_payload,
        maber_emailed = EXCLUDED.maber_emailed,
        maber_first_sent_at = COALESCE(maber_reports.maber_first_sent_at, EXCLUDED.maber_first_sent_at),
        maber_last_sent_at = EXCLUDED.maber_last_sent_at,
        maber_ts = EXCLUDED.maber_ts
    `, [orderId, JSON.stringify(payload), emailedInt, firstSentAt, lastSentAt, ts]);
  } catch (err) {
    console.error(`❌ saveOrUpdateReport PG error for orderId=${orderId}:`, err);
  }
}

export function getDbStatus() {
  return {
    useLocalDb,
    poolInitialized: !!pool,
    localDbPath
  };
}

