// server/models/reportStore.js
import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connectionString = process.env.DATABASE_URL;
let pool = null;
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
    CREATE TABLE IF NOT EXISTS reports (
      orderId VARCHAR(255) PRIMARY KEY,
      payload TEXT NOT NULL,
      emailed INTEGER DEFAULT 0,
      firstSentAt BIGINT,
      lastSentAt BIGINT,
      ts BIGINT
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
    return row ? JSON.parse(row.payload) : {};
  }

  try {
    const res = await pool.query('SELECT payload FROM reports WHERE orderId = $1', [orderId]);
    const row = res.rows[0];
    return row ? JSON.parse(row.payload) : {};
  } catch (err) {
    console.error(`❌ getReportByOrderId error for orderId=${orderId}, falling back to local storage:`, err);
    const db = readLocalDb();
    const row = db[orderId];
    return row ? JSON.parse(row.payload) : {};
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
      orderId,
      payload: JSON.stringify(payload),
      emailed: emailedInt,
      firstSentAt: firstSentAt || (db[orderId]?.firstSentAt) || null,
      lastSentAt: lastSentAt || ts,
      ts
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
      INSERT INTO reports (orderId, payload, emailed, firstSentAt, lastSentAt, ts)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT(orderId) DO UPDATE SET
        payload = EXCLUDED.payload,
        emailed = EXCLUDED.emailed,
        firstSentAt = COALESCE(reports.firstSentAt, EXCLUDED.firstSentAt),
        lastSentAt = EXCLUDED.lastSentAt,
        ts = EXCLUDED.ts
    `, [orderId, JSON.stringify(payload), emailedInt, firstSentAt, lastSentAt, ts]);
  } catch (err) {
    console.error(`❌ saveOrUpdateReport PG error for orderId=${orderId}:`, err);
  }
}
